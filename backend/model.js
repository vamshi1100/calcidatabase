const mongoose = require("mongoose");

const expressionSchema = new mongoose.Schema({
  expression: String,
  result: Number,
});

const Expression = mongoose.model("Expression", expressionSchema);

module.exports = Expression;
