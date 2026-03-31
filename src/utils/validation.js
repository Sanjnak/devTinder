const validator = require("validator");

const validationSignup = (data) => {
  const { firstName, lastName, emailId, password } = data;

  if (!firstName || !lastName) {
    throw Error("Name is invalid!");
  }
  if (firstName.length < 4 || firstName.length > 50) {
    throw Error("firstName is too short or long!");
  }
  if (lastName.length < 4 || lastName.length > 50) {
    throw Error("lastName is too short or long!");
  }
  if (!validator.isEmail(emailId)) {
    throw Error("Invalid emailID!");
  }
  if (!validator.isStrongPassword(password)) {
    throw Error("Password is weak!");
  }
};

const validationProfileEdit = (req) => {
  const allowedProfileEdit = ["firstName", "lastName", "age", "gender", "about", "skills", "photoUrl"];
  const isAllowedProfileEdit = Object.keys(req.body).every((element) => allowedProfileEdit.includes(element));
  if(!isAllowedProfileEdit) {
    throw Error("Not updatable fields!!");
  }
}

module.exports = {validationSignup, validationProfileEdit}
