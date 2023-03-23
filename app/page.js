import ListProducts from "@/components/products/ListProducts";
import axios from "axios";
import "./globals.css";
const getProducts = async () => {
  const { data } = await axios.get(`${process.env.API_URL}/api/products`);
  return data;
};
const HomePage = async () => {
  const productsData = await getProducts();
  return <ListProducts data={productsData} />;
};
export default HomePage;
