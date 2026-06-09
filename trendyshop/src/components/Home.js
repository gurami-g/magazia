import React, { useEffect, useState } from "react";
import Slider from "react-slick";

import Img1 from "./Images/tent.jpg";
import Img2 from "./Images/jacket.jpg";
import Img3 from "./Images/section1-1.jpg";
import Img4 from "./Images/section1-2.jpg";
import Img5 from "./Images/section1-3.jpg";
import { BsCheckLg } from "react-icons/bs";
import { FaTruck } from "react-icons/fa";
import { RiArrowLeftRightFill } from "react-icons/ri";
import { CgPhone } from "react-icons/cg";
import { BsCartFill } from "react-icons/bs";

import axios from "axios";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";

const Home = ({ basketItems, setBasketItems }) => {
  const [section1Data, setSection1Data] = useState([
    {
      img: Img3,
      title: "გახდი ბუნების ნაწილი",
      text: "ყველაფერი რაც გჭირდება მოგზაურობის გამოცდილებაა",
    },
    {
      img: Img5,
      title: "დაიძინე ვარსკვლავებს შორის",
      text: "განსაკუთრებული ტენტი 15%-ანი ფასდაკლებით",
    },
    {
      img: Img4,
      title: "მოემზადე დიდი დასვენებისთვის",
      text: "ჩვენი ახალი ქურთუკები კომფორტული და ხარისხიანია",
    },
  ]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [categories, setCategories] = useState(null);
  const [products, setProducts] = useState(null);

  const [offeredProducts, setOfferedProducts] = useState(null);

  const url = process.env.REACT_APP_SERVER_URL;

  const gegtOfferedProducts = async () => {
    await axios.get(`${url}/specialoffer`)
      .then(res => {
        if (res.status === 200) {
          const arr = [];
          Array.from({ length: 2 }, (v, k) => {
            let random = Math.round(Math.random() * (res.data.length - 1));
            while (arr.includes(random)) random = Math.round(Math.random() * (res.data.length - 1));
            arr.push(random);
          })
          console.log(arr);
          setOfferedProducts([res.data[arr[0]], res.data[arr[1]]]);
        }
      })
      .catch(err => {
        console.log(err);
      });
  }

  const getProducts = async () => {
    await axios.get(`${url}/getseveralproducts`)
      .then(res => {
        if (res.status === 200) {
          setProducts(res.data);
        }
      })
      .catch(err => console.log(err));
  }

  const getCategories = async () => {
    await axios.get(`${url}/categories`)
      .then(res => {
        if (res.status === 200) {
          setCategories(res.data);
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
        _basket.push({ ...item, _total: item.discount, _amount: 1 });
      }
      localStorage.setItem("basket", JSON.stringify(_basket));
      setBasketItems(_basket);
    } else {
      const _basket = [];
      _basket.push({ ...item, _total: item.discount, _amount: 1 });
      localStorage.setItem("basket", JSON.stringify(_basket));
      setBasketItems(_basket);
    }
  }

  useEffect(() => {
    getProducts();
    getCategories();
    gegtOfferedProducts();
  }, []);

  useEffect(() => {
    let interval;
    interval = setInterval(() => {
      setCurrentIndex(currentIndex + (currentIndex === 2 ? -2 : 1))
    }, 5000);

    return () => clearInterval(interval);
  }, [currentIndex]);

  return (
    <div className="home">
      {/* <Button onClick={pay}>TEST BUTTON</Button> */}
      <div className="home_content">
        <div className="section1">
          <div className="section1_left">
            <img src={section1Data[currentIndex].img} alt="img" />
            <div className="overlay bpg-arial-caps">
              <div className="overlay_content">
                <h1 className="title">{section1Data[currentIndex].title}</h1>
                <p className="txt">{section1Data[currentIndex].text}</p>
                {/* <button>იყიდეთ</button> */}
              </div>

              <div className="three_boxes">
                <div
                  onClick={() => setCurrentIndex(0)}
                  style={
                    currentIndex == 0
                      ? { flex: "2", backgroundColor: "whitesmoke" }
                      : { flex: "1" }
                  }
                ></div>
                <div
                  onClick={() => setCurrentIndex(1)}
                  style={
                    currentIndex == 1
                      ? { flex: "2", backgroundColor: "whitesmoke" }
                      : { flex: "1" }
                  }
                ></div>
                <div
                  onClick={() => setCurrentIndex(2)}
                  style={
                    currentIndex == 2
                      ? { flex: "2", backgroundColor: "whitesmoke" }
                      : { flex: "1" }
                  }
                ></div>
              </div>
            </div>
          </div>
          <div className="section1_right bpg-arial-caps">
            {offeredProducts?.map(x => {
              return (
                <div className="right_side_img">
                  <img src={`${url}${x.photos}`} alt="img" />
                  <div className="overlay">
                    <p className="save">დაზოგე {x.salePercent}%</p>
                    <p className="offer">სპეციალური შემოთავაზება</p>
                    <Link to={`/product/${x.productId}`} className="link">ნახვა</Link>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
        <div className="section2 bpg-arial-caps">
          <div className="section2_child">
            <BsCheckLg className="icon" /> <h6>ხარისხიანი პროდუქცია</h6>
          </div>
          <div className="section2_child">
            <FaTruck className="icon" /> <h6>სწრაფი მიწოდება</h6>
          </div>
          <div className="section2_child">
            <RiArrowLeftRightFill className="icon" /> <h6>გადაცვლა</h6>
          </div>
          <div className="section2_child">
            <CgPhone className="icon" /> <h6>24/7 კავშირი</h6>
          </div>
        </div>
        <div className="categories bpg-arial-caps">
          <div className="header">
            <p>კატეგორიები</p> <div className="line"></div>
          </div>
          <div className="category_container">
            {categories?.map((element, i) => {
              return (
                <Link key={i} className="category_child" to={`/categories/${element.categoryId}`}>
                  <div className="image_container">
                    <img src={`${url}${element.categoryImage}`} alt="" />
                  </div>
                  <div className="content_container">
                    <p style={{ fontWeight: "bold" }}>{element.categoryName}</p>
                    <p style={{ color: "#68727a" }}>{element.description}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
        <div className="feature bpg-arial-caps">
          <div className="header">
            <p>პროდუქტები 20%+</p> <div className="line"></div>
          </div>
          <div className="feature_container">
            {products?.map((element, i) => {
              return (
                <div key={i} className="feature_child" to={`/product/${element.productId}`}>
                  <div className="image_container">
                    <img src={url + element.photos} alt="" />
                    <div className="image_overlay">
                      <Link to={`/categories/${element.categoryId}`} className="position-absolute py-1 px-2 bg-success text-white rounded-2" style={{ left: 20, top: 20 }}>{element.categoryName}</Link>
                      <div className={`icon_container ${basketItems?.find(x => x.productId === element.productId) && 'bg-success'}`} onClick={() => addToBasket(element)}>
                        <BsCartFill className="icon" />
                      </div>
                    </div>
                  </div>
                  <div className="content_container">
                    <Link to={`/product/${element.productId}`} className="title mb-2">{element.productName}</Link>
                    <div className="price d-flex align-items-center">
                      <div className="current_price fs-5">{element.discount}₾</div>
                      <div className="d-flex align-items-center gap-2 p-1 bg-warning rounded-1">
                        <div className="old_price text-secondary">{element.price}₾</div>
                        <div>{element.salePercent}%</div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        {/* <div className="special_offer">
          <div className="img_container">
            <img src={Paralon} alt="" />
            <div className="img_overlay">
              <p>SAVE 20%</p>
              <h2>Special Offer</h2>
              <button>Shop Now</button>
            </div>
          </div>
          <div className="img_container">
            <img src={Paralon} alt="" />
            <div className="img_overlay">
              <p>SAVE 20%</p>
              <h2>Special Offer</h2>
              <button>Shop Now</button>
            </div>
          </div>

        </div>
        <div className="feature">
          <div className="header">
            <p>RECENT PRODUCTS</p> <div className="line"></div>
          </div>
          <div className="feature_container">
            {product.map((element, i) => {
              return (
                <div key={i} className="feature_child">
                  <div className="image_container">
                    <img src={element.image} alt="" />
                    <div className="image_overlay">
                      <div className="icon_container">
                        <BsCartFill className="icon" />
                      </div>
                      <div className="icon_container">
                        <BsSuitHeart className="icon" />
                      </div>
                      <div className="icon_container">
                        <TiArrowSync className="icon" />
                      </div>
                      <div className="icon_container">
                        <HiOutlineSearch className="icon" />
                      </div>
                    </div>
                  </div>
                  <div className="content_container">
                    <p className="title">product name</p>
                    <div className="price">
                      <div className="current_price">$123.00</div>
                      <div className="old_price">$124.00</div>
                    </div>
                    <div className="rating">
                      <FaStar />
                      <FaStar />
                      <FaStar />
                      <FaStar />
                      <FaStar />
                      <span className="rate_score">(99)</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="logo_slider">
          <Slider {...settings}>
            {sliderImages.map((element, index) => {
              return (
                <div key={index}>
                  <img className="slider_img" src={element} alt="" />
                </div>
              );
            })}
          </Slider>
        </div> */}
      </div>
    </div>
  );
};

export default Home;
