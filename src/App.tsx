import React from 'react';
import HomePage from './pages/HomePage';
import AdminPage from './pages/AdminPage';
import { Routes, Route } from 'react-router-dom';

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/admin" element={<AdminPage />} />
    </Routes>
  );
};

export default App;