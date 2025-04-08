import AdminSidebar from "../Admin/AdminSidebar";
import Products from "../Admin/Products";

const AdminProducts = () => {
    return (
        <div className="flex">
            <div className="flex-1 basis-[15%]"> 
                <AdminSidebar />
            </div>
            <div className="flex-1 basis-[85%]"> 
                <Products />
            </div>
        </div>
    );
}

export default AdminProducts;