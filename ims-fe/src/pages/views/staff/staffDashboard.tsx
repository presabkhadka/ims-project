import axios from "axios";
import { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";

import { Crown, Package } from "lucide-react";
import StaffNavbar from "../../../components/staffNavbar";
import StaffSideBar from "../../../components/staffSidebar";

export default function StaffDashboard() {
  const [totalProduct, setTotalProduct] = useState(null);
  const [totalOrder, setTotalOrder] = useState(null);

  // ue for fetching total product
  useEffect(() => {
    const fetchTotalProduct = async () => {
      try {
        let token = localStorage.getItem("Authorization")?.split(" ")[1];
        if (!token) {
          throw new Error("No authorization headers");
        }
        let response = await axios.get(
          "http://localhost:1212/staff/total-products",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setTotalProduct(response.data.totalProduct);
      } catch (error) {
        console.log(error);
      }
    };
    fetchTotalProduct();
    let interval = setInterval(fetchTotalProduct, 5000);
    return () => clearInterval(interval);
  }, []);

  // ue for fetching total staff
  useEffect(() => {
    const fetchTotalStaff = async () => {
      try {
        let token = localStorage.getItem("Authorization")?.split(" ")[1];
        if (!token) {
          throw new Error("No authorization headers");
        }
        let response = await axios.get(
          "http://localhost:1212/staff/total-orders",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setTotalOrder(response.data.totalOrder);
      } catch (error) {
        console.log(error);
      }
    };
    fetchTotalStaff();
    let interval = setInterval(fetchTotalStaff, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-screen w-screen flex flex-col">
      <div className="top-0 sticky z-50 bg-white dark:bg-black">
        <StaffNavbar />
      </div>
      <div className="grid grid-cols-12 h-full">
        <div className="col-span-2">
          <StaffSideBar />
        </div>
        <div className="col-span-10">
          <div>
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 p-4">
              <div className="rounded-xl shadow-lg  flex justify-center items-center hover:shadow-xl min-h-[10rem] border hover:border-green-500">
                {totalProduct === 0 ? (
                  <Skeleton height={100} width="80%" />
                ) : (
                  <div className="w-full flex flex-col gap-2 py-2 px-4 items-center">
                    <h1 className="font-bold text-xl sm:text-2xl md:text-2xl text-gray-800 dark:text-gray-200 self-start">
                      Total Products
                    </h1>
                    <div className="w-full flex justify-between items-center text-green-500">
                      <h1 className="font-semibold text-2xl sm:text-2xl md:text-3xl">
                        {totalProduct}
                      </h1>
                      <Crown />
                    </div>
                  </div>
                )}
              </div>
              <div className="rounded-xl shadow-lg  flex justify-center items-center hover:shadow-xl min-h-[10rem] border hover:border-purple-500">
                {totalOrder === null ? (
                  <Skeleton height={100} width="80%" />
                ) : (
                  <div className="w-full flex flex-col gap-2 py-2 px-4 justify-center items-center">
                    <h1 className="font-bold text-xl sm:text-2xl md:text-2xl text-gray-800 dark:text-gray-200 self-start">
                      Total Orders
                    </h1>
                    <div className="w-full flex justify-between items-center text-purple-500">
                      <h1 className="font-semibold text-2xl sm:text-2xl md:text-3xl">
                        {totalOrder}
                      </h1>
                      <Package />
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="grid grid-cols-12 gap-4 w-full p-4">
              <div className="col-span-full flex flex-col gap-2"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
