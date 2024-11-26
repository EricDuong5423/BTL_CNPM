const Printer = require("../models/printerModels");
const APIFeatures = require("../utils/APIFeatures");

exports.getAllPrinter = async (req, res) => {
  try {
    const features = new APIFeatures(Printer.find(), req.query)
      .filter()
      .sort()
      .select()
      .page();

    const allPrinter = await features.query;
    res.status(200).json({
      status: "success",
      data: {
        allPrinter,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

exports.getPrinter = async (req, res) => {
  try {
    const printer = await Printer.findById(req.params.id);
    res.status(200).json({
      status: "success",
      data: {
        printer,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

exports.createPrinter = async (req, res) => {
  try {
    const newPrinter = await Printer.create(req.body);
    res.status(201).json({
      status: "success",
      data: {
        newPrinter,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

exports.updatePrinter = async (req, res) => {
  try {
    const updatePrinter = await Printer.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    res.status(200).json({
      status: "success",
      data: {
        updatePrinter,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

exports.deletePrinter = async (req, res) => {
  try {
    await Printer.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};
