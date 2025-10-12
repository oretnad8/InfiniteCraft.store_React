import React from 'react';
import './Navigation.css';

const Navigation: React.FC = () => {
  return (
    <ul className="menu">
      <li><a href="#home">Inicio</a></li>
      <li><a href="#productos">Productos</a></li>
      <li><a href="#nosotros">Nosotros</a></li>
      <li><a href="#contacto">Contacto</a></li>
    </ul>
  );
};

export default Navigation;