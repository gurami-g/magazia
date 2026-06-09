import React, { useEffect, useState } from "react";
import product1 from "./Images/product-1.jpg";
import product2 from "./Images/product-2.jpg";
import product3 from "./Images/product-3.jpg";
import product4 from "./Images/product-4.jpg";
import product5 from "./Images/product-5.jpg";
import { IoClose } from "react-icons/io5";
import { HiMinus } from "react-icons/hi";
import { HiPlus } from "react-icons/hi";
import axios from "axios";
import { Button, Modal } from "react-bootstrap";
const ShopCart = ({ basketItems, setBasketItems }) => {
  const [isPayable, setIsPayable] = useState(false);
  const [transactionUrl, setTransactionUrl] = useState(null);
  const [total, setTotal] = useState(null);
  const closePayable = () => setIsPayable(false);

  const plusAmount = (i) => {
    const _basketItems = [...basketItems];
    if (_basketItems[i]._amount !== undefined) {
      if (_basketItems[i]._amount < _basketItems[i].amount) {
        _basketItems[i]._amount += 1;
      }
    } else {
      _basketItems[i]._amount = 1;
    }
    _basketItems[i]._total = _basketItems[i]._amount * _basketItems[i].discount;
    setBasketItems(_basketItems);
    localStorage.setItem("basket", JSON.stringify(_basketItems));
  }

  const minusAmount = (i) => {
    const _basketItems = [...basketItems];
    if (_basketItems[i]._amount !== undefined) {
      if (_basketItems[i]._amount > 1) {
        _basketItems[i]._amount -= 1;
      }
    } else {
      _basketItems[i]._amount = 1;
    }
    _basketItems[i]._total = _basketItems[i]._amount * _basketItems[i].discount;
    setBasketItems(_basketItems);
    localStorage.setItem("basket", JSON.stringify(_basketItems));
  }

  const removeItem = (id) => {
    let _basket = [...basketItems];
    _basket = _basket.filter(x => x.productId !== id);
    setBasketItems(_basket);
    localStorage.setItem("basket", JSON.stringify(_basket));
  }

  const url = process.env.REACT_APP_SERVER_URL;

  const pay = async () => {
    await axios.post(`${url}/pay`, { total })
      .then(res => {
        if (res.status === 200) {
          setTransactionUrl(res.data.transactionUrl);
          setIsPayable(true);
        }
      })
      .catch(err => console.log(err))
  }

  useEffect(() => {
    if (basketItems) {
      const _totalPrice = basketItems.map(x => x._total).reduce((a, b) => a + b, 0);
      setTotal(_totalPrice);
    }
  }, [basketItems]);

  return (
    <div className="shop_card">
      <div className="shop_card_content bpg-arial-caps">
        {/* <div className="shop_card_header">Home / Shop / Shopping Cart</div> */}
        <div className="shop_card_two_container">
          <div className="shop_card_left_container">
            <div className="prodact_description_container">
              <div className="description">სახელი</div>
              <div className="description">ფასი</div>
              <div className="description">რაოდენობა</div>
              <div className="description">ჯამი</div>
              <div className="description">აქტივობა</div>
            </div>
            <div className="items_container">
              {basketItems?.map((element, i) => {
                return (
                  <div key={i} className="each_item_container">
                    <div className="each_item">
                      <div className="image_container">
                        <img src={`${url}${element.photos}`} alt="" />
                      </div>
                      <div>{element.productName}</div>
                    </div>
                    <div className="each_item">{element.discount}₾</div>
                    <div className="each_item" style={{ gap: '0' }}>
                      <div className="plus_minus" onClick={() => minusAmount(i)} >
                        <HiMinus />
                      </div>
                      <div className="amount">{element?._amount || 1}</div>
                      <div className="plus_minus" onClick={() => plusAmount(i)}>
                        <HiPlus />
                      </div>
                    </div>
                    <div className="each_item">{element._total.toFixed(2) || element.discount}₾</div>
                    <div className="each_item">
                      <div className="icon_container" onClick={() => removeItem(element.productId)}>
                        <IoClose />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="shop_card_right_container">
            <div className="coupon_container">
              <input type="text" placeholder="Coupon Code" />
              <button>ვაუჩერი</button>
            </div>
            <div className="header" style={{ marginTop: "2rem" }}>
              <p style={{ fontSize: "1.3rem" }}>გადახდა</p>{" "}
              <div className="line"></div>
            </div>
            <div className="checkout_container">
              <div className="line"></div>
              <div className="checkout_child" style={{ fontWeight: 'bold', fontSize: '1.3rem' }}>
                <span>ჯამი</span>
                <span>{basketItems?.map(x => x._total).reduce((a, b) => a + b, 0).toFixed(2)}</span>
              </div>
              <div className="button_container">
                <button onClick={pay}>გადახდა</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal show={isPayable} onHide={closePayable} fullscreen centered style={{ zIndex: 9999 }}>
        <Modal.Header closeButton className="bpg-arial-caps py-2">
          <Modal.Title className="fs-6">გადახდა ბარათით</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-0">
          <iframe id="ifr" src={transactionUrl} className="w-100 " scrolling="no" style={{ height: "99%" }}></iframe>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ShopCart;
