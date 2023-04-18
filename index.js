// const express = require("express");
// const app = express();
// const port  = 8090;

// app.get("/", (req , res)=>{
//   return res.send("hello world!...");
// });

// const isAdmin = (req,res,next)=>{
//   console.log("isAdmin running on");
//   next();
// }
// const admin = (req,res)=>{
//   console.log(" this is Admin dashboard");
// }
//   app.get("/admin", isAdmin , admin);


//   const isloggedin = (req , res , next)=>{
//     console.log("hello world user is looged!...");
//     next();
//   };

//   const login = (req,res)=>{
//     console.log(" this is login dashboard");
//   }

//   app.get("/login",isloggedin , login)


//   app.get("/signup", (req , res)=>{
//     return res.send("hello world its a signup page!...");
//   });

// app.listen(port , ()=>{
//     console.log("Server is connected and reunning!....")
// });