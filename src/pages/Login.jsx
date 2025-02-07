import { useState } from "react";
import { adminLogin } from "../connection/connection";
import { useNavigate } from "react-router-dom";
import TheLoader from "../components/TheLoader";
import { alertError } from "../tools/sweetAlert";
export default function Login() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    username: '',
    password: '',
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value,
    })
  }

  const submit = async () => {
    setIsLoading(true);
    try {
      const res = await adminLogin(userData);
      const { token, expired } = res.data;
      document.cookie = `tim0107=${token}; expires=${new Date(expired)}`;
      navigate('/admin/products');
    } catch (error) {
      alertError(error.response.data.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <TheLoader type="spin" color="#fd7e14" isLoading={isLoading}/>
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <h2>登入帳號</h2>
            <div className="mb-2">
              <label htmlFor="email" className="form-label w-100">
                Email
                <input id="email"
                  className="form-control"
                  name="username"
                  type="email"
                  placeholder="請輸入電子信箱"
                  onChange={handleInputChange} />
              </label>
            </div>
            <div className="mb-2">
              <label htmlFor="password" className="form-label w-100">
                密碼
                <input type="password"
                  className="form-control"
                  name="password"
                  id="password"
                  placeholder="請輸入密碼"
                  onChange={handleInputChange} />
              </label>
            </div>
            <button type="button"
              className="btn btn-primary"
              onClick={submit}>
              登入
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
