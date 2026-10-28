"use client";

import { useState, useEffect } from "react";

import { CartContext } from "./contex";
import { Games } from "@/types/database";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartList, setCartList] = useState<Games[]>([]);

  useEffect(() => {
    fetch("/api/orders", {
      credentials: "include",
    })
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        if (Array.isArray(data)) {
          setCartList(data);
        } else {
          setCartList([]);
        }
      })
      .catch((err) => {
        console.error(err);
        setCartList([]);
      });
  }, []);

  return (
    <CartContext.Provider value={{ cartList, setCartList }}>
      {children}
    </CartContext.Provider>
  );
}

