
const jwt=require('jsonwebtoken')
require('dotenv').config()

//token verification middleware
const verifyToken = (req, res, next) => {
    //console.log(req.headers.authorization)
    //search for bearer token  from req
    let bearerToken = req.headers.authorization;
    //extract token from bearertoken
    let token = bearerToken.split(" ")[1]; // ["Bearer" ,"xasdsasdasd"]
    console.log(token);
    //if token is not existed, send res as "unauthorized access"
    if (token === undefined) {
      res.send({ message: "Unauthorized access" });
    }
    //if token is there but expired,send res as relogin
    try {
      let decodedToken = jwt.verify(token, process.env.SECRET);
      console.log(decodedToken);
      //call next mioddleware
      next();
    } catch (err) {
      res.send({ message: "Token expired..plz relogin" });
    }
    //if token is there and valid, then forward to next middleware
  };
  


  module.exports=verifyToken;