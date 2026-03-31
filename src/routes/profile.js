const express = require("express");
const profileRouter = express.Router();
const { authUser } = require("../middlewares/authUser");
const {validationProfileEdit} = require("../utils/validation");

profileRouter.get("/profile", authUser ,async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).send("Login Failed! => " + err);
  }
});

profileRouter.patch("/profile/edit", authUser, (req, res) => {
  try {
    validationProfileEdit(req);
    const loggedInUser = req.user;
    Object.keys(req.body).forEach((key) => {loggedInUser[key] = req.body[key]});
    loggedInUser.save();
    res.json({message: `${loggedInUser.firstName}, your profile updated successfully!!`, data: loggedInUser});
    
  } catch(err) {
    res.status(400).send("Some error ocurred => "+err);
  }
});

module.exports = profileRouter;