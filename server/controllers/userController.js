const User = require("../models/userModels");

exports.signup = async (req, res) => {
  try {
    const data = {
      username: req.body.username,
      password: req.body.password,
      realName: req.body.realName
    };

    const existingUser = await User.findOne({ username: data.username });
    if (existingUser) {
      res.status(409).json({
        status: "fail",
        message: "A user with this username already exists"
      });
    }

    const newUser = await User.create(data);
    res.status(201).json({
      status: "success",
      token: "todo",
      user: newUser
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
}

exports.login = async (req, res) => {
  try {
    const apparentCredentials = {
      username: req.body.username,
      password: req.body.password
    };

    const matchedUser = await User.findOne(apparentCredentials);
    if (!matchedUser) {
      res.status(401).json({
        status: "fail",
        message: "No such account with these credentials"
      });
    }

    res.status(200).json({
      status: "success",
      token: "todo",
      user: matchedUser
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
}

exports.logout = async (req, res) => {
  try {
    const token = req.body.token;

    res.status(200).json({
      status: "success"
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
}
