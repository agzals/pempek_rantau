"use client";

import { ProductType } from "@/types/types";
import { useCartStore } from "@/utils/store";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { formatToRupiah } from "@/utils/formatToRupiah";

const Price = ({ product }: { product: ProductType }) => {
  const [total, setTotal] = useState(product.price);
  const [quantity, setQuantity] = useState(1);

  const { addToCart } = useCartStore();

  useEffect(() => {
    useCartStore.persist.rehydrate();
  }, []);

  useEffect(() => {
    setTotal(quantity * product.price);
  }, [quantity, product]);

  const handleCart = () => {
    addToCart({ id: product.id, title: product.title, img: product.img, price: total, quantity: quantity });
    toast.success("The Product added to the cart");
  };

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl font-bold">{formatToRupiah(total)}</h2>
      {/* QUANTITY AND ADD BUTTON CONTAINER */}
      <div className="flex justify-between items-center">
        {/* QUANTITY */}
        <div className="flex justify-between w-full p-3 ring-1 ring-red-500">
          <span>Quantity</span>
          <div className="flex gap-4 items-center">
            <button onClick={() => setQuantity((prev) => (prev > 1 ? prev - 1 : 1))}>{"<"}</button>
            <span>{quantity}</span>
            <button onClick={() => setQuantity((prev) => (prev < 9 ? prev + 1 : 9))}>{">"}</button>
          </div>
        </div>
        {/* CART BUTTON */}
        <button className="uppercase w-56 bg-red-500 text-white p-3 ring-1 ring-red-500" onClick={handleCart}>
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default Price;
