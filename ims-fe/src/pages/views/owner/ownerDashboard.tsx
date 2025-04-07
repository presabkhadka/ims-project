import Navbar from "../../../components/navbar";
import Sidebar from "../../../components/sidebar";
import axios from "axios";
import { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";

import { Crown, User } from "lucide-react";

export default function OwnerDashboard() {
  const [totalProduct, setTotalProduct] = useState(null);
  const [totalStaff, setTotalStaff] = useState(null);

  useEffect(() => {
    const fetchTotalProduct = async () => {
      try {
        let token = localStorage.getItem("Authorization")?.split(" ")[1];
        if (!token) {
          throw new Error("No authorization headers");
        }
        let response = await axios.get(
          "http://localhost:1212/owner/total-products",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setTotalProduct(response.data.totalProducts);
      } catch (error) {
        console.log(error);
      }
    };
    fetchTotalProduct();
    let interval = setInterval(fetchTotalProduct, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchTotalProduct = async () => {
      try {
        let token = localStorage.getItem("Authorization")?.split(" ")[1];
        if (!token) {
          throw new Error("No authorization headers");
        }
        let response = await axios.get(
          "http://localhost:1212/owner/total-staffs",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setTotalStaff(response.data.totalStaff);
      } catch (error) {
        console.log(error);
      }
    };
    fetchTotalProduct();
    let interval = setInterval(fetchTotalProduct, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-screen w-screen flex flex-col">
      <div className="top-0 sticky z-50 bg-white dark:bg-black">
        <Navbar />
      </div>
      <div className="grid grid-cols-12 h-full">
        <div className="col-span-2">
          <Sidebar />
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
                {totalStaff === 0 ? (
                  <Skeleton height={100} width="80%" />
                ) : (
                  <div className="w-full flex flex-col gap-2 py-2 px-4 justify-center items-center">
                    <h1 className="font-bold text-xl sm:text-2xl md:text-2xl text-gray-800 dark:text-gray-200 self-start">
                      Total Staff
                    </h1>
                    <div className="w-full flex justify-between items-center text-purple-500">
                      <h1 className="font-semibold text-2xl sm:text-2xl md:text-3xl">
                        {totalStaff}
                      </h1>
                      <User />
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
