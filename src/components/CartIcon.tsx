"use client";
import { useCartStore } from "@/utils/store";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect } from "react";
import { useSession } from "next-auth/react";

const CartIcon = () => {
  const { totalItems } = useCartStore();
  const { data: session } = useSession();

  useEffect(() => {
    // localStorage.removeItem("Cart");
    useCartStore.persist.rehydrate();
  }, []);

  if (session?.user.isAdmin) {
    return null; // Jika pengguna adalah admin, tidak menampilkan CartIcon
  }

  return (
    <Link href="/cart" className="flex items-center gap-4">
      <div className="relative w-8 h-8 md:w-5 md:h-5">
        <Image src="/cart.png" alt="" fill />
      </div>
      <span>Cart ({totalItems})</span>
    </Link>
  );
};

export default CartIcon;
