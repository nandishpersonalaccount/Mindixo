import { describe,it,expect } from "vitest";
import {cartTotals} from "./cart";
describe("real store totals",()=>{it("never applies an invented offer",()=>{expect(cartTotals([{slug:"a",price:1000,qty:1}],"MINDIXO10").discount).toBe(0)});it("never adds an unconfigured tax",()=>{expect(cartTotals([{slug:"a",price:500,qty:1}]).total).toBe(500)});});
