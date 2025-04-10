import {
  LayoutDashboard,
  Package,
  PlusCircle,
  PackageSearch,
  ShoppingCart,
  Truck,
} from "lucide-react";
import { NavLink } from "react-router-dom";

export default function StaffSideBar() {
  const menuItems = [
    { to: "/staff/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/staff/products", icon: Package, label: "All Products" },
    { to: "/staff/stocks", icon: PackageSearch, label: "Stocks" },
    { to: "/staff/suppliers", icon: Truck, label: "Suppliers" },
    { to: "/staff/orders", icon: ShoppingCart, label: "Orders" },
  ];

  return (
    <div className="flex flex-col gap-4 h-full border-r bg-white p-4 w-64 dark:bg-black">
      {menuItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            `flex items-center p-3 rounded-lg gap-3 transition-all duration-200 ${
              isActive
                ? "bg-blue-50 text-blue-600 border-blue-200 font-semibold dark:border-blue-500 dark:bg-muted/80"
                : "text-gray-600 hover:bg-gray-50 hover:text-blue-600 dark:hover:bg-muted/80"
            }`
          }
        >
          <item.icon size={20} />
          <span className="text-sm font-medium">{item.label}</span>
        </NavLink>
      ))}
    </div>
  );
}
