const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  firstName: { type: String },
  lastName: { type: String },
  age: { type: Number },
  email: { type: String, unique: true },
  password: { type: String },
  rol: { type: String, default: "user" },
  cart: { type: mongoose.Schema.Types.ObjectId, ref: "Cart" },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
  isPremium: { type: Boolean, default: false },
});

module.exports = mongoose.model("User", UserSchema);
