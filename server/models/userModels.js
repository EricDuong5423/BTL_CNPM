const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
      required: [true, "A user must have a username"],
    },
  password: {
    type: String,
      required: [true, "A user must have a username"],
  },

  realName: {
    type: String,
    required: [true, "A user must have a real name"],
  }
});

const User = new mongoose.model("User", userSchema);
module.exports = User;
