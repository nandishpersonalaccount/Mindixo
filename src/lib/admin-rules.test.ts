import {describe,it,expect} from "vitest";
import {canManage,productSchema} from "./admin-rules";
describe("store management rules",()=>{it("allows only admin management",()=>{expect(canManage("admin")).toBe(true);expect(canManage("user")).toBe(false);expect(canManage(undefined)).toBe(false)});it("requires a real title",()=>{expect(productSchema.safeParse({title:"",author:"Author",slug:"book",price:1,pages:0,category_id:null,description:"",sample:"",cover:"",formats:["PDF"],published:false}).success).toBe(false)});});
