import React, { useState, useEffect } from 'react';
import { ArrowRight, FileText, RefreshCw, Leaf } from 'lucide-react';
import { motion } from 'framer-motion';
import ProductCard from '../components/ui/ProductCard';
import { fetchProducts } from '../services/api';

const Home = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadProducts = async () => {
            try {
                const data = await fetchProducts('', 1, '', 4); // Fetch top 4
                // Map database fields to UI component props
                const mappedProducts = (data.products || []).map(item => ({
                    id: item._id,
                    name: item.name,
                    category: item.category,
                    dosage: item.dosage,
                    price: item.price,
                    image: item.image,
                    // Map or default style properties
                    cardBg: item.bgColor || 'bg-white',
                    textColor: item.textColor || 'text-slate-900',
                    // Heuristic: if bg is dark green, use white text/accents
                    accentColor: item.bgColor?.includes('green') || item.bgColor?.includes('emerald') ? 'text-white/70' : 'text-primary',
                    darker: item.bgColor?.includes('green') || item.bgColor?.includes('emerald') || item.bgColor?.includes('orange') || item.bgColor?.includes('amber')
                }));
                setProducts(mappedProducts);
            } catch (error) {
                console.error("Failed to fetch products:", error);
            } finally {
                setLoading(false);
            }
        };

        loadProducts();
    }, []);

    const testimonials = [
        { id: 1, name: 'Sarah Johnson', text: 'The fastest delivery I ve experienced. Dharti Medical eco-friendly packaging makes a real difference.', initial: 'SJ', color: 'bg-green-100 text-green-700' },
        { id: 2, name: 'Robert Chen', text: 'Professional and knowledgeable. They provided detailed instructions for my chronic medication.', initial: 'RC', color: 'bg-blue-100 text-blue-700' },
        { id: 3, name: 'Elena Rodriguez', text: 'Convenient digital uploads and a very calm, easy-to-use website. They make pharmacy visits a thing of the past.', initial: 'ER', color: 'bg-purple-100 text-purple-700' },
    ];

    return (
        <div className="bg-slate-50 min-h-screen pb-20">
            {/* Hero Section */}
            <section className="pt-8 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* Main Hero Banner */}
                    <div className="lg:col-span-8 bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm relative overflow-hidden min-h-[500px] flex flex-col justify-center">
                        <div className="relative z-10 max-w-lg">
                            <span className="inline-block px-3 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-full mb-6 tracking-wide">TRUSTED SINCE 1998</span>
                            <h1 className="text-5xl md:text-6xl font-bold text-slate-900 leading-[1.1] mb-6">
                                Your Wellness, <br />
                                <span className="text-primary">Elegantly Delivered.</span>
                            </h1>
                            <p className="text-slate-500 text-lg mb-8 leading-relaxed max-w-md">
                                Experience premium healthcare with MediCare. Expertly curated wellness products and genuine prescriptions for your modern lifestyle.
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <button className="px-8 py-4 bg-primary text-white rounded-full font-bold hover:bg-primary-dark transition-all transform hover:scale-105 shadow-lg shadow-primary/25">
                                    Shop Medicines
                                </button>
                                <button className="px-8 py-4 bg-white text-primary border border-primary rounded-full font-bold hover:bg-green-50 transition-all">
                                    Our Services
                                </button>
                            </div>
                        </div>
                        {/* Abstract Background Decoration */}
                        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-secondary-light/50 to-transparent pointer-events-none"></div>
                    </div>

                    {/* Right Side Cards */}
                    <div className="lg:col-span-4 flex flex-col gap-6">

                        {/* Digital Scripts Card */}
                        <div className="bg-white rounded-[2rem] p-6 shadow-sm flex-1">
                            <h3 className="font-bold text-slate-900 mb-6 text-xl">Digital Scripts</h3>
                            <div className="space-y-4">
                                <button className="w-full flex items-center p-4 bg-slate-50 rounded-2xl hover:bg-secondary transition-colors group">
                                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-primary shadow-sm mr-4 group-hover:scale-110 transition-transform">
                                        <FileText size={20} />
                                    </div>
                                    <div className="text-left">
                                        <h4 className="font-bold text-slate-900 text-sm">Upload Prescription</h4>
                                        <p className="text-slate-400 text-xs">Fast 15-min review</p>
                                    </div>
                                </button>
                                <button className="w-full flex items-center p-4 bg-slate-50 rounded-2xl hover:bg-secondary transition-colors group">
                                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-primary shadow-sm mr-4 group-hover:scale-110 transition-transform">
                                        <RefreshCw size={20} />
                                    </div>
                                    <div className="text-left">
                                        <h4 className="font-bold text-slate-900 text-sm">Refill History</h4>
                                        <p className="text-slate-400 text-xs">Manage your recurring orders</p>
                                    </div>
                                </button>
                            </div>
                            <button className="w-full mt-6 py-2 text-primary text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1 hover:gap-2 transition-all">
                                View All Services <ArrowRight size={14} />
                            </button>
                        </div>

                        {/* Wellness Card */}
                        <div className="bg-[#047857] rounded-[2rem] p-8 shadow-sm flex-1 relative overflow-hidden text-white flex flex-col justify-center">
                            <Leaf className="absolute top-4 right-4 text-white/10 w-24 h-24 rotate-12" />
                            <h3 className="font-bold text-2xl mb-2 relative z-10">Winter Wellness</h3>
                            <p className="text-secondary text-sm mb-6 relative z-10">Boost your immunity with our organic collection.</p>
                            <button className="self-start px-6 py-2 bg-white text-primary-dark rounded-full font-bold text-sm hover:bg-gray-100 transition-colors relative z-10">
                                Explore Organic
                            </button>
                        </div>

                    </div>
                </div>
            </section>

            {/* Featured Section */}
            <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-20">
                <div className="flex items-end justify-between mb-10">
                    <div>
                        <h2 className="text-3xl font-bold text-slate-900">Featured Essentials</h2>
                        <div className="h-1 w-20 bg-primary mt-4 rounded-full"></div>
                    </div>
                    <a href="#" className="hidden md:flex items-center text-primary font-medium text-sm hover:underline">
                        Browse Full Catalog <ArrowRight size={16} className="ml-1" />
                    </a>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {products.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </section>

            {/* Testimonials */}
            <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="bg-white rounded-[3rem] p-10 md:p-16 text-center">
                    <span className="text-xs font-bold text-primary tracking-[0.2em] uppercase mb-4 block">Testimonials</span>
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-12">Community Care Stories</h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        {testimonials.map(t => (
                            <div key={t.id} className="text-left bg-slate-50 p-6 rounded-2xl hover:bg-white hover:shadow-lg transition-all duration-300">
                                <div className="flex text-primary mb-4">
                                    {[1, 2, 3, 4, 5].map(i => <span key={i}>★</span>)}
                                </div>
                                <p className="text-slate-600 text-sm italic mb-6 leading-relaxed">"{t.text}"</p>
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs ${t.color}`}>
                                        {t.initial}
                                    </div>
                                    <span className="font-bold text-slate-900 text-sm">{t.name}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
