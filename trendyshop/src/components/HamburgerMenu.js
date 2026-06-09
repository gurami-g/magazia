import React, { useState } from "react";
import "./style/style.css";
import { RxHamburgerMenu } from "react-icons/rx";
import { Link } from "react-router-dom";
const HamburgerMenu = () => {
  const [hiddenMenuVisibility, setHiddenMenuVisibility] = useState(false)
  return (
    <div className="hamburger">
      <div className="hamburger_container">
        <div className="logo">
          <span className="multi">MULTI</span>
          <span className="shop">SHOP</span>
        </div>
        <div className="hamburger_icon" onClick={() => setHiddenMenuVisibility(!hiddenMenuVisibility)}>
          <RxHamburgerMenu />
        </div>
      </div>
      <div className={hiddenMenuVisibility ? 'hamburger_menu_container open' : 'hamburger_menu_container'}>
        <div className="menu bpg-arial-caps">
          <Link to="/" className="nav_item">
            მთავარი
          </Link>
          <Link to="/contact" className="nav_item">
            კონტაქტი
          </Link>
          <Link to="/shop" className="nav_item">
            მაღაზია
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HamburgerMenu;
