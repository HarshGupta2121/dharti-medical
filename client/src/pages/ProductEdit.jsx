import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Save } from 'lucide-react';
import toast from 'react-hot-toast';

const ProductEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';


    const [name, setName] = useState('');
    const [price, setPrice] = useState(0);
    const [image, setImage] = useState('');
    const [brand, setBrand] = useState('');
    const [category, setCategory] = useState('');
    const [countInStock, setCountInStock] = useState(0);
    const [description, setDescription] = useState('');
    const [dosage, setDosage] = useState('');
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        if (!user || !user.isAdmin) {
            navigate('/');
            return;
        }

        const fetchProduct = async () => {
            try {
                const { data } = await axios.get(`${API_URL}/products/${id}`);
                setName(data.name);
                setPrice(data.price);
                setImage(data.image);
                setBrand(data.brand);
                setCategory(data.category);
                setCountInStock(data.countInStock);
                setDescription(data.description);
                setDosage(data.dosage || '');
            } catch (error) {
                toast.error('Error fetching product');
            }
        };

        fetchProduct();
    }, [id, navigate, user]);

    const uploadFileHandler = async (e) => {
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('image', file);
        setUploading(true);
        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            };
            const { data } = await axios.post(`${API_URL}/upload`, formData, config);
            setImage(data);
            setUploading(false);
            toast.success('Image Uploaded Successfully');
        } catch (error) {
            console.error(error);
            setUploading(false);
            toast.error('Image Upload Failed');
        }
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            const userInfo = JSON.parse(localStorage.getItem('user'));
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };

            await axios.put(
                `${API_URL}/products/${id}`,
                {
                    name,
                    price,
                    image,
                    brand,
                    category,
                    description,
                    countInStock,
                    dosage
                },
                config
            );

            toast.success('Product Updated');
            navigate('/admin');
        } catch (error) {
            toast.error('Error updating product');
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <Link to="/admin" className="inline-flex items-center text-slate-500 hover:text-primary mb-6 transition-colors">
                    <ArrowLeft size={20} className="mr-2" /> Back to Dashboard
                </Link>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
                    <h1 className="text-2xl font-bold text-slate-900 mb-8">Edit Product</h1>

                    <form onSubmit={submitHandler} className="space-y-6">

                        {/* Name */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                            <input
                                type="text"
                                placeholder="Enter name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                            />
                        </div>

                        {/* Price & Stock */}
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Price</label>
                                <input
                                    type="number"
                                    placeholder="Enter price"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Stock</label>
                                <input
                                    type="number"
                                    placeholder="Enter stock"
                                    value={countInStock}
                                    onChange={(e) => setCountInStock(e.target.value)}
                                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                />
                            </div>
                        </div>

                        {/* Image */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Image URL</label>
                            <input
                                type="text"
                                placeholder="Enter image url"
                                value={image}
                                onChange={(e) => setImage(e.target.value)}
                                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary mb-2"
                            />
                            <input 
                                type="file" 
                                onChange={uploadFileHandler}
                                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                            />
                            {uploading && <p className="text-sm text-slate-500 mt-2">Uploading...</p>}
                        </div>

                        {/* Brand & Category */}
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Brand</label>
                                <input
                                    type="text"
                                    placeholder="Enter brand"
                                    value={brand}
                                    onChange={(e) => setBrand(e.target.value)}
                                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                                <input
                                    type="text"
                                    placeholder="Enter category"
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                />
                            </div>
                        </div>

                        {/* Dosage */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Dosage</label>
                            <input
                                type="text"
                                placeholder="Enter dosage (e.g. 500mg)"
                                value={dosage}
                                onChange={(e) => setDosage(e.target.value)}
                                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                            <textarea
                                rows="4"
                                placeholder="Enter description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                            ></textarea>
                        </div>

                        <button
                            type="submit"
                            className="w-full py-3 bg-primary text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-primary-dark transition-colors shadow-lg shadow-primary/25"
                        >
                            <Save size={20} /> Update Product
                        </button>

                    </form>
                </div>
            </div>
        </div>
    );
};

export default ProductEdit;
