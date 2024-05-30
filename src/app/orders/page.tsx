"use client";
import { OrderType } from "@/types/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "react-toastify";
import { format } from "date-fns";

const OrdersPage = () => {
  const formatDateTime = (dateTimeString: string) => {
    return format(new Date(dateTimeString), "dd/MM/yyyy HH:mm:ss"); // Format the date and time to "dd/MM/yyyy HH:mm:ss" format
  };
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "unauthenticated") {
    router.push("/");
  }

  const { isLoading, error, data } = useQuery({
    queryKey: ["orders"],
    queryFn: () => fetch("https://pempekrantau.vercel.app/api/orders").then((res) => res.json()),
  });

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ id, status, trackingNumber }: { id: string; status: string; trackingNumber: string }) => {
      return fetch(`https://pempekrantau.vercel.app/api/orders/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status, trackingNumber }),
      });
    },
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });

  const handleUpdate = (e: React.FormEvent<HTMLFormElement>, id: string) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const statusInput = form.elements[0] as HTMLInputElement;
    const trackingNumberInput = form.elements[1] as HTMLInputElement;
    const status = statusInput.value;
    const trackingNumber = trackingNumberInput.value;

    mutation.mutate({ id, status, trackingNumber });
    toast.success("The order status and tracking number have been changed!");
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(amount);
  };

  if (isLoading || status === "loading") return "Loading...";

  return (
    <div className="p-4 lg:px-20 xl:px-40">
      <table className="w-full border-separate border-spacing-2">
        <thead>
          <tr className="text-left">
            <th className="hidden md:table-cell">Order ID</th>
            <th>Tanggal Pemesanan</th>
            <th>Harga</th>
            <th className="hidden md:table-cell">Products</th>
            <th>Status</th>
            <th>Resi Pengiriman</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item: OrderType) => (
            <tr className={`${item.status !== "delivered" && "bg-red-50"}`} key={item.id}>
              <td className="hidden md:table-cell py-2 px-1">{item.id}</td>
              <td className="py-2 px-1">{formatDateTime(item.createdAt.toString())}</td>
              <td className="py-2 px-1">{formatCurrency(item.price)}</td>
              <td className="hidden md:table-cell py-2 px-1">{item.products.length > 0 ? item.products[0].title : "No Product"}</td>
              {session?.user.isAdmin ? (
                <td className="py-2 px-1">
                  <form className="flex items-center justify-center gap-2" onSubmit={(e) => handleUpdate(e, item.id)}>
                    <input placeholder={item.status.toString()} className="p-2 ring-1 ring-red-100 rounded-md w-full md:w-32" />
                    <input placeholder={item.trackingNumber || ""} className="p-2 ring-1 ring-red-100 rounded-md w-full md:w-32" />
                    <button className="bg-red-400 p-2 rounded-full">
                      <Image src="/edit.png" alt="Edit" width={20} height={20} />
                    </button>
                  </form>
                </td>
              ) : (
                <>
                  <td className="py-2 px-1">{item.status}</td>
                  <td className="py-2 px-1">{item.trackingNumber}</td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrdersPage;
