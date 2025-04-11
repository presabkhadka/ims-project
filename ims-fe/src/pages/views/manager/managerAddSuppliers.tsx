import { useState } from "react";
import ManagerNavbar from "../../../components/managerNavbar";
import ManagerSidebar from "../../../components/managerSidebar";
import { PlusCircle } from "lucide-react";
import { Input } from "../../../components/ui/input";
import toast from "react-hot-toast";

export default function AddSuppliersManager() {
  const [formData, setFormData] = useState({
    Name: "",
    Phone: "",
    Email: "",
    Address: "",
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

      const response = await fetch(
        "http://localhost:1212/manager/add-supplier",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        }
      );

      const responseData = await response.json();
      if (response.ok) {
        toast.success(responseData.msg);
        setFormData({
          Name: "",
          Phone: "",
          Email: "",
          Address: "",
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
        <ManagerNavbar />
      </div>
      <div className="grid grid-cols-12 h-full">
        <div className="col-span-2">
          <ManagerSidebar />
        </div>
        <div className="col-span-10 overflow-auto">
          <div className="p-6">
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              <div className="col-span-full ">
                <div className="bg-white dark:bg-black rounded-lg shadow-lg p-6 border">
                  <div className="flex items-center gap-3 mb-6">
                    <PlusCircle className="h-6 w-6 text-blue-600" />
                    <h1 className="text-2xl font-semibold text-gray-900 dark:text-blue-600">
                      Add New Supplier
                    </h1>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                      <div>
                        <label
                          htmlFor="Name"
                          className="block text-sm font-medium text-gray-700 dark:text-white"
                        >
                          Supplier Name
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
                          htmlFor="Phone"
                          className="block text-sm font-medium text-gray-700 dark:text-white"
                        >
                          Supplier Phone
                        </label>
                        <Input
                          name="Phone"
                          id="Phone"
                          value={formData.Phone}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="Email"
                          className="block text-sm font-medium text-gray-700 dark:text-white"
                        >
                          Supplier Email
                        </label>
                        <Input
                          type="text"
                          name="Email"
                          id="Email"
                          value={formData.Email}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="Address"
                          className="block text-sm font-medium text-gray-700 dark:text-white"
                        >
                          Supplier Address
                        </label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"></div>
                          <Input
                            type="text"
                            name="Address"
                            id="Address"
                            value={formData.Address}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Add Supplier
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
