import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "../node_modules/bootstrap/dist/js/bootstrap.min.js";
import "./App.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Home from "./components/Home";
import Contact from "./components/Contact";
import About from "./components/About";
import Shop from "./components/Shop";
import ShopCart from "./components/ShopCart";
import Layout from "./components/Layout";
import AdminLayout from "./components/Admin/AdminLayout";

import "../node_modules/bpg-arial-caps/css/bpg-arial-caps.min.css";
import "../node_modules/alk-sanet/css/alk-sanet.min.css";
import "../node_modules/bpg-banner-extrasquare-caps/css/bpg-banner-extrasquare-caps.min.css";
import AdminProtectedRoute from "./components/AdminProtectedRoute";
import LoginProtectedRoute from "./components/LoginProtectedRoute";
import Login from "./components/Login";
import axios from "axios";
import AddProducts from "./components/Admin/AddProducts";
import { useEffect, useState } from "react";
import Categories from "./components/Categories";
import Product from "./components/Product";
import Error from "./components/Error";
import Products from "./components/Admin/Products";
import EditProduct from "./components/Admin/EditProduct";
import Settings from "./components/Admin/Settings";

function App() {
  const [current, setCurrent] = useState(null);
  axios.defaults.withCredentials = true;

  const [basketItems, setBasketItems] = useState([]);

  useEffect(() => {
    let _basket = localStorage.getItem("basket");
    if (_basket) {
      _basket = JSON.parse(_basket);
      _basket = _basket.map(x => {
        return {
          ...x,
          _amount: x._amount || 1,
          _total: x._total || x.discount,
        }
      })
      setBasketItems(_basket);
      localStorage.setItem("basket", JSON.stringify(_basket));
    }
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout basketItems={basketItems} setBasketItems={setBasketItems} />}>
          <Route path="/" element={<Home basketItems={basketItems} setBasketItems={setBasketItems} />} />
          {/* <Route path="/about" element={<About />} /> */}
          <Route path="/contact" element={<Contact />} />
          <Route path="/shop" element={<Shop basketItems={basketItems} setBasketItems={setBasketItems} />} />
          <Route path="/shopcart" element={<ShopCart basketItems={basketItems} setBasketItems={setBasketItems} />} />
          <Route path="/categories" element={<Categories />}>
            <Route path=":categoryId" element={''} />
          </Route>
          <Route path="/product/:productId" element={<Product basketItems={basketItems} setBasketItems={setBasketItems} />} />
        </Route>
        <Route element={<LoginProtectedRoute />}>
          <Route path="/login" element={<Login />} />
        </Route>
        <Route element={<AdminProtectedRoute />} >
          <Route element={<AdminLayout current={current} />} >
            <Route path="/addproducts" element={<AddProducts setCurrent={setCurrent} />} />
            <Route path="/products" element={<Products setCurrent={setCurrent} />} />
            <Route path="/editproduct/:id" element={<EditProduct />} />
            <Route path="/settings" element={<Settings setCurrent={setCurrent} />} />
          </Route>
        </Route>
        <Route path="*" element={<Error />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
