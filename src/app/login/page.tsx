"use client";
import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

const LoginPage = () => {
  const { data, status } = useSession();
  const router = useRouter();

  if (status === "loading") {
    return <p>Loading...</p>;
  }
  if (status === "authenticated") {
    router.push("/");
  }
  return (
    <div className="p-5 h-[calc(100vh-6rem)] md:h-[calc(100vh-9rem)] flex items-center justify-center">
      {/* BOX */}
      <div className=" h-full shadow-2xl rounded-md flex flex-col md:flex-row md:h-full md:w-full lg:w-[50%] 2xl:w-1/2">
        {/* IMAGE CONTAINER */}
        <div className="relative h-1/3 w-full md:h-full md:w-1/2">
          <Image src="/login3.png" alt="" fill className="object-cover" />
        </div>
        {/* FORM CONTAINER */}
        <div className="p-3 flex flex-col gap-8 md:w-1/2">
          <h1 className="font-bold text-xl xl:text-3xl">Selamat Datang!</h1>
          <p>Silahkan Log in dengan akun google.</p>
          <button className="flex gap-4 p-4 ring-1 ring-orange-100 rounded-md" onClick={() => signIn("google")}>
            <Image src="/google.png" alt="" width={20} height={20} className="object-contain" />
            <span>Sign in with Google</span>
          </button>
          <p className="text-sm">
            Ada Masalah Sign in?
            <Link className="underline" href="https://wa.me/6285777192036" target="_blank" rel="noopener noreferrer">
              {" "}
              Kontak Kami
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
