import React, { useState } from "react";
import { AiOutlineUser } from "react-icons/ai";
import { HiOutlineMenuAlt3 } from "react-icons/hi";
import { IoClose } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { showSuccessToast } from "../toastConfig";
import axios from "axios";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
const MySwal = withReactContent(Swal);

function Navbar() {
  axios.defaults.withCredentials = true;
  const [isMenuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    MySwal.fire({
      title: "Are you sure?",
      text: "You will be logged out.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#FF902B",
      cancelButtonColor: "#7A623F",
      confirmButtonText: "Yes, logout",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await axios.get("http://localhost:5000/api/user/logout");
          if (res.status === 200) {
            localStorage.removeItem("isLogin");
            window.location.reload();
            showSuccessToast("Logged out successfully");
          }
        } catch (error) {
          console.log(error);
        }
      }
    });
  };

  return (
    <nav
      className="sticky top-0 flex items-center justify-between px-6 py-4 bg-[#FDF4E8] "
      style={{ zIndex: 100 }}
    >
      {/* Logo */}
      <div
        className="text-2xl cursor-pointer pl-8 font-bold text-[#FF902B]"
        onClick={() => navigate("/home")}
      >
        BuyAndSell
      </div>

      {/* Desktop Links */}
      <ul className="hidden md:flex space-x-8 text-lg text-[#7A623F] font-medium">
        <li
          className="hover:text-[#FF902B] cursor-pointer transition duration-300"
          onClick={() => navigate("/home")}
        >
          Home
        </li>
        <li
          className="hover:text-[#FF902B] cursor-pointer transition duration-300"
          onClick={() => navigate("/sell")}
        >
          <a href="#delivery">Sell</a>
        </li>
        <li className="hover:text-[#FF902B] cursor-pointer transition duration-300">
          <a
            href="https://github.com/ATIKSH09"
            target="_blank"
            rel="noreferrer"
          >
            About Me
          </a>
        </li>
      </ul>

      {/* Profile and Login Buttons */}
      <div className="hidden md:flex items-center gap-4">
        <button
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#FF902B] text-white font-medium shadow-md hover:bg-[#e07e26] hover:shadow-lg transition duration-300"
          onClick={() => navigate("/profile")}
        >
          <AiOutlineUser size={20} />
          Profile
        </button>
        {!localStorage.getItem("isLogin") ? (
          <button
            className="px-6 py-2 rounded-full border border-[#FF902B] text-[#FF902B] font-medium hover:bg-[#FF902B] hover:text-white shadow-md transition duration-300"
            onClick={() => navigate("/login")}
          >
            Login
          </button>
        ) : (
          <button
            className="px-6 py-2 rounded-full border border-[#FF902B] text-[#FF902B] font-medium hover:bg-[#FF902B] hover:text-white shadow-md transition duration-300"
            onClick={handleLogout}
          >
            Logout
          </button>
        )}
      </div>

      {/* Hamburger Menu (Mobile) */}
      <div className="md:hidden">
        <HiOutlineMenuAlt3
          size={28}
          className={`text-[#7A623F] cursor-pointer transform transition-transform duration-300 ${
            isMenuOpen ? "rotate-90" : "rotate-0"
          }`}
          onClick={() => setMenuOpen(!isMenuOpen)}
        />
      </div>

      {/* Mobile Menu */}
      <div
        className={`fixed top-0 right-0 w-4/5 max-w-sm h-screen bg-[#FDF4E8] shadow-lg transition-transform transform ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ zIndex: 200 }}
      >
        <div className="flex items-center justify-between px-6 py-4">
          <div className="text-2xl font-bold text-[#FF902B]">Menu</div>
          <IoClose
            size={28}
            className="text-[#7A623F] cursor-pointer"
            onClick={() => setMenuOpen(false)}
          />
        </div>
        <ul className="mt-10 space-y-6 text-lg text-center font-medium">
          <li className="hover:text-[#FF902B] transition duration-300">
            <a
              href="#about"
              onClick={() => {
                setMenuOpen(false);
              }}
            >
              About Us
            </a>
          </li>
          <li className="hover:text-[#FF902B] transition duration-300">
            <a
              href="#home"
              onClick={() => {
                setMenuOpen(false);
                navigate("/home");
              }}
            >
              Home
            </a>
          </li>
          <li className="hover:text-[#FF902B] transition duration-300">
            <a
              href="#delivery"
              onClick={() => {
                setMenuOpen(false);
              }}
            >
              Delivery
            </a>
          </li>
          <li className="hover:text-[#FF902B] transition duration-300">
            <a
              href="#profile"
              onClick={() => {
                setMenuOpen(false);
                navigate("/profile");
              }}
            >
              Profile
            </a>
          </li>
          {!localStorage.getItem("isLogin") ? (
            <li
              className="hover:text-[#FF902B] transition duration-300"
              onClick={() => {
                setMenuOpen(false);
                navigate("/login");
              }}
            >
              Login
            </li>
          ) : (
            <li
              className="hover:text-[#FF902B] transition duration-300"
              onClick={() => {
                setMenuOpen(false);
                handleLogout();
              }}
            >
              Logout
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
