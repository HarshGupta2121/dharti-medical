import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { Package, Truck, CheckCircle, Users, ShoppingBag, Edit, Trash2, Plus, Save, ListChecks, FileText, Image as ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('orders');

    const [orders, setOrders] = useState([]);
    const [products, setProducts] = useState([]);
    const [users, setUsers] = useState([]);
    const [prescriptions, setPrescriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isBulkEditMode, setIsBulkEditMode] = useState(false);
    const [editedProducts, setEditedProducts] = useState({});

    const userInfo = JSON.parse(localStorage.getItem('user'));
    const config = {
        headers: { Authorization: `Bearer ${userInfo?.token}` },
    };

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';


    useEffect(() => {
        if (!user || !user.isAdmin) {
            navigate('/');
        } else {
            fetchData();
        }
    }, [user, navigate, activeTab]);

    const fetchData = async () => {
        setLoading(true);
        try {
            if (activeTab === 'orders') {
                const { data } = await axios.get(`${API_URL}/orders`, config);
                setOrders(data);
            } else if (activeTab === 'products') {
                const { data } = await axios.get(`${API_URL}/products?limit=1000`);
                setProducts(data.products || []);
            } else if (activeTab === 'users') {
                const { data } = await axios.get(`${API_URL}/users`, config);
                setUsers(data);
            } else if (activeTab === 'prescriptions') {
                const { data } = await axios.get(`${API_URL}/prescriptions`, config);
                setPrescriptions(data);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            const message = error.response?.data?.message || error.message || 'Failed to load data';
            toast.error(`Error: ${message}`);
        } finally {
            setLoading(false);
        }
    };

    const markAsDelivered = async (id) => {
        try {
            await axios.put(`${API_URL}/orders/${id}/deliver`, {}, config);
            toast.success('Order Marked as Delivered');
            fetchData();
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    const deleteProduct = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await axios.delete(`${API_URL}/products/${id}`, config);
                toast.success('Product Deleted');
                fetchData();
            } catch (error) {
                toast.error('Failed to delete product');
            }
        }
    };

    const createProduct = async () => {
        try {
            const { data } = await axios.post(`${API_URL}/products`, {}, config);
            toast.success('Sample Product Created');
            navigate(`/admin/product/${data._id}/edit`);
        } catch (error) {
            toast.error('Failed to create product');
        }
    };

    const handleBulkEditChange = (id, field, value) => {
        setEditedProducts((prev) => ({
            ...prev,
            [id]: {
                ...(prev[id] || products.find(p => p._id === id)),
                [field]: value
            }
        }));
    };

    const saveBulkEdits = async () => {
        const updates = Object.values(editedProducts);
        if (updates.length === 0) {
            setIsBulkEditMode(false);
            return;
        }

        try {
            await axios.put(`${API_URL}/products/bulk`, { products: updates }, config);
            toast.success('Products updated successfully');
            setEditedProducts({});
            setIsBulkEditMode(false);
            fetchData();
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to update products';
            toast.error(message);
        }
    };

    const deleteUser = async (id) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await axios.delete(`${API_URL}/users/${id}`, config);
                toast.success('User Deleted');
                fetchData();
            } catch (error) {
                toast.error('Failed to delete user');
            }
        }
    };

    const toggleAdminStatus = async (id, isAdmin) => {
        try {
            // isAdmin is current status, so we want to set it to !isAdmin
            await axios.put(`${API_URL}/users/${id}/admin`, { isAdmin: !isAdmin }, config);
            toast.success('User Role Updated');
            fetchData();
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to update user';
            toast.error(message);
        }
    };

    const updatePrescriptionStatus = async (id, status) => {
        try {
            await axios.put(`${API_URL}/prescriptions/${id}/status`, { status }, config);
            toast.success(`Prescription marked as ${status}`);
            fetchData();
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    const deletePrescription = async (id) => {
        if (window.confirm('Are you sure you want to delete this prescription?')) {
            try {
                await axios.delete(`${API_URL}/prescriptions/${id}`, config);
                toast.success('Prescription deleted');
                fetchData();
            } catch (error) {
                toast.error('Failed to delete prescription');
            }
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <Package className="text-primary" />
                        </div>
                        Admin Dashboard
                    </h1>
                </div>

                {/* Tabs */}
                <div className="flex gap-4 mb-8 border-b border-slate-200">
                    <button
                        onClick={() => setActiveTab('orders')}
                        className={`pb-4 px-4 font-medium transition-colors relative ${activeTab === 'orders' ? 'text-primary' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        <div className="flex items-center gap-2">
                            <Truck size={18} /> Orders
                        </div>
                        {activeTab === 'orders' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-t-full"></div>}
                    </button>
                    <button
                        onClick={() => setActiveTab('products')}
                        className={`pb-4 px-4 font-medium transition-colors relative ${activeTab === 'products' ? 'text-primary' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        <div className="flex items-center gap-2">
                            <ShoppingBag size={18} /> Products
                        </div>
                        {activeTab === 'products' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-t-full"></div>}
                    </button>
                    <button
                        onClick={() => setActiveTab('users')}
                        className={`pb-4 px-4 font-medium transition-colors relative ${activeTab === 'users' ? 'text-primary' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        <div className="flex items-center gap-2">
                            <Users size={18} /> Users
                        </div>
                        {activeTab === 'users' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-t-full"></div>}
                    </button>
                    <button
                        onClick={() => setActiveTab('prescriptions')}
                        className={`pb-4 px-4 font-medium transition-colors relative ${activeTab === 'prescriptions' ? 'text-primary' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        <div className="flex items-center gap-2">
                            <FileText size={18} /> Prescriptions
                        </div>
                        {activeTab === 'prescriptions' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-t-full"></div>}
                    </button>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">

                    {/* Orders Tab */}
                    {activeTab === 'orders' && (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-slate-50 text-slate-500 font-medium">
                                    <tr>
                                        <th className="px-6 py-4">Order ID</th>
                                        <th className="px-6 py-4">User</th>
                                        <th className="px-6 py-4">Date</th>
                                        <th className="px-6 py-4">Total</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {loading ? (
                                        <tr><td colSpan="6" className="px-6 py-8 text-center">Loading...</td></tr>
                                    ) : orders.map(order => (
                                        <tr key={order._id} className="hover:bg-slate-50/50">
                                            <td className="px-6 py-4 font-mono text-xs text-slate-500">{order._id}</td>
                                            <td className="px-6 py-4 font-medium">{order.user?.name || 'Unknown'}</td>
                                            <td className="px-6 py-4 text-slate-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                                            <td className="px-6 py-4 font-bold text-primary">₹{order.totalPrice.toFixed(2)}</td>
                                            <td className="px-6 py-4">
                                                {order.isDelivered ? (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700"><CheckCircle size={12} /> Delivered</span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-700"><Truck size={12} /> Processing</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                {!order.isDelivered && (
                                                    <button onClick={() => markAsDelivered(order._id)} className="px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-slate-800">Mark Delivered</button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Products Tab */}
                    {activeTab === 'products' && (
                        <div>
                            <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                                <button
                                    onClick={() => {
                                        setIsBulkEditMode(!isBulkEditMode);
                                        setEditedProducts({});
                                    }}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-colors ${isBulkEditMode ? 'bg-slate-200 text-slate-700 hover:bg-slate-300' : 'bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200'}`}
                                >
                                    <ListChecks size={16} /> {isBulkEditMode ? 'Cancel Bulk Edit' : 'Bulk Edit Mode'}
                                </button>
                                <div className="flex gap-3">
                                    {isBulkEditMode && (
                                        <button onClick={saveBulkEdits} className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-green-600 transition-colors">
                                            <Save size={16} /> Save Changes
                                        </button>
                                    )}
                                    <button onClick={createProduct} className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-primary-dark transition-colors">
                                        <Plus size={16} /> Create Product
                                    </button>
                                </div>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-slate-50 text-slate-500 font-medium">
                                        <tr>
                                            <th className="px-6 py-4">ID</th>
                                            <th className="px-6 py-4">Name</th>
                                            <th className="px-6 py-4">Price</th>
                                            <th className="px-6 py-4">Category</th>
                                            <th className="px-6 py-4">Brand</th>
                                            <th className="px-6 py-4">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {loading ? (
                                            <tr><td colSpan="6" className="px-6 py-8 text-center">Loading...</td></tr>
                                        ) : products.map(product => {
                                            const edited = editedProducts[product._id] || product;
                                            return (
                                                <tr key={product._id} className="hover:bg-slate-50/50">
                                                    <td className="px-6 py-4 font-mono text-xs text-slate-500 truncate max-w-[100px]">{product._id}</td>
                                                    <td className="px-6 py-4 font-medium">
                                                        {isBulkEditMode ? (
                                                            <input type="text" value={edited.name} onChange={(e) => handleBulkEditChange(product._id, 'name', e.target.value)} className="w-full border border-slate-300 rounded px-2 py-1 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none" />
                                                        ) : (
                                                            <span className="truncate max-w-[200px] block">{product.name}</span>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        {isBulkEditMode ? (
                                                            <div className="flex items-center gap-1">₹<input type="number" value={edited.price} onChange={(e) => handleBulkEditChange(product._id, 'price', e.target.value)} className="w-20 border border-slate-300 rounded px-2 py-1 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none" /></div>
                                                        ) : (
                                                            `₹${product.price}`
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        {isBulkEditMode ? (
                                                            <input type="text" value={edited.category} onChange={(e) => handleBulkEditChange(product._id, 'category', e.target.value)} className="w-full border border-slate-300 rounded px-2 py-1 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none" />
                                                        ) : (
                                                            product.category
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        {isBulkEditMode ? (
                                                            <input type="text" value={edited.brand} onChange={(e) => handleBulkEditChange(product._id, 'brand', e.target.value)} className="w-full border border-slate-300 rounded px-2 py-1 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none" />
                                                        ) : (
                                                            product.brand
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 flex gap-3">
                                                        <Link to={`/admin/product/${product._id}/edit`} className="text-slate-400 hover:text-primary">
                                                            <Edit size={18} />
                                                        </Link>
                                                        <button onClick={() => deleteProduct(product._id)} className="text-slate-400 hover:text-red-500">
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Users Tab */}
                    {activeTab === 'users' && (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-slate-50 text-slate-500 font-medium">
                                    <tr>
                                        <th className="px-6 py-4">ID</th>
                                        <th className="px-6 py-4">Name</th>
                                        <th className="px-6 py-4">Email</th>
                                        <th className="px-6 py-4">Role</th>
                                        <th className="px-6 py-4">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {loading ? (
                                        <tr><td colSpan="5" className="px-6 py-8 text-center">Loading...</td></tr>
                                    ) : users.map(userItem => (
                                        <tr key={userItem._id} className="hover:bg-slate-50/50">
                                            <td className="px-6 py-4 font-mono text-xs text-slate-500">{userItem._id}</td>
                                            <td className="px-6 py-4 font-medium">{userItem.name}</td>
                                            <td className="px-6 py-4"><a href={`mailto:${userItem.email}`} className="text-primary hover:underline">{userItem.email}</a></td>
                                            <td className="px-6 py-4">
                                                {userItem.isAdmin ? (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">Admin</span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700">User</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 flex gap-4">
                                                <button
                                                    onClick={() => toggleAdminStatus(userItem._id, userItem.isAdmin)}
                                                    className={`text-xs font-bold px-2 py-1 rounded ${userItem.isAdmin ? 'bg-yellow-50 text-yellow-600 hover:bg-yellow-100' : 'bg-green-50 text-green-600 hover:bg-green-100'}`}
                                                >
                                                    {userItem.isAdmin ? 'Revoke Admin' : 'Make Admin'}
                                                </button>
                                                <button
                                                    onClick={() => deleteUser(userItem._id)}
                                                    className="text-slate-400 hover:text-red-500"
                                                    disabled={userItem._id === user._id} // Prevent self-delete
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Prescriptions Tab */}
                    {activeTab === 'prescriptions' && (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-slate-50 text-slate-500 font-medium">
                                    <tr>
                                        <th className="px-6 py-4">ID</th>
                                        <th className="px-6 py-4">Patient Details</th>
                                        <th className="px-6 py-4">Image</th>
                                        <th className="px-6 py-4">Date</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {loading ? (
                                        <tr><td colSpan="6" className="px-6 py-8 text-center">Loading...</td></tr>
                                    ) : prescriptions.length === 0 ? (
                                        <tr><td colSpan="6" className="px-6 py-8 text-center text-slate-500">No prescriptions found.</td></tr>
                                    ) : prescriptions.map(prescription => (
                                        <tr key={prescription._id} className="hover:bg-slate-50/50">
                                            <td className="px-6 py-4 font-mono text-xs text-slate-500">{prescription._id.slice(-6)}</td>
                                            <td className="px-6 py-4 min-w-[250px]">
                                                <div className="font-medium text-slate-900">{prescription.patientName}</div>
                                                {prescription.user && (
                                                    <div className="text-[10px] text-slate-400 mb-1">Uploaded by: {prescription.user.name}</div>
                                                )}
                                                <div className="text-xs text-slate-500 font-semibold">{prescription.patientPhone}</div>
                                                <div className="text-xs text-slate-600 mt-1 break-words bg-slate-50 p-1 rounded border border-slate-100">
                                                    <span className="font-medium text-slate-400 uppercase text-[10px] block mb-0.5">Address:</span>
                                                    {prescription.deliveryAddress}
                                                </div>
                                                {prescription.additionalNotes && (
                                                    <div className="text-xs text-slate-500 mt-2 italic bg-blue-50/50 p-1 rounded border border-blue-100">
                                                        <span className="font-medium text-blue-400 uppercase text-[10px] block mb-0.5">Notes:</span>
                                                        {prescription.additionalNotes}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <a 
                                                    href={prescription.images[0]?.startsWith('http') ? prescription.images[0] : `http://localhost:5000${prescription.images[0]}`} 
                                                    target="_blank" 
                                                    rel="noreferrer"
                                                    className="flex items-center gap-1 text-primary hover:underline font-medium text-xs"
                                                >
                                                    <ImageIcon size={14} /> View Image
                                                </a>
                                            </td>
                                            <td className="px-6 py-4 text-slate-500">{new Date(prescription.createdAt).toLocaleDateString()}</td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                                                    prescription.status === 'accepted' ? 'bg-green-100 text-green-700' :
                                                    prescription.status === 'rejected' ? 'bg-red-100 text-red-700' :
                                                    prescription.status === 'reviewed' ? 'bg-blue-100 text-blue-700' :
                                                    'bg-yellow-100 text-yellow-700'
                                                }`}>
                                                    {prescription.status.charAt(0).toUpperCase() + prescription.status.slice(1)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 flex gap-2">
                                                {prescription.status === 'pending' && (
                                                    <>
                                                        <button
                                                            onClick={() => updatePrescriptionStatus(prescription._id, 'accepted')}
                                                            className="text-xs font-bold px-2 py-1 rounded bg-green-50 text-green-600 hover:bg-green-100"
                                                        >
                                                            Accept
                                                        </button>
                                                        <button
                                                            onClick={() => updatePrescriptionStatus(prescription._id, 'rejected')}
                                                            className="text-xs font-bold px-2 py-1 rounded bg-red-50 text-red-600 hover:bg-red-100"
                                                        >
                                                            Reject
                                                        </button>
                                                    </>
                                                )}
                                                <button
                                                    onClick={() => deletePrescription(prescription._id)}
                                                    className="text-slate-400 hover:text-red-500 ml-2"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
