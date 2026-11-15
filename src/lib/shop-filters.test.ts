import { describe, expect, it } from "vitest";
import { matchesPrice } from "./shop-filters";

describe("reference price filters", () => {
  it("allows every price for Any price", () => {
    expect(matchesPrice(1500, "any")).toBe(true);
  });
  it("keeps Under ₹300 below 300", () => {
    expect(matchesPrice(299, "under300")).toBe(true);
    expect(matchesPrice(300, "under300")).toBe(false);
  });
  it("includes 300 through 500 in ₹300–₹500", () => {
    expect(matchesPrice(300, "300to500")).toBe(true);
    expect(matchesPrice(500, "300to500")).toBe(true);
    expect(matchesPrice(501, "300to500")).toBe(false);
  });
  it("uses the next band above 500 through 1000", () => {
    expect(matchesPrice(500, "500to1000")).toBe(false);
    expect(matchesPrice(501, "500to1000")).toBe(true);
    expect(matchesPrice(1000, "500to1000")).toBe(true);
  });
  it("keeps Above ₹1000 strictly above 1000", () => {
    expect(matchesPrice(1000, "above1000")).toBe(false);
    expect(matchesPrice(1001, "above1000")).toBe(true);
  });
});