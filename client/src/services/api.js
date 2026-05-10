import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const fetchProducts = async (keyword = '', pageNumber = '', category = '', limit = '') => {
    try {
        const response = await axios.get(`${API_URL}/products`, {
            params: { keyword, pageNumber, category, limit }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching products:', error);
        return { products: [], page: 1, pages: 1, total: 0 };
    }
};

export const fetchProductById = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/products/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching product:', error);
        return null;
    }
};
