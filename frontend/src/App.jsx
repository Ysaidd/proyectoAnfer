import AppRouter from "./routes/AppRouter";
import { CartProvider } from "./context/CartContext";
import { BrowserRouter } from "react-router-dom";

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    </CartProvider>


  )
}

export default App;
