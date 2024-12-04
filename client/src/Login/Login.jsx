import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
// import AxiosInstance from "../components/AxiosInstance";
import AxiosInstance from "../Component/AxiosInstance";
import { toast } from "react-toastify";
import "../App.css";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    const loadingToastId = toast.loading("Logging in...");
    console.log("username: ", email);
    console.log("password: ", password);

    AxiosInstance.post(`users/login/`, {
      // username: email,
      // password: password,
      // realName: "Khoa",
    })
      .then((response) => {
        console.log(response);
        localStorage.setItem("Token", response.data.token);
        navigate(`/system`);
        toast.success("Login successful!");
      })
      .catch((error) => {
        console.error("Error during login", error);
        toast.error("Error during login");
      })
      .finally(() => {
        toast.dismiss(loadingToastId); // Dismiss loading toast
        setLoading(false);
      });
  };

  return (
    <div className="myBackground d-flex justify-content-center align-items-center vh-100">
      <form className="p-4 rounded shadow whiteBox" onSubmit={handleSubmit}>
        <div className="text-center mb-4">
          <h3 className="fw-bold">LOGIN PAGE</h3>
        </div>

        {/* Email Field */}
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input
            type="email"
            className="form-control"
            id="email"
            placeholder="Enter your email"
            value={email}
            onChange={handleEmailChange}
            required
          />
        </div>

        {/* Password Field */}
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            type="password"
            className="form-control"
            id="password"
            placeholder="Enter your password"
            value={password}
            onChange={handlePasswordChange}
            required
          />
        </div>

        {/* Submit Button */}
        <div className="mb-3">
          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={loading} // Disable button khi đang loading
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </div>

        {/* Forgot Password Link */}
        <div className="text-center">
          <Link to="/request/password_reset" className="text-decoration-none">
            Forgot your password? Click here!
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
