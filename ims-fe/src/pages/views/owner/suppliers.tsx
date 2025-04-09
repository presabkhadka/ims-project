import { Truck } from "lucide-react";
import Navbar from "../../../components/navbar";
import Sidebar from "../../../components/sidebar";
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function Suppliers() {
  interface Supplier {
    _id: string;
    Name: string;
    Phone: string;
    Email: string;
    Address: string;
  }

  let [suppliers, setSuppliers] = useState<Supplier[]>([]);
  let [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);

  // ue for fetching the suppliers
  useEffect(() => {
    const fetchSupplier = async () => {
      let token = localStorage.getItem("Authorization")?.split(" ")[1];
      if (!token) {
        throw new Error("No auhtorization headers");
      }
      let response = await axios.get("http://localhost:1212/owner/suppliers", {
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

  const handleDeleteSupplier = async (selectedSupplier: Supplier) => {
    if (!selectedSupplier) return;

    try {
      let token = localStorage.getItem("Authorization")?.split(" ")[1];
      if (!token) throw new Error("No token in headers");

      await axios.delete(
        `http://localhost:1212/owner/delete-supplier/${selectedSupplier._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Supplier deleted successfully");
    } catch (error) {
      toast.error("Couldn't delete supplier.");
    }
  };

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
                  <div className="px-6 py-4 flex gap-2">
                    <button
                      className="w-full border border-blue-500 py-2 px-4 rounded-md hover:bg-blue-700 hover:text-white transition-colors duration-300"
                      onClick={() => {
                        setSelectedSupplier(supplier);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="w-full border border-red-500 py-2 px-4 rounded-md hover:bg-red-700 hover:text-white transition-colors duration-300"
                      onClick={() => {
                        handleDeleteSupplier(supplier);
                      }}
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

      {selectedSupplier && (
        <div className="fixed inset-0  bg-muted/80 bg-opacity-50 flex items-center justify-center z-50">
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

                  const updatedProduct = {
                    ...selectedSupplier,
                  };

                  const response = await axios.patch(
                    `http://localhost:1212/owner/update-supplier/${selectedSupplier._id}`,
                    updatedProduct,
                    {
                      headers: {
                        Authorization: `Bearer ${token}`,
                      },
                    }
                  );

                  if (response.status === 200) {
                    toast.success("Product updated successfully");
                    setSelectedSupplier(null);
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
                value={selectedSupplier.Name}
                onChange={(e) =>
                  setSelectedSupplier({
                    ...selectedSupplier,
                    Name: e.target.value,
                  })
                }
                placeholder="Name"
                className="w-full border p-2 rounded"
                required
              />
              <input
                type="text"
                value={selectedSupplier.Phone}
                onChange={(e) =>
                  setSelectedSupplier({
                    ...selectedSupplier,
                    Phone: e.target.value,
                  })
                }
                placeholder="Phone"
                className="w-full border p-2 rounded"
                required
              />
              <input
                type="text"
                value={selectedSupplier.Email}
                onChange={(e) =>
                  setSelectedSupplier({
                    ...selectedSupplier,
                    Email: e.target.value,
                  })
                }
                placeholder="Email"
                className="w-full border p-2 rounded"
                required
              />
              <input
                type="text"
                value={selectedSupplier.Address}
                onChange={(e) =>
                  setSelectedSupplier({
                    ...selectedSupplier,
                    Address: e.target.value,
                  })
                }
                placeholder="Address"
                className="w-full border p-2 rounded"
                required
              />

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedSupplier(null)}
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
