import { NavLink } from "react-router-dom"
export default function TheHeader() {
  return (
    <div className="bg-dark py-3">
      <div className="container">
        <div className="d-flex justify-content-between">
          <ul className="d-flex list-unstyled mb-0">
            <li className="mx-3">
              <NavLink to="/" className="fs-4 text-light">
                首頁
              </NavLink>
            </li>
            <li className="mx-3">
              <NavLink to="/products" className="fs-4 text-light">
                產品列表
              </NavLink>
            </li>
            <li className="mx-3">
              <NavLink to="/cart" className="fs-4 text-light">
                購物車
              </NavLink>
            </li>
          </ul>
          <NavLink to="/login" className="fs-4 text-light">
            登入
          </NavLink>
        </div>
      </div>
    </div>
  )
}
