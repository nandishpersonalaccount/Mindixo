export interface CartLine { slug: string; price: number; qty: number }
export function cartTotals(lines: CartLine[], _couponCode?: string) { const subtotal=lines.reduce((s,l)=>s+l.price*l.qty,0); return {subtotal,discount:0,tax:0,total:subtotal,count:lines.reduce((s,l)=>s+l.qty,0)}; }
