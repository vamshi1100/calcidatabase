const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const controller = require("./backend/controller");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "frontend")));

mongoose
  .connect("mongodb://localhost:27017/calculator")
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.post("/api/expressions", controller.saveExpression);
app.get("/api/expressions", controller.getAllExpressions);
app.delete("/api/expressions", controller.clearAllExpressions);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
