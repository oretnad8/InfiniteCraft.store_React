import React from 'react';
import { useAuth } from './hooks/useAuth';
import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AdminPage from './pages/AdminPage';


const App: React.FC = () => {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) {
    return <div>Cargando sesión...</div>; // Pantalla de carga simple
  }

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/admin" element={isAuthenticated && (user?.role === 'ADMIN' || user?.role === 'SELLER') ? <AdminPage /> : <Navigate to="/" />} />
    </Routes>
  );
};

export default App;
