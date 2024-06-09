import { ProductType } from "@/types/types";
import Featured from "@/components/Featured";

const getData = async () => {
  const res = await fetch("https://pempekrantau.vercel.app/api/products", {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed!");
  }

  return res.json();
};

const FeaturedServer = async () => {
  const featuredProducts: ProductType[] = await getData();

  return <Featured featuredProducts={featuredProducts} />;
};

export default FeaturedServer;
