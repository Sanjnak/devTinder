const mongoose = require("mongoose");


const connectDB = async () => {
  try {
    // console.log(process.env.MONGODB_URI);

    await mongoose.connect(process.env.MONGODB_URI);
  } catch (error) {
    if (error?.code === "ECONNREFUSED" && error?.hostname?.includes("mongodb.net")) {
      throw new Error(
        "MongoDB SRV lookup failed. Check your Atlas hostname, IP allowlist, and local DNS or VPN settings.",
      );
    }

    throw error;
  }
};

module.exports = connectDB;
