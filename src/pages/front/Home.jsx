import {
  getProducts,
  addCart,
  getCart,
  deleteCart,
  deleteAllCart,
  modifyCart,
  sendOrder,
} from '../../connection/connection';
import { useEffect, useState, useRef } from 'react';
import { alertError, alertDeleteConfirm, toastAlert } from '../../tools/sweetAlert';
import TheLoader from '../../components/TheLoader';
import CartModal from '../../components/admin/CartModal';
import { Modal } from 'bootstrap';
import { useForm } from "react-hook-form";
export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [currentProduct, setCurrentProduct] = useState({});
  const getProductList = async () => {
    try {
      const res = await getProducts();
      setProducts(res.data.products);
    } catch(error) {
      alertError(error.response.data.message);
    }
  }
  const productModal = useRef(null);
  const modalRef = useRef(null);

  const openModal = () => {
    productModal.current.show();
  }
  const closeModal = () => {
    productModal.current.hide();
  }

  useEffect(() => {
    productModal.current = new Modal(modalRef.current);
    getProductList();
    getCartList();
  }, []);

  // 購物車功能
  const [cartList, setCartList] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [cartFinalTotal, setCartFinalTotal] = useState(0);
  const [isCartLoading, setIsCartLoading] = useState(false);
  const addCartItem = async (productId, qty) => {
    setIsCartLoading(true);
    try {
      const res = await addCart({
        data: {
          'product_id': productId,
          qty: Number(qty),
        }
      });
      closeModal();
      toastAlert(res.data.message);
      getCartList();
    } catch(error) {
      alertError(error.response.data.message);
    } finally {
      setIsCartLoading(false);
    }
  }

  const getCartList = async () => {
    setIsLoading(true);
    try {
      const res = await getCart();
      const { carts, total, final_total } = res.data.data;
      setCartList(carts);
      setCartTotal(total);
      setCartFinalTotal(final_total)
    } catch(error) {
      alertError(error.response.data.message);
    } finally {
      setIsLoading(false);
    }
  }

  const deleteCartItem = async (id, productTitle) => {
    const alertRes = await alertDeleteConfirm(productTitle);
    if (!alertRes.isConfirmed) return;
    setIsLoading(true);
    try {
      await deleteCart(id);
      getCartList();
    } catch(error) {
      alertError(error.response.data.message);
    } finally {
      setIsLoading(false);
    }
  }
  
  const deleteAllCartItems = async () => {
    const alertRes = await alertDeleteConfirm('全部商品');
    if (!alertRes.isConfirmed) return;
    setIsLoading(true);
    try {
      await deleteAllCart();
      getCartList();
    } catch(error) {
      alertError(error.response.data.message);
    } finally {
      setIsLoading(false);
    }
  }

  const modifyCartItem = async (cartId, productId, qty) => {
    console.log()
    setIsLoading(true);
    try {
      await modifyCart(cartId, {
        data: {
          product_id: productId,
          qty: Number(qty)
        }
      });
      getCartList();
    } catch(error) {
      alertError(error.response.data.message);
    } finally {
      setIsLoading(false);
    }
  }
  
  // 表單驗證
  const {
    register, //state
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    mode: 'onChange', // 表單驗證的時機
  });
  
  const onSubmit = async (orderData) => {
    const { address, name, email, message, tel } = orderData;
    setIsLoading(true);
    try {
      const res = await sendOrder({
        data: {
          user: {
            name,
            email,
            tel,
            address,
          },
          message,
        }
      });
      toastAlert(res.data.message);
      reset();
      getCartList();
    } catch(error) {
      alertError(error.response.data.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <TheLoader type="spin" color="#fd7e14" isLoading={isLoading} />
      <div className="container">
        <div className="mt-4">
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
                        <button type="button" className="btn btn-outline-secondary"
                          disabled={isCartLoading}
                          onClick={() => {
                            setCurrentProduct(product);
                            openModal();
                          }}>
                          <i className="fas fa-spinner fa-pulse"></i>
                          查看更多
                        </button>
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
          <div className="text-end">
            <button
              className="btn btn-outline-danger"
              type="button"
              disabled={!cartList.length}
              onClick={deleteAllCartItems}>
              清空購物車
            </button>
          </div>
          <table className="table align-middle">
            <thead>
              <tr>
                <th></th>
                <th>品名</th>
                <th style={{ width: '150px' }}>數量/單位</th>
                <th>單價</th>
              </tr>
            </thead>
            <tbody>
              {
                cartList?.map(cart => (
                  <tr key={cart.id}>
                    <th>
                      <button
                        type="button"
                        className="btn-close"
                        onClick={() => deleteCartItem(cart.id, cart.product.title)}
                        aria-label="Close"></button>
                    </th>
                    <th>{cart.product.title}</th>
                    <th>
                      <div className="input-group mb-3">
                        <button
                          className="btn btn-outline-secondary"
                          type="button"
                          disabled={cart.qty <= 1}
                          onClick={() => modifyCartItem(cart.id, cart.product_id, cart.qty - 1)}>
                          -
                        </button>
                        <input type="numner"
                          className="form-control text-center"
                          value={cart.qty}
                          readOnly
                        />
                        <button
                          className="btn btn-outline-secondary"
                          type="button"
                          onClick={() => modifyCartItem(cart.id, cart.product_id, cart.qty + 1)}>
                          +
                        </button>
                      </div>
                    </th>
                    <th>{cart.total}</th>
                  </tr>
                ))
              }
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="3" className="text-end">總計</td>
                <td className="text-end">{cartTotal}</td>
              </tr>
              <tr>
                <td colSpan="3" className="text-end text-success">折扣價</td>
                <td className="text-end text-success">{cartFinalTotal}</td>
              </tr>
            </tfoot>
          </table>
        </div>
        <div className="my-5 row justify-content-center">
          <form className="col-md-6"
            onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                id="email"
                type="email"
                className={`form-control ${errors.email && 'is-invalid'}`}
                { ...register('email', {
                  required: {
                    value: true,
                    message: 'Email 為必填',
                  },
                  pattern: {
                    value: /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/,
                    message: 'Email 格式錯誤',
                  },
                })}
                placeholder="請輸入 Email" />
              {errors.email && (
                <div className='invalid-feedback'>{errors?.email?.message}</div>
              )}
            </div>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">收件人姓名</label>
              <input
                id="name"
                type="text"
                className={`form-control ${errors.name && 'is-invalid'}`}
                { ...register('name', {
                  required: {
                    value: true,
                    message: '姓名 為必填',
                  },
                })}
                placeholder="請輸入姓名" />
              {errors.name && (
                <div className='invalid-feedback'>{errors?.name?.message}</div>
              )}
            </div>
            <div className="mb-3">
              <label htmlFor="tel" className="form-label">收件人電話</label>
              <input
                id="tel"
                type="tel"
                className={`form-control ${errors.tel && 'is-invalid'}`}
                { ...register('tel', {
                  required: {
                    value: true,
                    message: '電話為必填',
                  },
                  minLength: {
                    value: 8,
                    message: '電話長度錯誤',
                  },
                })}
                placeholder="請輸入電話" />
              {errors.tel && (
                <div className='invalid-feedback'>{errors?.tel?.message}</div>
              )}
            </div>

            <div className="mb-3">
              <label htmlFor="address" className="form-label">收件人地址</label>
              <input
                id="address"
                name="address"
                type="text"
                className={`form-control ${errors.address && 'is-invalid'}`}
                { ...register('address', {
                  required: {
                    value: true,
                    message: '地址為必填',
                  },
                })}
                placeholder="請輸入地址" />
              {errors.address && (
                <div className='invalid-feedback'>{errors?.address?.message}</div>
              )}
            </div>

            <div className="mb-3">
              <label htmlFor="message" className="form-label">留言</label>
              <textarea
                id="message"
                className="form-control"
                { ...register('message') }
                cols="30"
                rows="10"></textarea>
            </div>
            <div className="text-end">
              <button
                type="submit"
                disabled={!cartList.length}
                className="btn btn-danger">
                送出訂單
              </button>
            </div>
          </form>
        </div>
      </div>
      <CartModal
        modalRef={modalRef}
        currentProduct={currentProduct}
        closeModal={closeModal}
        isCartLoading={isCartLoading}
        addCartItem={addCartItem}
      />
    </>
  );
}
