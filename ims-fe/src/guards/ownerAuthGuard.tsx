import { Navigate, Outlet } from "react-router-dom";

const isAuthenticated = () => {
  return !!localStorage.getItem("Authorization");
};

const getUserRole = () => {
  return localStorage.getItem("UserRole");
};

const OwnerAuthGuard = () => {
  return isAuthenticated() && getUserRole() === "owner" ? (
    <Outlet />
  ) : (
    <Navigate to="/owner/login" />
  );
};

export default OwnerAuthGuard;
