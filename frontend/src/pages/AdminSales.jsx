import AdminSidebar from "../Admin/AdminSidebar";
import Sales from "../Admin/Sales";

const AdminSales = () => {
    return (
        <div className="flex">
            <div className="flex-1 basis-[15%]"> 
                <AdminSidebar />
            </div>
            <div className="flex-1 basis-[85%]"> 
                <Sales />
            </div>
        </div>
    );
}

export default AdminSales;