import { Navigate, Outlet } from "react-router-dom";

const isAuthenticated = () => {
  return !!localStorage.getItem("Authorization");
};

const getUserRole = () => {
  return localStorage.getItem("UserRole");
};

const StaffAuthGuard = () => {
  return isAuthenticated() && getUserRole() === "staff" ? (
    <Outlet />
  ) : (
    <Navigate to="/staff/login" />
  );
};

export default StaffAuthGuard;
