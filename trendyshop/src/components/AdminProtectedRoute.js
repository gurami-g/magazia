import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'

const AdminProtectedRoute = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    const url = process.env.REACT_APP_SERVER_URL;

    const getUser = async () => {
        await axios.get(`${url}/getuser`)
            .then(res => {
                if (res.status === 200) {
                    if (res.data.loggedIn === false) {
                        navigate("/login");
                    } else {
                        setUser(res.data.loggedIn);
                    }
                }
            })
    }

    useEffect(() => {
        getUser();
    }, []);

    if (user === true) {
        return (
            <Outlet />
        )
    }
}

export default AdminProtectedRoute