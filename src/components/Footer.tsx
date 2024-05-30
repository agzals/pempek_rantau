import Link from "next/link";
import React from "react";
import Image from "next/image";

const Footer = () => {
  return (
    <div className="text-sm h-12 md:h-24 p-4 lg:px-20 xl:px-40 bg-gray-800 text-white flex items-center justify-between">
      <Link href="/">
        <Image src="/logo.png" alt="Pempek Rantau" width={100} height={40} />
      </Link>
      <div className="flex items-center">
        <Link href="https://www.instagram.com/ayokepempekrantau/?hl=id#" target="_blank" rel="noopener noreferrer">
          <Image src="/instagram_2111463.png" alt="Instagram" width={24} height={24} />
        </Link>
        <span className="ml-2">@ayokepempekrantau</span>
      </div>
      <p>© ALL RIGHTS RESERVED.</p>
    </div>
  );
};

export default Footer;
