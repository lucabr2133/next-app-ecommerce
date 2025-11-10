"use client";
import { useState, useEffect } from "react";
import { CartContext } from "./contex";
import { usePathname } from "next/navigation";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartList, setCartList] = useState<any[]>([]);
    const url=process.env.NEXT_PUBLIC_API_URL
  
  // si querés cargar datos iniciales del backend:
  useEffect(() => {
    fetch(`${url}/api/orders`,{
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
