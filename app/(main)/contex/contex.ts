import { Games } from "@/types/database";
import React, { createContext, Dispatch, SetStateAction } from "react";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  // agrega las propiedades que necesites
}

interface CartContextType {
  cartList: Games[];
  setCartList: Dispatch<SetStateAction<Games[]>>;
}

export const CartContext = createContext<CartContextType>({
  cartList: [],
  setCartList: () => {},
});
