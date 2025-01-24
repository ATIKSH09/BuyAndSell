// toastConfig.js

import { toast } from "react-hot-toast";

const toastConfig = {
  success: {
    style: {
      background: "#FBE9C7", // Light yellow
      color: "#7F265B", // Maroon
      border: "1px solid #7F265B", // Optional border for aesthetics
    },
    iconTheme: {
      primary: "#7F265B",
      secondary: "#FBE9C7",
    },
    position: "top-right",
  },
  error: {
    style: {
      background: "#FBE9C7", // Light yellow
      color: "#7F265B", // Maroon
      border: "1px solid #7F265B",
    },

    iconTheme: {
      primary: "#7F265B",
      secondary: "#FBE9C7",
    },
    position: "top-right",
  },
  loading: {
    style: {
      background: "#FBE9C7", // Light yellow
      color: "#7F265B", // Maroon
      border: "1px solid #7F265B",
    },
    iconTheme: {
      primary: "#7F265B",
      secondary: "#FBE9C7",
    },
    position: "top-right",
  },
};

export const showSuccessToast = (message) =>
  toast.success(message, toastConfig.success);

export const showErrorToast = (message) =>
  toast.error(message, toastConfig.error);

export const showLoadingToast = (message) =>
  toast.loading(message, toastConfig.loading);
