import { Input } from "../../../components/ui/input";
import axios from "axios";
import { FC, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";

interface LoginFormProps {
  showPassword: boolean;
  togglePasswordVisibility: () => void;
  handleSubmit: (e: React.FormEvent) => void;
  email: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  password: string;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
}

const LoginForm: FC<LoginFormProps> = ({
  showPassword,
  togglePasswordVisibility,
  handleSubmit,
  email,
  setEmail,
  password,
  setPassword,
}) => {
  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 w-full max-w-md"
    >
      <div className="flex flex-col">
        <label htmlFor="email" className="mb-2 font-medium">
          Email
        </label>
        <Input
          type="email"
          id="email"
          className="border p-2 rounded-lg"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="flex flex-col relative">
        <label htmlFor="password" className="mb-2 font-medium">
          Password
        </label>
        <Input
          type={showPassword ? "text" : "password"}
          id="password"
          className="border p-2 rounded-lg pr-10"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="button"
          onClick={togglePasswordVisibility}
          className="absolute right-3 top-10 text-gray-500 hover:text-gray-700"
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
              />
            </svg>
          )}
        </button>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <input type="checkbox" id="rememberme" className="scale-125" />
          <label htmlFor="rememberme" className="text-sm">
            Remember Me
          </label>
        </div>
        <a href="#" className="text-red-500 text-sm">
          Forgot Password?
        </a>
      </div>

      <button
        type="submit"
        className="bg-blue-500 p-2 rounded-lg text-white font-semibold hover:bg-blue-600"
      >
        Login
      </button>

      <div className="text-center mt-4">
        <p>
          Don't have an account?{" "}
          <a href="/manager/signup" className="text-blue-500 font-semibold">
            Sign Up
          </a>
        </p>
      </div>
    </form>
  );
};

const ManagerLogin: FC = () => {
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:1212/manager/login", {
        userEmail,
        userPassword,
      });
      const { token } = response.data;
      localStorage.setItem("Authorization", `Bearer ${token}`);
      localStorage.setItem("UserRole", "manager");
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      toast.success("Logged in successfully!");
      navigate("/manager/dashboard");
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.msg || "Invalid credentials. Please try again.";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 h-screen w-screen">
      <div className="hidden md:block md:col-span-7">
        <img
          src="/cloth.jpg"
          alt="cloth"
          className="h-full w-full object-cover rounded-r-3xl"
        />
      </div>
      <div className="col-span-1 md:col-span-5 flex flex-col items-center justify-center p-6">
        <h1 className="text-2xl font-bold mb-6">Hi, Welcome Back! 👋</h1>
        <LoginForm
          showPassword={showPassword}
          togglePasswordVisibility={togglePasswordVisibility}
          email={userEmail}
          setEmail={setUserEmail}
          password={userPassword}
          setPassword={setUserPassword}
          handleSubmit={handleSubmit}
        />
      </div>
    </div>
  );
};

export default ManagerLogin;
