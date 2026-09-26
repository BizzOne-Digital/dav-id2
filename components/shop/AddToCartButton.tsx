"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { addToCart } from "@/lib/shop/cart";

type AddToCartButtonProps = {
  productId: string;
  slug: string;
  title: string;
  priceCents: number;
  image?: string;
};

export function AddToCartButton({ productId, slug, title, priceCents, image }: AddToCartButtonProps) {
  const [added, setAdded] = useState(false);

  function handleClick() {
    addToCart({ productId, slug, title, priceCents, image });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <Button type="button" variant="primary" onClick={handleClick}>
      {added ? "Added to cart" : "Add to cart"}
    </Button>
  );
}
