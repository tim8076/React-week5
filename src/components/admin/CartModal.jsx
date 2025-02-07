

import { useEffect, useState } from "react";
export default function CartModal({
  modalRef,
  currentProduct,
  closeModal,
  isCartLoading,
  addCartItem,
}) {
  const [cartNum, setCartNum] = useState(1);
  useEffect(() => {
    setCartNum(1);
  }, [currentProduct.id])
  return (
    <div className="modal fade" ref={modalRef} tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5" id="exampleModalLabel">
              { currentProduct.title }
            </h1>
            <button type="button" className="btn-close" aria-label="Close"
              onClick={closeModal}></button>
          </div>
          <div className="modal-body">
            <img src={currentProduct.imageUrl}
              className="img-fluid mb-2"
              alt={currentProduct.title} />
            <p className='mb-2'>{currentProduct.content}</p>
            <p className='mb-2'>{currentProduct.description}</p>
            <p>售價: {currentProduct.price} 元</p>
            <div className="row mb-3">
              <label htmlFor="cartNum" className="col-sm-2 col-form-label">數量: </label>
              <div className="col-sm-10">
                <select className="form-select"
                  id="cartNum"
                  aria-label="Default select example"
                  value={cartNum}
                  onChange={ e => setCartNum(e.target.value) }>
                  {
                    [...Array(10).keys()].map(i => i + 1).map(num => {
                      return <option value={num} key={num}>{num}</option>
                    })
                  }
                </select>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary"
              disabled={isCartLoading}
              onClick={closeModal}
              >
              取消
            </button>
            <button type="button" className="btn btn-primary"
              onClick={() => addCartItem(currentProduct.id, cartNum)}
              disabled={isCartLoading}>
              加入購物車
              { isCartLoading && (
                <div className="ms-2 spinner-border spinner-border-sm text-secondary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
