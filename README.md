# AlgoLens — Algorithm Comparator

AlgoLens is a small, beginner-friendly web platform for comparing two algorithms. It helps learners answer three practical questions: do the algorithms solve the same kind of problem, how does their runtime grow, and how much extra memory do they use?

## Main features

- Compare two algorithms in a clear side-by-side table
- Clearly labels a pair as performing the **same task**, **different tasks**, or an **uncertain match**
- Shows best, average, and worst-case time complexity
- Shows auxiliary space complexity
- Includes Bubble Sort, Selection Sort, Insertion Sort, Linear Search, and Binary Search
- Accepts custom JavaScript or pseudocode for a simple structural estimate
- Responsive layout for desktop and mobile
- Includes a compact Big O reference for beginners

## Technologies used

- HTML5
- CSS3
- Vanilla JavaScript (ES modules)
- [Vite](https://vite.dev/) for local development and production builds
- Node.js's built-in test runner

No front-end framework or runtime API is required.

## How to run the project

You need a current version of [Node.js](https://nodejs.org/) (Node 20.19+ or 22.12+ is recommended by Vite 7).

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

Open the URL printed in the terminal (normally `http://localhost:5173`).

To create a production build:

```bash
npm run build
```

To run the automated tests:

```bash
npm test
```

## How algorithm comparison works

### Included samples

Each included algorithm has reviewed metadata describing:

1. Its task category (such as sorting or searching)
2. A short explanation of its approach
3. Best, average, and worst-case time complexity
4. Auxiliary space complexity
5. Any important requirement, such as Binary Search needing sorted input

Two known algorithms perform the same task when their task categories match. For example, Bubble Sort and Insertion Sort both sort data, while Bubble Sort and Linear Search perform different tasks.

### Custom algorithms

For custom code, AlgoLens performs a deliberately simple static estimate in the browser. It looks for recognizable names and code patterns to infer a task, then checks structures such as loops, nested loops, range-halving, recursion, and array allocation to estimate complexity.

These estimates are educational hints—not formal proofs. The app labels custom estimates accordingly, and reports an uncertain task match when it cannot classify the code reliably. Actual performance may also depend on input shape, implementation details, and the language runtime.

## Project structure

```text
index.html       Page structure and accessible comparison UI
styles.css       Responsive visual design
app.js           Browser interactions and result rendering
analyzer.js      Sample data and comparison/estimation logic
test/            Automated analyzer tests
```
