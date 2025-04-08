import AdminSidebar from "../Admin/AdminSidebar";
import Dashboard from "../Admin/Dashboard";

const AdminPrincipal = () => {
    return (
        <div className="flex">
            <div className="flex-1 basis-[15%]"> 
                <AdminSidebar />
            </div>
            <div className="flex-1 basis-[85%]"> 
                <Dashboard />
            </div>
        </div>
    );
}

export default AdminPrincipal;