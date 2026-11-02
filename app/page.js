import Storefront from "../components/Storefront";
import { categories, products } from "../lib/products";

export default function Home() {
  return <Storefront products={products} categories={categories} />;
}
