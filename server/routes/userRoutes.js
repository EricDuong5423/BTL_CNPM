const express = require("express");
const router = express.Router();
const userController = require(`${__dirname}/../controllers/userController.js`);

router.route("/login").post(userController.loginRoute);
router.route("/logout").post(userController.logoutRoute);
router.route("/signup").post(userController.signupRoute);
router.route("/deleteAccount").post(userController.deleteAccountRoute);
module.exports = router;
