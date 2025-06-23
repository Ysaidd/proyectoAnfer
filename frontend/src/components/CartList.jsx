import React from "react";
import CartItem from "./CartItem";




const CartList = ({ cartItems, updateQuantity }) => {
    
    return (
        <div className="bg-white shadow-md rounded-lg p-5 overflow-x-auto">
            <h2 className="text-2xl font-bold mb-4">Carrito</h2>
            <table className="w-full border-collapse">
                <thead>
                <tr className="bg-gray-100">
                    <th></th>
                    <th className="text-left">Product</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Subtotal</th>
                </tr>
                </thead>
                <tbody>
                {cartItems.map((item) => (
                    <CartItem key={item.id} item={item} updateQuantity={updateQuantity} />
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default CartList;
