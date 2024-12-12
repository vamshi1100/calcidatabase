const Expression = require("./model");

// Function to save a new expression
exports.saveExpression = async (req, res) => {
  const { expression, result } = req.body;
  const newExpression = new Expression({ expression, result });
  await newExpression.save();
  res.status(201).json(newExpression);
};

// Function to get all expressions
exports.getAllExpressions = async (req, res) => {
  const expressions = await Expression.find();
  res.status(200).json(expressions);
};

// Function to clear all expressions
exports.clearAllExpressions = async (req, res) => {
  await Expression.deleteMany({});
  res.status(200).json({ message: "History cleared!" });
};
