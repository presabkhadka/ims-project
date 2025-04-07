import { useEffect, useState } from "react";
import Navbar from "../../../components/navbar";
import Sidebar from "../../../components/sidebar";
import { Package2 } from "lucide-react";
import axios from "axios";

export default function AllProduct() {
  interface Products {
    _id: string;
    Name: string;
    Description: string;
    Category: string;
    Price: { $numberDecimal: string };
    Quantity: number;
    Available: string;
  }

  const [products, setProducts] = useState<Products[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        let token = localStorage.getItem("Authorization")?.split(" ")[1];
        if (!token) {
          throw new Error("No authorization headers");
        }
        let response = await axios.get("http://localhost:1212/owner/products", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProducts(response.data.products);
      } catch (error) {}
    };
    fetchProducts();
    let interval = setInterval(fetchProducts, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden">
      <div className="top-0 sticky z-50 bg-white dark:bg-black">
        <Navbar />
      </div>
      <div className="flex-1 grid grid-cols-12 overflow-hidden">
        <div className="col-span-2 ">
          <Sidebar />
        </div>
        <div className="col-span-10 overflow-y-auto">
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Package2 className="h-6 w-6" />
              Products
            </h1>
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => (
                <div
                  key={product._id}
                  className="bg-white rounded-lg shadow-md dark:bg-muted/80 border hover:border-blue-500"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h2 className="text-xl font-semibold text-gray-800 line-clamp-1 dark:text-white">
                        {product.Name}
                      </h2>
                    </div>
                    <p className="text-gray-600 mb-4 line-clamp-2 dark:text-white">
                      {product.Description}
                    </p>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-500 dark:text-white">
                          Category
                        </span>
                        <span className="font-medium text-gray-800 dark:text-white">
                          {product.Category}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-500 dark:text-white">
                          Price
                        </span>
                        <span className="font-medium text-gray-800 dark:text-white">
                          $
                          {parseFloat(
                            product.Price?.$numberDecimal || "0.0"
                          ).toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-500 dark:text-white">
                          Quantity
                        </span>
                        <span className="font-medium text-gray-800 dark:text-white">
                          {product.Quantity}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="px-6 py-4 flex gap-2">
                    <button className="w-full border border-blue-500  py-2 px-4 rounded-md hover:bg-blue-700 hover:text-white transition-colors duration-300">
                      Edit
                    </button>
                    <button className="w-full border border-red-500  py-2 px-4 rounded-md hover:bg-red-700 hover:text-white transition-colors duration-300">
                      Delete
                    </button>
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
