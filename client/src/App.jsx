import { useState } from "react";
import "./App.css";
import { Routes, Route, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.bundle.js";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap-icons/font/bootstrap-icons.css";

import Dashboard from "./Dashboard/Dashboard";
import System from "./System/System";
import Layout from "./Component/Layout";

import Login from "./Login/Login";
import ProtectedRoute from "./Login/ProtectedRoutes";

function App() {
  const location = useLocation();
  const noNavbar =
    location.pathname === "/register" ||
    location.pathname === "/" ||
    location.pathname.includes("password");
  return (
    <>
      {/* <Navbar /> */}
      {/* <Routes> */}
      {/* <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/system" element={<System />} /> */}
      {/* <Route path="/" element={<Login />} /> */}
      {/* </Routes> */}
      {/* <Footer /> */}
      {noNavbar ? (
        <Routes>
          <Route path="/" element={<Login />} />
        </Routes>
      ) : (
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/system" element={<System />} />
            </Route>
          </Route>
        </Routes>
      )}
    </>
  );
}

export default App;
