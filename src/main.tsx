import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';\nimport { AuthProvider } from './hooks/useAuth.ts';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter } from 'react-router-dom';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>\n      <AuthProvider>
      <App />\n      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);