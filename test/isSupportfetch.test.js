
import { isSupportFetch } from "../lib/isSupportFetch.js";

test("detects isSupportFetch", () => {
  expect(isSupportFetch).toBe(false);
});
