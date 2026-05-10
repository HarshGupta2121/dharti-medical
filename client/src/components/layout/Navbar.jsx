import React, { useState } from 'react';
import { Search, ShoppingCart, User, Menu, X, MapPin, Leaf } from 'lucide-react';
import { Link } from 'react-router-dom';

import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { cartCount } = useCart();
    const { user, logout } = useAuth();

    return (
        <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-secondary">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    {/* Left Side: Logo & Nav */}
                    <div className="flex items-center gap-10">
                        {/* Logo */}
                        <Link to="/" className="flex items-center gap-2">
                            <img src="/logo.svg" alt="Dharti Medical" className="h-12 w-auto" />
                        </Link>

                        {/* Desktop Nav */}
                        <div className="hidden md:flex items-center gap-8">
                            <Link to="/medicines" className="text-slate-600 hover:text-primary font-medium transition-colors">Medicines</Link>
                            <Link to="/wellness" className="text-slate-600 hover:text-primary font-medium transition-colors">Wellness</Link>
                            <Link to="/prescriptions" className="text-slate-600 hover:text-primary font-medium transition-colors">Prescriptions</Link>
                            <Link to="/locations" className="text-slate-600 hover:text-primary font-medium transition-colors">Locations</Link>
                        </div>
                    </div>

                    {/* Search Bar */}
                    <div className="hidden lg:flex flex-1 max-w-md mx-8 relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-slate-400" />
                        </div>
                        <input
                            type="text"
                            className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-full leading-5 bg-slate-50 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary-light focus:border-primary-light sm:text-sm transition-all"
                            placeholder="Search for medicines, health products..."
                        />
                    </div>

                    {/* Right Actions */}
                    <div className="hidden md:flex items-center gap-4">
                        <Link to="/cart" className="relative p-2 text-slate-600 hover:text-primary transition-colors">
                            <ShoppingCart className="h-6 w-6" />
                            {cartCount > 0 && (
                                <span className="absolute top-1 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-500 rounded-full">
                                    {cartCount}
                                </span>
                            )}
                        </Link>

                        {user ? (
                            <div className="flex items-center gap-4">
                                {user.isAdmin && (
                                    <Link to="/admin" className="text-slate-600 hover:text-primary font-bold text-sm transition-colors">
                                        Admin
                                    </Link>
                                )}
                                <Link to="/profile" className="flex items-center gap-2 hover:bg-slate-50 p-1.5 rounded-full pr-4 transition-colors group">
                                    <div className="w-8 h-8 bg-primary/10 text-primary rounded-full flex items-center justify-center font-bold text-sm">
                                        {user.name?.charAt(0).toUpperCase() || 'U'}
                                    </div>
                                    <span className="text-slate-700 font-medium group-hover:text-primary transition-colors">Hi, {user.name?.split(' ')[0] || 'User'}</span>
                                </Link>
                                <button
                                    onClick={logout}
                                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-semibold rounded-full transition-colors"
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <Link to="/login" className="px-5 py-2.5 bg-primary hover:bg-primary-dark text-white text-sm font-semibold rounded-full transition-colors shadow-lg shadow-primary/20">
                                Sign Up
                            </Link>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-slate-600 hover:text-primary hover:bg-secondary focus:outline-none"
                        >
                            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden bg-white border-t border-slate-100">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        <Link to="/medicines" className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-primary hover:bg-secondary">Medicines</Link>
                        <Link to="/wellness" className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-primary hover:bg-secondary">Wellness</Link>
                        <Link to="/prescriptions" className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-primary hover:bg-secondary">Prescriptions</Link>
                        <div className="px-3 py-2">
                            <input
                                type="text"
                                className="block w-full px-3 py-2 border border-slate-200 rounded-lg leading-5 bg-slate-50 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm"
                                placeholder="Search..."
                            />
                        </div>
                        <Link to="/cart" className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-primary hover:bg-secondary">Cart (0)</Link>
                        <Link to="/login" className="block px-3 py-2 mt-2 text-center rounded-md text-base font-medium bg-primary text-white hover:bg-primary-dark">Sign Up</Link>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
