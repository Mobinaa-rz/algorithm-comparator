import { ALGORITHMS, compareAlgorithms } from "./analyzer.js";

const sides = ["first", "second"];
const defaults = { first: "bubble", second: "selection" };

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;"
  })[character]);
}

function fillSelect(side) {
  const select = document.querySelector(`#${side}-select`);
  Object.entries(ALGORITHMS).forEach(([key, algorithm]) => {
    const option = document.createElement("option");
    option.value = key;
    option.textContent = algorithm.name;
    select.append(option);
  });
  select.append(new Option("Custom algorithm…", "custom"));
  select.value = defaults[side];
}

function updatePanel(side) {
  const select = document.querySelector(`#${side}-select`);
  const textarea = document.querySelector(`#${side}-code`);
  const nameWrap = document.querySelector(`[data-panel="${side}"] .custom-name-wrap`);
  const isCustom = select.value === "custom";
  nameWrap.hidden = !isCustom;
  textarea.readOnly = !isCustom;
  textarea.value = isCustom ? "" : ALGORITHMS[select.value].code;
  textarea.placeholder = isCustom ? "Paste or write your algorithm here…" : "";
}

function getInput(side) {
  const key = document.querySelector(`#${side}-select`).value;
  return {
    key,
    name: key === "custom" ? document.querySelector(`#${side}-name`).value : ALGORITHMS[key].name,
    code: document.querySelector(`#${side}-code`).value
  };
}

function renderTime(target, time) {
  document.querySelector(target).innerHTML = `
    <div class="complexity-grid">
      <div><span>Best</span><code>${time.best}</code></div>
      <div><span>Average</span><code>${time.average}</code></div>
      <div><span>Worst</span><code>${time.worst}</code></div>
    </div>`;
}

function renderAlgorithm(prefix, algorithm) {
  document.querySelector(`#${prefix}-result-name`).textContent = algorithm.name;
  document.querySelector(`#${prefix}-purpose`).innerHTML = `<span class="task-pill">${escapeHtml(algorithm.task)}</span><p class="cell-summary">${escapeHtml(algorithm.summary)}</p>`;
  renderTime(`#${prefix}-time`, algorithm.time);
  document.querySelector(`#${prefix}-space`).innerHTML = `<code class="space-value">${algorithm.space}</code><p class="cell-summary">Extra space as input grows.</p>`;
  document.querySelector(`#${prefix}-note`).innerHTML = `<p class="cell-note">${escapeHtml(algorithm.note || "No special input requirements.")}</p>`;
}

function renderVerdict(result) {
  const verdict = document.querySelector("#task-verdict");
  if (result.sameTask === true) {
    verdict.className = "verdict";
    verdict.innerHTML = `<span class="verdict-icon">✓</span><div><strong>Same task: ${result.first.task}</strong><p>Both algorithms share the same goal, though their approach and efficiency may differ.</p></div>`;
  } else if (result.sameTask === false) {
    verdict.className = "verdict different";
    verdict.innerHTML = `<span class="verdict-icon">≠</span><div><strong>Different tasks</strong><p>${escapeHtml(result.first.name)} performs ${escapeHtml(result.first.task.toLowerCase())}, while ${escapeHtml(result.second.name)} performs ${escapeHtml(result.second.task.toLowerCase())}.</p></div>`;
  } else {
    verdict.className = "verdict unknown";
    verdict.innerHTML = `<span class="verdict-icon">?</span><div><strong>Task match is uncertain</strong><p>The code did not provide enough recognizable detail to reliably determine whether both algorithms do the same task.</p></div>`;
  }
}

function compare() {
  const first = getInput("first");
  const second = getInput("second");
  const message = document.querySelector("#form-message");
  if ((first.key === "custom" && !first.code.trim()) || (second.key === "custom" && !second.code.trim())) {
    message.textContent = "Add code for both custom algorithms before comparing.";
    return;
  }
  message.textContent = "";
  const result = compareAlgorithms(first, second);
  renderVerdict(result);
  renderAlgorithm("first", result.first);
  renderAlgorithm("second", result.second);
  const results = document.querySelector("#results");
  results.hidden = false;
  results.scrollIntoView({ behavior: "smooth", block: "start" });
}

sides.forEach((side) => {
  fillSelect(side);
  updatePanel(side);
  document.querySelector(`#${side}-select`).addEventListener("change", () => updatePanel(side));
});

document.querySelector("#compare-button").addEventListener("click", compare);
document.querySelector("#reset-button").addEventListener("click", () => {
  document.querySelector("#compare").scrollIntoView({ behavior: "smooth" });
});
