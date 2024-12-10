import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import {AuthContextProvider} from "./AuthContextProvider/AuthContextProvider.jsx";
import "../node_modules/bootstrap/dist/css/bootstrap.css";
import { BrowserRouter} from "react-router-dom";


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthContextProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AuthContextProvider>
  </StrictMode>,
)
