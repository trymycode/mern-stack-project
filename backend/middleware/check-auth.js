const HttpError = require("../models/http-error");
const jwt = require("jsonwebtoken");
module.exports = (req, res, next) => {
  if(req.method === 'OPTIONS'){
    return next();
  }
  try {
    const token = req.headers.authorization.split(" ")[1];//Authorization: 'Bearer TOKEN'
    if (!token) {
      throw new Error("Authentication failed!");
    }
    // use the private key , what we used to generate the token .check in users-controller
    const decodedToken = jwt.verify(token, "Secter_String_Dont_Share");
    // We will attach userData in the req body. While creating the token , we stored userId in it.check in users-controller
    req.userData = { userId: decodedToken.userId };
    next();
  } catch (err) {
    const error = new HttpError("Authentication failed!", 401);
    return next(error);
  }
};
