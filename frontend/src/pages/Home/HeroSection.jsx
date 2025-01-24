import React from "react";
import { AiOutlineShoppingCart } from "react-icons/ai"; // Import the cart icon
import AOS from "aos";
import "aos/dist/aos.css";
import img from "../../assets/images/hero.png";

function Hero() {
  const scrollToProducts = () => {
    document.getElementById("products").scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div
      className="w-full h-[92vh] flex flex-col md:flex-row items-center justify-center sm:justify-between px-8 md:px-16 bg-gradient-to-b from-[#FDF4E8] to-white"
      id="hero-section"
      //   style={{ backgroundColor: "#FDF4E8" }}
    >
      {/* Text Content */}
      <div
        className="md:w-1/2 flex sm:block justify-center items-center flex-col text-center md:text-left"
        data-aos="fade-right"
      >
        <h1 className="text-5xl font-bold mb-4 text-[#7A623F]">
          <span className="text-[#FF902B]">Buy</span> and{" "}
          <span className="text-[#FF902B]">Sell</span> With Ease
        </h1>
        <p className="text-gray-600 mb-6">
          Join our marketplace to sell your products or shop for the best
          offers.
        </p>
        <button
          onClick={scrollToProducts}
          className="bg-[#FF902B] text-white py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300 flex items-center gap-2"
        >
          <AiOutlineShoppingCart size={20} className="text-white" />
          Explore Products
        </button>
      </div>

      {/* Image Content */}
      <div
        className="md:w-1/2 hidden sm:block mt-8 md:mt-0"
        data-aos="fade-left"
      >
        <img
          src={img}
          alt="Marketplace illustration"
          className="w-full max-w-md mx-auto md:max-w-full"
        />
      </div>
    </div>
  );
}

export default Hero;
