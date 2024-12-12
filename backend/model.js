const mongoose = require("mongoose");

const ExpressionSchema = new mongoose.Schema(
  {
    instanceId: { type: String, required: true },
    expression: { type: String, required: true },
    result: { type: Number, required: true }, // Ensure this is correct
  },
  { timestamps: true }
);

const Expression = mongoose.model("Expression", ExpressionSchema);

module.exports = Expression;
