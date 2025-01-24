import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import Navbar from "../../assets/Components/Navbar";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { showErrorToast, showSuccessToast } from "../../assets/toastConfig";
import AOS from "aos";
import "aos/dist/aos.css";

const categoriesList = [
  "Electronics",
  "Clothing",
  "Books",
  "Home Appliances",
  "Tickets",
  "Decoration",
];

const MySwal = withReactContent(Swal);

function ProductSubmissionPage() {
  axios.defaults.withCredentials = true;
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;
  const [isAdding, setisAdding] = useState(false);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();
  const [uploadedImageBase64, setUploadedImageBase64] = useState(null);

  // Initialize AOS
  useEffect(() => {
    AOS.init({ duration: 500 }); // Initialize AOS with default settings
  }, []);

  // Convert file to Base64
  const convertToBase64 = async (file) => {
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };

  // Check login
  useEffect(() => {
    const checkLogin = async () => {
      try {
        await axios.get("http://localhost:5000/api/user/checkLogin");
      } catch (error) {
        console.error(error);
        showErrorToast("Please Login First");
        navigate("/login");
      }
    };
    checkLogin();
  }, []);

  const handleImageUpload = async (file) => {
    try {
      const base64 = await convertToBase64(file); // Using await when calling it
      setUploadedImageBase64(base64);
    } catch (error) {
      console.log(error);
    }
  };

  const onSubmit = async (data) => {
    if (!uploadedImageBase64) {
      showErrorToast("Please upload an image also");
      return;
    }

    try {
      const result = await MySwal.fire({
        title: "Are you sure?",
        text: "Your Product will be Added!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#FF902B",
        cancelButtonColor: "#7A623F",
        confirmButtonText: "Yes",
        cancelButtonText: "Cancel",
      });

      if (result.isConfirmed) {
        const finalData = { ...data, image: uploadedImageBase64 }; // Add Base64 image to form data
        setisAdding(true);
        const res = await axios.post(
          "http://localhost:5000/api/item/sellItem",
          finalData
        );
        if (res.status === 200) {
          setisAdding(false);
          showSuccessToast("Product added successfully");
          navigate("/profile");
        }
      }
    } catch (error) {
      console.error("error");
    }
  };

  return (
    <div>
      <Navbar />
      {isAdding ? (
        <div className="flex flex-col gap-12 items-center justify-center h-[65vh]">
          <div className="w-16 h-16 border-4 border-[#7A623F] border-t-[#FF902B] rounded-full animate-spin"></div>
          <h1 className="text-3xl text-[#FF902B]">Adding the product</h1>
        </div>
      ) : (
        <div className="flex min-h-[93vh] items-center justify-center bg-[#FDF4E8] px-6">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-white shadow-lg rounded-lg w-full max-w-xl p-8"
            data-aos="fade-up"
          >
            <h2
              className="text-2xl font-bold text-center text-[#FF902B] mb-6"
              data-aos="zoom-in"
            >
              Add Product Details
            </h2>

            {/* Product Name */}
            <div className="mb-4" data-aos="fade-right">
              <label className="block text-sm font-medium text-[#7A623F] mb-2">
                Product Name
              </label>
              <input
                type="text"
                {...register("name", { required: "Name is required" })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF902B]"
              />
              {errors.name && (
                <span className="text-red-500 text-sm">
                  {errors.name.message}
                </span>
              )}
            </div>

            {/* Product Price */}
            <div className="mb-4" data-aos="fade-left">
              <label className="block text-sm font-medium text-[#7A623F] mb-2">
                Price
              </label>
              <input
                type="number"
                {...register("price", { required: "Price is required" })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF902B]"
              />
              {errors.price && (
                <span className="text-red-500 text-sm">
                  {errors.price.message}
                </span>
              )}
            </div>

            {/* Upload Image */}
            <div className="mb-4" data-aos="fade-right">
              <label className="block text-sm font-medium text-[#7A623F] mb-2">
                Upload Image
              </label>
              <input
                type="file"
                accept="image/*"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF902B]"
                onChange={(e) => handleImageUpload(e.target.files[0])}
              />
            </div>

            {/* Product Description */}
            <div className="mb-4" data-aos="fade-left">
              <label className="block text-sm font-medium text-[#7A623F] mb-2">
                Description
              </label>
              <textarea
                {...register("description", {
                  required: "Description is required",
                })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF902B]"
                rows="3"
              />
              {errors.description && (
                <span className="text-red-500 text-sm">
                  {errors.description.message}
                </span>
              )}
            </div>

            {/* Categories */}
            <div className="mb-6" data-aos="fade-right">
              <label className="block text-sm font-medium text-[#7A623F] mb-2">
                Categories
              </label>
              <Controller
                name="categories"
                control={control}
                defaultValue={[]}
                rules={{ required: "At least one category is required" }}
                render={({ field }) => (
                  <div className="grid grid-cols-2 gap-3">
                    {categoriesList.map((category, index) => (
                      <label
                        key={index}
                        className="flex items-center space-x-2 text-[#7A623F]"
                      >
                        <input
                          type="checkbox"
                          value={category}
                          checked={field.value.includes(category)}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (field.value.includes(value)) {
                              field.onChange(
                                field.value.filter((item) => item !== value)
                              );
                            } else {
                              field.onChange([...field.value, value]);
                            }
                          }}
                          className="h-4 w-4 text-[#FF902B]"
                        />
                        <span>{category}</span>
                      </label>
                    ))}
                  </div>
                )}
              />
              {errors.categories && (
                <span className="text-red-500 text-sm">
                  {errors.categories.message}
                </span>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 bg-[#FF902B] text-white font-semibold rounded-lg hover:bg-[#e07e26] focus:outline-none focus:ring-2 focus:ring-[#FF902B]"
            >
              Submit Product
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default ProductSubmissionPage;
