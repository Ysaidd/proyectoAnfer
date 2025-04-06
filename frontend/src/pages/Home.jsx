import { useState, useEffect } from "react";
import Carousel from "../components/Carousel";
import Categories from "../components/Categories";
import BtnVerTienda from "../components/BtnVerTienda";
import Banner from "../components/Banner";
import ProductList from "../components/ProductList";

const Home = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        // 🔥 Llamar a la API para obtener 3 productos
        fetch("http://localhost:8000/products?limit=3")  
            .then((response) => response.json())
            .then((data) => {
                setProducts(data);  // Guardar los productos en el estado
            })
            .catch((error) => console.error("Error al obtener productos:", error));
    }, []);

    return (
        <div className="text-center">
            <Carousel />
            <Categories />
            <ProductList products={products} />
            <BtnVerTienda link="/productos" />
            <Banner />
        </div>
    );
};

export default Home;
