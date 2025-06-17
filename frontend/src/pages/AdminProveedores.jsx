import AdminSidebar from "../Admin/AdminSidebar";
import AdminProveedores from "../Admin/Proveedores";

const ProveedoresManager = () => {
    return (
        <div className="flex">
            <div className="flex-1 basis-[15%]"> 
                <AdminSidebar />
            </div>
            <div className="flex-1 basis-[85%]"> 
                <AdminProveedores />
            </div>
        </div>
    );
}

export default ProveedoresManager;