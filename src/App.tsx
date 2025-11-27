import React from 'react';\nimport { useAuth } from './hooks/useAuth';\nimport { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AdminPage from './pages/AdminPage';


const App: React.FC = () => {\n  const { isAuthenticated, user, isLoading } = useAuth();\n\n  if (isLoading) {\n    return <div>Cargando sesión...</div>; // Pantalla de carga simple\n  }
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/admin" element={isAuthenticated && (user?.role === 'ADMIN' || user?.role === 'SELLER') ? <AdminPage /> : <Navigate to="/" />} />
    </Routes>
  );
};

export default App;