import { Routes, Route } from 'react-router-dom';
import './assets/scss/all.scss';
import Login from './pages/Login';
import Dashboard from './pages/admin/Dashboard';
import AdminProducts from './pages/admin/AdminProducts';
import Home from './pages/front/Home';

function App() {

  return (
    <Routes>
      <Route path="/" element={<Home />}></Route>
      <Route path="/login" element={<Login />}></Route>
      <Route path="/admin" element={<Dashboard />}>
        <Route path="products" element={<AdminProducts />}></Route>
      </Route>
    </Routes>
  )
}

export default App
