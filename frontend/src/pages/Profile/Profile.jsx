import React, { useEffect, useState } from "react";
import Navbar from "../../assets/Components/Navbar";
import AOS from "aos";
import axios from "axios";
import "aos/dist/aos.css";
import { useNavigate } from "react-router-dom";
import { showSuccessToast, showErrorToast } from "../../assets/toastConfig";

function ProfilePage() {
  axios.defaults.withCredentials = true;
  const navigate = useNavigate();
  const [userData, setUserData] = useState({});
  const getProfile = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/user/getProfile");
      setUserData(res.data);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        showErrorToast("Please Login First");
        navigate("/login");
      }
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    getProfile();
    AOS.init({ duration: 500 }); // Initialize AOS with a duration of 500ms
  }, []);

  return (
    <div>
      <Navbar />

      <div className="min-h-screen bg-[#FDF4E8] text-[#7A623F] px-4 md:px-8">
        {/* Profile Header */}
        <div
          className="max-w-4xl mx-auto bg-white p-6 md:p-8 rounded-xl shadow-lg"
          data-aos="fade-up"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Profile Info */}
            <div
              className="flex flex-col items-center md:items-start text-center md:text-left"
              data-aos="fade-up"
            >
              <img
                src="https://th.bing.com/th/id/OIP.0MDI4C27d7_8TkC08Su-wgHaHa?rs=1&pid=ImgDetMain"
                alt="Profile Avatar"
                className="w-24 h-24 md:w-32 md:h-32 rounded-full shadow-lg border-4 border-[#FF902B]"
              />
              <h2 className="text-xl md:text-2xl font-bold mt-4">
                {userData.name || "Your Name"}
              </h2>
              <h3 className="text-base md:text-lg text-gray-600">
                {userData.email || "Your Email"}
              </h3>
              <h3 className="text-xs md:text-lg text-gray-600">
                Member Since{" "}
                {userData.since &&
                  new Date(userData.since).toISOString().split("T")[0]}
              </h3>
            </div>

            {/* Buttons */}
            <div
              className="flex flex-col w-full md:w-auto md:items-end gap-4 mt-6 md:mt-0"
              data-aos="fade-up"
            >
              <button className="px-4 py-2 md:px-6 md:py-3 bg-[#FF902B] text-white rounded-full font-semibold hover:bg-[#e38228] shadow-md hover:shadow-lg transition duration-300"
              onClick={() => navigate("/profile/requests")}
              >
                Requests
              </button>
              <button
                className="px-4 py-2 md:px-6 md:py-3 bg-[#FF902B] text-white rounded-full font-semibold hover:bg-[#e38228] shadow-md hover:shadow-lg transition duration-300"
                onClick={() => navigate("/sell")}
              >
                Sell an Item
              </button>
              <button className="px-4 py-2 md:px-6 md:py-3 bg-[#FF902B] text-white rounded-full font-semibold hover:bg-[#e38228] shadow-md hover:shadow-lg transition duration-300">
                Edit Profile
              </button>
            </div>
          </div>
        </div>

        {/* Items Purchased */}
        <div className="max-w-4xl mx-auto mt-12" data-aos="fade-up">
          <h2 className="text-xl md:text-2xl font-semibold mb-4 text-center md:text-left">
            Items Purchased
          </h2>
          {userData.purchased && userData.purchased.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
              {userData.purchased.map((item) => (
                <div
                  key={item.id}
                  className="p-4 bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-xl transition-shadow duration-300"
                >
                  <h3 className="text-lg md:text-xl font-bold">{item.name}</h3>
                  <p className="text-sm md:text-base text-gray-600">
                    Price: {item.price}
                  </p>
                  {item.soldOn && (
                    <p className="text-xs md:text-sm text-gray-400 mt-1">
                      Purchased on: {new Date(item.soldOn).toISOString().split("T")[0]}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">No items purchased yet.</p>
          )}
        </div>

        {/* items in progress */}

        <div className="max-w-4xl mx-auto mt-12" data-aos="fade-up">
          <h2 className="text-xl md:text-2xl font-semibold mb-4 text-center md:text-left">
            Items Added
          </h2>
          {userData.inProgress && userData.inProgress.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
              {userData.inProgress.map((item) => (
                <div
                  key={item.id}
                  className="p-4 bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-xl transition-shadow duration-300"
                >
                  <h3 className="text-lg md:text-xl font-bold">{item.name}</h3>
                  <p className="text-sm md:text-base text-gray-600">
                    Price: {item.price}
                  </p>
                  {item.addedon && (
                    <p className="text-xs md:text-sm text-gray-400 mt-1">
                      Added On: {new Date(item.addedon).toISOString().split("T")[0]}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">
              Currently no Added items.
            </p>
          )}
        </div>

        {/* Items Sold */}
        <div className="max-w-4xl mx-auto mt-12">
          <h2 className="text-xl md:text-2xl font-semibold mb-4 text-center md:text-left">
            Items Sold
          </h2>
          {userData.sold && userData.sold.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
              {userData.sold.map((item, index) => (
                <div
                  key={index}
                  className="p-4 bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-xl transition-shadow duration-300"
                >
                  <h3 className="text-lg md:text-xl font-bold">{item.name}</h3>
                  <p className="text-sm md:text-base text-gray-600">
                    Price: {item.price}
                  </p>
                  {item.soldOn && (
                    <p className="text-xs md:text-sm text-gray-400 mt-1">
                      Sold on: {new Date(item.soldOn).toISOString().split("T")[0]}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">No items sold yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
