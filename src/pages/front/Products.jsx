import {
  getProducts,
  addCart,
} from '../../connection/connection';
import { useEffect, useState } from 'react';
import { alertError, toastAlert } from '../../tools/sweetAlert';
import TheLoader from '../../components/TheLoader';
import { Link } from 'react-router-dom';

export default function Products() {
  const [isLoading, setIsLoading] = useState(false);
  const [isCartLoading, setIsCartLoading] = useState(false);
  const [products, setProducts] = useState([]);

  const getProductList = async () => {
    setIsLoading(true);
    try {
      const res = await getProducts();
      setProducts(res.data.products);
    } catch(error) {
      alertError(error.response.data.message);
    } finally {
      setIsLoading(false);
    }
  }
  useEffect(() => {
    getProductList();
  }, []);

  const addCartItem = async (productId, qty) => {
    setIsCartLoading(true);
    try {
      const res = await addCart({
        data: {
          'product_id': productId,
          qty: Number(qty),
        }
      });
      toastAlert(res.data.message);
    } catch(error) {
      alertError(error.response.data.message);
    } finally {
      setIsCartLoading(false);
    }
  }
  return (
    <>
      <TheLoader type="spin" color="#fd7e14" isLoading={isLoading} />
      <div className="container py-5">
        <table className="table align-middle">
          <thead>
            <tr>
              <th>圖片</th>
              <th>商品名稱</th>
              <th>價格</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {
              products.map(product => (
                <tr key={product.id}>
                  <td style={{ width: '200px' }}>
                    <div style={{
                      height: '100px',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      backgroundImage: `url(${product.imageUrl})`
                      }}></div>
                  </td>
                  <td>{product.title}</td>
                  <td>
                    <del className="h6">原價: {product.origin_price}</del>
                    <div className="h5">特價: {product.price}</div>
                  </td>
                  <td>
                    <div className="btn-group btn-group-sm">
                      <Link className="btn btn-outline-secondary"
                        to={`/products/${product.id}`}
                        disabled={isCartLoading}>
                        <i className="fas fa-spinner fa-pulse"></i>
                        查看更多
                      </Link>
                      <button type="button" className="btn btn-outline-danger"
                        onClick={() => addCartItem(product.id, 1)}
                        disabled={isCartLoading}>
                        <i className="fas fa-spinner fa-pulse"></i>
                        加到購物車
                        { isCartLoading && (
                          <div className="ms-2 spinner-border spinner-border-sm text-secondary" role="status">
                            <span className="visually-hidden">Loading...</span>
                          </div>
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
    </>
  )
}
