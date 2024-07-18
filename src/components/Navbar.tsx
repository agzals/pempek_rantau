import React from "react";
import Menu from "./Menu";
import Link from "next/link";
import CartIcon from "./CartIcon";
import Image from "next/image";
import UserLinks from "./UserLinks";

const Navbar = () => {
  const user = false;
  return (
    <div className="text-sm h-12 bg-gray-800  p-4 flex items-center justify-between border-b-2 uppercase md:h-24 lg:px-20 xl:px-40" style={{ color: "#392929", borderBottomColor: "#392929" }}>
      {/* LEFT LINKS */}
      <div className="hidden md:flex gap-4 flex-1 text-white">
        <Link href="/">Home</Link>
        <Link href="/menu">Menu</Link>
        <Link href="/about">About Us</Link>
      </div>
      {/* LOGO */}
      <div className="flex-1 flex justify-center">
        <Link href="/">
          <Image src="/logo.png" alt="Pempek Rantau" width={150} height={60} />
        </Link>
      </div>
      {/* MOBILE MENU */}
      <div className="md:hidden">
        <Menu />
      </div>
      {/* RIGHT LINKS */}
      <div className="hidden md:flex gap-3 items-center justify-end flex-0 text-white">
        <div className="md:absolute top-3 right-4 lg:static flex items-center gap-1 cursor-pointer bg-orange-300 px-1 rounded-md">
          <Image src="/phone.png" alt="" width={20} height={20} />
          <span>08118332979</span>
        </div>
        <UserLinks />
        <CartIcon />
      </div>
    </div>
  );
};

export default Navbar;
