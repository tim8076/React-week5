import { useParams } from "react-router-dom"
import { getProduct, addCart } from "../../connection/connection";
import { useEffect, useState } from "react";
import { alertError, toastAlert } from "../../tools/sweetAlert";
import TheLoader from "../../components/TheLoader";
export default function ProductDetail() {
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [product, setProduct] = useState({});
  const getProductData = async () => {
    setIsLoading(true);
    try {
      const res = await getProduct(id);
      setProduct(res.data.product);
    } catch(error) {
      alertError(error.response.data.message);
    } finally {
      setIsLoading(false);
    }
  }

  const [cartNum, setCartNum] = useState(1);
  const addCartItem = async (productId, qty) => {
    setIsLoading(true);
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
      setIsLoading(false);
    }
  }
  useEffect(() => {
    getProductData();
  }, []);
  return (
    <>
      <TheLoader type="spin" color="#fd7e14" isLoading={isLoading} />
      <div className="container py-5">
        <div className="row">
          <div className="col-md-6">
            <img src={product.imageUrl} alt=""
            className="img-fluid w-100 object-fit-cover"
            style={{
              height: '600px'
            }}/>
          </div>
          <div className="col-md-6">
            <h1 className="mb-3">{product.title}</h1>
            <p className="mb-3">{product.content}</p>
            <p className="mb-3">{product.description}</p>
            <p className="fs-4 mb-3">NT$ {product.price}</p>
            <div className="row">
              <div className="col-8">
                <div className="input-group mb-3">
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
                  <button className="btn btn-outline-secondary"
                    type="button"
                    onClick={() => addCartItem(product.id, cartNum)}>
                    加入購物車
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
