// src/utils/formatToRupiah.ts
export const formatToRupiah = (amount: number): string => {
  return amount.toLocaleString("id-ID", { style: "currency", currency: "IDR" });
};
