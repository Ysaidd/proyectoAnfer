import Carousel from "../components/Carousel";
import Categories from "../components/Categories";
import BtnVerTienda from "../components/BtnVerTienda";
import Banner from "../components/Banner";
import ProductList from "../components/ProductList";

const Home = () => {
    return (
        <div className="text-center">
            <Carousel/>
            <Categories/>
            <ProductList/>
            <BtnVerTienda link="/productos"/>
            <Banner/>   
        </div>
    );
};

export default Home;


