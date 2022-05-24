import { isBrowser } from "../lib/isBrowser";

test("detects browser-like environment", () => {
  expect(isBrowser).toBe(false);
});
