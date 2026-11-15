import { useStore } from "@/lib/store";
import { cartTotals } from "@/lib/cart";
import { formatPrice } from "@/lib/site";

export function Summary({ coupon }: { coupon?: string | undefined }) {
  const { cart } = useStore();
  const t = cartTotals(cart, coupon);
  return (
    <div className="space-y-2 text-sm">
      <div className="flex justify-between"><span className="text-muted-foreground">Subtotal ({t.count})</span><span>{formatPrice(t.subtotal)}</span></div>
      {t.discount > 0 && <div className="flex justify-between text-primary"><span>Discount</span><span>−{formatPrice(t.discount)}</span></div>}
      <div className="flex justify-between border-t border-border pt-3 text-lg font-semibold"><span>Total</span><span className="text-primary">{formatPrice(t.total)}</span></div>
    </div>
  );
}
