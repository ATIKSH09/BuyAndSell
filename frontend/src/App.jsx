import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import Login from "./pages/Login/Login";
import "./App.css";
import { Toaster } from "react-hot-toast";
import Navbar from "./assets/Components/Navbar";
import Home from "./pages/Home/Home";
import Product from "./pages/Product/Product";
import Sell from "./pages/Sellitem/Sell";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Profile from "./pages/Profile/Profile";
import Request from "./pages/Requests/Requests";

function App() {
  const [count, setCount] = useState(0);

  return (
    <Router>
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/product/:id" element={<Product />} />
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/sell" element={<Sell />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/profile/requests" element={<Request />} />
      </Routes>
    </Router>
  );
}

export default App;
