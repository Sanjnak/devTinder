const process = require("node:process");

const requiredEnvVars = ["MONGODB_URI", "JWT_SECRET"];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}

const PORT = Number(process.env.PORT) || 7777;

module.exports = {
  JWT_SECRET: process.env.JWT_SECRET,
  MONGODB_URI: process.env.MONGODB_URI,
  PORT,
};
