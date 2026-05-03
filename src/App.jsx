import { useState } from 'react'
import './App.css'
import './index.css'
import { Routes, Route } from 'react-router-dom';
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Cart from "./pages/Cart.jsx";
import Checkout from "./pages/Checkout.jsx";
import CheckoutSuccess from "./pages/CheckoutSuccess.jsx";
import CheckoutCancel from "./pages/CheckoutCancel.jsx";
import Profile from "./pages/Profile.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/checkout/success" element={<CheckoutSuccess />} />
      <Route path="/checkout/cancel" element={<CheckoutCancel />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/admin" element={<AdminDashboard />} />
    </Routes>
  );
}

export default App;

