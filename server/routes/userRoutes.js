const express = require("express");
const router = express.Router();
const userController = require(`${__dirname}/../controllers/userController.js`);

router
  .route("/users/login")
  .post(userController.loginRoute);
router
  .route("/users/logout")
  .post(userController.logoutRoute);
router
  .route("/users/signup")
  .post(userController.signupRoute);
module.exports = router;