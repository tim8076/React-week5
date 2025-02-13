// 此為 api.js 檔案 (統一管理 API)
import axios from 'axios';
const apiBase = import.meta.env.VITE_APP_API_URL;
const apiPath = import.meta.env.VITE_APP_API_PATH;

// 後台axios實體
const adminRequest = axios.create({
  baseURL: apiBase,
});

export const setAdminToken = (token) => {
  adminRequest.defaults.headers.common['Authorization'] = token;
} 

// 後台 API
export const adminLogin = (data) => adminRequest.post('/v2/admin/signin', data);
export const adminCheckLogin = () => adminRequest.post('/v2/api/user/check');
export const adminGetProducts = (page) => adminRequest.get(`/v2/api/${apiPath}/admin/products?page=${page}`);
export const adminAddProducts = (data) => adminRequest.post(`/v2/api/${apiPath}/admin/product`, data);
export const adminDeleteProduct = (id) => adminRequest.delete(`/v2/api/${apiPath}/admin/product/${id}`);
export const adminModifyProduct = (id, data) => adminRequest.put(`/v2/api/${apiPath}/admin/product/${id}`, data);

// 前台 API
const customerRequest = axios.create({
  baseURL: apiBase,
});

export const getProducts = () => customerRequest.get(`/v2/api/${apiPath}/products`);
export const getProduct = (id) => customerRequest.get(`/v2/api/${apiPath}/product/${id}`);
export const addCart = (data) => customerRequest.post(`/v2/api/${apiPath}/cart`, data);
export const getCart = () => customerRequest.get(`/v2/api/${apiPath}/cart`);
export const deleteCart = (id) => customerRequest.delete(`/v2/api/${apiPath}/cart/${id}`);
export const deleteAllCart = () => customerRequest.delete(`/v2/api/${apiPath}/carts`);
export const modifyCart = (id, data) => customerRequest.put(`/v2/api/${apiPath}/cart/${id}`, data);
export const sendOrder = (data) => customerRequest.post(`/v2/api/${apiPath}/order`, data);