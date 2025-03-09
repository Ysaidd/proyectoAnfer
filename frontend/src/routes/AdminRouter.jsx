import { Routes, Route, BrowserRouter } from "react-router-dom";
import AdminPanel from "../admin/AdminPanel";

const AdminRouter = () => {
    return (
  
        <Routes>
            <Route path="/admin/*" element={<AdminPanel />} />
        </Routes>

    );
};

export default AdminRouter;
