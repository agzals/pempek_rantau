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
  const { products, totalItems, totalPrice, removeFromCart, clearCart } = useCartStore();
  const { data: session } = useSession();
  const router = useRouter();
  const [shippingAddress, setShippingAddress] = useState({
    name: "",
    phoneNumber: "",
    address: "",
    city: "",
    pos: "",
    courier: "",
  });
  const [formValid, setFormValid] = useState(false); // State to track form validity

  const calculateShippingCost = (quantity: number) => {
    if (quantity === 0) return 0;
    return quantity <= 3 ? 16000 : 24000;
  };

  const totalQuantity = products.reduce((sum, product) => sum + product.quantity, 0);
  const shippingCost = shippingAddress.courier === "JNE (Yes)" ? calculateShippingCost(totalQuantity) : 0;
  const totalWithShipping = totalPrice + shippingCost;

  useEffect(() => {
    useCartStore.persist.rehydrate();
  }, []);

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setShippingAddress({ ...shippingAddress, [name]: value });
  };

  const handleCourierChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    setShippingAddress({ ...shippingAddress, courier: value });
  };

  const handleCheckout = async () => {
    if (!session) {
      router.push("https://pempekrantau.vercel.app/login");
    } else {
      // Validate if shipping address is filled
      if (!shippingAddress.name || !shippingAddress.phoneNumber || !shippingAddress.address || !shippingAddress.city || !shippingAddress.pos) {
        toast.error("Tolong isi Alamat Pengiriman sebelum menyelesaikan pembayaran.");
        return;
      }

      // Validate if courier is selected
      if (!shippingAddress.courier) {
        toast.error("Tolong pilih kurir pengiriman sebelum menyelesaikan pembayaran.");
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
            id: `order-${Date.now()}`,
            price: totalWithShipping,
            products,
            status: "Belum Bayar",
            userEmail: session.user.email,
            name: shippingAddress.name,
            phoneNumber: shippingAddress.phoneNumber,
            address: shippingAddress.address,
            city: shippingAddress.city,
            pos: shippingAddress.pos,
          }),
        });
        const { id: order_id } = await resp.json();

        const orderData = {
          transaction_details: {
            order_id: order_id,
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
            first_name: shippingAddress.name,
            phone: shippingAddress.phoneNumber,
            shipping_address: {
              address: shippingAddress.address,
              city: shippingAddress.city,
              postal_code: shippingAddress.pos,
            },
          },
        };

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
          clearCart();
          router.push(data.payment_url);
        } else {
          console.error("Failed to create payment link", data);
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  // Update formValid state based on form completeness and quantity constraint
  useEffect(() => {
    setFormValid(!!shippingAddress.name && !!shippingAddress.phoneNumber && !!shippingAddress.address && !!shippingAddress.city && !!shippingAddress.pos && !!shippingAddress.courier && totalQuantity <= 4);
  }, [shippingAddress, totalQuantity]);

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
        <input type="text" name="name" placeholder="Nama Lengkap" value={shippingAddress.name} onChange={handleAddressChange} className="border border-gray-300 rounded-md p-2 mb-2 focus:outline-none" />
        <input type="text" name="phoneNumber" placeholder="No Telepon" value={shippingAddress.phoneNumber} onChange={handleAddressChange} className="border border-gray-300 rounded-md p-2 mb-2 focus:outline-none" />
        <textarea
          name="address"
          placeholder="Alamat Lengkap"
          value={shippingAddress.address}
          onChange={handleAddressChange}
          className="border border-gray-300 rounded-md p-2 mb-2 focus:outline-none"
          rows={4} // Menentukan tinggi textarea
        />
        <select name="city" value={shippingAddress.city} onChange={handleAddressChange} className="border border-gray-300 rounded-md p-2 mb-2 focus:outline-none">
          <option value="">Pilih Kota</option>
          <option value="Jakarta">Jakarta</option>
          <option value="Bogor">Bogor</option>
          <option value="Depok">Depok</option>
          <option value="Tangerang">Tangerang</option>
          <option value="Bekasi">Bekasi</option>
        </select>
        <input type="text" name="pos" placeholder="Kode Pos" value={shippingAddress.pos} onChange={handleAddressChange} className="border border-gray-300 rounded-md p-2 mb-2 focus:outline-none" />
        <select name="courier" value={shippingAddress.courier} onChange={handleCourierChange} className="border border-gray-300 rounded-md p-2 mb-2 focus:outline-none">
          <option value="">Pilih Pengiriman</option>
          <option value="JNE (Yes)">JNE (Yes) (est 1 hari)</option>
        </select>
        {!formValid && <p className="text-red-500 text-sm mt-2">Lengkapi form Alamat Pengiriman dengan benar.</p>}
        {totalQuantity > 4 && <p className="text-red-500 text-sm mt-2">Mohon maaf. Maksimal pembelian hanya 4 Produk.</p>}
      </div>
      {/* PAYMENT CONTAINER */}
      <div className="h-1/2 p-4 bg-gray-200 text-gray-800 flex flex-col gap-4 justify-center lg:h-full lg:w-1/2 2xl:w-1/3 lg:px-20 xl:px-40 2xl:text-xl 2xl:gap-6">
        <div className="flex justify-between">
          <span className="">Subtotal</span>
          <span className="">{formatToRupiah(totalPrice)}</span>
        </div>
        {shippingAddress.courier === "JNE (Yes)" && (
          <div className="flex justify-between">
            <span className="">Ongkos Kirim</span>
            <span className="">{formatToRupiah(shippingCost)}</span>
          </div>
        )}
        <hr className="my-2" />
        <div className="flex justify-between">
          <span className="">TOTAL HARGA</span>
          <span className="font-bold">{formatToRupiah(totalWithShipping)}</span>
        </div>
        <button
          className={`bg-gray-800 text-white p-3 rounded-md w-full self-end ${formValid ? "" : "opacity-50 cursor-not-allowed"}`}
          onClick={handleCheckout}
          disabled={!formValid} // Disable button jika form tidak valid
        >
          BAYAR
        </button>
      </div>
    </div>
  );
};

export default CartPage;
