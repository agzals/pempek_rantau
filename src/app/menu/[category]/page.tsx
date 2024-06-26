import { ProductType } from "@/types/types";
import Image from "next/image";
import Link from "next/link";
import React from "react";

// Fungsi formatToRupiah
const formatToRupiah = (amount: number) => {
  return amount.toLocaleString("id-ID", { style: "currency", currency: "IDR" });
};

const getData = async (category: string) => {
  const res = await fetch(`https://pempekrantau.vercel.app/api/products?cat=${category}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed!");
  }

  return res.json();
};

type Props = {
  params: { category: string };
};

const CategoryPage = async ({ params }: Props) => {
  const products: ProductType[] = await getData(params.category);
  return (
    <div className="flex flex-wrap text-gray-800">
      {products.map((item) => (
        <Link className="w-full h-[60vh] border-r-2 border-b-2 border-gray-800 sm:w-1/2 lg:w-1/3 p-4 flex flex-col justify-between group odd:bg-fuchsia-50" href={`/product/${item.id}`} key={item.id}>
          {/* IMAGE CONTAINER */}
          {item.img && (
            <div className="relative h-[80%]">
              <Image src={item.img} alt={item.title} fill className="object-contain" />
            </div>
          )}
          {/* TEXT CONTAINER */}
          <div className="flex items-center justify-between font-bold">
            <h1 className="text-2xl uppercase p-2">{item.title}</h1>
            <h2 className="group-hover:hidden text-xl">{formatToRupiah(item.price)}</h2>
            <button className="hidden group-hover:block uppercase bg-gray-800 text-white p-2 rounded-md">Add to Cart</button>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default CategoryPage;
