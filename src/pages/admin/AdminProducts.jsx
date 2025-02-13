import { useEffect, useRef, useState } from "react";
import { adminGetProducts, adminDeleteProduct } from "../../connection/connection";
import { alertError, alertDeleteConfirm } from "../../tools/sweetAlert";
import TheLoader from "../../components/TheLoader";
import AdminProductModal from "../../components/admin/AdminProductModal";
import Pagination from "../../components/Pagination";
import { Modal } from "bootstrap";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({});
  const [modalMode, setModalMode] = useState('create');
  const [tempProduct, setTempProduct] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  
  // 新增產品 modal
  const productModal = useRef(null);
  const modalRef = useRef(null);
  const openProductModal = (mode, product) => {
    setModalMode(mode);
    setTempProduct(product);
    productModal.current.show();
  }
  const closeProductModal = () => {
    productModal.current.hide();
  }
  
  // 取得商品
  const getProducts = async (page = 1) => {
    setIsLoading(true);
    try {
      const res = await adminGetProducts(page);
      setProducts(res.data.products);
      setPagination(res.data.pagination);
    } catch (error) {
      alertError(error.response.data.message)
    } finally {
      setIsLoading(false);
    }
  }

  // 刪除商品
  const deleteProduct = async (product) => {
    const alertRes = await alertDeleteConfirm(product.title);
    if (!alertRes.isConfirmed) return;
    setIsLoading(true);
    try {
      await adminDeleteProduct(product.id);
      getProducts();
    } catch(error) {
      alertError(error.response.data.message)
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    productModal.current = new Modal(modalRef.current);
    getProducts();
  }, []);

  return (
    <>
      <TheLoader type="spin" color="#fd7e14" isLoading={isLoading} />
      <div className="p-3">
        <AdminProductModal
          modalRef={modalRef}
          getProducts={getProducts}
          tempProduct={tempProduct}
          mode={modalMode}
          closeProductModal={closeProductModal} />
        <h3>產品列表</h3>
        <hr />
        <div className="text-end">
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={() => openProductModal('create', {})}
          >
            建立新商品
          </button>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th scope="col">分類</th>
              <th scope="col">名稱</th>
              <th scope="col">售價</th>
              <th scope="col">啟用狀態</th>
              <th scope="col">編輯</th>
            </tr>
          </thead>
          <tbody>
            {
              products.map(product => {
                return (      
                  <tr key={product.id}>
                    <td>{product.category}</td>
                    <td>{product.title}</td>
                    <td>{product.price}</td>
                    <td>
                      { product.is_enabled ? (
                        <span>啟用</span>
                      ): (
                        <span className="text-danger">未啟用</span>
                      )}
                    </td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        onClick={() => openProductModal('edit', product)}
                      >
                        編輯
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline-danger btn-sm ms-2"
                        onClick={() => deleteProduct(product)}
                      >
                        刪除
                      </button>
                    </td>
                  </tr>
                )
              })
            }
          </tbody>
        </table>   
        <Pagination pagination={pagination}
          changePage={getProducts}/>
      </div>
    </>
  )
}
