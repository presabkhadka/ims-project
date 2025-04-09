import { useEffect, useState } from "react";
import Navbar from "../../../components/navbar";
import Sidebar from "../../../components/sidebar";
import { Package2, Search } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { Input } from "../../../components/ui/input";

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
  const [selectedProduct, setSelectedProduct] = useState<Products | null>(null);
  const [searchQuery, setSearchQuery] = useState<any>("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        let token = localStorage.getItem("Authorization")?.split(" ")[1];
        if (!token) throw new Error("No authorization headers");

        let response = await axios.get("http://localhost:1212/owner/products", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProducts(response.data.products);
      } catch (error) {
        toast.error("Failed to fetch products");
      }
    };
    fetchProducts();
    const interval = setInterval(fetchProducts, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleDeleteProduct = async (selectedProduct: Products) => {
    if (!selectedProduct) return;

    try {
      let token = localStorage.getItem("Authorization")?.split(" ")[1];
      if (!token) throw new Error("No token in headers");

      await axios.delete(
        `http://localhost:1212/owner/delete-product/${selectedProduct._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Product deleted successfully");
    } catch (error) {
      toast.error("Couldn't delete product.");
    }
  };

  const filteredProducts = products.filter(
    (product) =>
      product.Name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.Category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden">
      <div className="top-0 sticky z-50 bg-white dark:bg-black">
        <Navbar />
      </div>
      <div className="flex-1 grid grid-cols-12 overflow-hidden">
        <div className="col-span-2">
          <Sidebar />
        </div>
        <div className="col-span-10 overflow-y-auto">
          <div className="p-6">
            <div className="flex gap-2 justify-between">
              <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Package2 className="h-6 w-6" />
                Products
              </h1>
              <div className="flex relative">
                <div className="absolute mt-1 ml-1">
                  <Search />
                </div>
                <Input
                  className="pl-10"
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                  }}
                />
              </div>
            </div>
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {filteredProducts.map((product) => (
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
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-500 dark:text-white">
                          Description
                        </span>
                        <p className="text-gray-600 line-clamp-2 dark:text-white">
                          {product.Description}
                        </p>
                      </div>

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
                    <button
                      onClick={() => setSelectedProduct(product)}
                      className="w-full border border-blue-500 py-2 px-4 rounded-md hover:bg-blue-700 hover:text-white transition-colors duration-300"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product)}
                      className="w-full border border-red-500 py-2 px-4 rounded-md hover:bg-red-700 hover:text-white transition-colors duration-300"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-black p-6 rounded-md w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
              Edit Product
            </h2>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                try {
                  const token = localStorage
                    .getItem("Authorization")
                    ?.split(" ")[1];
                  if (!token) throw new Error("No token found");

                  const availableStatus =
                    selectedProduct.Quantity < 20 ? "Low in stock" : "In Stock";

                  const updatedProduct = {
                    ...selectedProduct,
                    Available: availableStatus,
                  };

                  const response = await axios.patch(
                    `http://localhost:1212/owner/update-product/${selectedProduct._id}`,
                    updatedProduct,
                    {
                      headers: {
                        Authorization: `Bearer ${token}`,
                      },
                    }
                  );

                  if (response.status === 200) {
                    toast.success("Product updated successfully");
                    setSelectedProduct(null);
                  } else {
                    throw new Error("Unexpected response from server");
                  }
                } catch (error) {
                  console.error(error);
                  toast.error("Failed to update product");
                }
              }}
              className="space-y-4"
            >
              <input
                type="text"
                value={selectedProduct.Name}
                onChange={(e) =>
                  setSelectedProduct({
                    ...selectedProduct,
                    Name: e.target.value,
                  })
                }
                placeholder="Name"
                className="w-full border p-2 rounded"
                required
              />
              <input
                type="text"
                value={selectedProduct.Category}
                onChange={(e) =>
                  setSelectedProduct({
                    ...selectedProduct,
                    Category: e.target.value,
                  })
                }
                placeholder="Category"
                className="w-full border p-2 rounded"
                required
              />
              <textarea
                value={selectedProduct.Description}
                onChange={(e) =>
                  setSelectedProduct({
                    ...selectedProduct,
                    Description: e.target.value,
                  })
                }
                placeholder="Description"
                className="w-full border p-2 rounded"
                required
              />
              <input
                type="number"
                value={parseFloat(selectedProduct.Price.$numberDecimal)}
                onChange={(e) =>
                  setSelectedProduct({
                    ...selectedProduct,
                    Price: { $numberDecimal: e.target.value },
                  })
                }
                placeholder="Price"
                className="w-full border p-2 rounded"
                required
              />
              <input
                type="number"
                value={selectedProduct.Quantity}
                onChange={(e) =>
                  setSelectedProduct({
                    ...selectedProduct,
                    Quantity: parseInt(e.target.value),
                  })
                }
                placeholder="Quantity"
                className="w-full border p-2 rounded"
                required
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedProduct(null)}
                  className="px-4 py-2 bg-gray-300 dark:bg-gray-700 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
