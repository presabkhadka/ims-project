import { useState } from "react";
import { PlusCircle } from "lucide-react";
import { Input } from "../../../components/ui/input";
import toast from "react-hot-toast";
import StaffNavbar from "../../../components/staffNavbar";
import StaffSideBar from "../../../components/staffSidebar";

export default function StaffAddProduct() {
  const [formData, setFormData] = useState({
    Name: "",
    Description: "",
    Category: "",
    Price: "",
    Quantity: "",
    Available: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleCreateProduct(formData);
  };

  const handleCreateProduct = async (data: typeof formData) => {
    try {
      const token = localStorage.getItem("Authorization")?.split(" ")[1];

      const response = await fetch("http://localhost:1212/staff/add-product", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();
      if (response.ok) {
        toast.success(responseData.msg);
        setFormData({
          Name: "",
          Description: "",
          Category: "",
          Price: "",
          Quantity: "",
          Available: "",
        });
      } else {
        toast.error(responseData.msg || "Something went wrong.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Something went wrong while submitting the form.");
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col">
      <div className="top-0 sticky z-50 bg-white dark:bg-black">
        <StaffNavbar />
      </div>
      <div className="grid grid-cols-12 h-full">
        <div className="col-span-2">
          <StaffSideBar />
        </div>
        <div className="col-span-10 overflow-auto">
          <div className="p-6">
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              <div className="col-span-full ">
                <div className="bg-white dark:bg-black rounded-lg shadow-lg p-6 border">
                  <div className="flex items-center gap-3 mb-6">
                    <PlusCircle className="h-6 w-6 text-blue-600" />
                    <h1 className="text-2xl font-semibold text-gray-900 dark:text-blue-600">
                      Add New Product
                    </h1>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                      <div>
                        <label
                          htmlFor="Name"
                          className="block text-sm font-medium text-gray-700 dark:text-white"
                        >
                          Product Name
                        </label>
                        <Input
                          type="text"
                          name="Name"
                          id="Name"
                          value={formData.Name}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="Category"
                          className="block text-sm font-medium text-gray-700 dark:text-white"
                        >
                          Category
                        </label>
                        <Input
                          name="Category"
                          id="Category"
                          value={formData.Category}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label
                          htmlFor="Description"
                          className="block text-sm font-medium text-gray-700 dark:text-white"
                        >
                          Description
                        </label>
                        <textarea
                          name="Description"
                          id="Description"
                          rows={3}
                          value={formData.Description}
                          onChange={handleChange}
                          className="mt-1 block w-full rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-1 border"
                          required
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="Price"
                          className="block text-sm font-medium text-gray-700 dark:text-white"
                        >
                          Price
                        </label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="text-gray-500 sm:text-sm">$</span>
                          </div>
                          <input
                            type="number"
                            name="Price"
                            id="Price"
                            value={formData.Price}
                            onChange={handleChange}
                            className="pl-7 block w-full rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border px-3 py-2"
                            placeholder="0.00"
                            min="0"
                            step="0.01"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor="Quantity"
                          className="block text-sm font-medium text-gray-700 dark:text-white"
                        >
                          Quantity
                        </label>
                        <input
                          type="number"
                          name="Quantity"
                          id="Quantity"
                          value={formData.Quantity}
                          onChange={handleChange}
                          className="mt-1 block w-full rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border px-3 py-2"
                          min="0"
                          required
                        />
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Add Product
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
