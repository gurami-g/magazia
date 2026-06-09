import React, { useEffect, useState } from "react";
import { Button, Col, Form, InputGroup } from "react-bootstrap";
import "./style/style.css";
import { BsCartFill } from "react-icons/bs";

import axios from "axios";
import { Link } from "react-router-dom";
const Shop = ({ basketItems, setBasketItems }) => {
  const [products, setProducts] = useState(null);
  const [startPrice, setStartPrice] = useState('');
  const [endPrice, setEndPrice] = useState('');

  const url = process.env.REACT_APP_SERVER_URL;

  const getProducts = async () => {
    await axios.get(`${url}/products?startPrice=${startPrice}&endPrice=${endPrice}`)
      .then(res => {
        if (res.status === 200) {
          setProducts(res.data);
        }
      })
      .catch(err => console.log(err));
  }

  const addToBasket = (item) => {
    if (basketItems) {
      let _basket = [...basketItems];
      const _isItemExists = _basket.find(x => x.productId === item.productId);
      if (_isItemExists) {
        _basket = _basket.filter(x => x.productId !== item.productId);
      } else {
        _basket.push(item);
      }
      localStorage.setItem("basket", JSON.stringify(_basket));
      setBasketItems(_basket);
    } else {
      const _basket = [];
      _basket.push(item);
      localStorage.setItem("basket", JSON.stringify(_basket));
      setBasketItems(_basket);
    }
  }

  useEffect(() => {
    getProducts();
  }, []);

  return (
    <div className="shop">
      <div className="shop_container">
        <div className="left_right_container">
          <div className="shop_left_container">
            <div className="each_container">
              <div className="header bpg-arial-caps">
                <p style={{ fontSize: "1.1rem" }}>ფილტრი</p>{" "}
                <div className="line"></div>
              </div>
              <div className="list bpg-arial-caps">
                <Form.Group controlId="priceFilter">
                  <Form.Label className="bpg-banner-es-caps">ფასი</Form.Label>
                  <Col className="d-flex gap-3">
                    <InputGroup>
                      <Col>
                        <Form.Control type="number" className="rounded-0 shadow-none " placeholder="საწყისი" value={startPrice} onChange={e => setStartPrice(e.target.value)} />
                      </Col>
                      <InputGroup.Text className="border-start-0 bg-white rounded-0">₾</InputGroup.Text>
                    </InputGroup>
                    <InputGroup>
                      <Col>
                        <Form.Control type="number" className="rounded-0 shadow-none" placeholder="საბოლოო" value={endPrice} onChange={e => setEndPrice(e.target.value)} />
                      </Col>
                      <InputGroup.Text className="border-start-0 bg-white rounded-0">₾</InputGroup.Text>
                    </InputGroup>
                  </Col>
                </Form.Group>
                <Col>
                  <Button variant="warning" className="rounded-0 pt-2" onClick={getProducts}>გაფილტვრა</Button>
                </Col>
              </div>
            </div>
          </div>{" "}
          <div className="shop_right_container">
            <div className="right_container_header">
              <div className="right">
              </div>
            </div>
            <div className="shop_container mb-2">
              {products?.map((element, i) => {
                return (
                  <div key={i} className="shop_child bpg-arial-caps">
                    <div className="image_container">
                      <img src={`${url}${element.photos}`} alt="" />
                      <div className="image_overlay">
                        <Link to={`/categories/${element.categoryId}`} className="position-absolute py-1 px-2 bg-success rounded-2 text-white" style={{ left: 20, top: 20 }}>{element.categoryName}</Link>
                        <div className={`icon_container ${basketItems?.find(x => x.productId === element.productId) && 'bg-success'}`} onClick={() => addToBasket(element)}>
                          <BsCartFill className="icon" />
                        </div>
                      </div>
                    </div>
                    <div className="content_container">
                      <Link to={`/product/${element.productId}`} className="title">{element.productName}</Link>
                      <div className="price">
                        <div className="current_price">${element.discount}₾</div>
                        <div className="old_price">${element.price}₾</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;
