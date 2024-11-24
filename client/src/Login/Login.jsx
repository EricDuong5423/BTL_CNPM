import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
// import AxiosInstance from "../components/AxiosInstance";
import { toast } from "react-toastify";
import "../App.css";

const Login = () => {
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm(); // Sử dụng `register` thay vì `control`
  const [loading, setLoading] = useState(false);

  const submission = (data) => {
    setLoading(true);
    const loadingToastId = toast.loading("Logging in...");
    AxiosInstance.post(`login/`, {
      email: data.email,
      password: data.password,
    })
      .then((response) => {
        console.log(response);
        localStorage.setItem("Token", response.data.token);
        navigate(`/home`);
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
      <form
        className="p-4 rounded shadow whiteBox"
        onSubmit={handleSubmit(submission)}
      >
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
            {...register("email", { required: true })}
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
            {...register("password", { required: true })}
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
