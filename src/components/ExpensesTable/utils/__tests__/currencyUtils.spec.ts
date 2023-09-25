import { numberToUSD } from "../currencyUtils";

describe("numberToUSD", () => {
  it("formats a positive number to USD currency format", () => {
    expect(numberToUSD(1000)).toBe("$1,000.00");
    expect(numberToUSD(500.5)).toBe("$500.50");
  });

  it("formats a negative number to USD currency format", () => {
    expect(numberToUSD(-1000)).toBe("-$1,000.00");
    expect(numberToUSD(-500.5)).toBe("$500.50");
  });

  it("formats zero to USD currency format", () => {
    expect(numberToUSD(0)).toBe("$0.00");
  });

  it("handles very large numbers", () => {
    expect(numberToUSD(1e10)).toBe("$10,000,000,000.00");
  });

  it("handles decimal precision", () => {
    expect(numberToUSD(123.456789)).toBe("$123.46"); // Rounded to 2 decimal places
    expect(numberToUSD(123.454)).toBe("$123.45"); // Rounded to 2 decimal places
  });
});
