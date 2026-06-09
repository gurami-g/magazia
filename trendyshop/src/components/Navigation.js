import React, { useEffect } from "react";
import "./style/style.css";
import { useState } from "react";
import { Link } from "react-router-dom";
import { IoIosArrowDown } from "react-icons/io";
import { RxHamburgerMenu } from "react-icons/rx";
import { FaHeart } from "react-icons/fa";
import { BsCartFill } from "react-icons/bs";
import { RiArrowRightSLine } from "react-icons/ri";
import axios from "axios";
const Navigation = ({ basketItems }) => {
  const [openCategory, setOpenCategory] = useState(true);
  const [data, setData] = useState(null);


  const url = process.env.REACT_APP_SERVER_URL;

  const getData = async () => {
    await axios.get(`${url}/categories`)
      .then(res => {
        if (res.status === 200) {
          setData(res.data);
        }
      })
      .catch(err => console.log(err));
  }

  useEffect(() => {
    getData();
  }, []);

  const RecurseCategoryItems = ({ categories }) => {
    return (
      <div className="nested_category">
        {categories.subCategories.map((e, i) => {
          return (
            <div key={i}>
              <div className="nested_child"><Link className="text-dark" to={`/categories/${e.categoryId}`}>{e.categoryName}</Link></div>
              {e.subCategories && <RecurseCategoryItems categories={e} />}
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div className="navigation">
      <div className="navigation_container">
        <div className="navigation_left">
          <div
            className="categories"
            onClick={() => setOpenCategory(!openCategory)}
          >
            <div className="categ_left">
              <RxHamburgerMenu /> კატეგორიები
            </div>
            <IoIosArrowDown />
            <div
              className={openCategory ? "category_list" : "category_list open"}
              style={openCategory ? { overflow: 'hidden' } : null}
            >
              {data?.map((c, i) => {
                return (
                  <div key={i} className="category_each_item">
                    <Link to={`/categories/${c.categoryId}`} className="d-flex align-items-center text-dark" style={{ textDecoration: 'none' }}>{c.categoryName} {c.subCategories && <RiArrowRightSLine />}</Link>
                    {c.subCategories && <RecurseCategoryItems categories={c} />}
                  </div>
                );
              })}
            </div>
          </div>
          <div className="navigation_menu">
            <Link to="/" className="nav_item">
              მთავარი
            </Link>
            <Link to="contact" className="nav_item">
              კონტაქტი
            </Link>
            {/* <Link to="about" className="nav_item">
              შესახებ
            </Link> */}
            <Link to="shop" className="nav_item">
              მაღაზია
            </Link>
          </div>
        </div>
        <div className="navigation_right">
          {/* <Link to="#" className="navigation_icon_container">
            <FaHeart className="icon" />
            <div>33</div>
          </Link> */}
          <Link to="shopcart" className="navigation_icon_container">
            <BsCartFill className="icon" />
            <div>{basketItems?.length || 0}</div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Navigation;
