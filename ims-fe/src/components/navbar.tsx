import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../components/ui/popover";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { ModeToggle } from "./mode-toggle";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Bell } from "lucide-react";

export default function Navbar() {
  interface User {
    userName: string;
    userEmail: string;
  }

  interface Product {
    _id: string;
    Name: string;
    Available: string;
    cleared: boolean;
  }

  const [user, setUser] = useState<User>();
  const [notifications, setNotifications] = useState<Product[]>([]);
  const navigate = useNavigate();

  // Fetch user details
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const token = localStorage.getItem("Authorization")?.split(" ")[1];
        if (!token) throw new Error("No token found");

        const response = await axios.get(
          "http://localhost:1212/owner/details",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setUser(response.data.userDetails);
      } catch (e) {
        console.log(e);
      }
    };

    fetchUserDetails();
    const interval = setInterval(fetchUserDetails, 20000);
    return () => clearInterval(interval);
  }, []);

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("Authorization");
    localStorage.removeItem("UserRole");
    navigate("/owner/login");
  };

  // Fetch notifications
  useEffect(() => {
    const getNotification = async () => {
      const token = localStorage.getItem("Authorization")?.split(" ")[1];
      if (!token) throw new Error("No authorization token");

      try {
        const response = await axios.get(
          "http://localhost:1212/owner/check-stocks",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        // Only set notifications that are not cleared
        const notificationsWithStatus = response.data.lowStocks.map(
          (notification: Product) => ({
            ...notification,
            cleared: false,
          })
        );

        setNotifications(notificationsWithStatus);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    getNotification();
    const interval = setInterval(getNotification, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex justify-between p-4 shadow-lg border-b">
      <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
        House of Nepal
      </h1>

      <div className="flex gap-2 items-center">
        <ModeToggle />

        <Popover>
          <PopoverTrigger>
            <Avatar>
              <AvatarFallback>{user?.userName.charAt(0)}</AvatarFallback>
            </Avatar>
          </PopoverTrigger>
          <PopoverContent>
            <div className="flex flex-col gap-2">
              <div>
                <p className="text-sm text-slate-600 dark:text-white">
                  Name: {user?.userName}
                </p>
                <p className="text-sm text-slate-600 dark:text-white">
                  Email: {user?.userEmail}
                </p>
              </div>
              <button
                className="bg-red-500 p-1 rounded-lg text-white hover:bg-red-400 text-sm"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
