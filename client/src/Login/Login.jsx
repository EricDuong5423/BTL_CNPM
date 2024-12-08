import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
// import AxiosInstance from "../components/AxiosInstance";
import AxiosInstance from "../Component/AxiosInstance";
import { toast } from "react-toastify";
import "../Login/Login.css"
import img1 from "../Login/LogImg.png"

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
    // console.log("username: ", email);
    // console.log("password: ", password);

    AxiosInstance.post(`users/login/`, {
      username: email,
      password: password,
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
    <div className = "containerDB">
      <div className = "left">
        <div className = "Login_Frame">
          <p className = "Login_Title">Smart Printing Service</p>
          <form onSubmit={handleSubmit}>

            {/* Email Field */}
            <div className="Login_Username_Field">
              <label htmlFor="email"> 
                Tên đăng nhập:
              </label>
              <input className="Login_Username_Field_Input form-control" id="email" placeholder="Nhập tên đăng nhập" 
                value={email} onChange={handleEmailChange} required
              />
            </div>

            {/* Password Field */}
            <div className="Login_Password_Field">
              <label htmlFor="password" className=" form-label">
                Mật khẩu
              </label>
              <input
                type="password"
                className="form-control Login_Password_Field_Input"
                id="password"
                placeholder="Nhập mật khẩu"
                value={password}
                onChange={handlePasswordChange}
                required
              />
            </div>

            {/* Submit Button */}
            <div className="Login_Submit">
              <button
                type="submit"
                className="btn btn-primary w-100 Login_Submit_Button"
                disabled={loading} // Disable button khi đang loading
              >
                {loading ? "Đang đăng nhập..." : "Đăng nhập"}
              </button>
            </div>

            {/* Forgot Password Link */}
            <div className="text-center Forget_Pass_Button">
              <Link to="/request/password_reset" className="text-decoration-none  Forget_Pass">
                Quên mật khẩu? Tại đây!
              </Link>
            </div>

          </form>

        </div>
      </div>

      <div className = "right">
        <img className = "Image_Edit" src={img1} alt="" />
      </div>
  </div>
  );
};

export default Login;