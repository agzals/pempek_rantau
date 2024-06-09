"use client";
import { useCartStore } from "@/utils/store";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { CartItemType, ProductType } from "@/types/types"; // Import types
import { toast } from "react-toastify"; // Import react-toastify for displaying error messages

const formatToRupiah = (amount: number | null | undefined) => {
  if (amount == null) {
    return "0"; // Or any default value you prefer
  }
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

  const calculateShippingCost = (quantity: number) => {
    if (quantity === 0) return 0;
    return quantity <= 3 ? 10000 : 18000;
  };

  const totalQuantity = products.reduce((sum, product) => sum + product.quantity, 0);
  const shippingCost = calculateShippingCost(totalQuantity);
  const totalWithShipping = totalPrice + shippingCost;

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
      // Validate if shipping address is filled
      if (!shippingAddress.address || !shippingAddress.city || !shippingAddress.pos) {
        toast.error("Tolong isi Alamat Pengiriman sebelum menyelesaikan pembayaran.");
        return;
      }

      // Ensure the server key is correctly Base64 encoded
      const serverKey = "SB-Mid-server-Yb5on11GDySP2wsM8kz59PlO";
      const base64ServerKey = Buffer.from(serverKey).toString("base64");

      try {
        const resp = await fetch("https://pempekrantau.vercel.app/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            price: totalWithShipping,
            products,
            status: "Belum Bayar",
            userEmail: session.user.email,
            address: shippingAddress.address,
            city: shippingAddress.city,
            pos: shippingAddress.pos,
          }),
        });
        const i = 50000;
        const orderData = {
          transaction_details: {
            order_id: `order-${Date.now()}`,
            gross_amount: totalWithShipping,
          },
          item_details: [
            ...products.map((product) => ({
              id: product.id,
              price: product.price,
              quantity: 1,
              name: product.title,
            })),
            {
              id: "shipping",
              price: shippingCost,
              quantity: 1,
              name: "Shipping Cost",
            },
          ],
          customer_details: {
            email: session.user.email,
            shipping_address: {
              address: shippingAddress.address,
              city: shippingAddress.city,
              postal_code: shippingAddress.pos,
            },
          },
        };
        console.log("Gross amount:", orderData.transaction_details.gross_amount);
        console.log("detail:", orderData.item_details);
        console.log("Total with shipping:", totalWithShipping);

        const itemDetailsSum = orderData.item_details.reduce((sum, item) => sum + item.price, 0);
        console.log("Item details sum:", itemDetailsSum);

        if (totalWithShipping !== itemDetailsSum) {
          console.error("Discrepancy detected:", totalWithShipping - itemDetailsSum);
        } else {
          console.log("Total with shipping:", totalWithShipping);
          console.log("Item details sum:", itemDetailsSum);
        }

        const res = await fetch("https://api.sandbox.midtrans.com/v1/payment-links", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Basic ${base64ServerKey}`,
          },
          body: JSON.stringify(orderData),
        });

        const data = await res.json();
        if (data.payment_url) {
          router.push(data.payment_url);
        } else {
          console.error("Failed to create payment link", data);
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="h-[calc(100vh-6rem)] md:h-[calc(100vh-9rem)] flex flex-col text-gray-800 bg-gray-100 lg:flex-row">
      {/* PRODUCTS CONTAINER */}
      <div className="h-1/2 p-4 flex flex-col justify-center overflow-scroll lg:h-full lg:w-2/3 2xl:w-1/2 lg:px-20 xl:px-40">
        {products.map((item) => (
          <div className="flex items-center justify-between mb-4" key={item.id}>
            {item.img && <Image src={item.img} alt="" width={100} height={100} />}
            <div className="">
              <h1 className="uppercase text-xl font-bold">
                {item.title} ({item.quantity})
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
      <div className="flex flex-col justify-center w-full lg:w-1/3 px-4 py-2 text-gray-800 bg-gray-200">
        <h2 className="text-lg font-semibold mb-2">Alamat Pengiriman</h2>
        <input type="text" name="address" placeholder="Alamat Lengkap" value={shippingAddress.address} onChange={handleAddressChange} className="border border-gray-300 rounded-md p-2 mb-2 focus:outline-none" />
        <input type="text" name="city" placeholder="Kota" value={shippingAddress.city} onChange={handleAddressChange} className="border border-gray-300 rounded-md p-2 mb-2 focus:outline-none" />
        <input type="text" name="pos" placeholder="Kode Pos" value={shippingAddress.pos} onChange={handleAddressChange} className="border border-gray-300 rounded-md p-2 mb-2 focus:outline-none" />
      </div>
      {/* PAYMENT CONTAINER */}
      <div className="h-1/2 p-4 bg-gray-200 text-gray-800 flex flex-col gap-4 justify-center lg:h-full lg:w-1/2 2xl:w-1/3 lg:px-20 xl:px-40 2xl:text-xl 2xl:gap-6">
        <div className="flex justify-between">
          <span className="">Subtotal</span>
          <span className="">{formatToRupiah(totalPrice)}</span>
        </div>
        <div className="flex justify-between">
          <span className="">Ongkos Kirim</span>
          <span className="">{formatToRupiah(shippingCost)}</span>
        </div>
        <hr className="my-2" />
        <div className="flex justify-between">
          <span className="">TOTAL HARGA</span>
          <span className="font-bold">{formatToRupiah(totalWithShipping)}</span>
        </div>
        <button className="bg-gray-800 text-white p-3 rounded-md w-100% self-end" onClick={handleCheckout}>
          BAYAR
        </button>
      </div>
    </div>
  );
};

export default CartPage;
