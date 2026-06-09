import React from 'react'
import img1 from "../Images/adminImages/Settings.svg";
import img2 from "../Images/adminImages/addProduct.svg";
import img3 from "../Images/adminImages/addedProducts.svg";
import img4 from "../Images/adminImages/logout.svg";
import img5 from "../Images/adminImages/soldItems.svg";
import img6 from "../Images/adminImages/trendyshop.svg";
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminNavigation = ({ current }) => {

    const navigate = useNavigate();
    const url = process.env.REACT_APP_SERVER_URL;

    const logOut = async () => {
        await axios.post(`${url}/logout`)
            .then(res => {
                if (res.status === 200) {
                    navigate("/login");
                }
            })
            .catch(err => console.log(err));
    }

    return (
        <>
            <div className="admin_navigation">
                <div className="top">
                    <div className="nav_child">
                        <img src={img6} alt="" />
                    </div>
                    <Link to="/addproducts">
                        <div className="nav_child" style={{ backgroundColor: current === 1 && '#5a5a5a' }}>
                            <img src={img2} alt="" />
                        </div>
                    </Link>
                    <Link to="/products">
                        <div className="nav_child" style={{ backgroundColor: current === 2 && '#5a5a5a' }}>
                            <img src={img3} alt="" />
                        </div>
                    </Link>
                    {/* <div className="nav_child" style={{ backgroundColor: current === 3 && '#5a5a5a' }}>
                        <img src={img5} alt="" />
                    </div> */}
                    <Link to="/settings">
                        <div className="nav_child" style={{ backgroundColor: current === 4 && '#5a5a5a' }}>
                            <img src={img1} alt="" />
                        </div>
                    </Link>
                </div>
                <div className="bottom nav_child" onClick={logOut}>
                    <img src={img4} alt="" />
                </div>
            </div>
        </>
    )
}

export default AdminNavigation