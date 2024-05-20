"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

type Inputs = {
  title: string;
  desc: string;
  price: number;
  catSlug: string;
};
const AddPage = () => {
  const { data: session, status } = useSession();
  const [inputs, setInputs] = useState<Inputs>({
    title: "",
    desc: "",
    price: 0,
    catSlug: "",
  });
  const [file, setFile] = useState<File>();
  const router = useRouter();
  if (status === "loading") {
    return <p>Loading...</p>;
  }
  if (status === "unauthenticated" || !session?.user.isAdmin) {
    router.push("/");
    return null;
  }
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setInputs((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };

  const handleChangeImg = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    const item = (target.files as FileList)[0];
    setFile(item);
  };
  const upload = async () => {
    const data = new FormData();
    data.append("file", file!);
    data.append("upload_preset", "pempekrantau");
    const res = await fetch("https://api.cloudinary.com/v1_1/agzalsufi/image/upload", {
      method: "POST",
      body: data,
    });
    const resData = await res.json();
    return resData.url;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const url = await upload();
      const res = await fetch("http://localhost:3000/api/products", {
        method: "POST",
        body: JSON.stringify({
          img: url,
          ...inputs,
        }),
      });
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
        <div>
          <label className="w-full flex flex-col gap-2">Category</label>
          <input onChange={handleChange} className="ring-1 ring-red-200 p-2 rounded-sm" type="text" name="catSlug" />
        </div>
        <button type="submit" className="p-2 w-full bg-red-500 text-white">
          Submit
        </button>
      </form>
    </div>
  );
};

export default AddPage;
