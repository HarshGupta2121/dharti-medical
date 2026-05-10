import React, { useState } from 'react';
import { Upload, X, FileText, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const UploadPrescription = () => {
    const { user } = useAuth();
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [submitted, setSubmitted] = useState(false);

    // Form States
    const [patientName, setPatientName] = useState(user?.name || '');
    const [patientPhone, setPatientPhone] = useState('');
    const [deliveryAddress, setDeliveryAddress] = useState('');
    const [additionalNotes, setAdditionalNotes] = useState('');
    const [loading, setLoading] = useState(false);

    const handleFileChange = (e) => {
        const selected = e.target.files[0];
        if (selected) {
            setFile(selected);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(selected);
        }
    };

    const handleRemoveFile = () => {
        setFile(null);
        setPreview(null);
    };

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData();
        formData.append('image', file);
        formData.append('patientName', patientName);
        formData.append('patientPhone', patientPhone);
        formData.append('deliveryAddress', deliveryAddress);
        formData.append('additionalNotes', additionalNotes);
        if (user) {
            formData.append('userId', user._id);
        }

        try {
            await axios.post(`${API_URL}/prescriptions/upload`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setSubmitted(true);
        } catch (error) {
            console.error('Upload failed', error);
            alert('Failed to upload prescription. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center bg-slate-50 px-4 text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-6">
                    <CheckCircle size={40} />
                </div>
                <h2 className="text-3xl font-bold text-slate-900 mb-2">Prescription Uploaded!</h2>
                <p className="text-slate-500 mb-8 max-w-md">
                    Our pharmacists will review your prescription and prepare your order. You will receive a notification shortly.
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

    return (
        <div className="bg-slate-50 min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-3xl font-bold text-slate-900 mb-2">Upload Prescription</h1>
                <p className="text-slate-500 mb-8">Please upload a clear image of your valid prescription.</p>

                <form onSubmit={handleSubmit} className="bg-white rounded-[2rem] p-8 md:p-10 shadow-sm">

                    {/* File Upload Area */}
                    <div className="mb-8">
                        <label className="block text-sm font-bold text-slate-700 mb-4">Prescription Image</label>

                        {!preview ? (
                            <div className="border-2 border-dashed border-slate-200 rounded-2xl p-10 flex flex-col items-center justify-center bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer relative">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-primary shadow-sm mb-4">
                                    <Upload size={24} />
                                </div>
                                <p className="text-slate-900 font-bold mb-1">Click to upload or drag and drop</p>
                                <p className="text-slate-400 text-sm">SVG, PNG, JPG or GIF (max. 5MB)</p>
                            </div>
                        ) : (
                            <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-50">
                                <img src={preview} alt="Prescription Preview" className="w-full h-64 object-contain" />
                                <button
                                    type="button"
                                    onClick={handleRemoveFile}
                                    className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur-sm rounded-full text-slate-600 hover:text-red-500 transition-colors"
                                >
                                    <X size={20} />
                                </button>
                                <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm p-3 rounded-xl flex items-center gap-3">
                                    <FileText size={20} className="text-primary" />
                                    <span className="text-sm font-medium text-slate-700 truncate flex-1">{file.name}</span>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Full Name</label>
                            <input
                                required
                                type="text"
                                placeholder="John Doe"
                                value={patientName}
                                onChange={(e) => setPatientName(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Phone Number</label>
                            <input
                                required
                                type="tel"
                                placeholder="+1 (555) 000-0000"
                                value={patientPhone}
                                onChange={(e) => setPatientPhone(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-bold text-slate-700 mb-2">Delivery Address</label>
                            <textarea
                                required
                                rows="3"
                                placeholder="Enter your full address"
                                value={deliveryAddress}
                                onChange={(e) => setDeliveryAddress(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                            ></textarea>
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-bold text-slate-700 mb-2">Additional Notes (Optional)</label>
                            <textarea
                                rows="2"
                                placeholder="Any specific instructions..."
                                value={additionalNotes}
                                onChange={(e) => setAdditionalNotes(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                            ></textarea>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={!file || loading}
                        className={`w-full py-4 rounded-xl font-bold text-lg transition-all shadow-lg ${file ? 'bg-primary text-white hover:bg-primary-dark shadow-primary/25' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
                    >
                        {loading ? 'Uploading...' : 'Submit Prescription'}
                    </button>

                </form>
            </div>
        </div>
    );
};

export default UploadPrescription;
