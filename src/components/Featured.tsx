import { ProductType } from "@/types/types";
import Image from "next/image";
import React from "react";

const getData = async () => {
  const res = await fetch("https://pempek-rantau.vercel.app/api/products", {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed!");
  }

  return res.json();
};

const Featured = async () => {
  const featuredProducts: ProductType[] = await getData();
  return (
    <div className="w-screen overflow-x-scroll text-red-500">
      {/*WRAPPER*/}
      <div className="w-max flex">
        {/*SINGLE ITEM*/}
        {featuredProducts.map((item) => (
          <div key={item.id} className="w-screen h-[60vh] flex flex-col items-center justify-around p-4 hover:bg-fuchsia-50 transition-all duration-300 md:w-[50vw] xl:w-[33vw] xl:h-[90vh]">
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
              <span className="text-l font-bold">Rp.{item.price}</span>
              <button className="bg-red-500 w-50 text-white text-sm p-2 rounded-md">Add to Cart</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Featured;
