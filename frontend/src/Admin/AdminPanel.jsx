import { Routes, Route } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import "./AdminPanel.css";

const AdminPanel = () => {
  return (
    <div>
      <AdminSidebar />
      <div className="admin-content">
        <Routes>
          <Route path=""  />
          <Route path="products"  />
          <Route path="users"  />
        </Routes>
      </div>
    </div>
  );
};

export default AdminPanel;
