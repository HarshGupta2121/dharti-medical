import React from 'react';
import { Plus, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

const ProductCard = ({ product }) => {
    const { addToCart } = useCart();

    const handleAddToCart = (e) => {
        e.preventDefault();
        addToCart(product);
    };

    const isDark = product.darker;

    return (
        <div className={`rounded-[2rem] p-5 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col h-full group ${product.cardBg} ${isDark ? 'border-none' : 'border border-slate-100'}`}>
            {/* Image Area */}
            <div className={`relative h-48 rounded-2xl mb-5 overflow-hidden flex items-center justify-center ${isDark ? 'bg-white/10' : 'bg-slate-50'}`}>
                <button className={`absolute top-3 right-3 p-2 rounded-full transition-colors ${isDark ? 'bg-white/20 text-white hover:bg-white hover:text-red-500' : 'bg-white/60 text-slate-400 hover:text-red-500'}`}>
                    <Heart size={18} />
                </button>
                {product.image ? (
                    <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                ) : (
                    // Placeholder if no image
                    <div className="text-4xl">💊</div>
                )}
            </div>

            {/* Content */}
            <Link to={`/product/${product.id}`} className="flex-1 flex flex-col">
                <div className="mb-3">
                    <span className={`text-[10px] uppercase font-bold tracking-wider ${product.accentColor}`}>{product.category}</span>
                    <h3 className={`${product.textColor} font-bold text-xl leading-tight mt-1`}>{product.name}</h3>
                    <p className={`text-xs mt-1 ${isDark ? 'text-white/60' : 'text-slate-400'}`}>{product.dosage}</p>
                </div>

                <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-slate-900">₹{product.price}</span>
                    <button
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-transform hover:scale-105 shadow-lg ${isDark ? 'bg-white text-primary' : 'bg-primary text-white'}`}
                        onClick={handleAddToCart}
                    >
                        <Plus size={20} />
                    </button>
                </div>
            </Link>
        </div>
    );
};

export default ProductCard;
