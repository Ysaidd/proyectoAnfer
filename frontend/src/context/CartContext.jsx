import { createContext, useState, useContext } from "react";

const CartContext = createContext();

// Hook personalizado para acceder al contexto
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // 🛒 Añadir producto al carrito
  const addToCart = (product, quantity, selectedSize, selectedColor) => {
    const newItem = {
      id: `${product.id}-${selectedSize}-${selectedColor.name}`, // ID único
      name: product.name,
      price: product.price,
      image: product.images[0],
      quantity,
      size: selectedSize,
      color: selectedColor,
    };

    setCartItems((prev) => {
      const exists = prev.find((item) => item.id === newItem.id);
      return exists
        ? prev.map((item) =>
            item.id === newItem.id ? { ...item, quantity: item.quantity + quantity } : item
          )
        : [...prev, newItem];
    });
  };

  // ❌ Eliminar producto del carrito
  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  // 🔄 Actualizar cantidad
  const updateQuantity = (id, newQuantity) => {
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: newQuantity } : item))
    );
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity }}>
      {children}
    </CartContext.Provider>
  );
};
