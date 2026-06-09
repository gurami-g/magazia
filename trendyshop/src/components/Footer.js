import React from "react";
import "./style/style.css";
import { MdLocationOn } from "react-icons/md";
import { BsFillEnvelopeFill } from "react-icons/bs";
import { BsTelephoneFill } from "react-icons/bs";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";

import { GrTwitter } from "react-icons/gr";
import { FaFacebookF } from "react-icons/fa";
import { GrLinkedinOption } from "react-icons/gr";
import { RiInstagramFill } from "react-icons/ri";
import { Link } from "react-router-dom";
const Footer = () => {
  return (
    <div className="footer">
      <div className="footer_container justify-content-between d-flex">
        <div className="container1 bpg-arial-caps col-5">
          <p className="title">როგორ გვიპოვოთ</p>
          <p className="description">
            ჩვენ ვყიდით სამოგზაურო ინვენტარებს, დასაკავშირებლად შესაძლებლობა გაქვთ დაგვიკავშირდეთ ქვემოთ მითითებული შესაბამისი საკონტაქტო ინფორმაციებით
          </p>
          <p>
            {" "}
            <MdLocationOn className="icon" /> 123 საბურთალო, თბილისი, საქართველო
          </p>
          <p>
            {" "}
            <BsFillEnvelopeFill className="icon" />
            info@example.com
          </p>
          <p>
            {" "}
            <BsTelephoneFill className="icon" />
            +012 345 67890
          </p>
        </div>
        <div className="container2">
          <div className="container2_child bpg-arial-caps">
            <h4 className="title">საიტის რუქა</h4>
            <p>
              {" "}
              <Link to="/" className="text-light"><MdOutlineKeyboardArrowRight className="icon" /> მთავარი</Link>
            </p>
            <p>
              <Link to="/shop" className="text-light">
                <MdOutlineKeyboardArrowRight className="icon" />
                მაღაზია
              </Link>
            </p>
            <p>
              <Link to="/shopcart" className="text-light">
                <MdOutlineKeyboardArrowRight className="icon" />
                კალათა
              </Link>
            </p>
            <p>
              <Link to="/contact" className="text-light">
              <MdOutlineKeyboardArrowRight className="icon" />
              Contact Us
              </Link>
            </p>
          </div>
          <div className="container2_child bpg-arial-caps ">
            <h4 className="title">სიახლეები</h4>
            <p style={{ fontWeight: "600" }}>
              სიახლის მისაღებად გამოიწერეთ
            </p>
            <div className="input_container">
              <input type="text" placeholder="Your Email Address" />
              <button>გამოწერა</button>
            </div>

            <p className="follow">გამოგვყევით</p>

            <div className="icon_container">
              <div>
                <GrTwitter className="icon" />
              </div>
              <div>
                <FaFacebookF className="icon" />
              </div>
              <div>
                <GrLinkedinOption className="icon" />
              </div>
              <div>
                <RiInstagramFill className="icon" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
