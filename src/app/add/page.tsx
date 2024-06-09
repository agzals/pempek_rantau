"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

type Inputs = {
  title: string;
  desc: string;
  price: number;
  catSlug: string;
  stock: number;
};

const AddPage = () => {
  const { data: session, status } = useSession();
  const [inputs, setInputs] = useState<Inputs>({
    title: "",
    desc: "",
    price: 0,
    catSlug: "",
    stock: 0,
  });
  const [file, setFile] = useState<File | null>(null);
  const router = useRouter();

  if (status === "loading") {
    return <p>Loading...</p>;
  }
  if (status === "unauthenticated" || !session?.user.isAdmin) {
    router.push("/");
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setInputs((prev) => ({
      ...prev,
      [name]: name === "price" || name === "stock" ? Number(value) : value,
    }));
  };

  const handleChangeImg = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    const item = (target.files as FileList)[0];
    setFile(item);
  };

  const upload = async () => {
    const data = new FormData();
    if (file) {
      data.append("file", file);
      data.append("upload_preset", "pempekrantau");
      const res = await fetch("https://api.cloudinary.com/v1_1/agzalsufi/image/upload", {
        method: "POST",
        body: data,
      });
      const resData = await res.json();
      return resData.url;
    }
    throw new Error("No file selected for upload");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const url = await upload();
      const res = await fetch("https://pempekrantau.vercel.app/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          img: url,
          ...inputs,
        }),
      });
      if (!res.ok) {
        throw new Error("Failed to create product");
      }
      const data = await res.json();
      router.push(`/product/${data.id}`);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="shadow-lg flex flex-wrap gap-4 p-8">
        <h1 className="text-4xl mb-2 text-gray-300 font-bold">Add New Product</h1>
        <div className="w-full flex flex-col gap-2">
          <label>Image</label>
          <input className="ring-1 ring-red-200 p-2 rounded-sm" type="file" onChange={handleChangeImg} />
        </div>
        <div className="w-full flex flex-col gap-2">
          <label>Title</label>
          <input onChange={handleChange} className="ring-1 ring-red-200 p-2 rounded-sm" type="text" name="title" />
        </div>
        <div className="w-full flex flex-col gap-2">
          <label>Desc</label>
          <textarea className="ring-1 ring-red-200 p-2 rounded-sm" name="desc" onChange={handleChange} />
        </div>
        <div className="w-full flex flex-col gap-2">
          <label>Price</label>
          <input onChange={handleChange} className="ring-1 ring-red-200 p-2 rounded-sm" type="number" name="price" />
        </div>
        <div className="w-full flex flex-col gap-2">
          <label>Category</label>
          <input onChange={handleChange} className="ring-1 ring-red-200 p-2 rounded-sm" type="text" name="catSlug" />
        </div>
        <div className="w-full flex flex-col gap-2">
          <label>Stock</label>
          <input onChange={handleChange} className="ring-1 ring-red-200 p-2 rounded-sm" type="number" name="stock" />
        </div>
        <button type="submit" className="p-2 w-full bg-red-500 text-white">
          Submit
        </button>
      </form>
    </div>
  );
};

export default AddPage;
