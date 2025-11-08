"use client";
import { useState, useEffect } from "react";
import { CartContext } from "./contex";
import { usePathname } from "next/navigation";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartList, setCartList] = useState<any[]>([]);
  
  // si querés cargar datos iniciales del backend:
  useEffect(() => {
    fetch("/api/orders",{
      credentials:'include'
    })
      .then((res) => res.json())
      .then((data) => setCartList(data))
      .catch(console.error);
  }, []);

  return <CartContext.Provider value={{ cartList, setCartList }}>
      {children}
    </CartContext.Provider>

}
