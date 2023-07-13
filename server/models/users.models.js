const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
  {
    Name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    phoneNumber: { type: Number, required: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
