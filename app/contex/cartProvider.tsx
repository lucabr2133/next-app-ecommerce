"use client";
import { useState, useEffect } from "react";
import { CartContext } from "./contex";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartList, setCartList] = useState<any[]>([]);

  // si querés cargar datos iniciales del backend:
  useEffect(() => {
    fetch("/api/orders")
      .then((res) => res.json())
      .then((data) => setCartList(data))
      .catch(console.error);
  }, []);

  return <CartContext.Provider value={{ cartList, setCartList }}>
      {children}
    </CartContext.Provider>

}
