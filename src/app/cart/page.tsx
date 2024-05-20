"use client";
import { useCartStore } from "@/utils/store";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const formatToRupiah = (amount: number) => {
  // Menggunakan fungsi toLocaleString() untuk mengubah angka menjadi format mata uang rupiah
  return amount.toLocaleString("id-ID", { style: "currency", currency: "IDR" });
};

const CartPage = () => {
  const { products, totalItems, totalPrice, removeFromCart } = useCartStore();
  const { data: session } = useSession();
  const router = useRouter();
  const [shippingAddress, setShippingAddress] = useState({
    address: "",
    city: "",
    pos: "",
  });

  useEffect(() => {
    useCartStore.persist.rehydrate();
  }, []);

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingAddress({ ...shippingAddress, [name]: value });
  };

  const handleCheckout = async () => {
    if (!session) {
      router.push("/");
    } else {
      // Encode the server key in base64 format
      const base64ServerKey = Buffer.from("SB-Mid-server-Yb5on11GDySP2wsM8kz59PlO").toString("base64");

      try {
        const resp = await fetch("http://localhost:3000/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            price: totalPrice,
            products,
            status: "Not Paid!",
            userEmail: session.user.email,
            address: shippingAddress.address,
            city: shippingAddress.city,
            pos: shippingAddress.pos,
          }),
        });
        const orderData = {
          transaction_details: {
            order_id: `order-${Date.now()}`, // Unique order ID
            gross_amount: totalPrice, // Total price from the cart
          },
          item_details: products.map((product) => ({
            id: product.id,
            price: product.price,
            quantity: product.quantity,
            name: product.title,
          })),
          customer_details: {
            email: session.user.email,

            shipping_address: {
              address: shippingAddress.address,
              city: shippingAddress.city,
              postal_code: shippingAddress.pos,
              // Add more fields as required by Midtrans API
            }, // Assuming session.user has an email field
          },
          // Add additional payload as required by Midtrans API
        };

        const res = await fetch("https://api.sandbox.midtrans.com/v1/payment-links", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Basic " + base64ServerKey,
          },
          body: JSON.stringify(orderData),
        });

        const data = await res.json();
        if (data.payment_url) {
          // Redirect to the payment URL
          router.push(data.payment_url);
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="h-[calc(100vh-6rem)] md:h-[calc(100vh-9rem)] flex flex-col text-red-500 lg:flex-row">
      {/* PRODUCTS CONTAINER */}
      <div className="h-1/2 p-4 flex flex-col justify-center overflow-scroll lg:h-full lg:w-2/3 2xl:w-1/2 lg:px-20 xl:px-40">
        {/* SINGLE ITEM */}
        {products.map((item) => (
          <div className="flex items-center justify-between mb-4" key={item.id}>
            {item.img && <Image src={item.img} alt="" width={100} height={100} />}
            <div className="">
              <h1 className="uppercase text-xl font-bold">
                {item.title} x{item.quantity}
              </h1>
            </div>
            <h2 className="font-bold">{formatToRupiah(item.price)}</h2>
            <span className="cursor-pointer" onClick={() => removeFromCart(item)}>
              X
            </span>
          </div>
        ))}
      </div>
      {/* SHIPPING ADDRESS FORM */}
      <div className="flex flex-col justify-center w-full lg:w-1/3 px-4 py-2 bg-blue-50">
        <h2 className="text-lg font-semibold mb-2">Shipping Address</h2>
        <input type="text" name="address" placeholder="Address" value={shippingAddress.address} onChange={handleAddressChange} className="border border-gray-300 rounded-md p-2 mb-2 focus:outline-none" />
        <input type="text" name="city" placeholder="City" value={shippingAddress.city} onChange={handleAddressChange} className="border border-gray-300 rounded-md p-2 mb-2 focus:outline-none" />
        <input type="text" name="pos" placeholder="Pos" value={shippingAddress.pos} onChange={handleAddressChange} className="border border-gray-300 rounded-md p-2 mb-2 focus:outline-none" />
      </div>
      {/* PAYMENT CONTAINER */}
      <div className="h-1/2 p-4 bg-fuchsia-50 flex flex-col gap-4 justify-center lg:h-full lg:w-1/2 2xl:w-1/3 lg:px-20 xl:px-40 2xl:text-xl 2xl:gap-6">
        <div className="flex justify-between">
          <span className="">Subtotal ({totalItems} items)</span>
          <span className="">{formatToRupiah(totalPrice)}</span>
        </div>
        <div className="flex justify-between">
          <span className="">Ongkos Kirim</span>
          <span className="text-green-500">Gratis!</span>
        </div>
        <hr className="my-2" />
        <div className="flex justify-between">
          <span className="">TOTAL HARGA</span>
          <span className="font-bold">{formatToRupiah(totalPrice)}</span>
        </div>
        <button className="bg-red-500 text-white p-3 rounded-md w-100% self-end" onClick={handleCheckout}>
          BAYAR
        </button>
      </div>
    </div>
  );
};

export default CartPage;
