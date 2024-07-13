"use client";
import { OrderType } from "@/types/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { format } from "date-fns";

const OrdersPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderType | null>(null);

  const formatDateTime = (dateTimeString: string) => {
    return format(new Date(dateTimeString), "dd/MM/yyyy HH:mm:ss");
  };

  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "unauthenticated") {
    router.push("/");
  }

  const queryClient = useQueryClient();

  useEffect(() => {
    if (status === "authenticated") {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    }
  }, [status, queryClient]);

  const { isLoading, error, data } = useQuery({
    queryKey: ["orders"],
    queryFn: () => fetch("https://pempekrantau.vercel.app/api/orders").then((res) => res.json()),
  });

  const mutation = useMutation({
    mutationFn: ({ id, status, trackingNumber }: { id: string; status: string; trackingNumber: string }) => {
      return fetch(`https://pempekrantau.vercel.app/api/orders/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status, trackingNumber }),
      }).then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.json();
      });
    },
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast.success("Status Order dan Resi Pengiriman telah di update!");
    },
    onError(error) {
      console.error("Error updating order:", error);
      toast.error("Failed to update order");
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
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(amount);
  };

  const openModal = (order: OrderType) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedOrder(null);
    setIsModalOpen(false);
  };

  if (isLoading || status === "loading") return "Loading...";

  if (error) return <div>Error loading orders</div>;

  return (
    <div className="p-4 lg:px-20 xl:px-40">
      <div className="overflow-x-auto">
        <table className="w-full border-separate border-spacing-2">
          <thead>
            <tr className="text-left">
              <th className="hidden md:table-cell">Order ID</th>
              <th>Tanggal Pemesanan</th>
              <th>Harga</th>
              <th className="hidden md:table-cell">Products</th>
              <th>Status</th>
              <th className="text-left">Resi Pengiriman</th>
              <th className="text-left">Detail</th>
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
                    <form className="flex flex-col md:flex-row items-center justify-center gap-2" onSubmit={(e) => handleUpdate(e, item.id)}>
                      <input placeholder={item.status.toString()} className="p-2 ring-1 ring-red-100 rounded-md w-full md:w-32" />
                      <input placeholder={item.trackingNumber || ""} className="p-2 ring-1 ring-red-100 rounded-md w-full md:w-32" />
                      <button className="bg-red-400 p-2 rounded-full">ubah</button>
                    </form>
                  </td>
                ) : (
                  <>
                    <td className="py-2 px-1">{item.status}</td>
                    <td className="py-2 px-1">{item.trackingNumber}</td>
                  </>
                )}
                <td className="py-2 px-1">
                  <button className="bg-blue-500 text-white p-2 rounded-md" onClick={() => openModal(item)}>
                    Detail
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && selectedOrder && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4">Detail Pemesanan</h2>
            <p>
              <strong>Order ID:</strong> {selectedOrder.id}
            </p>
            <p>
              <strong>Email:</strong> {selectedOrder.userEmail}
            </p>
            <p>
              <strong>Tanggal Pemesanan:</strong> {formatDateTime(selectedOrder.createdAt.toString())}
            </p>
            <p>
              <strong>Harga:</strong> {formatCurrency(selectedOrder.price)}
            </p>
            <p>
              <strong>Status:</strong> {selectedOrder.status}
            </p>
            <p>
              <strong>Alamat Lengkap:</strong> {selectedOrder.address}
            </p>
            <p>
              <strong>Kota:</strong> {selectedOrder.city}
            </p>
            <p>
              <strong>Kode Pos:</strong> {selectedOrder.pos}
            </p>
            <p>
              <strong>Resi Pengiriman:</strong> {selectedOrder.trackingNumber}
            </p>
            <h3 className="mt-4 font-semibold">Produk:</h3>
            <ul className="list-disc list-inside">
              {selectedOrder.products.map((product) => (
                <li key={product.id}>{product.title}</li>
              ))}
            </ul>
            <button className="bg-red-500 text-white p-2 rounded-md mt-4" onClick={closeModal}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
