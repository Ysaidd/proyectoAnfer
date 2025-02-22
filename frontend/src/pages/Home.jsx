import Carousel from "../components/Carousel";
import Categories from "../components/Categories";
import BtnVerTienda from "../components/BtnVerTienda";
import Banner from "../components/Banner";
import ProductList from "../components/ProductList";


const products = [
    {
      id: 1,
      name: "Calzado Dama Style D-7545-2AAAAA",
      price: 30.0,
      image: "/images/prueba.jpg",
    },
    {
      id: 2,
      name: "Calzado Dama Style D-7545-3",
      price: 30.0,
      image: "/images/prueba.jpg",
    },
    {
      id: 3,
      name: "Calzado Dama Style D-7545-7",
      price: 30.0,
      image: "/images/prueba.jpg",
    },
  ];
  
const Home = () => {
    return (
        <div className="text-center">
            <Carousel/>
            <Categories/>
            <ProductList products={products} />
            <BtnVerTienda link="/productos"/>
            <Banner/>   
        </div>
    );
};

export default Home;


