import { useEffect, useState } from "react";
import { adminAddProducts, adminModifyProduct } from "../../connection/connection";
import { alertError } from "../../tools/sweetAlert";
import { Value } from "sass";
import { useDispatch } from "react-redux";
import { pushMessage } from "../../slice/toastSlice";
const defaultData = {
  title: "", //商品名稱
  category: "", //商品種類
  origin_price: 100, //原價
  price: 300, // 優惠價
  unit: "", // 商品單位
  description: "", //商品描述
  content: "", // 商品描述
  is_enabled: 1, // 是否啟用
  imageUrl: "", // 商品圖片網址
  imagesUrl: [''],
}
export default function AdminProductModal({ closeProductModal, modalRef, getProducts, mode, tempProduct }) {
  const [tempData, setTempData] = useState(defaultData);
  const dispatch = useDispatch();
  useEffect(() => {
    if (mode === 'create') {
      setTempData(defaultData);
    } else if (mode === 'edit') {
      setTempData(tempProduct);
    }
  }, [mode, tempProduct])

  const handleInputChange = (e) => {
    const { name, value, checked } = e.target;
    if (['price', 'origin_price'].includes(name)) {
      setTempData({
        ...tempData,
        [name]: parseInt(value),
      })
    } else if (name === 'is_enabled') {
      setTempData({
        ...tempData,
        [name]: +checked,
      })
    } else {
      setTempData({
        ...tempData,
        [name]: value,
      })
    }
  }

  const submit = async () => {
    try {
      if (mode === 'create') {
        await adminAddProducts({
          data: tempData
        });
        dispatch(pushMessage({
          text: '加入產品成功',
          status: 'success',
        }))
      } else if (mode === 'edit') {
        const { id } = tempData;
        await adminModifyProduct(id, {
          data: tempData,
        })
        dispatch(pushMessage({
          text: '編輯產品成功',
          status: 'success',
        }))
      }
      closeProductModal();
      getProducts();
    } catch (error) {
      dispatch(pushMessage({
        text: error.response.data.message.join('、'),
        status: 'fail',
      }))
    }
  }

  const handleImageChange = (e, index) => {
    const { value } = e.target;
    const newImages = [...tempData.imagesUrl];
    newImages[index] = value;
    setTempData({
      ...tempData,
      imagesUrl: newImages,
    })
  }

  const handleAddImage = () => {
    const newImages = [...tempData.imagesUrl, ''];
    setTempData({
      ...tempData,
      imagesUrl: newImages,
    })
  }

  const handleRemoveImage = () => {
    const newImages = [...tempData.imagesUrl];
    newImages.pop();
    setTempData({
      ...tempData,
      imagesUrl: newImages,
    })
  }

  return (
    <div
      ref={modalRef}
      className='modal fade'
      tabIndex='-1'
      aria-labelledby='exampleModalLabel'
      aria-hidden='true'
    >
      <div className='modal-dialog modal-lg'>
        <div className='modal-content'>
          <div className='modal-header'>
            <h1 className='modal-title fs-5' id='exampleModalLabel'>
              { mode === 'create' ? '建立新商品' : `編輯: ${tempProduct.title}` }
            </h1>
            <button
              type='button'
              className='btn-close'
              aria-label='Close'
              onClick={closeProductModal}
            />
          </div>
          <div className='modal-body'>
            <div className='row'>
              <div className='col-sm-4'>
                <div className='form-group mb-2'>
                  <label className='w-100 mb-2' htmlFor='image'>
                    主圖
                    <input
                      type='text'
                      name='imageUrl'
                      id='image'
                      placeholder='請輸入圖片連結'
                      className='form-control'
                      value={tempData.imageUrl}
                      onChange={handleInputChange}
                    />
                  </label>
                  {
                    tempData.imageUrl && (
                      <img src={tempData.imageUrl}
                        alt={`附圖 ${tempData.imageUrl}`}
                        className="img-fluid mb-3" />
                    )
                  }
                  <div className="border border-2 p-3">
                    {
                      tempData.imagesUrl.map((image, index) => {
                        return (
                          <div className="mb-2"
                            key={image}>
                            <label htmlFor={`imageUrl:${index + 1}`}
                              className="form-label">
                              { `附圖 ${index + 1}` }
                            </label>
                            <input
                              value={image}
                              onChange={(e) => handleImageChange(e, index)}
                              type="text"
                              id={`imageUrl:${index + 1}`}
                              className="form-control mb-2"
                              placeholder="請輸入圖片網址"/>
                            {
                              image && (
                                <img src={image}
                                  alt={`附圖 ${image}`}
                                  className="img-fluid mb-2" />
                              )
                            }
                          </div>
                        )
                      })
                    }
                    <div className="btn-group w-100">
                      {
                        tempData.imagesUrl.length < 5
                        && tempData.imagesUrl[tempData.imagesUrl.length - 1] !== ''
                        && (
                          <button className="btn btn-outline-primary btn-sm w-100"
                            onClick={handleAddImage} >
                            新增圖片
                          </button>
                        )
                      }
                      {
                        tempData.imagesUrl.length > 1
                        && (
                          <button className="btn btn-outline-danger btn-sm w-100"
                            onClick={handleRemoveImage}>
                            取消圖片
                          </button>
                        )
                      }
                    </div>
                  </div>
                </div>
              </div>
              <div className='col-sm-8'>
                <div className='form-group mb-2'>
                  <label className='w-100' htmlFor='title'>
                    標題
                    <input
                      type='text'
                      id='title'
                      name='title'
                      placeholder='請輸入標題'
                      className='form-control'
                      value={tempData.title}
                      onChange={handleInputChange}
                    />
                  </label>
                </div>
                <div className='row'>
                  <div className='form-group mb-2 col-md-6'>
                    <label className='w-100' htmlFor='category'>
                      分類
                      <input
                        type='text'
                        id='category'
                        name='category'
                        placeholder='請輸入分類'
                        className='form-control'
                        value={tempData.category}
                        onChange={handleInputChange}
                      />
                    </label>
                  </div>
                  <div className='form-group mb-2 col-md-6'>
                    <label className='w-100' htmlFor='unit'>
                      單位
                      <input
                        type='unit'
                        id='unit'
                        name='unit'
                        placeholder='請輸入單位'
                        className='form-control'
                        value={tempData.unit}
                        onChange={handleInputChange}
                      />
                    </label>
                  </div>
                </div>
                <div className='row'>
                  <div className='form-group mb-2 col-md-6'>
                    <label className='w-100' htmlFor='origin_price'>
                      原價
                      <input
                        type='number'
                        id='origin_price'
                        name='origin_price'
                        placeholder='請輸入原價'
                        className='form-control'
                        value={tempData.origin_price}
                        onChange={handleInputChange}
                      />
                    </label>
                  </div>
                  <div className='form-group mb-2 col-md-6'>
                    <label className='w-100' htmlFor='price'>
                      售價
                      <input
                        type='number'
                        id='price'
                        name='price'
                        placeholder='請輸入售價'
                        className='form-control'
                        value={tempData.price}
                        onChange={handleInputChange}
                      />
                    </label>
                  </div>
                </div>
                <hr />
                <div className='form-group mb-2'>
                  <label className='w-100' htmlFor='description'>
                    產品描述
                    <textarea
                      type='text'
                      id='description'
                      name='description'
                      placeholder='請輸入產品描述'
                      className='form-control'
                      value={tempData.description}
                      onChange={handleInputChange}
                    />
                  </label>
                </div>
                <div className='form-group mb-2'>
                  <label className='w-100' htmlFor='content'>
                    說明內容
                    <textarea
                      type='text'
                      id='content'
                      name='content'
                      placeholder='請輸入產品說明內容'
                      className='form-control'
                      value={tempData.content}
                      onChange={handleInputChange}
                    />
                  </label>
                </div>
                <div className='form-group mb-2'>
                  <div className='form-check'>
                    <label
                      className='w-100 form-check-label'
                      htmlFor='is_enabled'
                    >
                      是否啟用
                      <input
                        checked={tempData.is_enabled}
                        type='checkbox'
                        id='is_enabled'
                        name='is_enabled'
                        placeholder='請輸入產品說明內容'
                        className='form-check-input'
                        onChange={handleInputChange}
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='modal-footer'>
            <button type='button' className='btn btn-secondary'
              onClick={closeProductModal}>
              關閉
            </button>
            <button type='button' className='btn btn-primary'
              onClick={submit}>
              儲存
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
