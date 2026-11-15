export type PriceBand = "any" | "under300" | "300to500" | "500to1000" | "above1000";

export function matchesPrice(price: number, band: PriceBand) {
  switch (band) {
    case "under300": return price < 300;
    case "300to500": return price >= 300 && price <= 500;
    case "500to1000": return price > 500 && price <= 1000;
    case "above1000": return price > 1000;
    default: return true;
  }
}