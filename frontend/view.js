class Calculator {
  constructor(container, instanceId) {
    this.container = container;
    this.instanceId = instanceId;
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
    const calculatorDiv = this.createElement("div", "calculator");
    const input = this.createInputField();
    const buttonContainer = this.createButtonContainer(input);
    const resultDiv = this.createElement("div", "result");
    const historyDiv = this.createElement("div", "history");
    const filterDiv = this.createFilterUI(historyDiv);

    const calculateButton = this.createButton("Calculate");
    const clearHistoryButton = this.createButton("Clear History");

    this.attachEventListeners(
      calculateButton,
      clearHistoryButton,
      input,
      resultDiv,
      historyDiv
    );

    calculatorDiv.append(
      input,
      buttonContainer,
      calculateButton,
      clearHistoryButton,
      resultDiv,
      historyDiv,
      filterDiv
    );
    this.container.appendChild(calculatorDiv);
  }

  createElement(tag, className) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    return element;
  }

  createInputField() {
    const input = this.createElement("input");
    input.type = "text";
    input.placeholder = "Enter expression";
    input.className = "input";
    input.addEventListener("keydown", (event) => this.filterInput(event));
    return input;
  }

  createButton(label) {
    const button = this.createElement("button", "calc-button");
    button.textContent = label;
    return button;
  }

  createButtonContainer(input) {
    const buttonContainer = this.createElement("div", "button-container");
    this.buttonLabels.forEach((label) => {
      const button = this.createButton(label);
      button.addEventListener(
        "click",
        label === "C"
          ? () => this.clearInput(input)
          : () => this.appendToInput(input, label)
      );
      buttonContainer.appendChild(button);
    });
    return buttonContainer;
  }

  createFilterUI(historyDiv) {
    const filterDiv = this.createElement("div", "filter");
    filterDiv.innerHTML = `
      <p>Filter (choices)</p>
      <p>1: >50, 2: <150 <br /> 3: b/w 50 & 150, <br /> 4: no. of operands</p>
      <input type="number" id="choice" placeholder="Enter choice" />
      <input type="number" id="filter" placeholder="Enter value" />
      <div id="errorDiv" style="color: red"></div>
    `;
    this.setupFilterEventListeners(filterDiv, historyDiv);
    return filterDiv;
  }

  setupFilterEventListeners(filterDiv, historyDiv) {
    const choiceInput = filterDiv.querySelector("#choice");
    const filterInput = filterDiv.querySelector("#filter");
    const errorDiv = filterDiv.querySelector("#errorDiv");

    const handleFilter = () => {
      const choiceop = parseInt(choiceInput.value);
      const filteroutput = parseInt(filterInput.value);
      errorDiv.innerHTML = "";

      if (isNaN(filteroutput)) return; // Exit if filter output is not a number

      historyDiv.innerHTML = "";
      this.fetchHistoryData()
        .then((parsedHistory) => {
          this.applyFilter(
            choiceop,
            filteroutput,
            parsedHistory,
            historyDiv,
            errorDiv
          );
        })
        .catch((error) => {
          errorDiv.innerHTML = error.message;
        });
    };

    choiceInput.addEventListener("input", handleFilter);
    filterInput.addEventListener("input", handleFilter);
  }

  async fetchHistoryData() {
    const response = await fetch(`/api/expressions/${this.instanceId}`);
    if (!response.ok) throw new Error("Failed to fetch history");
    return response.json();
  }

  applyFilter(choiceop, filteroutput, parsedHistory, historyDiv, errorDiv) {
    let filterresult = [];

    switch (choiceop) {
      case 1:
        if (filteroutput <= 50) {
          errorDiv.innerHTML = "Error: Value must be greater than 50!";
        } else {
          filterresult = parsedHistory.filter((item) => item.result > 50);
        }
        break;
      case 2:
        if (filteroutput >= 150) {
          errorDiv.innerHTML = "Error: Value must be less than 150!";
        } else {
          filterresult = parsedHistory.filter((item) => item.result < 150);
        }
        break;
      case 3:
        if (filteroutput < 50 || filteroutput > 150) {
          errorDiv.innerHTML = "Error: Value must be <50 & >150";
        } else {
          filterresult = parsedHistory.filter(
            (item) => item.result > 50 && item.result < 150
          );
        }
        break;
      case 4:
        if (filteroutput < 2) {
          errorDiv.innerHTML = "Error: Value must be >= 2";
        } else {
          filterresult = this.filterByOperandCount(
            parsedHistory,
            filteroutput,
            errorDiv
          );
        }
        break;
      default:
        errorDiv.innerHTML =
          "Error: Please select a valid choice (1, 2, 3, or 4).";
    }

    filterresult.forEach((item) => {
      const p = document.createElement("p");
      p.innerText = `${item.expression} = ${item.result}`;
      historyDiv.prepend(p);
    });
  }

  filterByOperandCount(parsedHistory, filteroutput, errorDiv) {
    const filterresult = parsedHistory.filter((item) => {
      const operandsCount = item.expression
        .split(/[+\-*/^()]/)
        .filter(Boolean).length;
      return operandsCount === filteroutput;
    });

    if (filterresult.length === 0) {
      errorDiv.innerHTML = "No matching operands found";
    }
    return filterresult;
  }

  filterInput(event) {
    const allowedKeys = [
      "0",
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
      "Backspace",
      "Delete",
      "ArrowLeft",
      "ArrowRight",
      "Enter",
    ];

    if (!allowedKeys.includes(event.key)) {
      event.preventDefault();
    }

    const operators = ["+", "-", "*", "/", "%"];
    const input = event.target;

    if (
      operators.includes(event.key) &&
      input.value.length > 0 &&
      operators.includes(input.value.slice(-1))
    ) {
      event.preventDefault();
    }

    if (event.key === "=" || event.key === "Enter") {
      event.preventDefault();
      const resultDiv = this.container.querySelector(".result");
      const historyDiv = this.container.querySelector(".history");
      this.calculateResult(input, resultDiv, historyDiv);
    }
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
    const expression = input.value.trim();
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
      if (!response.ok) throw new Error("Failed to save expression");
    } catch (error) {
      console.error("Error saving expression:", error);
    }
  }

  async clearHistory(historyDiv) {
    historyDiv.innerHTML = "";
    try {
      const response = await fetch(`/api/expressions/${this.instanceId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to clear history in database");
    } catch (error) {
      console.error("Error clearing history:", error);
    }
  }

  async fetchHistory() {
    try {
      const historyData = await this.fetchHistoryData();
      const historyDiv = this.container.querySelector(
        `.calculator:nth-child(${this.instanceId}) .history`
      );
      historyData.forEach((entry) => {
        const style = this.getHistoryStyle(this.instanceId);
        this.appendToHistory(historyDiv, entry.expression, entry.result, style);
      });
    } catch (error) {
      console.error("Error fetching history:", error);
    }
  }

  appendToHistory(historyDiv, expression, result, style) {
    const p = document.createElement("p");
    p.innerText = `${expression} = ${result}`;
    p.className = style;
    historyDiv.prepend(p);
  }

  clearInput(input) {
    input.value = "";
  }

  appendToInput(input, value) {
    input.value += value;
  }

  getHistoryStyle(instanceId) {
    // Custom styling for history entries based on instanceId
    return `history-item-${instanceId}`;
  }
}

const container = document.getElementById("calculators-container");
const calculator1 = new Calculator(container, 1);
const calculator2 = new Calculator(container, 2);
// const calculator3 = new Calculator(container, 3);
