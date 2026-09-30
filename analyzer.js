export const ALGORITHMS = {
  bubble: {
    name: "Bubble Sort",
    task: "Sorting",
    summary: "Repeatedly swaps adjacent values that are in the wrong order.",
    time: { best: "O(n)", average: "O(n²)", worst: "O(n²)" },
    space: "O(1)",
    code: `function bubbleSort(items) {
  const array = [...items];
  for (let i = 0; i < array.length; i++) {
    let swapped = false;
    for (let j = 0; j < array.length - i - 1; j++) {
      if (array[j] > array[j + 1]) {
        [array[j], array[j + 1]] = [array[j + 1], array[j]];
        swapped = true;
      }
    }
    if (!swapped) break;
  }
  return array;
}`
  },
  selection: {
    name: "Selection Sort",
    task: "Sorting",
    summary: "Finds the smallest remaining value and places it next.",
    time: { best: "O(n²)", average: "O(n²)", worst: "O(n²)" },
    space: "O(1)",
    code: `function selectionSort(items) {
  const array = [...items];
  for (let i = 0; i < array.length; i++) {
    let smallest = i;
    for (let j = i + 1; j < array.length; j++) {
      if (array[j] < array[smallest]) smallest = j;
    }
    [array[i], array[smallest]] = [array[smallest], array[i]];
  }
  return array;
}`
  },
  insertion: {
    name: "Insertion Sort",
    task: "Sorting",
    summary: "Builds a sorted section by inserting each value into place.",
    time: { best: "O(n)", average: "O(n²)", worst: "O(n²)" },
    space: "O(1)",
    code: `function insertionSort(items) {
  const array = [...items];
  for (let i = 1; i < array.length; i++) {
    const value = array[i];
    let j = i - 1;
    while (j >= 0 && array[j] > value) {
      array[j + 1] = array[j];
      j--;
    }
    array[j + 1] = value;
  }
  return array;
}`
  },
  linear: {
    name: "Linear Search",
    task: "Searching",
    summary: "Checks each value in order until the target is found.",
    time: { best: "O(1)", average: "O(n)", worst: "O(n)" },
    space: "O(1)",
    code: `function linearSearch(items, target) {
  for (let i = 0; i < items.length; i++) {
    if (items[i] === target) return i;
  }
  return -1;
}`
  },
  binary: {
    name: "Binary Search",
    task: "Searching",
    summary: "Halves a sorted search range until the target is found.",
    time: { best: "O(1)", average: "O(log n)", worst: "O(log n)" },
    space: "O(1)",
    note: "Requires sorted input.",
    code: `function binarySearch(sortedItems, target) {
  let low = 0;
  let high = sortedItems.length - 1;
  while (low <= high) {
    const middle = Math.floor((low + high) / 2);
    if (sortedItems[middle] === target) return middle;
    if (sortedItems[middle] < target) low = middle + 1;
    else high = middle - 1;
  }
  return -1;
}`
  }
};

const nestedLoops = (code) => {
  const loopPattern = /(?:for|while)\s*\([^)]*\)\s*\{?/g;
  const matches = [...code.matchAll(loopPattern)];
  if (matches.length < 2) return false;
  // A compact heuristic: if another loop starts before the first loop's likely end,
  // treat the loops as nested. This intentionally favors clear beginner code.
  const firstStart = matches[0].index;
  const secondStart = matches[1].index;
  const firstBlock = code.slice(firstStart, secondStart);
  return !firstBlock.includes("}\n") || /^\s*for/m.test(code.slice(secondStart));
};

export function inferTask(name = "", code = "") {
  const text = `${name} ${code}`.toLowerCase();
  if (/sort|swap|smallest|largest/.test(text) || (/array/.test(text) && /\[.*\]\s*=/.test(text))) return "Sorting";
  if (/search|target|find|lookup|return\s+-1/.test(text)) return "Searching";
  if (/graph|vertex|vertices|edge|bfs|dfs/.test(text)) return "Graph traversal";
  if (/factorial|fibonacci/.test(text)) return "Numeric calculation";
  return "General / unknown";
}

export function analyzeCustom(name, code) {
  const cleanCode = code.trim();
  const lower = cleanCode.toLowerCase();
  const task = inferTask(name, cleanCode);
  const hasRecursion = /function\s+(\w+)/.test(cleanCode) && (() => {
    const functionName = cleanCode.match(/function\s+(\w+)/)?.[1];
    return functionName && new RegExp(`\\b${functionName}\\s*\\(`, "g").test(cleanCode.replace(new RegExp(`function\\s+${functionName}\\s*\\(`), ""));
  })();
  const loops = (cleanCode.match(/\b(for|while)\s*\(/g) || []).length;
  const halvesInput = /\b(high|right|end)\s*=.*\/\s*2|\b(low|left|start)\s*=.*middle|>>\s*1/.test(lower);
  const logarithmic = halvesInput && loops > 0;
  const quadratic = loops >= 2 && (nestedLoops(cleanCode) || task === "Sorting");

  let average = "O(1)";
  let explanation = "No input-sized loop was detected.";
  if (hasRecursion) {
    average = "O(n)";
    explanation = "A recursive call was detected; this estimate assumes the input shrinks by one per call.";
  }
  if (loops > 0) {
    average = "O(n)";
    explanation = "A loop that may scan the input was detected.";
  }
  if (logarithmic) {
    average = "O(log n)";
    explanation = "The loop appears to halve its search range each step.";
  } else if (quadratic) {
    average = "O(n²)";
    explanation = "Multiple input-sized loops were detected, suggesting quadratic work.";
  }

  const allocatesArray = /\b(new\s+Array|array\.from|\.slice\(|\.map\(|\.filter\(|\[\.\.\.)/i.test(cleanCode);
  const space = hasRecursion ? "O(n)" : allocatesArray ? "O(n)" : "O(1)";

  return {
    name: name.trim() || "Custom algorithm",
    task,
    summary: explanation,
    time: { best: average, average, worst: average },
    space,
    note: "Estimated from code structure. Review estimates for complex or language-specific code.",
    code: cleanCode
  };
}

export function compareAlgorithms(first, second) {
  const knownFirst = ALGORITHMS[first.key];
  const knownSecond = ALGORITHMS[second.key];
  const a = knownFirst || analyzeCustom(first.name, first.code);
  const b = knownSecond || analyzeCustom(second.name, second.code);
  const comparable = a.task !== "General / unknown" && b.task !== "General / unknown";
  return {
    first: a,
    second: b,
    sameTask: comparable ? a.task === b.task : null
  };
}
