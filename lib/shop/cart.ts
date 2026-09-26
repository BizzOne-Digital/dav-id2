export const CART_STORAGE_KEY = "nsh-shop-cart";

export type CartLine = {
  productId: string;
  slug: string;
  title: string;
  priceCents: number;
  quantity: number;
  image?: string;
};

export function readCart(): CartLine[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as CartLine[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function writeCart(lines: CartLine[]) {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(lines));
}

export function addToCart(item: Omit<CartLine, "quantity">, quantity = 1) {
  const cart = readCart();
  const existing = cart.find((l) => l.productId === item.productId);
  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({ ...item, quantity });
  }
  writeCart(cart);
  return cart;
}

export function cartSubtotal(lines: CartLine[]): number {
  return lines.reduce((sum, l) => sum + l.priceCents * l.quantity, 0);
}
