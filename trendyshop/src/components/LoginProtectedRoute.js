import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'

const LoginProtectedRoute = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    const url = process.env.REACT_APP_SERVER_URL;

    const getUser = async () => {
        await axios.get(`${url}/getuser`)
            .then(res => {
                if (res.data.loggedIn === false) setUser(res.data);
                else navigate("/addproducts");
            })
            .catch(err => console.log(err));
    }

    useEffect(() => {
        getUser();
    }, []);

    if (user?.loggedIn === false) {
        return (
            <Outlet />
        )
    }
}

export default LoginProtectedRoute