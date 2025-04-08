import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Products from "../pages/Products";
import Cart from "../pages/Cart";
import ProductPage from "../pages/ProductPage";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AdminPrincipal from "../pages/AdminPrincipal";
import AdminProducts from "../pages/AdminProducts";
import AdminUsers from "../pages/AdminUsers";
import AdminSales from "../pages/AdminSales";
import Error404 from "../pages/NotFounded"; 
import CategoryManagerr from "../pages/AdminCategories";

const AppRouter = () => {
    return (
        <Routes>
        {/* Rutas con Navbar y Footer */}
            <Route
                path="/*"
                element={
                <>
                    <Navbar />
                    <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/product/:productId" element={<ProductPage />} />
                    <Route path="*" element={<Error404/>} />
                    </Routes>
                    <Footer />
                </>
                }
            />

            {/* Rutas de admin SIN Navbar ni Footer */}
            <Route 
                path="/admin/*" 
                element={
                <>
                    <Routes>
                    <Route path="/" element={<AdminPrincipal/>} />
                    <Route path="/products" element={<AdminProducts/>} />
                    <Route path="/users" element={<AdminUsers/>} />
                    <Route path="/sales" element={<AdminSales/>}></Route>
                    <Route path="/categories" element={<CategoryManagerr/>}></Route>
                    </Routes>
                </>
                }
                />
        </Routes>
    );
};

export default AppRouter;
