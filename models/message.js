
var mongoose = require('mongoose');
const Joi = require("@hapi/joi");

var messageSchema = mongoose.Schema({
    user_to: String,
    user_from: String,
    body: String,
    date: String,
    time: String,
    opened: Boolean,
    viewed: Boolean,
    deleted: Boolean,
});

const Message = mongoose.model("messages", messageSchema);
var today= new Date();
function validateMessage(data) {
  const schema = Joi.object({
    user_to: Joi.string().min(3).max(100).required(),
    user_from: Joi.string().min(3).max(100).required(),
    body: Joi.string().min(1).required(),
    date: Joi.string().min(3).default(today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate()),
    time: Joi.string().min(3).default(today.getHours() + ":" + today.getMinutes()),
    opened: Joi.boolean().default(false),
    viewed: Joi.boolean().default(false),
    deleted: Joi.boolean().default(false),
  });
  return schema.validate(data, { abortEarly: false });
}
module.exports.Message = Message;
module.exports.validate = validateMessage;