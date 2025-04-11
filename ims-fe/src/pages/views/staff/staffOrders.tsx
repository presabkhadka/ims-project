"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import StaffNavbar from "../../../components/staffNavbar";
import StaffSideBar from "../../../components/staffSidebar";

interface Order {
  orderId: string;
  customerName: string;
  productName: string;
  quantity: number;
  unitPrice: { $numberDecimal: string };
  totalPrice: { $numberDecimal: string };
  Status: String;
  DeliveryMethod: String;
}

export default function StaffOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:1212/staff/orders");
      setOrders(res.data.orders);
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
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
        <div className="col-span-10 overflow-auto p-6">
          <h2 className="text-2xl font-semibold mb-4">Orders</h2>

          {loading ? (
            <p>Loading orders...</p>
          ) : (
            <table className="w-full text-left border border-gray-300">
              <thead className="bg-gray-100 dark:bg-zinc-900">
                <tr>
                  <th className="p-3 border">Order ID</th>
                  <th className="p-3 border">Customer</th>
                  <th className="p-3 border">Product</th>
                  <th className="p-3 border">Quantity</th>
                  <th className="p-3 border">Unit Price</th>
                  <th className="p-3 border">Total Price</th>
                  <th className="p-3 border">Status</th>
                  <th className="p-3 border">Delivery</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr
                    key={order.orderId}
                    className="hover:bg-gray-100 dark:hover:bg-zinc-800"
                  >
                    <td className="p-3 border">{order.orderId}</td>
                    <td className="p-3 border">{order.customerName}</td>
                    <td className="p-3 border">{order.productName}</td>
                    <td className="p-3 border">{order.quantity}</td>
                    <td className="p-3 border">
                      {parseFloat(
                        order.unitPrice?.$numberDecimal || "0"
                      ).toFixed(2)}
                    </td>
                    <td className="p-3 border">
                      {parseFloat(
                        order.totalPrice?.$numberDecimal || "0"
                      ).toFixed(2)}
                    </td>
                    <td className="p-3 border">{order.Status}</td>
                    <td className="p-3 border">{order.DeliveryMethod}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
