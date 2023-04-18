// const { json } = require("body-parser");
const User = require("../models/user");
const { check, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
// const { result } = require("lodash");
const expressjwt = require('express-jwt');

exports.signup = (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: errors.array()[0].msg,
    });
  }

  const user = new User(req.body);
  user
    .save()
    .then((savedUser) => {
      res.json(savedUser);
    })
    .catch((err) => {
      res.status(400).json({
        error: "Failed to save user to DB",
      });
    });
};

exports.signin = (req, res) => {
  const { email, password } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: errors.array()[0].msg,
    });
  }

  User.findOne({ email })
    .then((result) => {
      //handle result
      //create token

      if (!result.authenticate(password)) {
        return res.status(401).json({
          error: "Email or password not matched ",
        });
      }
      console.log("121");
      const token = jwt.sign({ _id: result._id }, process.env.SECRET);

      //put token in cookie
      res.cookie("token", token, { expire: new Date() + 9999 });

      //send response to frontend
      const { _id, name, email, role } = result;
      return res.json({ token, result: { _id, name, email, role } });

      console.log("232");
    })
    .catch((err) => {
      //handle the error
      //error message if no email is found
      if (err || !result) {
        return res.status(400).json({
          error: "User Email Does Not Exist",
        });
      }
    });
};

exports.signout = (req, res) => {
  res.clearCookie("token");
  res.json({
    message: "User signout successfully",
  });
};

//protected routes(middleware)
exports.isSignedIn = expressjwt({
  secret: process.env.SECRET,
  userProperty: "auth",
  algorithms: ["HS256"] 
});

//custom middlewarea
exports.isAuthenticated = (req, res, next) => {
  let checker = req.profile && req.auth && req.profile._id == req.auth._id;//through frontend this property will be comming
  if(!checker){
    return res.status(403).json({
      error:"Access Denied"
    })
  }
  next();
};

exports.isAdmin = (req, res, next) => {
  if(req.profile.role === 0){
    return res.status(403).json({
      error:"You are not a Admin, ACCESS DENIED"
    })
  }
  next();//next is resposible for tranferring control from one middleware to another
};
