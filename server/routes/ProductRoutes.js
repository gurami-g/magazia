import express from "express";
import { addNewCategory, addProduct, deleteProduct, getCategories, getCategory, getOfferedProducts, getProduct, getProducts, getSeveralProducts, getUnsortedCategories, pay, updateProduct } from "../controllers/ProductController.js";

const ProductRouter = express.Router();

ProductRouter.get("/categories", getCategories);
ProductRouter.get("/category/:categoryId", getCategory);
ProductRouter.get("/unsortedcategories", getUnsortedCategories);
ProductRouter.post("/addcategory", addNewCategory);
ProductRouter.get("/specialoffer", getOfferedProducts);
ProductRouter.get("/getseveralproducts", getSeveralProducts);
ProductRouter.get("/product/:productId", getProduct);
ProductRouter.get("/products", getProducts);
ProductRouter.post("/addproduct", addProduct);
ProductRouter.put("/updateproduct/:id", updateProduct);
ProductRouter.delete("/deleteproduct/:id", deleteProduct);

ProductRouter.post("/pay", pay);

export default ProductRouter;
