function calculate(expression) {
  try {
    // Only allow numbers and math operators for safety
    if (!/^[\d\s+\-*/()^.]+$/.test(expression)) return "Invalid characters in expression.";
    // eslint-disable-next-line no-eval
    const result = eval(expression);
    if (typeof result !== "number" || !isFinite(result)) return "Invalid calculation.";
    return `Result: ${result}`;
  } catch {
    return "Error evaluating expression.";
  }
}

module.exports = { calculate };