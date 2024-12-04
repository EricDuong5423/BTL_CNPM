import React, { useEffect, useState, useRef } from "react";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import AxiosInstance from "./AxiosInstance";

export default function Navbar() {
  const navigate = useNavigate();
  const handleLogout = () => {
    const token = localStorage.getItem("Token");
    AxiosInstance.post(`users/logout/`, { token: token })
      .then(() => {
        localStorage.removeItem("Token");
        navigate("/");
        toast.success("Logged out successfully!");
      })
      .catch((error) => {
        toast.error("An error occurred while logging out!");
        console.error("Error logging out:", error);
      });
  };
  return (
    <>
      <nav
        className="navbar sticky-top navbar-expand-lg"
        style={{ backgroundColor: "#9FCDE8" }}
      >
        <div className="container-fluid" style={{ width: "100%" }}>
          <div className="col">
            <a
              className="navbar-brand fs-4 fw-bold"
              style={{ color: "#3A4163" }}
              href="#"
            >
              Smart Printing Service
            </a>
          </div>

          <div className="col-6">
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav">
                <li
                  className="nav-item"
                  onClick={() => {
                    navigate("/dashboard");
                  }}
                >
                  <a className="nav-link" href="#">
                    Tổng Quan
                  </a>
                </li>
                <li
                  className="nav-item"
                  onClick={() => {
                    navigate("/system");
                  }}
                >
                  <a className="nav-link" href="#">
                    Hệ Thống
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#">
                    Hiệu Chỉnh Giấy
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#">
                    Lịch Sử
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#">
                    Liên Hệ
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="col">
            <button
              className="btn btn text-white"
              style={{ backgroundColor: "#3A4163" }}
              onClick={handleLogout}
            >
              Đăng Xuất
            </button>
          </div>
        </div>
      </nav>
    </>
  );
}
