import { Routes, Route } from 'react-router-dom';
import './assets/scss/all.scss';
import Login from './pages/Login';
import Dashboard from './pages/admin/Dashboard';
import AdminProducts from './pages/admin/AdminProducts';
import FrontLayout from './pages/front/FrontLayout';
import Home from './pages/front/Home';
import Products from './pages/front/Products';
import ProductDetail from './pages/front/ProductDetail';
import Cart from './pages/front/Cart';

function App() {

  return (
    <Routes>
      <Route path="/" element={<FrontLayout />}>
        <Route index element={<Home />}></Route>
        <Route path="products" element={<Products />}></Route>
        <Route path="products/:id" element={<ProductDetail />}></Route>
        <Route path="cart" element={<Cart />}></Route>
      </Route>
      <Route path="/login" element={<Login />}></Route>
      <Route path="/admin" element={<Dashboard />}>
        <Route path="products" element={<AdminProducts />}></Route>
      </Route>
    </Routes>
  )
}

export default App
