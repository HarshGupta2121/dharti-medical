import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Package, MapPin, Calendar, Clock, Settings, User, Mail, Lock, Building, Map } from 'lucide-react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const Profile = () => {
    const { user, logout, updateUserProfile } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('orders');

    // Profile Form State
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    
    // Address Form State
    const [street, setStreet] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [country, setCountry] = useState('India');

    useEffect(() => {
        if (user) {
            setName(user.name || '');
            setEmail(user.email || '');
            
            if (user.address) {
                setStreet(user.address.street || '');
                setCity(user.address.city || '');
                setState(user.address.state || '');
                setPostalCode(user.address.postalCode || '');
                setCountry(user.address.country || 'India');
            }
        }
    }, [user]);

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

    useEffect(() => {
        const fetchOrders = async () => {
            if (user && activeTab === 'orders') {
                try {
                    setLoading(true);
                    const { data } = await axios.get(`${API_URL}/orders/myorders?userId=${user._id}`);
                    setOrders(data);
                } catch (error) {
                    console.error('Error fetching orders:', error);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchOrders();
    }, [user, activeTab]);

    const submitProfileHandler = async (e) => {
        e.preventDefault();
        
        if (password !== confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        const updateData = {
            name,
            email,
            address: {
                street,
                city,
                state,
                postalCode,
                country
            }
        };

        if (password) {
            updateData.password = password;
        }

        const loadingToast = toast.loading('Updating profile...');
        const result = await updateUserProfile(updateData);
        toast.dismiss(loadingToast);

        if (result.success) {
            toast.success('Profile updated successfully!');
            setPassword('');
            setConfirmPassword('');
        } else {
            toast.error(result.message || 'Failed to update profile');
        }
    };

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">Please Login</h2>
                    <Link to="/login" className="text-primary hover:underline">Go to Login</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">

                {/* Sidebar / User Info */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-24">
                        <div className="flex flex-col items-center mb-6">
                            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center text-3xl font-bold text-primary mb-4">
                                {user.name.charAt(0).toUpperCase()}
                            </div>
                            <h2 className="text-xl font-bold text-slate-900 text-center">{user.name}</h2>
                            <p className="text-slate-500 text-sm text-center">{user.email}</p>
                        </div>

                        <div className="space-y-2 mb-6">
                            <button
                                onClick={() => setActiveTab('orders')}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                                    activeTab === 'orders' 
                                    ? 'bg-primary text-white font-medium' 
                                    : 'text-slate-600 hover:bg-slate-50'
                                }`}
                            >
                                <Package size={20} /> My Orders
                            </button>
                            <button
                                onClick={() => setActiveTab('settings')}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                                    activeTab === 'settings' 
                                    ? 'bg-primary text-white font-medium' 
                                    : 'text-slate-600 hover:bg-slate-50'
                                }`}
                            >
                                <Settings size={20} /> Settings
                            </button>
                        </div>

                        <div className="pt-4 border-t border-slate-100">
                            <button
                                onClick={logout}
                                className="w-full py-2 px-4 border border-slate-200 rounded-xl text-slate-600 font-medium hover:bg-slate-50 hover:text-red-500 transition-colors"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="lg:col-span-3">
                    {activeTab === 'orders' && (
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                                <Package className="text-primary" /> Order History
                            </h1>

                            {loading ? (
                                <div className="text-center py-10 text-slate-500">Loading orders...</div>
                            ) : orders.length === 0 ? (
                                <div className="bg-white rounded-2xl p-10 shadow-sm text-center">
                                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">📦</div>
                                    <h3 className="text-lg font-bold text-slate-900 mb-2">No orders yet</h3>
                                    <p className="text-slate-500 mb-6">Looks like you haven't placed any orders yet.</p>
                                    <Link to="/medicines" className="px-6 py-2 bg-primary text-white rounded-full font-bold text-sm hover:bg-primary-dark transition-colors">
                                        Start Shopping
                                    </Link>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {orders.map(order => (
                                        <div key={order._id} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow border border-slate-100">
                                            <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                                                <div>
                                                    <div className="flex items-center gap-3 mb-1">
                                                        <span className="font-bold text-slate-900">Order #{order._id.slice(-6)}</span>
                                                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${order.isDelivered ? 'bg-green-100 text-green-700' : 'bg-blue-50 text-blue-600'}`}>
                                                            {order.isDelivered ? 'Delivered' : 'Processing'}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-4 text-xs text-slate-500">
                                                        <span className="flex items-center gap-1"><Calendar size={12} /> {new Date(order.createdAt).toLocaleDateString()}</span>
                                                        <span className="flex items-center gap-1"><Clock size={12} /> {new Date(order.createdAt).toLocaleTimeString()}</span>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-bold text-primary text-lg">₹{order.totalPrice.toFixed(2)}</p>
                                                    <p className="text-xs text-slate-400">{order.paymentMethod}</p>
                                                </div>
                                            </div>

                                            <div className="border-t border-slate-50 pt-4 mt-4">
                                                <div className="flex flex-col gap-2">
                                                    {order.orderItems.map((item, index) => (
                                                        <div key={index} className="flex justify-between items-center text-sm">
                                                            <span className="text-slate-700">
                                                                <span className="font-bold text-slate-900">{item.quantity}x</span> {item.name}
                                                            </span>
                                                            <span className="text-slate-500">₹{item.price}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'settings' && (
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                            <div className="p-6 border-b border-slate-100">
                                <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                                    <Settings className="text-primary" /> Profile Settings
                                </h1>
                                <p className="text-slate-500 mt-1">Update your personal information and shipping address.</p>
                            </div>

                            <form onSubmit={submitProfileHandler} className="p-6 space-y-8">
                                {/* Basic Info Section */}
                                <div>
                                    <h3 className="text-lg font-semibold text-slate-900 mb-4 border-b border-slate-100 pb-2">Basic Information</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-slate-700 block">Full Name</label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <User className="h-4 w-4 text-slate-400" />
                                                </div>
                                                <input
                                                    type="text"
                                                    value={name}
                                                    onChange={(e) => setName(e.target.value)}
                                                    className="w-full pl-10 pr-3 py-2 border border-slate-200 rounded-xl focus:ring-primary focus:border-primary"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-slate-700 block">Email Address</label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <Mail className="h-4 w-4 text-slate-400" />
                                                </div>
                                                <input
                                                    type="email"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    className="w-full pl-10 pr-3 py-2 border border-slate-200 rounded-xl focus:ring-primary focus:border-primary bg-slate-50"
                                                    disabled // Optional: Disable email changes if it breaks Google Auth logic
                                                />
                                            </div>
                                            <p className="text-xs text-slate-400">Email cannot be changed.</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Security Section */}
                                <div>
                                    <h3 className="text-lg font-semibold text-slate-900 mb-4 border-b border-slate-100 pb-2">Security</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-slate-700 block">New Password</label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <Lock className="h-4 w-4 text-slate-400" />
                                                </div>
                                                <input
                                                    type="password"
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    placeholder="Leave blank to keep current"
                                                    className="w-full pl-10 pr-3 py-2 border border-slate-200 rounded-xl focus:ring-primary focus:border-primary"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-slate-700 block">Confirm New Password</label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <Lock className="h-4 w-4 text-slate-400" />
                                                </div>
                                                <input
                                                    type="password"
                                                    value={confirmPassword}
                                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                                    placeholder="Confirm new password"
                                                    className="w-full pl-10 pr-3 py-2 border border-slate-200 rounded-xl focus:ring-primary focus:border-primary"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Address Section */}
                                <div>
                                    <h3 className="text-lg font-semibold text-slate-900 mb-4 border-b border-slate-100 pb-2">Shipping Address</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2 md:col-span-2">
                                            <label className="text-sm font-medium text-slate-700 block">Street Address</label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <MapPin className="h-4 w-4 text-slate-400" />
                                                </div>
                                                <input
                                                    type="text"
                                                    value={street}
                                                    onChange={(e) => setStreet(e.target.value)}
                                                    placeholder="123 Main St, Apt 4B"
                                                    className="w-full pl-10 pr-3 py-2 border border-slate-200 rounded-xl focus:ring-primary focus:border-primary"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-slate-700 block">City</label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <Building className="h-4 w-4 text-slate-400" />
                                                </div>
                                                <input
                                                    type="text"
                                                    value={city}
                                                    onChange={(e) => setCity(e.target.value)}
                                                    placeholder="Mumbai"
                                                    className="w-full pl-10 pr-3 py-2 border border-slate-200 rounded-xl focus:ring-primary focus:border-primary"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-slate-700 block">State</label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <Map className="h-4 w-4 text-slate-400" />
                                                </div>
                                                <input
                                                    type="text"
                                                    value={state}
                                                    onChange={(e) => setState(e.target.value)}
                                                    placeholder="Maharashtra"
                                                    className="w-full pl-10 pr-3 py-2 border border-slate-200 rounded-xl focus:ring-primary focus:border-primary"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-slate-700 block">Postal Code</label>
                                            <input
                                                type="text"
                                                value={postalCode}
                                                onChange={(e) => setPostalCode(e.target.value)}
                                                placeholder="400001"
                                                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-primary focus:border-primary"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-slate-700 block">Country</label>
                                            <input
                                                type="text"
                                                value={country}
                                                onChange={(e) => setCountry(e.target.value)}
                                                placeholder="India"
                                                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-primary focus:border-primary bg-slate-50"
                                                disabled
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-4 flex justify-end">
                                    <button
                                        type="submit"
                                        className="px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark focus:ring-4 focus:ring-primary/20 transition-all shadow-lg shadow-primary/25"
                                    >
                                        Update Profile
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;
