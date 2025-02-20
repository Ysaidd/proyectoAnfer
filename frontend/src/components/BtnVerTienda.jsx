import { Link } from "react-router-dom"

const BtnVerTienda = () => {
    return (
        <div className="w-full text-center pb-8">
            <Link to={"/products"} className="bg-indigo-900 text-white px-8 py-2 rounded-md hover:bg-indigo-600 transition duration-3000">Ver Tienda</Link>
        </div>
    );
}

export default BtnVerTienda;