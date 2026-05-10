import React from 'react';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-slate-50 pt-16 pb-8 border-t border-slate-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

                    {/* Brand Info */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <img src="/logo.svg" alt="Dharti Medical" className="h-10 w-auto" />
                        </div>
                        <p className="text-slate-500 text-sm leading-relaxed">
                            Your trusted partner in health and wellness. We provide genuine medicines, expert advice, and fast delivery to your doorstep.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-primary hover:border-primary transition-all">
                                <Facebook size={16} />
                            </a>
                            <a href="#" className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-primary hover:border-primary transition-all">
                                <Twitter size={16} />
                            </a>
                            <a href="#" className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-primary hover:border-primary transition-all">
                                <Instagram size={16} />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-semibold text-slate-900 mb-6">Quick Links</h3>
                        <ul className="space-y-3">
                            <li><Link to="/about" className="text-slate-500 hover:text-primary text-sm transition-colors">About Us</Link></li>
                            <li><Link to="/medicines" className="text-slate-500 hover:text-primary text-sm transition-colors">Medicines</Link></li>
                            <li><Link to="/wellness" className="text-slate-500 hover:text-primary text-sm transition-colors">Wellness Products</Link></li>
                            <li><Link to="/prescriptions" className="text-slate-500 hover:text-primary text-sm transition-colors">Upload Prescription</Link></li>
                            <li><Link to="/contact" className="text-slate-500 hover:text-primary text-sm transition-colors">Contact</Link></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="font-semibold text-slate-900 mb-6">Contact Us</h3>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3 text-slate-500 text-sm">
                                <MapPin size={18} className="text-primary mt-0.5" />
                                <span>123 Health Value Blvd,<br />Green District, CA 90210</span>
                            </li>
                            <li className="flex items-center gap-3 text-slate-500 text-sm">
                                <Phone size={18} className="text-primary" />
                                <span>+1 (555) 123-4567</span>
                            </li>
                            <li className="flex items-center gap-3 text-slate-500 text-sm">
                                <Mail size={18} className="text-primary" />
                                <span>support@medicare.com</span>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h3 className="font-semibold text-slate-900 mb-6">Stay Updated</h3>
                        <p className="text-slate-500 text-sm mb-4">Subscribe to our newsletter for health tips and exclusive offers.</p>
                        <form className="space-y-3">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm"
                            />
                            <button className="w-full bg-primary text-white py-2 rounded-lg text-sm font-semibold hover:bg-primary-dark transition-colors">
                                Subscribe
                            </button>
                        </form>
                    </div>

                </div>

                <div className="mt-16 pt-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-slate-400 text-sm">© 2026 Dharti Medical. All rights reserved.</p>
                    <div className="flex gap-6">
                        <a href="#" className="text-slate-400 hover:text-slate-600 text-xs">Privacy Policy</a>
                        <a href="#" className="text-slate-400 hover:text-slate-600 text-xs">Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
