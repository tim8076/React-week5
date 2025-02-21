
import {
  getCart,
  deleteCart,
  deleteAllCart,
  modifyCart,
  sendOrder,
} from '../../connection/connection';
import { useEffect, useState} from 'react';
import { alertError, alertDeleteConfirm, toastAlert } from '../../tools/sweetAlert';
import TheLoader from '../../components/TheLoader';
import { useForm } from "react-hook-form";
export default function Cart() {
  const [isLoading, setIsLoading] = useState(false);
  const [cartList, setCartList] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [cartFinalTotal, setCartFinalTotal] = useState(0);

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

  useEffect(() => {
    getCartList();
  }, []);
  
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
      <div className="container py-5">
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
                  pattern: {
                    value: /^\d+$/,
                    message: '只能輸入數字',
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
    </>
  )
}
