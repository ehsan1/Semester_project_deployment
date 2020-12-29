 const express = require('express');
let router = express.Router();
let { User } = require("../../models/user");
var bcrypt = require("bcryptjs");
const _ = require("lodash");
const jwt = require("jsonwebtoken");
const config = require("config");
router.post("/register", async (req, res) => {
  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("User with given Email already exist");
  user = new User();
  user.name = req.body.name;
  user.email = req.body.email;
  user.password = req.body.password;
  await user.generateHashedPassword();// generateHashedPassword() define in models/user.js
  await user.save();
  let token = jwt.sign(
    { _id: user._id, name: user.name, role: user.role,email:user.email ,last_scene:user.last_scene},
    config.get("jwtPrivateKey")
  );
  let datatoReturn = {
    name: user.name,
    email: user.email,
    token :user.token,
  }
  return res.send(datatoReturn);
  
});
router.get("/", async(req, res)=>{
    let users = await User.find();
    return res.send(users);
});
router.put("/:id", async(req, res)=>{
    let user = await User.findById(req.params.id);
    
    user.last_scene = req.body.date;
    await user.save();
    console.log("INside Api last scene "+ user.last_scene);
    return res.send(user);
});
router.post("/login", async (req, res) => {
  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("User Not Registered");
  let isValid = await bcrypt.compare(req.body.password, user.password);
  if (!isValid) return res.status(401).send("Invalid Password");
  let token = jwt.sign(
    { _id: user._id, name: user.name, role: user.role , email:user.email, last_scene:user.last_scene},
    config.get("jwtPrivateKey")
  );
  
  res.send(token);
});

module.exports = router;
