export type MenuType = {
  id: string;
  slug: string;
  title: string;
  img?: string;
  color: string;
}[];

export type ProductType = {
  id: string;
  title: string;
  desc?: string;
  img?: string;
  price: number;
  stock: number;
};

export type OrderType = {
  id: string;
  address: string;
  city: string;
  pos: string;
  userEmail: string;
  price: number;
  products: CartItemType[];
  status: String;
  createdAt: Date;
  intent_id?: String;
  trackingNumber?: string;
};

export type CartItemType = {
  id: string;
  title: string;
  img?: string;
  price: number;
  quantity: number;
};
export type CartType = {
  products: CartItemType[];
  totalItems: number;
  totalPrice: number;
};

export type ActionTypes = {
  addToCart: (item: CartItemType) => void;
  removeFromCart: (item: CartItemType) => void;
};
