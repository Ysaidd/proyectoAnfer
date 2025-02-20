import Carousel from "../components/Carousel";
import Categories from "../components/Categories";
import BtnVerTienda from "../components/BtnVerTienda";

const Home = () => {
    return (
        <div className="text-center">
            <Carousel/>
            <Categories/>
            <BtnVerTienda link="/productos"/>
        </div>
    );
};

export default Home;


 