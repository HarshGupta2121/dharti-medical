import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useNavigate, Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight, CreditCard, Wallet, Banknote } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const Cart = () => {
    const { cart, removeFromCart, updateQuantity, subtotal, clearCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [orderPlaced, setOrderPlaced] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');

    const targetAmount = 100;
    const isEligibleForDiscount = subtotal >= targetAmount;
    
    const shipping = isEligibleForDiscount ? 0 : 30;
    const discount = isEligibleForDiscount ? (subtotal * 0.10) : 0;
    const total = subtotal + shipping - discount;
    const remainingForDiscount = Math.max(0, targetAmount - subtotal);
    const progressPercentage = Math.min(100, (subtotal / targetAmount) * 100);

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

    const handleCheckout = async () => {
        if (!user) {
            toast.error('Please login to place an order');
            navigate('/login');
            return;
        }

        const orderData = {
            orderItems: cart,
            shippingAddress: {
                address: '123 Main St', // Placeholder - in real app would ask user
                city: 'Cityville',
                postalCode: '10001',
                country: 'India'
            },
            paymentMethod: paymentMethod,
            itemsPrice: subtotal,
            taxPrice: 0,
            shippingPrice: shipping,
            discount: discount,
            totalPrice: total,
            userId: user._id
        };

        try {
            const loadingToast = toast.loading('Placing order...');
            await axios.post(`${API_URL}/orders`, orderData);
            toast.dismiss(loadingToast);
            toast.success('Order placed successfully!');
            setOrderPlaced(true);
            clearCart();
        } catch (error) {
            console.error('Order failed', error);
            toast.error('Failed to place order. Please try again.');
        }
    };

    if (orderPlaced) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center bg-slate-50 px-4 text-center">
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6 text-green-600 text-4xl">🎉</div>
                <h2 className="text-3xl font-bold text-slate-900 mb-2">Order Placed Successfully!</h2>
                <p className="text-slate-500 mb-8 max-w-md">
                    Thank you, {user?.name}. Your order has been received and will be processed shortly.
                </p>
                <div className="flex gap-4">
                    <Link to="/" className="px-6 py-3 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold hover:border-primary hover:text-primary transition-colors">
                        Back to Home
                    </Link>
                    <Link to="/medicines" className="px-6 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary-dark transition-colors shadow-lg shadow-primary/25">
                        Continue Shopping
                    </Link>
                </div>
            </div>
        );
    }

    if (cart.length === 0 && !orderPlaced) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center bg-slate-50 px-4">
                <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-6 text-4xl">🛒</div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Your cart is empty</h2>
                <p className="text-slate-500 mb-6">Looks like you haven't added anything yet.</p>
                <Link to="/medicines" className="px-8 py-3 bg-primary text-white rounded-full font-bold hover:bg-primary-dark transition-colors shadow-lg shadow-primary/25">
                    Start Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-slate-50 min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-slate-900 mb-6">Shopping Cart</h1>

            {/* Progress Bar for Free Delivery & Discount */}
            <div className="bg-white rounded-2xl p-5 mb-8 shadow-sm border border-slate-100">
                <div className="flex justify-between items-end mb-3">
                    <div>
                        {isEligibleForDiscount ? (
                            <h3 className="text-green-600 font-bold text-lg flex items-center gap-2">
                                <span className="text-2xl">🎉</span> Congratulations! You've unlocked Free Delivery & 10% Discount!
                            </h3>
                        ) : (
                            <h3 className="text-slate-800 font-bold text-lg">
                                Add <span className="text-primary">₹{remainingForDiscount.toFixed(2)}</span> more to get <span className="text-primary font-bold">Free Delivery & 10% Discount!</span>
                            </h3>
                        )}
                    </div>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-3 mb-1 overflow-hidden">
                    <div 
                        className={`h-3 rounded-full transition-all duration-500 ease-out ${isEligibleForDiscount ? 'bg-green-500' : 'bg-primary'}`} 
                        style={{ width: `${progressPercentage}%` }}
                    ></div>
                </div>
                {!isEligibleForDiscount && <p className="text-xs text-slate-400 mt-2 text-right">Target: ₹100.00</p>}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Cart Items */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="space-y-4">
                        {cart.map(item => (
                            <div key={item.id} className="bg-white rounded-2xl p-6 shadow-sm flex items-center gap-6 border border-slate-100 hover:border-primary/20 transition-colors">
                                <div className="w-24 h-24 bg-slate-50 rounded-xl flex items-center justify-center text-3xl overflow-hidden p-2">
                                    {item.image ? <img src={item.image} alt={item.name} className="w-full h-full object-contain mix-blend-multiply" /> : '💊'}
                                </div>

                                <div className="flex-1">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h3 className="font-bold text-slate-900 text-lg">{item.name}</h3>
                                            <p className="text-slate-500 text-sm">{item.dosage}</p>
                                        </div>
                                        <button
                                            onClick={() => removeFromCart(item.id)}
                                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                    </div>

                                    <div className="flex justify-between items-end mt-4">
                                        <div className="flex items-center gap-3 bg-slate-50 rounded-full p-1 border border-slate-100">
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center hover:bg-slate-100 text-slate-600 transition-colors"
                                            >
                                                <Minus size={16} />
                                            </button>
                                            <span className="font-bold text-slate-900 w-6 text-center">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center hover:bg-slate-100 text-slate-600 transition-colors"
                                            >
                                                <Plus size={16} />
                                            </button>
                                        </div>
                                        <span className="font-bold text-slate-900 text-lg">₹{(parseFloat(item.price) * item.quantity).toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Payment Methods */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                        <h3 className="text-xl font-bold text-slate-900 mb-4">Payment Method</h3>
                        <div className="space-y-3">
                            <label className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${paymentMethod === 'Cash on Delivery' ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-slate-200 hover:border-slate-300'}`}>
                                <input
                                    type="radio"
                                    name="payment"
                                    value="Cash on Delivery"
                                    checked={paymentMethod === 'Cash on Delivery'}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                    className="w-4 h-4 text-primary focus:ring-primary border-gray-300"
                                />
                                <div className="ml-3 flex items-center gap-3">
                                    <div className="p-2 bg-green-100 text-green-600 rounded-lg">
                                        <Banknote size={20} />
                                    </div>
                                    <span className="font-medium text-slate-900">Cash on Delivery</span>
                                </div>
                            </label>

                            <label className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${paymentMethod === 'UPI' ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-slate-200 hover:border-slate-300'}`}>
                                <input
                                    type="radio"
                                    name="payment"
                                    value="UPI"
                                    checked={paymentMethod === 'UPI'}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                    className="w-4 h-4 text-primary focus:ring-primary border-gray-300"
                                />
                                <div className="ml-3 flex items-center gap-3">
                                    <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                                        <Wallet size={20} />
                                    </div>
                                    <span className="font-medium text-slate-900">UPI (PhonePe / GPay)</span>
                                </div>
                            </label>

                            <label className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${paymentMethod === 'Card' ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-slate-200 hover:border-slate-300'}`}>
                                <input
                                    type="radio"
                                    name="payment"
                                    value="Card"
                                    checked={paymentMethod === 'Card'}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                    className="w-4 h-4 text-primary focus:ring-primary border-gray-300"
                                />
                                <div className="ml-3 flex items-center gap-3">
                                    <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                                        <CreditCard size={20} />
                                    </div>
                                    <span className="font-medium text-slate-900">Credit / Debit Card</span>
                                </div>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-24 border border-slate-100">
                        <h3 className="text-xl font-bold text-slate-900 mb-6">Order Summary</h3>

                        <div className="space-y-4 mb-6 border-b border-slate-100 pb-6">
                            <div className="flex justify-between text-slate-600">
                                <span>Subtotal</span>
                                <span className="font-medium">₹{subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-slate-600">
                                <span>Delivery Charge</span>
                                {isEligibleForDiscount ? (
                                    <span className="flex items-center gap-2">
                                        <span className="text-slate-400 line-through text-sm">₹30.00</span>
                                        <span className="font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded text-xs">FREE</span>
                                    </span>
                                ) : (
                                    <span className="font-medium">₹{shipping.toFixed(2)}</span>
                                )}
                            </div>
                            {discount > 0 && (
                                <div className="flex justify-between text-green-700 font-bold bg-green-50 p-3 rounded-xl border border-green-100">
                                    <span>Discount (10%)</span>
                                    <span>- ₹{discount.toFixed(2)}</span>
                                </div>
                            )}
                        </div>

                        <div className="flex justify-between items-center mb-8 bg-slate-50 p-4 rounded-xl">
                            <span className="font-bold text-slate-900 text-lg">Total</span>
                            <span className="font-bold text-primary text-2xl">₹{total.toFixed(2)}</span>
                        </div>

                        <button
                            onClick={handleCheckout}
                            className="w-full py-4 bg-primary text-white rounded-xl font-bold text-lg hover:bg-primary-dark transition-all transform hover:-translate-y-1 shadow-lg shadow-primary/25 flex items-center justify-center gap-2"
                        >
                            Place Order <ArrowRight size={20} />
                        </button>

                        <div className="mt-6 flex items-center justify-center gap-2 text-slate-500 text-xs">
                            <CreditCard size={14} /> Secure Checkout
                            <span className="mx-2">•</span>
                            <Truck size={14} /> Free Returns
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );

            </div>
        </div>
    );
};

export default Cart;
