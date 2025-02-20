import CategoryCard from "./CategoryCard";

const Categories = () => {
  const categories = [
    {
      title: "Caballero",
      image: "/images/prueba.jpg",
      link: "/productos/",
    },
    {
      title: "Juvenil",
      image: "/images/prueba.jpg",
      link: "/productos/",
    },
    {
      title: "Accesorios",
      image: "/images/prueba.jpg",
      link: "/productos/",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto py-10">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
        Explora Nuestras Categorías
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {categories.map((cat, index) => (
          <CategoryCard key={index} {...cat} />
        ))}
      </div>
    </div>
  );
};

export default Categories;
