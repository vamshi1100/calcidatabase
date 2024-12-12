const Expression = require("./model"); // Adjust path as necessary

class ExpressionController {
  // Save an expression for a specific instance ID
  async saveExpression(req, res) {
    const { instanceId } = req.params;
    const { expression, result } = req.body;

    console.log(
      `Saving expression - Instance ID: ${instanceId}, Expression: ${expression}, Result: ${result}`
    );

    // Validate input
    if (!expression || result === undefined) {
      return res
        .status(400)
        .json({ message: "Expression and result are required." });
    }

    const newExpression = new Expression({
      instanceId,
      expression,
      result,
    });

    try {
      const savedExpression = await newExpression.save();
      res.status(201).json({
        message: "Expression saved successfully",
        data: savedExpression,
      });
    } catch (error) {
      console.error("Error saving expression:", error);
      res
        .status(500)
        .json({ message: "Error saving expression", error: error.message });
    }
  }

  // Get all expressions for a specific instance ID
  async getAllExpressions(req, res) {
    const { instanceId } = req.params;

    try {
      const expressions = await Expression.find({ instanceId });
      res.json(expressions);
    } catch (error) {
      console.error("Error retrieving expressions:", error);
      res.status(500).json({ message: "Error retrieving expressions" });
    }
  }

  async clearAllExpressions(req, res) {
    const { instanceId } = req.params;
    console.log(`Clearing expressions for instanceId: ${instanceId}`);

    try {
      const result = await Expression.deleteMany({ instanceId });
      console.log(`Delete result: ${result}`);
      if (result.deletedCount === 0) {
        return res
          .status(404)
          .json({ message: "No expressions found for this instanceId" });
      }
      res.json({ message: "All expressions cleared successfully" });
    } catch (error) {
      console.error("Error clearing expressions:", error);
      res.status(500).json({ message: "Error clearing expressions" });
    }
  }
}

module.exports = new ExpressionController();
