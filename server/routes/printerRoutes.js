const express = require("express");
const router = express.Router();
const printerController = require(`${__dirname}/../controllers/printerController.js`);

router
  .route("/")
  .get(printerController.getAllPrinter)
  .post(printerController.createPrinter);
router
  .route("/:id")
  .get(printerController.getPrinter)
  .patch(printerController.updatePrinter)
  .delete(printerController.deletePrinter);
module.exports = router;
