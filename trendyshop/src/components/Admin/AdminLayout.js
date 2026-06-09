import React from "react";
import AdminNavigation from "./AdminNavigation";
import { Outlet } from "react-router-dom";
const Admin = ({ current }) => {

  return (
    <div className="admin">
      <AdminNavigation current={current} />
      <Outlet />
    </div>
  );
};

export default Admin;
