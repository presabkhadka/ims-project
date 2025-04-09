import { useEffect, useState } from "react";
import Navbar from "../../../components/navbar";
import Sidebar from "../../../components/sidebar";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";

export default function Stocks() {
  interface Stocks {
    _id: string;
    Name: string;
    Quantity: string;
    Available: string;
  }

  const [stocks, setStocks] = useState<Stocks[]>([]);

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        let token = localStorage.getItem("Authorization")?.split(" ")[1];
        if (!token) {
          throw new Error("No authorization headers");
        }
        let response = await axios.get("http://localhost:1212/owner/stocks", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setStocks(response.data.stocks);
      } catch (error) {
        console.log(error);
      }
    };
    fetchStocks();
    let interval = setInterval(fetchStocks, 5000);
    return () => clearInterval(interval);
  }, []);

  const convertToCSV = (data: Stocks[]) => {
    const headers = ["Product Name", "Quantity", "Status"];
    const rows = data.map((stock) => [
      stock.Name,
      stock.Quantity,
      stock.Available,
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.join(","))
      .join("\n");

    return csvContent;
  };

  const downloadCSV = () => {
    const csv = convertToCSV(stocks);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "stocks.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="h-screen w-screen flex flex-col">
      <div className="top-0 sticky z-50 bg-white dark:bg-black">
        <Navbar />
      </div>
      <div className="grid grid-cols-12 h-full">
        <div className="col-span-2">
          <Sidebar />
        </div>
        <div className="col-span-10 overflow-auto">
          <div className="p-6">
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              <div className="col-span-full flex justify-end">
                <button
                  onClick={downloadCSV}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                >
                  Download CSV
                </button>
              </div>

              <div className="col-span-full ">
                <Table className="w-full table-auto">
                  <TableHeader>
                    <TableRow className="bg-blue-500 text-white dark:bg-blue-800">
                      <TableHead className="p-3 border dark:border-gray-600">
                        Product Name
                      </TableHead>
                      <TableHead className="p-3 border dark:border-gray-600">
                        Quantity
                      </TableHead>
                      <TableHead className="p-3 border dark:border-gray-600">
                        Status
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {stocks.length > 0 ? (
                      stocks.map((stock) => (
                        <TableRow
                          className="border-b-2 last:border-0 even:bg-muted/100 dark:even:bg-gray-700"
                          key={stock._id}
                        >
                          <TableCell className="p-3 border dark:border-gray-600">
                            {stock.Name}
                          </TableCell>
                          <TableCell className="p-3 border dark:border-gray-600">
                            {stock.Quantity}
                          </TableCell>
                          <TableCell className="p-3 border dark:border-gray-600">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-semibold 
    ${
      stock.Available === "In Stock"
        ? "bg-green-500 text-white dark:bg-green-800"
        : "bg-red-500 text-white dark:bg-red-800"
    }`}
                            >
                              {stock.Available}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={4}
                          className="text-center p-4 text-gray-500 dark:text-gray-400"
                        >
                          No data available
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
