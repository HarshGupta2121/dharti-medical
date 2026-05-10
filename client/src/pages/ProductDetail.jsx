import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, Minus, Plus, ShoppingCart, ShieldCheck, Truck, RotateCcw } from 'lucide-react';
import { fetchProductById } from '../services/api';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ui/ProductCard';

const ProductDetail = () => {
    const { id } = useParams();
    const { addToCart } = useCart();
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState('description');
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadProduct = async () => {
            try {
                const data = await fetchProductById(id);
                if (data) {
                    // Normalize data
                    const normalized = {
                        id: data._id,
                        name: data.name,
                        brand: 'MediCare', // Default or from DB if available
                        category: data.category,
                        dosage: data.dosage,
                        price: data.price,
                        originalPrice: data.originalPrice || (data.price * 1.2).toFixed(2),
                        rating: data.rating || 4.5,
                        reviews: data.reviews || 0,
                        description: data.description,
                        ingredients: 'Composition details available on package.', // Default
                        usage: 'As prescribed by physician.', // Default
                        safety: 'Consult doctor before use.', // Default
                        image: data.image
                    };
                    setProduct(normalized);
                }
            } catch (error) {
                console.error("Error loading product", error);
            } finally {
                setLoading(false);
            }
        };
        loadProduct();
    }, [id]);

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    if (!product) return <div className="min-h-screen flex items-center justify-center">Product not found</div>;

    const relatedProducts = [
        { id: 2, name: 'Amoxicillin', category: 'Antibiotic', dosage: '250mg • 15 Capsules', price: '12.50', bgColor: 'bg-emerald-800 text-white' },
        { id: 3, name: 'Vitamin C', category: 'Supplements', dosage: '1000mg • 60 Tablets', price: '15.00', bgColor: 'bg-orange-100' },
        { id: 4, name: 'Omega-3 Fish Oil', category: 'Health Supplements', dosage: '1000mg • 90 Softgels', price: '22.00', bgColor: 'bg-green-100' },
    ];

    const handleAddToCart = () => {
        addToCart(product, quantity);
    };

    return (
        <div className="bg-slate-50 min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">

            {/* Breadcrumb */}
            <nav className="flex mb-8 text-sm text-slate-500">
                <Link to="/" className="hover:text-primary">Home</Link>
                <span className="mx-2">/</span>
                <Link to="/medicines" className="hover:text-primary">Medicines</Link>
                <span className="mx-2">/</span>
                <span className="text-slate-900 font-medium">{product.name}</span>
            </nav>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
                {/* Product Image */}
                <div className="bg-white rounded-3xl p-8 shadow-sm flex items-center justify-center min-h-[400px] border border-slate-100 overflow-hidden">
                    {product.image ? (
                        <img src={product.image} alt={product.name} className="max-w-full max-h-[400px] object-contain" />
                    ) : (
                        <div className="text-9xl">💊</div>
                    )}
                </div>

                {/* Product Info */}
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full uppercase tracking-wider">In Stock</span>
                        <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-full uppercase tracking-wider">{product.category}</span>
                    </div>

                    <h1 className="text-4xl font-bold text-slate-900 mb-2">{product.name}</h1>
                    <p className="text-slate-500 text-lg mb-4">By {product.brand}</p>

                    <div className="flex items-center gap-4 mb-6">
                        <div className="flex text-yellow-500">
                            {[1, 2, 3, 4, 5].map(i => <Star key={i} size={18} fill="currentColor" />)}
                        </div>
                        <span className="text-slate-500 text-sm font-medium">{product.rating} ({product.reviews} reviews)</span>
                        <div className="mt-8">
                            <div className="flex items-baseline gap-4">
                                <span className="text-4xl font-bold text-slate-900">₹{product.price}</span>
                                {product.originalPrice && (
                                    <span className="text-xl text-slate-400 line-through">₹{product.originalPrice}</span>
                                )}
                            </div>
                            <p className="mt-2 text-green-600 font-medium">In Stock • Fast Delivery</p>
                        </div>
                    </div>

                    <div className="border-t border-b border-slate-100 py-6 mb-8 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors"
                            >
                                <Minus size={18} />
                            </button>
                            <span className="text-xl font-bold text-slate-900 w-8 text-center">{quantity}</span>
                            <button
                                onClick={() => setQuantity(quantity + 1)}
                                className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors"
                            >
                                <Plus size={18} />
                            </button>
                        </div>

                        <button
                            onClick={handleAddToCart}
                            className="flex-1 ml-8 bg-primary text-white py-4 rounded-xl font-bold text-lg hover:bg-primary-dark transition-colors shadow-lg shadow-primary/25 flex items-center justify-center gap-2"
                        >
                            <ShoppingCart size={22} /> Add to Cart
                        </button>
                    </div>

                    {/* Features */}
                    <div className="grid grid-cols-3 gap-4">
                        <div className="flex flex-col items-center text-center p-4 bg-white rounded-xl border border-slate-100">
                            <ShieldCheck size={24} className="text-primary mb-2" />
                            <span className="text-xs font-bold text-slate-900">100% Genuine</span>
                        </div>
                        <div className="flex flex-col items-center text-center p-4 bg-white rounded-xl border border-slate-100">
                            <Truck size={24} className="text-primary mb-2" />
                            <span className="text-xs font-bold text-slate-900">Fast Delivery</span>
                        </div>
                        <div className="flex flex-col items-center text-center p-4 bg-white rounded-xl border border-slate-100">
                            <RotateCcw size={24} className="text-primary mb-2" />
                            <span className="text-xs font-bold text-slate-900">Easy Returns</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs Section */}
            <div className="bg-white rounded-[2rem] p-8 shadow-sm mb-16">
                <div className="flex border-b border-slate-200 mb-6">
                    {['description', 'ingredients', 'usage', 'safety'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-8 py-4 font-bold text-sm uppercase tracking-wider border-b-2 transition-colors ${activeTab === tab ? 'border-primary text-primary' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
                <div className="text-slate-600 leading-relaxed text-lg min-h-[200px]">
                    {product[activeTab]}
                </div>
            </div>

            {/* Related Products */}
            <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-8">Similar Products</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {relatedProducts.map(p => (
                        <ProductCard key={p.id} product={p} />
                    ))}
                </div>
            </div>

        </div>
    );
};

export default ProductDetail;
