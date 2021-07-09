const HttpError = require("../models/http-error");
const { v4: uuidv4 } = require("uuid");

let USER_DETAILS = [
  { id: "u1", name: "Rija Roy", email: "test@test.com", password: "test" },
  { id: "u2", name: "Sana Dutta", email: "test1@test.com", password: "test1" },
];
const getUsers = (req, res, next) => {
  res.status(200).json({ users: USER_DETAILS });
};
const signup = (req, res, next) => {
  const { name, email, password } = req.body;
  const hasUser = USER_DETAILS.find((user) => user.email === email);
  if (hasUser) {
    return next(
      new HttpError(
        "Email id is already registered,please provide another email id",
        422
      )
    );
  }
  const newUser = {
    id: uuidv4(),
    name,
    email,
    password,
  };
  USER_DETAILS.push(newUser);
  res
    .status(200)
    .json({ message: "New User created successfully", user: newUser });
};
const login = (req, res, next) => {
  const { email, password } = req.body;
  const identifiedUser = USER_DETAILS.filter((user) => user.email === email);
  if (!identifiedUser || !identifiedUser.password === password) {
    return next(
      new HttpError(
        "Could not identify user, credentials seem to be wrong",
        401
      )
    );
  }
  res.status(200).json({ message: "Successfully logged in!" });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
