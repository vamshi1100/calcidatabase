document.getElementById("calculate").addEventListener("click", async () => {
  const input = document.getElementById("input").value;
  if (!input) return;

  try {
    const result = eval(input);
    document.getElementById("result").innerText = `Result: ${result}`;

    await fetch("/api/expressions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ expression: input, result }),
    });

    loadHistory();
  } catch (error) {
    document.getElementById("result").innerText = "Error: Invalid Expression";
  }
});

document.getElementById("clearHistory").addEventListener("click", async () => {
  await fetch("/api/expressions", { method: "DELETE" });
  loadHistory();
});

async function loadHistory() {
  const response = await fetch("/api/expressions");
  const history = await response.json();

  const historyDiv = document.getElementById("history");
  historyDiv.innerHTML = "";
  history.forEach((item) => {
    const p = document.createElement("p");
    p.innerText = `${item.expression} = ${item.result}`;
    historyDiv.prepend(p);
  });
}

// Load history on page load
loadHistory();
