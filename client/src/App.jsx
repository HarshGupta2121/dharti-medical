import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';

import Medicines from './pages/Medicines';

import ProductDetail from './pages/ProductDetail';

import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import UploadPrescription from './pages/UploadPrescription';

import Cart from './pages/Cart';

import Login from './pages/Login';

import Profile from './pages/Profile';

import AdminDashboard from './pages/AdminDashboard';
import ProductEdit from './pages/ProductEdit';

import { Toaster } from 'react-hot-toast';

function App() {
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || 'your_google_client_id_here';

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <Router>
      <AuthProvider>
        <CartProvider>
          <Toaster position="top-center" />
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/medicines" element={<Medicines />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/wellness" element={<Medicines />} />
                <Route path="/prescriptions" element={<UploadPrescription />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/login" element={<Login />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/product/:id/edit" element={<ProductEdit />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </CartProvider>
      </AuthProvider>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
