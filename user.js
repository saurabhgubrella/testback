const User = require("../models/user");
const Order = require("../models/order");
const { populate } = require("../models/user");
//get contollers
exports.getUserById = (req, res, next, id) => {
  User.findById(id)
    .then((user) => {
      req.profile = user;
      next();
    })
    .catch((err) => {
      if (err || !user) {
        return res.status(400).json({
          error: "no user was found in db",
        });
      }
    });
};

// exports.getAllUser = (req, res) => {
//   User.find()    // exercise for finding the all users
//     .then((user) => {
//       res.json(user)
//     })
//     .catch((err) => {
//       if (err || !user) {
//         return res.status(400).json({
//           error: "no users was there in db",
//         });
//       }
//     });
// };

exports.getUser = (req, res) => {
  //Todo:get back here for password
  req.profile.salt = undefined; //the information that we dont want to show we hide them like this
  req.profile.encry_password = undefined;
  req.profile.createdAt = undefined;
  req.profile.updatedAt = undefined;
  return res.json(req.profile);
};

//Update controllers

exports.updateUser = (req, res) => {
  User.findByIdAndUpdate(
    { _id: req.profile._id },
    { $set: req.body },
    { new: true, useFindAndModify: false }
  )
    .then((user) => {
      user.salt = undefined; //as we are updating the user info so we will use user.salt and user.encry not req.profile.
      user.encry_password = undefined;
      res.json(user);
    })
    .catch((err) => {
      if (err) {
        return res.status(400).json({
          error: "You are not authorized to update this information",
        });
      }
    });
};


//userPurchaseList
exports.userPurchaseList = (req,res)=>{ //finding the user with the help of req.profile in above and having ref in orderschema also
  Order.find({user:req.profile._id})
  .populate("user","_id name")
  .then(order => res.json(order))
  .catch(err=>{
    if(err){
        res.status(400).json({
            error:"no order are there in a list"
        })
    }
  })
}

exports.pushOrderInPurchaseArray=(req,res,next)=>{
  let purchases = [];
  req.body.order.products.forEach(product => {
    purchases.push({
        _id:product._id,
        name:product.name,
        description:product.description,
        category:product.category,
        quantity:product.quantity,
        amount:req.body.order.amount,
        transaction_id:req.body.order.transaction_id
    })
  }); 
  
  //store this in db

  User.findOneAndUpdate(
    {_id:req.profile._id},
    {$push: {purchases:purchases}},
    {new:true}
  ).then((purchase)=>{
     res.json(purchase)
  }).catch(err=>{
    if(err){
        return res.status(400).json({
            error:'Unable to save purchase in List'
        })
    }
    next();
  })
}

