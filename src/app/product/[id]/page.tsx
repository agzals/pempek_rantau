"use client";
import DeleteButton from "@/components/DeleteButton";
import Price from "@/components/Price";
import { ProductType } from "@/types/types";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

const SingleProductPage = ({ params }: { params: { id: string } }) => {
  const [singleProduct, setSingleProduct] = useState<ProductType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    const getData = async (id: string) => {
      try {
        const res = await fetch(`https://pempekrantau.vercel.app/api/products/${id}`, {
          cache: "no-store",
        });

        if (!res.ok) {
          throw new Error("Failed!");
        }

        const data = await res.json();
        setSingleProduct(data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    getData(params.id);
  }, [params.id]);

  const handleAddProductClick = () => {
    router.push("/add");
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!singleProduct) {
    return <p>Product not found</p>;
  }

  return (
    <div className="p-4 lg:px-20 xl:px-40 h-screen flex flex-col justify-around text-gray-800 md:flex-row md:gap-8 md:items-center">
      {/* IMAGE CONTAINER */}
      {singleProduct.img && (
        <div className="relative w-full h-1/2 md:h-[70%]">
          <Image src={singleProduct.img} alt="" className="object-contain" fill />
        </div>
      )}
      {/* TEXT CONTAINER */}
      <div className="h-1/2 flex flex-col gap-4 md:h-[70%] md:justify-center md:gap-6 xl:gap-8">
        <h1 className="text-3xl font-bold uppercase xl:text-5xl">{singleProduct.title}</h1>
        <p>{singleProduct.desc}</p>
        {/* Display Price component only if user is not admin */}
        {!session?.user.isAdmin && singleProduct.stock > 0 && <Price product={singleProduct} />}
        <p className="text-xl font-semibold">Stock: {singleProduct.stock > 0 ? <span className="text-green-500">Tersedia ({singleProduct.stock})</span> : <span className="text-red-500">Habis {singleProduct.stock}</span>}</p>
        {status === "authenticated" && session?.user.isAdmin && (
          <button onClick={handleAddProductClick} className="p-2 bg-red-500 text-white rounded">
            Tambah Produk Baru
          </button>
        )}
      </div>
      <DeleteButton id={singleProduct.id} />
    </div>
  );
};

export default SingleProductPage;
