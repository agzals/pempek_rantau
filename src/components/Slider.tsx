"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import Link from "next/link";

const data = [
  {
    id: 1,
    title: "Maknyus",
    image: "/slide1.jpg",
  },
  {
    id: 2,
    title: "Sedap",
    image: "/slide1.jpg",
  },
  {
    id: 3,
    title: "Nikmat",
    image: "/slide1.jpg",
  },
];

const Slider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setCurrentSlide((prev) => (prev === data.length - 1 ? 0 : prev + 1)), 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] md:h-[calc(100vh-9rem)] lg:flex-row">
      {/* TEXT CONTAINER */}
      <div className="flex-1 flex items-center justify-center flex-col gap-8 bg-gray-100 text-gray-800 font-bold">
        <h1 className="text-5xl text-center uppercase p-4 md:p-10 md:text-6xl xl:text-7xl">{data[currentSlide].title}</h1>
        <Link href="/menu">
          <button className=" bg-gray-800 text-white py-4 px-8 rounded-md">Pesan Sekarang</button>
        </Link>
      </div>
      {/* IMAGE CONTAINER */}
      <div className="w-full flex-1 relative">
        <Image src={data[currentSlide].image} alt="" fill className="object-cover" />
      </div>
    </div>
  );
};

export default Slider;
