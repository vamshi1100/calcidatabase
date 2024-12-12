class Calculator {
  constructor(container, instanceId) {
    this.container = container;
    this.instanceId = instanceId; // Unique instance ID for each calculator
    this.buttonLabels = [
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "+",
      "-",
      "*",
      "/",
      "%",
      "C",
    ];
    this.createCalculatorUI();
    this.fetchHistory(); // Fetch history on initialization
  }

  createCalculatorUI() {
    const calculatorDiv = document.createElement("div");
    calculatorDiv.className = "calculator";

    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = "Enter expression";
    input.className = "input";

    const buttonContainer = document.createElement("div");
    buttonContainer.className = "button-container";

    this.buttonLabels.forEach((label) => {
      const button = document.createElement("button");
      button.className = "calc-button";
      button.textContent = label;

      if (label === "C") {
        button.addEventListener("click", () => this.clearInput(input));
      } else {
        button.addEventListener("click", () => {
          this.appendToInput(input, label);
        });
      }

      buttonContainer.appendChild(button);
    });

    const clearHistoryButton = document.createElement("button");
    clearHistoryButton.textContent = "Clear History";
    clearHistoryButton.className = "clearHistory";

    const calculateButton = document.createElement("button");
    calculateButton.textContent = "Calculate";
    calculateButton.className = "calculate";

    const resultDiv = document.createElement("div");
    resultDiv.className = "result";

    const historyDiv = document.createElement("div");
    historyDiv.className = "history";

    calculatorDiv.appendChild(input);
    calculatorDiv.appendChild(buttonContainer);
    calculatorDiv.appendChild(calculateButton);
    calculatorDiv.appendChild(clearHistoryButton);
    calculatorDiv.appendChild(resultDiv);
    calculatorDiv.appendChild(historyDiv);

    this.container.appendChild(calculatorDiv);

    this.attachEventListeners(
      calculateButton,
      clearHistoryButton,
      input,
      resultDiv,
      historyDiv
    );
  }

  attachEventListeners(
    calculateButton,
    clearHistoryButton,
    input,
    resultDiv,
    historyDiv
  ) {
    calculateButton.addEventListener("click", () =>
      this.calculateResult(input, resultDiv, historyDiv)
    );
    clearHistoryButton.addEventListener("click", () =>
      this.clearHistory(historyDiv)
    );
  }

  async calculateResult(input, resultDiv, historyDiv) {
    const expression = input.value;
    if (!expression) return;

    try {
      const result = eval(expression);
      resultDiv.innerText = `Result: ${result}`;
      const style = this.getHistoryStyle(this.instanceId);
      this.appendToHistory(historyDiv, expression, result, style);

      await this.saveExpression(expression, result);
    } catch (error) {
      resultDiv.innerText = "Error: Invalid Expression";
    }
  }

  async saveExpression(expression, result) {
    try {
      const response = await fetch(`/api/expressions/${this.instanceId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ expression, result }),
      });

      if (!response.ok) {
        throw new Error("Failed to save expression");
      }
    } catch (error) {
      console.error("Error saving expression:", error);
    }
  }

  async clearHistory(historyDiv) {
    historyDiv.innerHTML = ""; // Clear UI history
    try {
      const response = await fetch(`/api/expressions/${this.instanceId}`, {
        method: "DELETE", // Assuming your API supports DELETE for clearing history
      });

      if (!response.ok) {
        throw new Error("Failed to clear history in database");
      }
    } catch (error) {
      console.error("Error clearing history:", error);
    }
  }

  async fetchHistory() {
    try {
      const response = await fetch(`/api/expressions/${this.instanceId}`);
      if (!response.ok) throw new Error("Failed to fetch history");

      const historyData = await response.json();
      const historyDiv = this.container.querySelector(
        `.calculator:nth-child(${this.instanceId}) .history`
      ); // Select the specific historyDiv for this instance

      historyData.forEach((entry) => {
        const style = this.getHistoryStyle(this.instanceId);
        this.appendToHistory(historyDiv, entry.expression, entry.result, style);
      });
    } catch (error) {
      console.error("Error fetching history:", error);
    }
  }

  clearInput(input) {
    input.value = "";
  }

  appendToInput(input, label) {
    input.value += label;
  }

  appendToHistory(historyDiv, expression, result, style) {
    const historyEntry = document.createElement("p");
    historyEntry.innerText = `${expression} = ${result}`;
    historyEntry.className = `history-entry ${style}`;
    historyDiv.prepend(historyEntry);
  }

  getHistoryStyle(instanceId) {
    switch (instanceId) {
      case 1:
        return "style1"; // Style for the first calculator
      case 2:
        return "style2"; // Style for the second calculator
      case 3:
        return "style3"; // Style for the third calculator
      default:
        return "default-style"; // Fallback style
    }
  }
}

// Automatically create multiple calculator instances
const container = document.getElementById("calculators-container");
new Calculator(container, 1);
new Calculator(container, 2);
// new Calculator(container, 3);
