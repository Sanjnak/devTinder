const express = require("express");
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");
const { createServer } = require('node:http');
const initializeSocket = require("./utils/socket");

require("dotenv").config();

const app = express();
const server = createServer(app);
initializeSocket(server);

app.use(express.json());
app.use(cookieParser());
app.use(cors(
  {
    origin: "http://localhost:5173",
    credentials: true
  }
));

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

connectDB()
  .then(() => {
    console.log("Database connected successfully");
    server.listen(process.env.PORT, () => {
      console.log(`Server is listening on ${process.env.PORT}...`);
    });
  })
  .catch((err) => {
    console.error("Database not connected:", err.message);
  });




