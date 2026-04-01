const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 4,
      maxLength: 20,
    },
    lastName: {
      type: String,
      minLength: 4,
      maxLength: 20,
    },
    age: {
      type: Number,
      min: 10,
    },
    gender: {
      type: String,
      enum: {
        values: ["male", "female", "other"],
        message: `{VALUE} is not supported!`
      }
    },
    emailId: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw Error("Invalid emailID!");
        }
      },
    },
    password: {
      type: String,
      required: true,
      trim: true,
      validate(value) {
        if (
          !validator.isStrongPassword(value, {
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1,
          })
        ) {
          throw Error("Password invalid-weak!");
        }
      },
    },
    about: {
      type: String,
      default: "This is a default bio of user",
    },
    skills: {
      type: [String],
      maxLength: 10,
    },
    photoUrl: {
      type: String,
      default: "https://imgs.search.brave.com/EEJhg93Ie9nP8XhCczs3dYpMISA66awRbhZFMQUM73U/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zdGF0/aWMudmVjdGVlenku/Y29tL3N5c3RlbS9y/ZXNvdXJjZXMvdGh1/bWJuYWlscy8wNDUv/NzExLzE1NC9zbWFs/bC9wbGFjZWhvbGRl/ci1hdmF0YXItZmVt/YWxlLWRlZmF1bHQt/d29tYW4tdXNlci1p/bWFnZS1ncmF5LXBy/b2ZpbGUtZmFjZS1w/aWN0dXJlLWlzb2xh/dGVkLW9uLWJhY2tn/cm91bmQtZm9yLWZv/cnVtLXNvY2lhbC1t/ZWRpYS1jaGF0LW9w/ZXJhdG9yLWF2YXRh/ci1mcmVlLXZlY3Rv/ci5qcGc"
    }
  },
  {
    timestamps: true,
  },
);

userSchema.methods.getJWT = function () {
  const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
  return token;
}

userSchema.methods.verifyPassword = async function (password) {
  const isPasswordValid = await bcrypt.compare(password, this.password);
  return isPasswordValid;
}

module.exports = mongoose.model("User", userSchema);
