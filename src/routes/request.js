const express = require("express");
const requestRouter = express.Router();
const User = require("../models/user");
const { authUser } = require("../middlewares/authUser");
const ConnectionRequest = require("../models/connectionRequest");

requestRouter.post(
  "/request/send/:status/:toUserId",
  authUser,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      const allowedStatus = ["Ignored", "Interested"];
      if (!allowedStatus.includes(status)) {
        return res.status(400).json({
          message: "Can't send this type of request!",
        });
      }

      const isUserExist = await User.findById(toUserId);
      if (!isUserExist) {
        return res.status(400).json({
          message: "User doesn't exist!",
        });
      }

      const isConnectionRequestExists = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });
      if (isConnectionRequestExists) {
        return res.status(400).json({
          message: "Connection request already sent!",
        });
      }

      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });
      const data = await connectionRequest.save();
      res.json({
        message: "Request sent successfully!",
        data,
      });
    } catch (err) {
      res.status(404).send("Some error occurred => " + err);
    }
  },
);

requestRouter.post(
  "/request/review/:status/:requestId",
  authUser,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const { status, requestId } = req.params;

      const allowedStatus = ["Accepted", "Rejected"];
      if (!allowedStatus.includes(status)) {
        return res.status(400).json({ message: "Status not allowed!" });
      }

      const connectionRequest = await ConnectionRequest.findOne({
        _id: requestId,
        toUserId: loggedInUser._id,
        status: "Interested",
      });
      if (!connectionRequest) {
        return res
          .status(400)
          .json({ message: "Connection Request doesn't exist" });
      }

      connectionRequest.status = status;
      const data = await connectionRequest.save();
      res.status(200).json({ message: "Connection status updated!", data });

    } catch (err) {
      res.status(400).json({ message: "Some error occurred!" });
    }
  },
);

module.exports = requestRouter;
