import { Input } from "../../../components/ui/input";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import axios from "axios";
import React, { FC, useState } from "react";
import { useNavigate } from "react-router-dom";

interface RegisterFormInterface {
  showPassword: boolean;
  togglePasswordVisibility: () => void;
  handleSubmit: (e: React.FormEvent) => void;
  handleGoogleLogin: (response: CredentialResponse) => void;
  userEmail: string;
  setUserEmail: React.Dispatch<React.SetStateAction<string>>;
  userPassword: string;
  setUserPassword: React.Dispatch<React.SetStateAction<string>>;
  userName: string;
  setUserName: React.Dispatch<React.SetStateAction<string>>;
  firstName: string;
  setFirstName: React.Dispatch<React.SetStateAction<string>>;
  lastName: string;
  setLastName: React.Dispatch<React.SetStateAction<string>>;
}

const RegisterForm: FC<RegisterFormInterface> = ({
  showPassword,
  togglePasswordVisibility,
  handleSubmit,
  handleGoogleLogin,
  userEmail,
  setUserEmail,
  userPassword,
  setUserPassword,
  userName,
  setUserName,
  firstName,
  setFirstName,
  lastName,
  setLastName,
}) => {
  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-2 w-full max-w-md"
    >
      <div className="flex flex-col">
        <label htmlFor="firstname" className="mb-2 font-medium">
          First Name
        </label>
        <Input
          type="text"
          id="firstName"
          className="border p-2 rounded-lg outline-blue-200"
          placeholder="Enter your first name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />
      </div>

      <div className="flex flex-col">
        <label htmlFor="lastname" className="mb-2 font-medium">
          Last Name
        </label>
        <Input
          type="text"
          id="lastName"
          className="border p-2 rounded-lg outline-blue-200"
          placeholder="Enter your last name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
        />
      </div>

      <div className="flex flex-col">
        <label htmlFor="username" className="mb-2 font-medium">
          Username
        </label>
        <Input
          type="text"
          id="userName"
          className="border p-2 rounded-lg outline-blue-200"
          placeholder="Enter your username"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          required
        />
      </div>

      <div className="flex flex-col">
        <label htmlFor="email" className="mb-2 font-medium">
          Email
        </label>
        <Input
          type="email"
          id="userEmail"
          className="border p-2 rounded-lg outline-blue-200"
          placeholder="Enter your email"
          value={userEmail}
          onChange={(e) => setUserEmail(e.target.value)}
          required
        />
      </div>

      <div className="flex flex-col relative">
        <label htmlFor="password" className="mb-2 font-medium">
          Password
        </label>
        <Input
          type={showPassword ? "text" : "password"}
          id="userPassword"
          className="border p-2 rounded-lg outline-blue-200 pr-10"
          placeholder="Enter your password"
          value={userPassword}
          onChange={(e) => setUserPassword(e.target.value)}
          required
        />

        <button
          type="button"
          onClick={togglePasswordVisibility}
          className="absolute right-3 top-10 text-gray-500 hover:text-gray-700"
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

      <button className="bg-blue-500 p-2 rounded-lg text-white font-semibold hover:bg-blue-600">
        Sign up
      </button>
      <div className="flex flex-col items-center gap-2 mt-4">
        <p className="text-gray-500">Or Signup With</p>
        <GoogleLogin onSuccess={handleGoogleLogin} />
      </div>
      <div className="text-center mt-4">
        <p>
          Already have an account?{" "}
          <a href="/staff/login" className="text-blue-500 font-semibold">
            Login
          </a>
        </p>
      </div>
    </form>
  );
};

const StaffRegister: FC = () => {
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  const [userEmail, setUserEmail] = useState<string>("");
  const [userPassword, setUserPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  const handleGoogleLogin = (response: CredentialResponse) => {
    const { credential } = response;

    if (!credential) {
      throw new Error("no credentials");
    }

    axios
      .post("http://localhost:1212/staff/signup", {
        tokenId: credential,
      })
      .then((res) => {
        console.log(res.data);
        navigate("/staff/login");
      })
      .catch((error) => {
        console.error("Error during Google login:", error);
      });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      firstName,
      lastName,
      userName,
      userEmail,
      userPassword,
    };

    try {
      await axios.post("http://localhost:1212/staff/signup", payload);

      navigate("/staff/login");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 h-screen w-screen">
      <div className="hidden md:block md:col-span-7">
        <img
          src="/iventory.jpg"
          alt="inventory"
          className="h-full w-full object-cover rounded-r-3xl"
        />
      </div>
      <div className="col-span-1 md:col-span-5 flex flex-col items-center justify-center p-6">
        <h1 className="text-2xl font-bold mb-6">Create an account</h1>
        <RegisterForm
          showPassword={showPassword}
          togglePasswordVisibility={togglePasswordVisibility}
          handleSubmit={handleSubmit}
          handleGoogleLogin={handleGoogleLogin}
          userEmail={userEmail}
          setUserEmail={setUserEmail}
          userPassword={userPassword}
          setUserPassword={setUserPassword}
          userName={userName}
          setUserName={setUserName}
          firstName={firstName}
          setFirstName={setFirstName}
          lastName={lastName}
          setLastName={setLastName}
        />
      </div>
    </div>
  );
};

export default StaffRegister;
