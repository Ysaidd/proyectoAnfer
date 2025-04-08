import { Routes, Route, Outlet  } from "react-router-dom";
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
      {/* Ruta principal CON Navbar/Footer */}
      <Route
        path="/"
        element={
          <>
            <Navbar />
            <Outlet /> {/* Aquí se renderizarán las subrutas */}
            <Footer />
          </>
        }
      >
        <Route index element={<Home />} />
        <Route path="products" element={<Products />} />
        <Route path="cart" element={<Cart />} />
        <Route path="product/:productId" element={<ProductPage />} />
      </Route>

      {/* Ruta de Admin SIN Navbar/Footer */}
      <Route
        path="/admin"
        element={<Outlet />} // Contenedor para subrutas de admin
      >
        <Route index element={<AdminPrincipal />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="sales" element={<AdminSales />} />
        <Route path="categories" element={<CategoryManagerr />} />
      </Route>

      {/* Ruta 404 debe estar FUERA de las demás rutas */}
      <Route path="*" element={<Error404 />} />
    </Routes>
    );
};

export default AppRouter;
