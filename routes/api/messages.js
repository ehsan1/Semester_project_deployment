const express = require('express');

let router = express.Router();
const validateMessage = require('../../middlewares/validateMessage');
const auth = require("../../middlewares/auth");
const admin = require("../../middlewares/admin");
var {Message} = require("../../models/message"); 
router.get("/",auth, async(req, res)=>{
    let messages = await Message.find();
    return res.send(messages);
});
//Insert a record
router.post('/add',auth,validateMessage, async function(req, res, next) {
  let message= new Message();
  message.user_to = req.body.user_to;
  message.user_from = req.body.user_from;
  message.body = req.body.body;
  var today= new Date();
  message.date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
  message.time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  message.opened = false;
  message.viewed = false;
  message.deleted = false;
  await message.save();
  return res.send(message);

});
//Admin Delete
router.delete("/delete/:id",auth,admin, async(req, res)=>{
    let message = await Message.findByIdAndDelete(req.params.id);
    return res.send(message);
});

// User delete
router.put("/trash/:id",auth, async(req, res)=>{
    let message = await Message.findById(req.params.id);
    message.deleted = true;
    await message.save();
    return res.send(message);
});
// Opened
router.put("/open/:id",auth, async(req, res)=>{
    let message = await Message.findById(req.params.id);
    message.opened = true;
    await message.save();
    return res.send(message);
});
 // viewed
router.put("/view/:id",auth, async(req, res)=>{
    let message = await Message.findById(req.params.id);
    message.viewed = true;
    await message.save();
    return res.send(message);
});
module.exports = router;
