import React, { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { AiOutlineSearch } from "react-icons/ai";
import { FiMenu } from "react-icons/fi";
import { IoMdClose } from "react-icons/io";
import Hero from "./HeroSection";
import Navbar from "../../assets/Components/Navbar";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Home() {
  axios.defaults.withCredentials = true;

  const [items, setItems] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [search, setsearch] = useState("");
  const navigate = useNavigate();

  const categories = [
    "All",
    "Electronics",
    "Clothing",
    "Books",
    "Home Appliances",
    "Tickets",
    "Decoration",
  ];

  // Fetch items from backend
  const getItems = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/item/getItems"
      );
      setItems(response.data);
      setFilteredProducts(response.data.reverse()); // Initialize filtered products
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    AOS.init({ duration: 500, easing: "ease-in-out", once: true });
    getItems();
  }, []);

  const toggleSidebar = () => {
    setIsSidebarExpanded((prev) => !prev);
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    if (category === "All") {
      setFilteredProducts(items);
    } else {
      setFilteredProducts(
        items.filter((item) => item.categories.includes(category))
      );
    }
  };

  const handleCategoryClickOnMobile = (category) => {
    handleCategoryClick(category);
    toggleSidebar();
  };

  const handleChange = (e) => {
    const query = e.target.value; // Use the value from the event
    setsearch(query); // Update the state

    const filtered = items.filter((item) =>
      item.name.toLowerCase().includes(query.toLowerCase())
    );

    setFilteredProducts(filtered); // Update the filtered products
  };

  return (
    <div>
      <Navbar />
      {/* Hero Section */}
      <Hero />

      <div className="flex flex-col relative md:flex-row">
        {/* Sidebar */}
        <aside
          className={`bg-[#FDF6EB] pl-4 border-r border-gray-300 hidden md:block transition-all duration-300 ${
            isSidebarExpanded ? "w-64" : "w-16"
          } h-[92vh] md:w-64 flex-shrink-0`}
        >
          <div className="flex justify-between items-center p-4 border-b border-gray-300">
            <h3
              className={`text-xl font-semibold text-[#7A623F] ${
                isSidebarExpanded ? "block" : "hidden md:block"
              }`}
            >
              Categories
            </h3>
            <button
              className="text-gray-600 hover:text-[#FF902B] md:hidden"
              onClick={toggleSidebar}
            >
              {isSidebarExpanded ? (
                <IoMdClose size={20} />
              ) : (
                <FiMenu size={20} />
              )}
            </button>
          </div>
          <ul>
            {categories.map((category) => (
              <li
                key={category}
                className={`py-2 px-4 rounded-lg flex justify-normal pl-4 cursor-pointer hover:bg-gray-200 transition ${
                  selectedCategory === category ? "bg-[#FF902B] text-white" : ""
                } ${isSidebarExpanded ? "" : "text-center"}`}
                onClick={() => handleCategoryClick(category)}
              >
                {category}
              </li>
            ))}
          </ul>
        </aside>

        {/* Mobile menu */}
        <aside
          className={`bg-[#FDF6EB] border-r absolute h-screen w-4/5 border-gray-300 top-0 left-0 z-[100000] md:hidden transition-all duration-200 ${
            isSidebarExpanded ? "translate-x-0" : "translate-x-[-100%]"
          } h-[92vh] md:w-64 flex-shrink-0`}
        >
          <div className="flex justify-between items-center p-4 border-b border-gray-300">
            <h3
              className={`text-xl font-semibold text-[#7A623F] ${
                isSidebarExpanded ? "block" : "hidden "
              }`}
            >
              Categories
            </h3>
            <button
              className="text-gray-600 hover:text-[#FF902B] md:hidden"
              onClick={toggleSidebar}
            >
              <IoMdClose size={20} />
            </button>
          </div>
          <ul>
            {categories.map((category) => (
              <li
                key={category}
                className={`py-2 px-4 rounded-lg cursor-pointer hover:bg-gray-200 transition ${
                  selectedCategory === category ? "bg-[#FF902B] text-white" : ""
                } ${isSidebarExpanded ? "" : "text-center"}`}
                onClick={() => handleCategoryClickOnMobile(category)}
              >
                {category}
              </li>
            ))}
          </ul>
        </aside>

        {/* Main Content */}
        <div className="flex-1 relative">
          <div className="py-16 px-4 sm:px-8 md:px-16 bg-[#FDF6EB]" id="products">
            {loading ? (
              // Loader for the content section
              <div className="flex items-center justify-center h-[65vh]">
                <div className="w-16 h-16 border-4 border-[#7A623F] border-t-[#FF902B] rounded-full animate-spin"></div>
              </div>
            ) : (
              <>
                {/* Header */}
                <button
                  className=" items-center gap-2 flex md:hidden px-4 py-2 rounded-full bg-[#FF902B] text-white font-medium shadow-md hover:bg-[#e07e26] hover:shadow-lg transition duration-300"
                  onClick={() => toggleSidebar()}
                >
                  <FiMenu size={20} />
                </button>
                <div className="text-center flex flex-col sm:flex-row items-center justify-between mb-10">
                  <h2 className="text-3xl font-bold text-center text-[#7A623F]">
                    {filteredProducts.length} Items
                  </h2>
                  <div className="flex items-center relative mt-6 sm:mt-0">
                    <input
                      type="text"
                      placeholder="Search..."
                      onChange={(e) => handleChange(e)}
                      value={search}
                      className="py-2 px-4 w-full sm:w-72 rounded-full border border-gray-300 focus:ring-2 focus:ring-[#FF902B] outline-none"
                    />
                    <AiOutlineSearch
                      className="absolute right-4 text-gray-500"
                      size={20}
                    />
                  </div>
                </div>

                {/* Product Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 h-[65vh] overflow-y-scroll overflow-x-hidden scrollbar-glass">
                  {filteredProducts.map((product) => (
                    <div
                      key={product._id}
                      className="p-6 rounded-2xl max-h-80 cursor-pointer shadow-md bg-gradient-to-br from-white to-gray-50 border border-gray-200 text-center hover:shadow-2xl h-76 hover:scale-105 transition-transform duration-300"
                      onClick={() => navigate(`/product/${product._id}`)}
                    >
                      <img
                        src={
                          product.image || "https://via.placeholder.com/150"
                        }
                        alt={product.name}
                        className="w-36 h-36 mx-auto mb-4 rounded-lg shadow-inner"
                      />
                      <h3 className="text-xl font-semibold text-[#7A623F] mb-2">
                        {product.name}
                      </h3>
                      <p className="text-lg text-[#FF902B] font-bold">
                        ₹{product.price}
                      </p>
                      <p className="text-sm text-gray-500 mt-2">
                        {product.description || "No description"}
                      </p>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
