import { StrictMode } from 'react';
import React from 'react';
import { createRoot } from 'react-dom/client';
import {ProveedorSesion} from './context/SessionContext.jsx';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App.jsx';


createRoot(document.getElementById('root')).render(
  <ProveedorSesion>
    <BrowserRouter>
      <StrictMode>
        <App />
      </StrictMode>
    </BrowserRouter>
  </ProveedorSesion>,
)

