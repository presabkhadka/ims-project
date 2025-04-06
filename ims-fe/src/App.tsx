import { createBrowserRouter, RouterProvider } from "react-router-dom";
import OwnerLogin from "./pages/auth/owner/ownerLogin";
import OwnerRegister from "./pages/auth/owner/ownerRegister";
import OwnerAuthGuard from "./guards/ownerAuthGuard";
import OwnerDashboard from "./pages/views/owner/ownerDashboard";
import StaffAuthGuard from "./guards/staffAuthGuard";
import StaffDashboard from "./pages/views/staff/staffDashboard";
import StaffLogin from "./pages/auth/staff/staffLogin";
import StaffRegister from "./pages/auth/staff/staffRegister";

function App() {
  return (
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
          ],
        },
      ])}
    ></RouterProvider>
  );
}

export default App;
