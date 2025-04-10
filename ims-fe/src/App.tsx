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
                path: "/staff/add-products",
                element: <StaffAddProduct />,
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
        ])}
      ></RouterProvider>
      <Toaster position="bottom-right" />
    </ThemeProvider>
  );
}

export default App;
