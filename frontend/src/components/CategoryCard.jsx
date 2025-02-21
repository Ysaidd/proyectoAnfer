import { Link } from "react-router-dom";

const CategoryCard = ({ image, title, link  }) => {  

    return (
        <Link to={link} className="group">
          <div className="m-4 md:0 bg-white rounded-lg shadow-lg overflow-hidden transform transition duration-300 hover:scale-105">
            <img src={image} alt={title} className="w-full h-64 object-cover" />
            <div className="bg-indigo-900 text-white text-center py-3 text-lg font-semibold">
              {title}
            </div>
          </div>
        </Link>
      );
}

export default CategoryCard;