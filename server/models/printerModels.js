const mongoose = require("mongoose");

const printerSchema = new mongoose.Schema({
  status: {
    type: Boolean,
    default: false,
  },
  location: {
    type: String,
    trim: true,
    required: [true, "A printer must have a location"],
  },
  type: {
    type: String,
    trim: true,
    required: [true, "A printer must have a type"],
  },
  paperType: {
    type: [String],
    required: [true, "A printer must have a paper type that it can use"],
  },
  currentPaper: {
    type: Number,
    default: 0,
  },
});

const Printer = new mongoose.model("Printer", printerSchema);
module.exports = Printer;
