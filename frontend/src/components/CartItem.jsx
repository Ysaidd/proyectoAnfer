import React, {useState} from "react";
import { Trash2 } from "lucide-react";

const CartItem = ({ item, updateQuantity }) => {

    const [quantity, setQuantity] = useState(item.quantity);

    const handleQuantityChange = (e) =>{
        let newQuantity = parseInt(e.target.value);
        
        if (newQuantity < 1) newQuantity = 1; 
        setQuantity(newQuantity);
        updateQuantity(item.id, newQuantity);
    }

    return (
        <tr className="border-b text-center">
            <td>
                <button className="text-red-500 hover:text-red-700">
                <Trash2 size={18} />
                </button>
            </td>
            <td className="flex items-center space-x-3 py-3">
                <img src={item.image} alt={item.name} className="w-12 h-12 object-contain" />
                <span className="text-blue-600 hover:underline cursor-pointer">{item.name}</span>
            </td>
            <td className="text-gray-700">${item.price.toFixed(2)}</td>
            <td>
                <input 
                type="number" 
                className="w-12 border rounded text-center" 
                value={quantity}   
                min="1" onChange={handleQuantityChange}/>
            </td>
            <td className="text-gray-700 font-semibold">${(item.price * quantity).toFixed(2)}</td>
        </tr>
    );
};

export default CartItem;
