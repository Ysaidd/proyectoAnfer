import AdminSidebar from "../admin/AdminSidebar";
import Users from "../Admin/Users";

const AdminUsers = () => {
    return (
        <div className="flex">
            <div className="flex-1 basis-[15%]"> 
                <AdminSidebar />
            </div>
            <div className="flex-1 basis-[85%]"> 
                <Users/>
            </div>
        </div>
    );
}

export default AdminUsers;