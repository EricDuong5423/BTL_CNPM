const crypto = require('crypto');
const User = require("../models/userModels");

// Maps tokens to usernames. That's all we need for now.
let currentTokens = new Map();

function createToken(username) {
  function generateRandomToken() {
    return crypto.randomBytes(64).toString("hex");
  }

  let token = generateRandomToken();
  while (currentTokens.has(token)) {
    token = generateRandomToken();
  }

  currentTokens.set(token, username);
  return token;
}

function invalidateToken(token) {
  if (currentTokens.has(token)) {
    currentTokens.delete(token);
    return true;
  }

  return false;
}

exports.getUsernameByToken = (token) => {
  return currentTokens.get(token);
}

exports.signupRoute = async (req, res) => {
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

exports.loginRoute = async (req, res) => {
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

    const token = createToken(matchedUser.username);

    res.status(200).json({
      status: "success",
      token: token,
      user: {
        name: matchedUser.username,
        realName: matchedUser.realName
      }
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
}

exports.logoutRoute = async (req, res) => {
  try {
    const token = req.body.token;

    if (invalidateToken(token)) {
      res.status(200).json({
        status: "success"
      });
    } else {
      res.status(200).json({
        status: "fail",
        message: "No such token"
      });
    }
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
}
