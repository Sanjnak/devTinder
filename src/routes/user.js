const express = require("express");
const userRouter = express.Router();
const { authUser } = require("../middlewares/authUser");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

userRouter.get("/user/requests/recieved", authUser, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const data = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "Interested",
    }).populate("fromUserId", "firstName lastName age gender about skills photoUrl");

    return res.status(200).json({ message: "Data fetched successfully", data: data });
  } catch (err) {
    return res.status(400).send("Something went wrong!");
  }
});

userRouter.get("/user/requests/sent", authUser, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const data = await ConnectionRequest.find({
      fromUserId: loggedInUser._id,
      status: "Interested",
    }).populate("toUserId", "firstName lastName age gender about skills photoUrl");

    return res.status(200).json({ message: "Data fetched successfully", data: data });
  } catch (err) {
    return res.status(400).send("Something went wrong!");
  }
});

userRouter.get("/user/connections", authUser, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connections = await ConnectionRequest.find({
      $or: [
        { fromUserId: loggedInUser._id, status: "Accepted" },
        { toUserId: loggedInUser._id, status: "Accepted" },
      ],
    })
    .populate("fromUserId", "firstName lastName age gender about skills photoUrl")
    .populate("toUserId", "firstName lastName age gender about skills photoUrl");

    const data = connections.map((row) => {
      if(row.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return row.toUserId;
      }
      return row.fromUserId;
    })
    return res.status(200).json({ message: "Data fetched successfully", data: data });
  } catch (err) {
    return res.status(400).send("Something went wrong!");
  }
});

userRouter.get("/user/feed", authUser, async(req, res) => {
  try{
    const loggedInUser = req.user;
    const page = (req.query.page) || 1;
    let limit = (req.query.limit) || 10;
    limit = limit>50 ? 50 : limit;
    const skip = (page-1)*limit;

    const connections = await ConnectionRequest.find({
      $or: [
        {fromUserId: loggedInUser._id}, {toUserId: loggedInUser._id}
      ]
    }).select("fromUserId toUserId");

    const hideUsersFromFeed = new Set();
    connections.forEach((row) => {
      hideUsersFromFeed.add(row.fromUserId.toString());
      hideUsersFromFeed.add(row.toUserId.toString());
    });

    const users = await User.find({
      $and: [
        {_id : {$nin: Array.from(hideUsersFromFeed)}},
        {_id: {$ne: loggedInUser._id}}
      ]
    })
    .select("firstName lastName age gender about skills photoUrl")
    .skip(skip)
    .limit(limit);

    return res.status(200).json({message: "Feed fetched successfully" ,data: users});
  }catch(err) {
    return res.status(400).json({message: "Error occurred!"+err});
  }
})

module.exports = userRouter;
