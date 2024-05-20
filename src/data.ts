type Product = {
  id: number;
  title: string;
  desc?: string;
  img?: string;
  price: number;
};

type Products = Product[];

export const featuredProducts: Products = [
  {
    id: 1,
    title: "Pempek Kapal Selam",
    desc: "Perpaduan Pempek dan Telur Mantap",
    img: "/temporary/pSelam.png",
    price: 87000,
  },
  {
    id: 2,
    title: "Pempek Adaan",
    desc: "Perpaduan Pempek dan Telur Mantap",
    img: "/temporary/pSelam.png",
    price: 59000,
  },
  {
    id: 3,
    title: "Pempek Lenjer",
    desc: "Perpaduan Pempek dan Telur Mantap",
    img: "/temporary/pSelam.png",
    price: 57000,
  },
  {
    id: 4,
    title: "Pempek Campur",
    desc: "Perpaduan Pempek dan Telur Mantap",
    img: "/temporary/pSelam.png",
    price: 26000,
  },
];

export const kapalselam: Products = [
  {
    id: 1,
    title: "Paket Kecil Kapal Selam",
    desc: "Ignite your taste buds with a fiery combination of spicy pepperoni, jalapeños, crushed red pepper flakes, and melted mozzarella cheese, delivering a kick with every bite.",
    img: "/temporary/pSelam.png",
    price: 24.9,
  },
  {
    id: 2,
    title: "Paket Kecil Kapal Selam",
    desc: "Embark on a culinary journey with this Mediterranean-inspired creation, featuring zesty feta cheese, Kalamata olives, sun-dried tomatoes, and a sprinkle of oregano.",
    img: "/temporary/pSelam.png",
    price: 32.9,
  },
  {
    id: 3,
    title: "Paket Besar Kapal Selam",
    desc: "A classic Italian delight featuring a thin, crispy crust, tangy tomato sauce, fresh mozzarella, and a medley of aromatic herbs topped with lettuce, tomatoes, and a dollop of tangy mayo.",
    img: "/temporary/pSelam.png",
    price: 26.9,
  },
  {
    id: 4,
    title: "Paket Hemat Kapal Selam",
    desc: "A classic Italian delight featuring a thin, crispy crust, tangy tomato sauce, fresh mozzarella, and a medley of aromatic herbs topped with lettuce, tomatoes, and a dollop of tangy mayo.",
    img: "/temporary/pSelam.png",
    price: 28.9,
  },
];

export const singleProduct: Product = {
  id: 1,
  title: "Pempek Kapal Selam",
  desc: "Ignite your taste buds with a fiery combination of spicy pepperoni, jalapeños, crushed red pepper flakes, and melted mozzarella cheese, delivering a kick with every bite.",
  img: "/temporary/pSelam.png",
  price: 30000,
};

type Menu = {
  id: number;
  slug: string;
  title: string;
  img?: string;
  color: string;
}[];

export const menu: Menu = [
  {
    id: 1,
    slug: "kapalselam",
    title: "Pempek Kapal Selam",
    img: "/temporary/m1.png",
    color: "white",
  },
  {
    id: 2,
    slug: "adaan",
    title: "Pempek Adaan",
    img: "/temporary/m2.png",
    color: "black",
  },
  {
    id: 3,
    slug: "lenjer",
    title: "Pempek Lenjer",
    img: "/temporary/m3.png",
    color: "white",
  },
];
