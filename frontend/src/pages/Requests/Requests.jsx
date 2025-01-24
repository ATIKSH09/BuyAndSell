import React, { useEffect, useState } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import Navbar from "../../assets/Components/Navbar";
import AOS from "aos";
import "aos/dist/aos.css";
import { showErrorToast, showSuccessToast } from "../../assets/toastConfig";
import axios, { all } from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
const MySwal = withReactContent(Swal);

function RequestsPage() {
  axios.defaults.withCredentials = true;

  const navigate = useNavigate();
  const [incomingRequests, setincomingRequests] = useState([]);
  const [outgoingRequests, setoutgoingRequests] = useState([]);

  const getRequests = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/user/getRequests");
      setincomingRequests(res.data.incomingRequests);
      setoutgoingRequests(res.data.outgoingRequests);
    } catch (error) {
      console.log(error);
    }
  };

  const acceptRequest = async (id, wish) => {
    if (wish == "Declined") {
      try {
        const result = await MySwal.fire({
          title: "Are you sure?",
          text: "Are you sure you want to decline this request?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#FF902B",
          cancelButtonColor: "#7A623F",
          confirmButtonText: "Yes",
          cancelButtonText: "Cancel",
        });

        if (result.isConfirmed) {
          const res = await axios.post(
            `http://localhost:5000/api/user/acceptRequest/${id}`,
            {
              status: "Declined",
            }
          );
          showSuccessToast("Request Declined");
          getRequests();
        }
      } catch (error) {
        console.error("error");
      }
    } else {
      MySwal.fire({
        title: "Write Your Message to be sent to the Buyer",
        input: "textarea",
        inputPlaceholder: "Type your message here...",
        icon: "info",
        showCancelButton: true,
        confirmButtonColor: "#FF902B",
        cancelButtonColor: "#7A623F",
        confirmButtonText: "Send",
        cancelButtonText: "Cancel",
        inputAttributes: {
          "aria-label": "Type your message here",
        },
      }).then(async (result) => {
        if (result.isConfirmed && result.value) {
          try {
            const res = await axios.post(
              `http://localhost:5000/api/user/acceptRequest/${id}`,
              {
                message: result.value,
                status: "Accepted",
              }
            );
            showSuccessToast("Request Accepted");
            getRequests();
          } catch (error) {
            console.error(error);
            showErrorToast("Failed to accept request");
          }
        }
      });
    }
  };

  useEffect(() => {
    AOS.init({ duration: 600, once: true }); // Initialize AOS animations
  }, []);

  useEffect(() => {
    const checkLogin = async () => {
      try {
        await axios.get("http://localhost:5000/api/user/checkLogin");
        getRequests();
      } catch (error) {
        console.error(error);
        showErrorToast("Please Login First");
        navigate("/login");
      }
    };
    checkLogin();
  }, []);

  return (
    <div className="bg-[#FDF4E8] min-h-screen">
      <Navbar />
      <div className="container mx-auto py-8 px-4" data-aos="fade-up">
        <h1 className="text-3xl font-bold text-[#FF902B] mb-6 text-center">
          Manage Your Requests
        </h1>
        <Tabs className="bg-white shadow-lg rounded-lg p-6">
          <TabList className="flex justify-center border-b mb-4">
            <Tab
              className="cursor-pointer text-[#7A623F] px-4 py-2 font-semibold border-b-2 border-transparent hover:border-[#FF902B] focus:outline-none"
              selectedClassName="border-[#FF902B] text-[#FF902B]"
            >
              Incoming Requests ({incomingRequests.length})
            </Tab>
            <Tab
              className="cursor-pointer text-[#7A623F] px-4 py-2 font-semibold border-b-2 border-transparent hover:border-[#FF902B] focus:outline-none"
              selectedClassName="border-[#FF902B] text-[#FF902B]"
            >
              Outgoing Requests ({outgoingRequests.length})
            </Tab>
          </TabList>

          {/* Incoming Requests */}
          <TabPanel>
            {incomingRequests.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {incomingRequests.map((req, index) => (
                  <div
                    key={index}
                    className="border rounded-lg p-4 shadow-md bg-[#FFFAF3]"
                  >
                    <h3 className="text-lg font-bold text-[#7A623F]">
                      {req.item.name}
                    </h3>
                    <p className="text-gray-600">Price: {req.item.price}</p>
                    <p className="text-gray-600">Buyer: {req.buyer.name}</p>
                    <p className="text-gray-600">Email: {req.buyer.email}</p>
                    <div className="flex space-x-4 mt-4">
                      <button
                        className="px-6 py-2 bg-[#FF902B] text-white rounded-md hover:bg-[#e6851b] focus:outline-none transition"
                        onClick={() => acceptRequest(req.id, "Accepted")}
                      >
                        Accept
                      </button>
                      <button
                        className="px-6 py-2 bg-[#D9534F] text-white rounded-md hover:bg-[#c9302c] focus:outline-none transition"
                        onClick={() => acceptRequest(req.id, "Declined")}
                      >
                        Decline
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 text-center">
                No incoming request at this moment.
              </p>
            )}
          </TabPanel>

          {/* Outgoing Requests */}
          <TabPanel>
            {outgoingRequests.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {outgoingRequests.map((req) => (
                  <div
                    key={req.id}
                    className="border rounded-lg p-4 shadow-md bg-[#FFFAF3]"
                  >
                    <h3 className="text-lg font-bold text-[#7A623F]">
                      {req.item.name}
                    </h3>
                    <p className="text-gray-600">Price: {req.item.price}</p>
                    <p className="text-gray-600">Seller: {req.seller.name}</p>
                    <p className="text-gray-600">Email: {req.seller.email}</p>
                    <p
                      className={`font-semibold mt-2 ${
                        req.status === "Pending"
                          ? "text-orange-500"
                          : req.status === "Accepted"
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      Status: {req.status}
                    </p>

                    <p className="text-gray-600">Message: {req.message}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 text-center">
                No outgoing request at this moment.
              </p>
            )}
          </TabPanel>
        </Tabs>
      </div>
    </div>
  );
}

export default RequestsPage;
