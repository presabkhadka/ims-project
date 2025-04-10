import axios from "axios";
import { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";

import { Crown, Package, Truck } from "lucide-react";
import StaffNavbar from "../../../components/staffNavbar";
import StaffSideBar from "../../../components/staffSidebar";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../../../components/ui/chart";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  ResponsiveContainer,
} from "recharts";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";

export default function StaffDashboard() {
  const [totalProduct, setTotalProduct] = useState(null);
  const [totalOrder, setTotalOrder] = useState(null);
  const [totalSupplier, setTotalSupplier] = useState(null);

  const dynamicChartData = [
    {
      type: "Total Products",
      productCount: totalProduct,
    },
    {
      type: "Total Orders",
      orderCount: totalOrder,
    },
  ];

  const dynamicChartConfig = {
    product: {
      label: "Total Products",
      color: "hsl(var(--chart-1))",
    },
    order: {
      label: "Total Orders",
      color: "hsl(var(--chart-2))",
    },
  } satisfies ChartConfig;

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

  // ue for fetching total order
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

  // ue for fetching total suppliers
  useEffect(() => {
    const fetchTotalSupplier = async () => {
      try {
        let token = localStorage.getItem("Authorization")?.split(" ")[1];
        if (!token) {
          throw new Error("No authorization headers");
        }
        let response = await axios.get(
          "http://localhost:1212/staff/total-suppliers",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setTotalSupplier(response.data.suppliers);
      } catch (error) {
        if (error instanceof Error) {
          console.log(error.message);
        }
      }
    };
    fetchTotalSupplier();
    let interval = setInterval(fetchTotalSupplier, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden">
      <div className="top-0 sticky z-50 bg-white dark:bg-black">
        <StaffNavbar />
      </div>
      <div className="grid grid-cols-12 h-full overflow-hidden">
        <div className="col-span-2">
          <StaffSideBar />
        </div>
        <div className="col-span-10 overflow-y-auto">
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
              <div className="rounded-xl shadow-lg  flex justify-center items-center hover:shadow-xl min-h-[10rem] border hover:border-pink-500">
                {totalOrder === null ? (
                  <Skeleton height={100} width="80%" />
                ) : (
                  <div className="w-full flex flex-col gap-2 py-2 px-4 justify-center items-center">
                    <h1 className="font-bold text-xl sm:text-2xl md:text-2xl text-gray-800 dark:text-gray-200 self-start">
                      Total Suppliers
                    </h1>
                    <div className="w-full flex justify-between items-center text-pink-500">
                      <h1 className="font-semibold text-2xl sm:text-2xl md:text-3xl">
                        {totalSupplier}
                      </h1>
                      <Truck />
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="grid grid-cols-12 gap-4 w-full p-4">
              <div className="col-span-full md:col-span-8 lg:col-span-full rounded-xl shadow-lg hover:shadow-xl border hover:border-cyan-500">
                {dynamicChartData.length === 0 ? (
                  <Skeleton height={300} width="100%" />
                ) : (
                  <Card className="dark:bg-black">
                    <CardHeader>
                      <CardTitle>Product and Orders</CardTitle>
                    </CardHeader>
                    <CardContent className="rounded-xl">
                      <ChartContainer config={dynamicChartConfig}>
                        <BarChart accessibilityLayer data={dynamicChartData}>
                          <CartesianGrid vertical={false} />
                          <XAxis
                            dataKey="type"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={true}
                          />
                          <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent indicator="dashed" />}
                          />
                          <Bar
                            dataKey="productCount"
                            fill="#4caf50"
                            radius={4}
                          />
                          <Bar dataKey="orderCount" fill="#9c27b0" radius={4} />
                        </BarChart>
                      </ChartContainer>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
