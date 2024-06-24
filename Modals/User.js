const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    otp: { type: String },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("Users", UserSchema);

module.exports = User;
