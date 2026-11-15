import {z} from "zod";
export const productSchema=z.object({id:z.string().uuid().optional(),title:z.string().trim().min(1).max(250),author:z.string().trim().min(1).max(200),slug:z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),price:z.number().finite().min(0),pages:z.number().int().min(0),category_id:z.string().uuid().nullable(),description:z.string().max(20000),sample:z.string().max(50000),cover:z.string().max(2000),formats:z.array(z.enum(["PDF","EPUB","MOBI"])).min(1),published:z.boolean()});
export function canManage(role:string|undefined){return role==="admin";}
