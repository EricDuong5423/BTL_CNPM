const express = require("express");
const router = express.Router();
const userController = require(`${__dirname}/../controllers/userController.js`);

router
  .route("/users/login")
  .post(userController.login);
router
  .route("/users/logout")
  .post(userController.logout);
router
  .route("/users/signup")
  .post(userController.signup);
module.exports = router;