import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { HashRouter } from 'react-router-dom'
import axios from 'axios';
import { Provider } from 'react-redux';
import store from './store.js';
axios.defaults.baseURL = import.meta.env.VITE_APP_API_URL;


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <HashRouter>
        <App />
      </HashRouter>
    </Provider>
  </StrictMode>,
)
