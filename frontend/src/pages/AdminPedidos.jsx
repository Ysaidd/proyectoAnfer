import AdminSidebar from "../Admin/AdminSidebar";
import Pedidos from "../Admin/Pedidos";

const AdminPedidos = () => {
    return (
        <div className="flex">
            <div className="flex-1 basis-[15%]"> 
                <AdminSidebar />
            </div>
            <div className="flex-1 basis-[85%]"> 
                < Pedidos/>
            </div>
        </div>
    );
}

export default AdminPedidos;