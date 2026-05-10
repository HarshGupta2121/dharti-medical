import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const { user } = useAuth();
    const [cart, setCart] = useState(() => {
        try {
            const storedCart = localStorage.getItem('cart');
            return storedCart ? JSON.parse(storedCart) : [];
        } catch (error) {
            return [];
        }
    });

    const isInitialMount = useRef(true);

    const USERS_API_URL = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/users` : 'http://localhost:5000/api/users';

    // Fetch cart from DB on login
    useEffect(() => {
        const fetchDbCart = async () => {
            if (user) {
                try {
                    const config = {
                        headers: {
                            Authorization: `Bearer ${user.token}`,
                        },
                    };
                    const { data } = await axios.get(`${USERS_API_URL}/cart`, config);
                    
                    setCart(prevLocalCart => {
                        const merged = [...data];
                        prevLocalCart.forEach(localItem => {
                            if (!merged.find(dbItem => dbItem.id === localItem.id)) {
                                merged.push(localItem);
                            }
                        });
                        return merged;
                    });
                } catch (error) {
                    console.error('Failed to fetch cart from DB', error);
                }
            }
        };
        fetchDbCart();
    }, [user]);

    // Save to local storage and DB
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));

        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }

        if (user) {
            const saveToDb = async () => {
                try {
                    const config = {
                        headers: {
                            Authorization: `Bearer ${user.token}`,
                        },
                    };
                    await axios.put(`${USERS_API_URL}/cart`, { cart }, config);
                } catch (error) {
                    console.error('Failed to save cart to DB', error);
                }
            };
            saveToDb();
        }
    }, [cart, user]);

    const addToCart = (product, quantity = 1) => {
        setCart(prevCart => {
            const existingItem = prevCart.find(item => item.id === product.id);
            if (existingItem) {
                toast.success(`Updated ${product.name} quantity`);
                return prevCart.map(item =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            }
            toast.success(`Added ${product.name} to cart`);
            return [...prevCart, { ...product, quantity }];
        });
    };

    const removeFromCart = (productId) => {
        setCart(prevCart => prevCart.filter(item => item.id !== productId));
    };

    const updateQuantity = (productId, newQuantity) => {
        if (newQuantity < 1) return;
        setCart(prevCart =>
            prevCart.map(item =>
                item.id === productId ? { ...item, quantity: newQuantity } : item
            )
        );
    };

    const clearCart = () => setCart([]);

    const subtotal = cart.reduce((total, item) => total + (parseFloat(item.price) * item.quantity), 0);
    const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, subtotal, cartCount }}>
            {children}
        </CartContext.Provider>
    );
};
