const express = require("express");
const authRouter = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { validationSignup } = require("../utils/validation");

const User = require("../models/user");

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const validUser = await User.findOne({ emailId: emailId });
    if (!validUser) {
      throw Error("Invalid Credentials!");
    }
    const result = await validUser.verifyPassword(password);
    if (result) {
      const token = await validUser.getJWT();
      res.cookie("token", token, {
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      });
      res.send(validUser);
    } else {
      throw Error("Invalid Credentials!");
    }
  } catch (err) {
    res.status(400).send(err.message);
  }
});

authRouter.post("/signup", async (req, res) => {
  try {
    validationSignup(req.body); // validation
    const myPlaintextPassword = req.body.password;
    const hash = await bcrypt.hash(myPlaintextPassword, 5); //hashing
    const user = new User(req.body);
    user.password = hash;
    await user.save();

    const token = await user.getJWT(); // or jwt.sign()

    res.cookie("token", token, {
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    return res.status(201).json({
      message: "Signup successful",
      user,
    });
  } catch (err) {
    return res.status(400).send("Error in saving user data =>" + err);
  }
});

authRouter.post("/logout", async(req, res) => {
  res.cookie("token", null,  {
    expires: new Date(Date.now()),
  });
  res.send("Logout Successfully!!");
});
module.exports = authRouter;
