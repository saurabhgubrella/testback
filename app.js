require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");

//My routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const categoryRoutes = require("./routes/category");
//My DB connection
mongoose
  .connect(process.env.DATABASE)
  .then(() => {
    console.log("DB Connected!..");
  })
  .catch(() => {
    console.log("error occured in DB");
  });

//My middlewear
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

//My Routes
app.use("/api",authRoutes);
app.use("/api",userRoutes);
app.use("/api",categoryRoutes);

//My port 
const port = process.env.PORT || 8080;


//My starting of server
app.listen(port, () => {
  console.log(`App is running at ${port}`);
});
