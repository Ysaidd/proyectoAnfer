import { Link } from "react-router-dom";

const Banner = () => {
  return (
    <div
      className="relative w-full h-[380px] flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: "url('/images/banner.jpg')" }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>

      <div className="relative text-center text-white px-6 max-w-2xl">
        <h1 className="text-4xl sm:text-5xl font-bold mb-4">
          Anfer es la mejor opción para comprar tu ropa
        </h1>
        <p className="text-lg mb-6">
          Encuentra los mejores estilos y precios en nuestra tienda.
        </p>
        <Link to="/contacto">
          <button className="bg-indigo-900 text-white font-semibold py-3 px-6 rounded-lg hover:bg-indigo-600 transition duration-3000">
            Comunícate con nosotros
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Banner;
