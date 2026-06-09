import React, { useState } from "react";
import "./style/style.css";
import { HiSearch } from "react-icons/hi";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
const Header = () => {
  const [dropdown, setDropdown] = useState(false);
  return (
    <div className="header_component">
      <div className="header_container">
        <div className="logo">
          <span className="multi">TRENDY</span>
          <span className="shop">SHOP</span>
        </div>
        <div className="header_content">
          {/* <div className="input_container">
            <input
              className="my_input"
              type="text"
              placeholder="მოძებნეთ პროდუქტი"
            />
            <div className="search_icon">
              <HiSearch />
            </div>
          </div> */}
          {/* <div className="header_dropdown" onClick={() => setDropdown(!dropdown)}>
            {" "}
            My Account <MdOutlineKeyboardArrowDown />
            {dropdown && <div className="myaccount_dropdown">
              <p>Sign In</p>
              <p>Sign Out</p>
            </div>}

          </div> */}
          {/* <div className="header_dropdown">
            {" "}
            USD <MdOutlineKeyboardArrowDown />
          </div> */}
          {/* <div className="header_dropdown">
            {" "}
            EN <MdOutlineKeyboardArrowDown />
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default Header;
