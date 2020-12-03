const calculateTip = require("../src/maths");

test("checking tip", () => {
  const total = calculateTip(10, 0.3);
  expect(total).toBe(13);
});
