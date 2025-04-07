import AdminSidebar from "../admin/AdminSidebar";
import CategoryManager from "../Admin/Categories";

const CategoryManagerr = () => {
    return (
        <div className="flex">
            <div className="flex-1 basis-[15%]"> 
                <AdminSidebar />
            </div>
            <div className="flex-1 basis-[85%]"> 
                <CategoryManager />
            </div>
        </div>
    );
}

export default CategoryManagerr;