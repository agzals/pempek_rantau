"use client";

import { ProductType } from "@/types/types";
import { useCartStore } from "@/utils/store";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { formatToRupiah } from "@/utils/formatToRupiah";

const Price = ({ product }: { product: ProductType }) => {
  const [total, setTotal] = useState(product.price);
  const [quantity, setQuantity] = useState(1);
  const [stock, setStock] = useState<number | null>(null);

  const { addToCart } = useCartStore();

  useEffect(() => {
    useCartStore.persist.rehydrate();
  }, []);

  useEffect(() => {
    setTotal(quantity * product.price);
  }, [quantity, product]);

  useEffect(() => {
    const fetchStock = async () => {
      try {
        const response = await fetch(`https://pempekrantau.vercel.app/api/products/${product.id}`);
        const data = await response.json();
        setStock(data.stock);
        if (quantity > data.stock) {
          setQuantity(data.stock);
        }
      } catch (error) {
        console.error("Failed to fetch stock information", error);
      }
    };

    fetchStock();
  }, [product.id, quantity]);

  const handleCart = () => {
    addToCart({ id: product.id, title: product.title, img: product.img, price: total, quantity: quantity });
    toast.success("Produk telah ditambahkan kedalam cart.");
  };

  const incrementQuantity = () => {
    if (quantity < (stock || 0)) {
      setQuantity((prev) => prev + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl font-bold">{formatToRupiah(total)}</h2>
      {/* QUANTITY AND ADD BUTTON CONTAINER */}
      <div className="flex justify-between items-center">
        {/* QUANTITY */}
        <div className="flex justify-between w-full p-3 ring-1 ring-gray-800">
          <span>Quantity</span>
          <div className="flex gap-4 items-center">
            <button onClick={decrementQuantity}>{"<"}</button>
            <span>{quantity}</span>
            <button onClick={incrementQuantity}>{">"}</button>
          </div>
        </div>
        {/* CART BUTTON */}
        <button className="uppercase w-56 bg-gray-800 text-white p-3 ring-1 ring-gray-800" onClick={handleCart} disabled={stock === 0}>
          {stock === 0 ? "Out of Stock" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
};

export default Price;
