import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import AOS from "aos";
import "aos/dist/aos.css";
import { FaGoogle } from "react-icons/fa";
import { AiOutlineLock, AiOutlineMail, AiOutlineUser } from "react-icons/ai";
import bg from "../../assets/images/loginbg.png";
import icon from "../../assets/images/loginIcon.svg";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  showErrorToast,
  showLoadingToast,
  showSuccessToast,
} from "../../assets/toastConfig";

function Login() {
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;
  const [activeForm, setActiveForm] = useState("login"); // "login" or "register"
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    AOS.init({
      duration: 300,
      easing: "ease-in-out",
      once: true,
    });
  }, []);

  const onLoginSubmit = async (data) => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/user/login",
        data
      );
      localStorage.setItem("isLogin", true);
      showSuccessToast(res.data);
      navigate("/home");
    } catch (error) {
      if (error.response) {
        showErrorToast(error.response.data);
      } else {
        showErrorToast("An unexpected error occurred");
      }
    }
  };

  const onRegisterSubmit = async (data) => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/user/register",
        data
      );
      localStorage.setItem("isLogin", true);
      showSuccessToast(res.data);
      navigate("/home");
    } catch (error) {
      if (error.response) {
        showErrorToast(error.response.data);
      } else {
        showErrorToast("An unexpected error occurred");
      }
    }
  };

  const handleFormSwitch = (formType) => {
    setActiveForm(formType);
    reset(); // Clear form data when switching forms
  };

  return (
    <div className="w-screen h-screen flex justify-center items-center flex-col md:flex-row">
      {/* Background Image Section */}
      <div
        className="hidden lg:flex w-full md:w-[60%] h-full"
        data-aos="fade-right"
      >
        <img className="h-full w-full object-cover" src={bg} alt="Background" />
      </div>

      {/* Form Section */}
      <div
        className="w-full lg:w-[40%] flex items-center justify-center p-4 md:p-8"
        data-aos="fade-up"
      >
        <div
          className="w-full max-w-md p-8 shadow-lg rounded-lg bg-white"
          data-aos="zoom-in"
        >
          {/* Logo or Icon */}
          <div className="flex justify-center mb-8" data-aos="fade-down">
            <div className="w-16 h-16 flex items-center justify-center">
              <img src={icon} alt="Icon" />
            </div>
          </div>

          {activeForm === "login" && (
            <>
              <h2
                className="text-3xl font-bold text-center mb-2"
                style={{ color: "#7F265B" }}
                data-aos="fade-up"
              >
                Login to your Account
              </h2>
              <p
                className="text-gray-600 text-center mb-6"
                data-aos="fade-up"
                data-aos-delay="200"
              >
                Stay connected
              </p>
              <form
                onSubmit={handleSubmit(onLoginSubmit)}
                data-aos="fade-up"
                data-aos-delay="800"
              >
                <div className="mb-5 relative">
                  <AiOutlineMail className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500 text-xl" />
                  <input
                    type="email"
                    placeholder="Email Address"
                    {...register("email", { required: true })}
                    className="w-full border border-gray-300 rounded-md px-10 py-3 mt-1 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#7F265B] focus:border-[#7F265B]"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">
                      Email Address is required
                    </p>
                  )}
                </div>
                <div className="mb-5 relative">
                  <AiOutlineLock className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500 text-xl" />
                  <input
                    type="password"
                    placeholder="Password"
                    {...register("password", { required: true })}
                    className="w-full border border-gray-300 rounded-md px-10 py-3 mt-1 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#7F265B] focus:border-[#7F265B]"
                  />
                  {errors.password && (
                    <p className="text-red-500 text-sm mt-1">
                      Password is required
                    </p>
                  )}
                </div>
                <div className="mb-6">
                  <a
                    href="#"
                    className="text-sm font-medium hover:underline float-right"
                    style={{ color: "#7F265B" }}
                  >
                    Forgot Password?
                  </a>
                </div>
                <button
                  type="submit"
                  className="w-full py-3 rounded-md text-white shadow-md hover:shadow-lg transition duration-200"
                  style={{ backgroundColor: "#7F265B" }}
                >
                  Login
                </button>
              </form>
              <p className="text-center text-gray-600 mt-8" data-aos="fade-up">
                Not Registered Yet?{" "}
                <a
                  href="#"
                  onClick={() => handleFormSwitch("register")}
                  className="font-medium hover:underline"
                  style={{ color: "#7F265B" }}
                >
                  Create an account
                </a>
              </p>
            </>
          )}

          {activeForm === "register" && (
            <>
              <h2
                className="text-3xl font-bold text-center mb-2"
                style={{ color: "#7F265B" }}
                data-aos="fade-up"
              >
                Create an Account
              </h2>
              <p
                className="text-gray-600 text-center mb-6"
                data-aos="fade-up"
                data-aos-delay="200"
              >
                Join to explore more
              </p>
              <form
                onSubmit={handleSubmit(onRegisterSubmit)}
                data-aos="fade-up"
                data-aos-delay="800"
              >
                <div className="mb-5 relative">
                  <AiOutlineUser className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500 text-xl" />
                  <input
                    type="text"
                    placeholder="Full Name"
                    {...register("name", { required: true })}
                    className="w-full border border-gray-300 rounded-md px-10 py-3 mt-1 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#7F265B] focus:border-[#7F265B]"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">
                      Full Name is required
                    </p>
                  )}
                </div>
                <div className="mb-5 relative">
                  <AiOutlineMail className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500 text-xl" />
                  <input
                    type="email"
                    placeholder="Email Address"
                    {...register("email", { required: true })}
                    className="w-full border border-gray-300 rounded-md px-10 py-3 mt-1 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#7F265B] focus:border-[#7F265B]"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">
                      Email Address is required
                    </p>
                  )}
                </div>
                <div className="mb-5 relative">
                  <AiOutlineLock className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500 text-xl" />
                  <input
                    type="password"
                    placeholder="Password"
                    {...register("password", { required: true, minLength: 6 })}
                    className="w-full border border-gray-300 rounded-md px-10 py-3 mt-1 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#7F265B] focus:border-[#7F265B]"
                  />
                  {errors.password && (
                    <p className="text-red-500 text-sm mt-1">
                      Password must be at least 6 characters
                    </p>
                  )}
                </div>
                <button
                  type="submit"
                  className="w-full py-3 rounded-md text-white shadow-md hover:shadow-lg transition duration-200"
                  style={{ backgroundColor: "#7F265B" }}
                >
                  Register
                </button>
              </form>
              <p className="text-center text-gray-600 mt-8" data-aos="fade-up">
                Already have an account?{" "}
                <a
                  href="#"
                  onClick={() => handleFormSwitch("login")}
                  className="font-medium hover:underline"
                  style={{ color: "#7F265B" }}
                >
                  Login
                </a>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Login;
