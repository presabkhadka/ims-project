import { createBrowserRouter, RouterProvider } from "react-router-dom";
import OwnerLogin from "./pages/auth/owner/ownerLogin";
import OwnerRegister from "./pages/auth/owner/ownerRegister";
import OwnerAuthGuard from "./guards/ownerAuthGuard";
import OwnerDashboard from "./pages/views/owner/ownerDashboard";
import StaffAuthGuard from "./guards/staffAuthGuard";
import StaffDashboard from "./pages/views/staff/staffDashboard";
import StaffLogin from "./pages/auth/staff/staffLogin";
import StaffRegister from "./pages/auth/staff/staffRegister";
import { ThemeProvider } from "./components/theme-provider";
import AllProduct from "./pages/views/owner/allProducts";
import AddProduct from "./pages/views/owner/addProduct";
import { Toaster } from "react-hot-toast";
import Stocks from "./pages/views/owner/stocks";
import Suppliers from "./pages/views/owner/suppliers";
import AddSuppliers from "./pages/views/owner/addSuppliers";
import StaffAllProduct from "./pages/views/staff/staffProduct";
import StaffAddProduct from "./pages/views/staff/staffAddProduct";
import StaffStocks from "./pages/views/staff/staffStocks";
import StaffSuppliers from "./pages/views/staff/staffSuppliers";
import ManagerAuthGuard from "./guards/managerAuthGuard";
import ManagerLogin from "./pages/auth/manager/managerLogin";
import ManagerRegister from "./pages/auth/manager/managerRegister";
import ManagerDashboard from "./pages/views/manager/managerDashboard";
import AllProductManager from "./pages/views/manager/productsManager";
import AddProductManager from "./pages/views/manager/addProductManager";
import StocksManager from "./pages/views/manager/managerStocks";
import SuppliersManager from "./pages/views/manager/managerSuppliers";
import AddSuppliersManager from "./pages/views/manager/managerAddSuppliers";

function App() {
  return (
    <ThemeProvider>
      <RouterProvider
        router={createBrowserRouter([
          { path: "/owner/login", element: <OwnerLogin /> },
          { path: "/owner/signup", element: <OwnerRegister /> },
          { path: "/staff/login", element: <StaffLogin /> },
          { path: "/staff/signup", element: <StaffRegister /> },
          {
            path: "/manager/login",
            element: <ManagerLogin />,
          },
          {
            path: "/manager/signup",
            element: <ManagerRegister />,
          },
          {
            path: "/owner",
            element: <OwnerAuthGuard />,
            children: [
              {
                path: "/owner/dashboard",
                element: <OwnerDashboard />,
              },
              {
                path: "/owner/products",
                element: <AllProduct />,
              },
              {
                path: "/owner/add-product",
                element: <AddProduct />,
              },
              {
                path: "/owner/stocks",
                element: <Stocks />,
              },
              {
                path: "/owner/suppliers",
                element: <Suppliers />,
              },
              {
                path: "/owner/add-suppliers",
                element: <AddSuppliers />,
              },
            ],
          },
          {
            path: "/staff",
            element: <StaffAuthGuard />,
            children: [
              {
                path: "/staff/dashboard",
                element: <StaffDashboard />,
              },
              {
                path: "/staff/products",
                element: <StaffAllProduct />,
              },
              {
                path: "/staff/stocks",
                element: <StaffStocks />,
              },
              {
                path: "/staff/suppliers",
                element: <StaffSuppliers />,
              },
            ],
          },
          {
            path: "/manager",
            element: <ManagerAuthGuard />,
            children: [
              {
                path: "/manager/dashboard",
                element: <ManagerDashboard />,
              },
              {
                path: "/manager/products",
                element: <AllProductManager />,
              },
              {
                path: "/manager/add-product",
                element: <AddProductManager />,
              },
              {
                path: "/manager/stocks",
                element: <StocksManager />,
              },
              {
                path: "/manager/suppliers",
                element: <SuppliersManager />,
              },
              {
                path: "/manager/add-suppliers",
                element: <AddSuppliersManager />,
              },
            ],
          },
        ])}
      ></RouterProvider>
      <Toaster position="bottom-right" />
    </ThemeProvider>
  );
}

export default App;
