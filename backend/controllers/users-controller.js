const HttpError = require("../models/http-error");
const User = require("../models/user");
// const { v4: uuidv4 } = require("uuid");
const {validationResult} = require("express-validator");
let USER_DETAILS = [
  { id: "u1", name: "Rija Roy", email: "test@test.com", password: "test" },
  { id: "u2", name: "Sana Dutta", email: "test1@test.com", password: "test1" },
];

const signup = async (req, res, next) => {
  const errors= validationResult(req);
 if(!errors.isEmpty()){
   console.log("errors",errors)
   return next(new HttpError('Invalid inputs passed, please check your data',422))
 }
  const { name, email, password, places } = req.body;
  let existingUser;
  try{
    existingUser =await  User.findOne({email:email})
  }catch(err){
      const error = new HttpError("Signing up failed! Please try again later.")
  return next(error);
    }
 if(existingUser){
  const error = new HttpError("User exists already, please login instead.",422)
  return next(error); 
 }
  const createdUser = new User({
   
    name,
    email,
    image:"https://png.pngtree.com/png-vector/20190909/ourmid/pngtree-outline-user-icon-png-image_1727916.jpg",
    password,
    places
  });
//  save data
try{
await createdUser.save()
}
catch(err){
const error = new HttpError("Signing up failed.Please try again",500)
return next(error)
}
  res
    .status(201)
    .json({user: createdUser.toObject({getters: true})});
};

const login = async (req, res, next) => {
  const errors= validationResult(req);
  if(!errors.isEmpty()){
    console.log("errors",errors)
    return next(new HttpError('Invalid inputs passed, please check your data',422))
  }
  const { name,email, password } = req.body;
  let existingUser;
  try{
    existingUser = await User.findOne({email:email})
  }catch(err){
    const error = new HttpError("Login failed,please try again later",500);
    return next(error);
  }
  if(!existingUser || existingUser.password !== password){
    const error = new HttpError("Login failed,check login credentials",401 );
    return next(error);
  }
  res.status(200).json({ message: "Successfully logged in!" });
};
const getUsers = async (req, res, next) => {
  let users;
  try{
    users = await User.find({},'-password')
  }catch(err){
    const error = new HttpError("Fetching users failed.Please try again later.",500);
  return next(error);
  }
  res.json({users: users.map(user=>user.toObject({getters:true}))})
};
exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
