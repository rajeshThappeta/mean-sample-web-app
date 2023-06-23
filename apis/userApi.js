//create mini-express app(Seperate route)
const exp = require("express");
const userApp = exp.Router();
const jwt = require("jsonwebtoken");
const verifyToken = require("./middlewares/verifyToken");
const expressAsyncHandler = require("express-async-handler");
const bcryptjs = require("bcryptjs");
const cloudinary = require("cloudinary").v2;
const multer = require("multer");
require('dotenv').config()

const { CloudinaryStorage } = require("multer-storage-cloudinary");
//body parser
userApp.use(exp.json());

//Configurations
//configure cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

//configure multer storage cloudinary
const cloudinaryStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    return {
      folder: "ca003",
      public_id: "photo-" + Date.now(),
    };
  },
});

//configure multer
const upload = multer({ storage: cloudinaryStorage });

//CREATE USER API

let usersCollection = null;
userApp.use((req, res, next) => {
  usersCollection = req.app.get("usersCollection");
  next();
});

//get all users
userApp.get(
  "/users",
  expressAsyncHandler(async (req, res) => {
    //get userCollection
    //const usersCollection=req.app.get('usersCollection')
    //get users
    let users = await usersCollection.find({ status: true }).toArray();
    //send res
    res.send({ message: "all users", payload: users });
  })
);

//get a user by username
userApp.get(
  "/users/:username",
  expressAsyncHandler(async (req, res) => {
    //get userCollection
    const usersCollection = req.app.get("usersCollection");
    //get username from url
    let usernameOfUrl = req.params.username;
    //find user
    let user = await usersCollection.findOne({
      username: usernameOfUrl,
      status: true,
    });
    //send res
    res.send({ message: "one user", payload: user });
  })
);

//create register  user
userApp.post(
  "/user",
  upload.single("photo"),
  expressAsyncHandler(async (req, res) => {

   // console.log("res is ",req)
    //get userCollection
    const usersCollection = req.app.get("usersCollection");
    //get newUser from client
    const newUser = JSON.parse(req.body.newUser);
    //check for the username which already taken by someone
    let user = await usersCollection.findOne({ username: newUser.username });
    //if user existed with that username
    if (user !== null) {
      res.send({ message: "Username has already taken. Choose another one" });
    } else {
      //add status
      newUser.status = true;
      //hash password
      let hashedPassword = await bcryptjs.hash(newUser.password, 5);
      //replace plain password with hased password
      newUser.password = hashedPassword;
      //add image address to newUser
      newUser.profileImage = req.file.path;
      //save new user
      await usersCollection.insertOne(newUser);
      res.status(201).send({ message: "created" });
    }
  })
);

//update user by username
userApp.put(
  "/user/:username",
  expressAsyncHandler(async (req, res) => {
    //get userCollection
    const usersCollection = req.app.get("usersCollection");
    //get username from url
    let usernameOfUrl = req.params.username;
    //get modified user from client
    const modifiedUser = req.body;
    //modify
    await usersCollection.updateOne(
      { username: modifiedUser.username },
      { $set: { ...modifiedUser } }
    );
    //send res
    res.send({ message: "User modified" });
  })
);

//user login
userApp.post(
  "/user-login",
  expressAsyncHandler(async (req, res) => {
    //get userCollection
    const usersCollection = req.app.get("usersCollection");
    //get user cred
    let userCred = req.body;
    //veirfy username
    let user = await usersCollection.findOne({ username: userCred.username });
    //if user not found
    if (user === null) {
      res.send({ message: "Invalid username" });
    }
    //if user found
    else {
      //compare passwords
      let result = await bcryptjs.compare(userCred.password, user.password);
      //if passwords not matched
      if (result === false) {
        res.send({ message: "Invalid password" });
      }
      //if passwords are also matched
      else {
        //create token
        let signedToken = jwt.sign({ username: user.username },process.env.SECRET, {
          expiresIn: 20,
        });
        //send token inres
        res.send({
          message: "Login success",
          token: signedToken,
          currentUser: user,
        });
      }
    }
  })
);

//delete user by username
userApp.delete(
  "/user/:username",
  expressAsyncHandler(async (req, res) => {
    //get userCollection
    const usersCollection = req.app.get("usersCollection");
    //get username from url
    let usernameOfUrl = req.params.username;
    //update user status to false
    await usersCollection.updateOne(
      { username: usernameOfUrl },
      { $set: { status: false } }
    );
    //send res
    res.send({ message: "User deleted" });
  })
);

//restore user by username
userApp.get(
  "/user-restore/:username",
  expressAsyncHandler(async (req, res) => {
    //get userCollection
    const usersCollection = req.app.get("usersCollection");
    //get username from url
    let usernameOfUrl = req.params.username;
    //update user status to false
    await usersCollection.updateOne(
      { username: usernameOfUrl },
      { $set: { status: true } }
    );
    //send res
    res.send({ message: "User restored" });
  })
);

//private route
userApp.get(
  "/test-private",
  verifyToken,
  expressAsyncHandler((req, res) => {
    res.send({ message: "This is private info" });
  })
);
//export userApp
module.exports = userApp;
