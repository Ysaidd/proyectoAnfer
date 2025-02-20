import Carousel from "../components/Carousel";
import Categories from "../components/Categories";
import BtnVerTienda from "../components/BtnVerTienda";
import Banner from "../components/Banner";

const Home = () => {
    return (
        <div className="text-center">
            <Carousel/>
            <Categories/>
            <BtnVerTienda link="/productos"/>
            <Banner/>   
        </div>
    );
};

export default Home;


 