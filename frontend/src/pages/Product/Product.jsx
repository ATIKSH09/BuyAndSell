import React, { useEffect, useState } from "react";
import Navbar from "../../assets/Components/Navbar";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import AOS from "aos";
import "aos/dist/aos.css";
import classNames from "classnames";
import { showErrorToast } from "../../assets/toastConfig";

const MySwal = withReactContent(Swal);

const ProductPage = () => {
  axios.defaults.withCredentials = true;
  const id = useParams().id;
  const navigate = useNavigate();
  const [ProductData, setProductData] = useState([]);
  const [shake, setShake] = useState(false);

  const sendBuyRequest = async () => {
    if (id === "678d12015ad8442d7378227b") {
      // Trigger prank: shake effect
      setShake(true);

      setTimeout(() => {
        setShake(false); // Stop shaking after 2 seconds
        MySwal.fire({
          title: "Fuck Yourself! ",
          text: "This Property belong to Daddy ATIKSH!!",
          icon: "error",
          confirmButtonColor: "#FF902B",
        });
      }, 2000);
    } else {
      try {
        const isLogin = await axios.get(
          "http://localhost:5000/api/user/checkLogin"
        );
        if (isLogin.status === 200) {
          MySwal.fire({
            title: "Are you sure?",
            text: "Your buy request will be sent to the owner.",
            icon: "question",
            iconColor: "#ff912b",
            showCancelButton: true,
            confirmButtonColor: "#FF902B",
            cancelButtonColor: "#7A623F",
            confirmButtonText: "Yes",
            cancelButtonText: "Cancel",
          }).then(async (result) => {
            if (result.isConfirmed) {
              try {
                const res = await axios.post(
                  `http://localhost:5000/api/user/sendBuyRequest/${id}`
                );
                if (res.status === 200) {
                  Swal.fire(
                    "Success!",
                    "Order request sent successfully.",
                    "success"
                  );
                  navigate("/profile/requests");
                }
              } catch (error) {
                if (error.response.status === 409) {
                  showErrorToast("you can't buy your own item");
                }
                console.error(error);
              }
            }
          });
        }
      } catch (error) {
        Swal.fire("Error", "Please login to continue.", "error");
        navigate("/login");
      }
    }
  };

  useEffect(() => {
    AOS.init({ duration: 400, once: true }); // Initialize AOS with desired settings

    const fetchProductData = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/item/getSpecificItem/${id}`
        );
        setProductData(res.data);
      } catch (error) {
        Swal.fire("Error", "Product already sold or not available.", "error");
        navigate("/home");
      }
    };

    fetchProductData();
  }, [id, navigate]);

  return (
    <div
      className={classNames(
        "min-h-screen bg-gradient-to-r from-[#FDF4E8] to-[#FFF3E0]",
        { shake: shake } // Apply shake effect conditionally
      )}
    >
      <Navbar />
      <div className="flex flex-col lg:flex-row md:gap-x-8 max-w-screen-lg mx-auto h-full p-4 md:p-8">
        {/* Image Section */}
        <div
          className="flex-1 flex justify-center items-center p-4"
          data-aos="fade-right"
        >
          <img
            src={ProductData.image}
            alt={ProductData.name}
            className="h-64 sm:h-80 md:h-96 object-contain rounded-md max-w-full"
          />
        </div>

        {/* Details Section */}
        <div className="flex-1 p-4 space-y-6" data-aos="fade-left">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#7A623F]">
            {ProductData.name && ProductData.name.toUpperCase()}
          </h1>
          <p className="text-xl sm:text-2xl flex items-center font-bold text-[#FF902B]">
            ₹ {ProductData.price}
          </p>
          <p className="text-gray-600 text-base sm:text-lg">
            {ProductData.description}
          </p>
          <ul
            className="list-disc pl-6 text-gray-700 space-y-1"
            data-aos="fade-up"
          >
            {ProductData.categories &&
              ProductData.categories.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
          </ul>

          {/* Seller Details */}
          <div
            className="mt-6 p-6 bg-white rounded-lg shadow-md"
            data-aos="zoom-in"
          >
            <h2 className="text-xl sm:text-2xl font-semibold text-[#7A623F] mb-4">
              Seller Details
            </h2>
            <p className="text-gray-800 flex items-center mb-2">
              <strong>Name:</strong>{" "}
              {ProductData.seller && ProductData.seller.name}
            </p>
            <p className="text-gray-800 flex items-center">
              <strong>Email:</strong>{" "}
              {ProductData.seller && ProductData.seller.email}
            </p>
          </div>

          {/* Buttons */}
          <div
            className="flex justify-center md:justify-start space-x-4"
            data-aos="fade-up"
          >
            <button
              className="px-6 py-2 rounded-full border border-[#FF902B] hover:bg-[#e07e26] hover:shadow-lg transition duration-300 font-medium bg-[#FF902B] text-white shadow-md"
              onClick={sendBuyRequest}
            >
              Order Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
