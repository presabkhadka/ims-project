import Navbar from "../../../components/navbar";
import Sidebar from "../../../components/sidebar";

export default function OwnerOrders(){
    return(
        <div className="h-screen w-screen flex flex-col">
<div className="top-0 sticky z-50 bg-white dark:bg-black">
    <Navbar/>
</div>
<div className="grid grid-cols-12 h-full">
    <div className="col-span-2">
<Sidebar/>
    </div>
    <div className="col-span-10 overflow-auto">
        <div className="p-6">
hi there
        </div>
    </div>
</div>
        </div>
    )
}