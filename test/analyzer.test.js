import test from "node:test";
import assert from "node:assert/strict";
import { ALGORITHMS, analyzeCustom, compareAlgorithms, inferTask } from "../analyzer.js";

test("includes all requested sample algorithms", () => {
  assert.deepEqual(Object.values(ALGORITHMS).map((item) => item.name), [
    "Bubble Sort", "Selection Sort", "Insertion Sort", "Linear Search", "Binary Search"
  ]);
});

test("identifies two sorting algorithms as the same task", () => {
  const result = compareAlgorithms({ key: "bubble" }, { key: "insertion" });
  assert.equal(result.sameTask, true);
  assert.equal(result.first.task, "Sorting");
});

test("identifies sorting and searching as different tasks", () => {
  const result = compareAlgorithms({ key: "selection" }, { key: "binary" });
  assert.equal(result.sameTask, false);
});

test("reports known binary search complexity", () => {
  assert.equal(ALGORITHMS.binary.time.average, "O(log n)");
  assert.equal(ALGORITHMS.binary.space, "O(1)");
});

test("infers a linear custom search", () => {
  const code = `function find(items, target) {
    for (let i = 0; i < items.length; i++) {
      if (items[i] === target) return i;
    }
    return -1;
  }`;
  const result = analyzeCustom("Find item", code);
  assert.equal(inferTask("Find item", code), "Searching");
  assert.equal(result.time.average, "O(n)");
  assert.equal(result.space, "O(1)");
});

test("marks unrecognizable tasks as uncertain", () => {
  const result = compareAlgorithms(
    { key: "custom", name: "Mystery one", code: "return value;" },
    { key: "custom", name: "Mystery two", code: "return other;" }
  );
  assert.equal(result.sameTask, null);
});
