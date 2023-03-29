import Product from "../models/product";
import APIFilters from "../utils/APIFilters";
export const newProduct = async (req, res, next) => {
  const product = await Product.create(req.body);
  res.status(201).json({ product });
};
export const getProducts = async (req, res, next) => {
  const resPerPage = 3;
  const productsCount = await Product.countDocuments();
  const apiFilters = new APIFilters(Product.find(), req.query)
    .search()
    .filters();
  let products = await apiFilters.query;

  const filteredProductCount = products.length;
  apiFilters.pagination(resPerPage);
  products = await apiFilters.query.clone();
  // clone() : is mongoose function that uses when your want to execute queries more than once
  res
    .status(200)
    .json({ productsCount, resPerPage, filteredProductCount, products });
};
export const getProduct = async (req, res, next) => {
  const product = await Product.findById(req.query.id);
  if (!product) {
    res.status(404).json({ error: "Product Not Found" });
  }
  res.status(200).json({ product });
};
