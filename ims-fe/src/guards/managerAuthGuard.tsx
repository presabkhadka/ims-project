import { Navigate, Outlet } from "react-router-dom";

const isAuthenticated = () => {
  return !!localStorage.getItem("Authorization");
};

const getUserRole = () => {
  return localStorage.getItem("UserRole");
};

const ManagerAuthGuard = () => {
  return isAuthenticated() && getUserRole() === "manager" ? (
    <Outlet />
  ) : (
    <Navigate to="/manager/login" />
  );
};

export default ManagerAuthGuard;
