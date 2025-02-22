import AppRouter from "./router";
import { CartProvider } from "./context/CartContext";

function App() {
  return (
    <CartProvider>
      <AppRouter />
    </CartProvider>
  )
}

export default App;
