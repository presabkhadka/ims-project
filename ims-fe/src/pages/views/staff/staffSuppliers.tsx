import { Truck } from "lucide-react";
import StaffSideBar from "../../../components/staffSidebar";
import StaffNavbar from "../../../components/staffNavbar";
import { useEffect, useState } from "react";
import axios from "axios";

export default function StaffSuppliers() {
  interface Supplier {
    _id: string;
    Name: string;
    Phone: string;
    Email: string;
    Address: string;
  }

  let [suppliers, setSuppliers] = useState<Supplier[]>([]);

  // ue for fetching the suppliers
  useEffect(() => {
    const fetchSupplier = async () => {
      let token = localStorage.getItem("Authorization")?.split(" ")[1];
      if (!token) {
        throw new Error("No auhtorization headers");
      }
      let response = await axios.get("http://localhost:1212/staff/suppliers", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSuppliers(response.data.suppliers);
    };
    fetchSupplier();
    let interval = setInterval(fetchSupplier, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden">
      <div className="top-0 sticky z-50 bg-white dark:bg-black">
        <StaffNavbar />
      </div>
      <div className="flex-1 grid grid-cols-12 overflow-hidden">
        <div className="col-span-2">
          <StaffSideBar />
        </div>
        <div className="col-span-10 overflow-y-auto">
          <div className="p-6">
            <div className="flex gap-2 justify-between">
              <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Truck className="h-6 w-6" />
                Supplier
              </h1>
            </div>
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {suppliers.map((supplier) => (
                <div
                  key={supplier._id}
                  className="bg-white rounded-lg shadow-md dark:bg-muted/80 border hover:border-blue-500"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h2 className="text-xl font-semibold text-gray-800 line-clamp-1 dark:text-white">
                        {supplier.Name}
                      </h2>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-500 dark:text-white">
                          Phone
                        </span>
                        <p className="text-gray-600  line-clamp-2 dark:text-white">
                          {supplier.Phone}
                        </p>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-gray-500 dark:text-white">
                          Category
                        </span>
                        <span className="font-medium text-gray-800 dark:text-white">
                          {supplier.Email}
                        </span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-gray-500 dark:text-white">
                          Address
                        </span>
                        <span className="font-medium text-gray-800 dark:text-white">
                          {supplier.Address}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
