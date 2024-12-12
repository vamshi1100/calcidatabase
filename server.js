const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const ExpressionController = require("./backend/controller"); // Import the class-based controller
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "frontend")));

// MongoDB connection
mongoose
  .connect("mongodb://localhost:27017/calculator", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));

// API Routes
app.post(
  "/api/expressions/:instanceId",
  ExpressionController.saveExpression.bind(ExpressionController)
);
app.get(
  "/api/expressions/:instanceId",
  ExpressionController.getAllExpressions.bind(ExpressionController)
);
app.delete(
  "/api/expressions/:instanceId",
  ExpressionController.clearAllExpressions.bind(ExpressionController)
);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
