import React, { useState, useEffect } from 'react';
import { Search, Filter, ChevronDown } from 'lucide-react';
import ProductCard from '../components/ui/ProductCard';
import { fetchProducts } from '../services/api';

const Medicines = () => {
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [keyword, setKeyword] = useState('');
    const [searchInput, setSearchInput] = useState('');

    // Categories
    const categories = ['All', 'Pain Relief', 'Antibiotic', 'Supplements', 'Vitality', 'Syrups', 'Medical Equipment', 'Personal Care'];

    useEffect(() => {
        const loadProducts = async () => {
            setLoading(true);
            try {
                const data = await fetchProducts(keyword, page, selectedCategory);
                const mappedProducts = (data.products || []).map(item => ({
                    id: item._id,
                    name: item.name,
                    category: item.category,
                    dosage: item.dosage,
                    price: item.price,
                    image: item.image,
                    cardBg: item.bgColor || 'bg-white',
                    textColor: item.textColor || 'text-slate-900',
                    accentColor: item.bgColor?.includes('green') || item.bgColor?.includes('emerald') ? 'text-white/70' : 'text-primary',
                    darker: item.bgColor?.includes('green') || item.bgColor?.includes('emerald') || item.bgColor?.includes('orange') || item.bgColor?.includes('amber')
                }));
                setProducts(mappedProducts);
                setTotalPages(data.pages || 1);
                setTotalItems(data.total || 0);
            } catch (error) {
                console.error("Failed to fetch products:", error);
            } finally {
                setLoading(false);
            }
        };
        loadProducts();
    }, [keyword, page, selectedCategory]);

    const handleSearch = (e) => {
        if (e.key === 'Enter') {
            setKeyword(searchInput);
            setPage(1);
        }
    };

    return (
        <div className="bg-slate-50 min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Medicines & Health</h1>
                    <p className="text-slate-500 text-sm mt-1">Found {totalItems} items</p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
                        <input
                            type="text"
                            placeholder="Search products (Press Enter)..."
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            onKeyDown={handleSearch}
                            className="pl-9 pr-4 py-2 rounded-full border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-primary text-sm w-64"
                        />
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-full text-slate-600 text-sm font-medium hover:border-primary transition-colors">
                        Sort by: Popular <ChevronDown size={14} />
                    </button>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Sidebar Filters */}
                <div className="lg:w-64 flex-shrink-0 space-y-8">
                    {/* Category Filter */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm">
                        <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <Filter size={16} className="text-primary" /> Filter by
                        </h3>
                        <div className="space-y-2">
                            {categories.map(cat => (
                                <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                                    <input
                                        type="radio"
                                        name="category"
                                        className="w-4 h-4 text-primary focus:ring-primary border-gray-300"
                                        checked={selectedCategory === cat}
                                        onChange={() => { setSelectedCategory(cat); setPage(1); }}
                                    />
                                    <span className={`text - sm group - hover: text - primary transition - colors ${selectedCategory === cat ? 'text-primary font-medium' : 'text-slate-600'} `}>
                                        {cat}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Price Range Mock */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm">
                        <h3 className="font-bold text-slate-900 mb-4">Price Range</h3>
                        <div className="flex items-center gap-4 text-sm text-slate-600">
                            <input type="number" placeholder="Min" className="w-full p-2 border border-slate-200 rounded-lg" />
                            <span>-</span>
                            <input type="number" placeholder="Max" className="w-full p-2 border border-slate-200 rounded-lg" />
                        </div>
                    </div>
                </div>

                {/* Product Grid */}
                <div className="flex-1">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {loading ? (
                            <div className="col-span-full text-center py-20 text-slate-500">Loading products...</div>
                        ) : products.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>

                    {!loading && products.length === 0 && (
                        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
                            <p className="text-slate-400">No products found.</p>
                            <button onClick={() => { setSelectedCategory('All'); setKeyword(''); setSearchInput(''); setPage(1); }} className="mt-4 text-primary font-bold hover:underline">Clear Filters</button>
                        </div>
                    )}

                    {/* Pagination Controls */}
                    {!loading && totalPages > 1 && (
                        <div className="flex justify-center items-center gap-4 mt-12">
                            <button 
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className={`px-4 py-2 rounded-lg font-bold text-sm transition-colors ${page === 1 ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-white border border-slate-200 text-slate-700 hover:border-primary hover:text-primary'}`}
                            >
                                Previous
                            </button>
                            <span className="text-slate-600 text-sm font-medium">Page {page} of {totalPages}</span>
                            <button 
                                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages}
                                className={`px-4 py-2 rounded-lg font-bold text-sm transition-colors ${page === totalPages ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-white border border-slate-200 text-slate-700 hover:border-primary hover:text-primary'}`}
                            >
                                Next
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Medicines;
