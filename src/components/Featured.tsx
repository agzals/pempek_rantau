"use client";
import { ProductType } from "@/types/types";
import Image from "next/image";
import React from "react";
import { useRouter } from "next/navigation";

interface FeaturedProps {
  featuredProducts: ProductType[];
}

const Featured: React.FC<FeaturedProps> = ({ featuredProducts }) => {
  const router = useRouter();

  const handleAddToCart = (id: string) => {
    router.push(`https://pempekrantau.vercel.app/product/${id}`);
  };

  const formatRupiah = (number: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(number);
  };

  return (
    <div className="w-screen overflow-x-scroll bg-gray-100 text-gray-800">
      {/* WRAPPER */}
      <div className="w-max flex">
        {/* SINGLE ITEM */}
        {featuredProducts.map((item) => (
          <div key={item.id} className="w-screen h-[60vh] flex flex-col items-center justify-around p-4 hover:bg-gray-200 transition-all duration-300 md:w-[50vw] xl:w-[33vw] xl:h-[90vh]">
            {/* IMAGE CONTAINER */}
            {item.img && (
              <div className="relative flex-1 w-60 hover:rotate-[60deg] transition-all duration-500">
                <Image src={item.img} alt="" fill className="object-scale-down" />
              </div>
            )}

            {/* TEXT CONTAINER */}
            <div className="flex-1 flex flex-col items-center justify-center text-center gap-4">
              <h1 className="text-xl font-bold uppercase xl:text-l 2xl:text-xl">{item.title}</h1>
              <p className="text-sm p-4 2xl:p-8">{item.desc}</p>
              <span className="text-l font-bold">{formatRupiah(item.price)}</span>
              <button className="bg-gray-800 w-50 text-white text-sm p-2 rounded-md" onClick={() => handleAddToCart(item.id)}>
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Featured;
