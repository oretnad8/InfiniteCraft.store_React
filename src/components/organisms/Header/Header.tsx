import React from 'react';\nimport { useAuth } from '../../../hooks/useAuth';\nimport { useNavigate } from 'react-router-dom';
import Button from '../../atoms/Button/Button';
import { Navbar, Nav, Container } from 'react-bootstrap';
import './Header.css'; // Mantenemos la importación para el estilo del logo

interface HeaderProps {
  cartCount: number;
  onCartClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ cartCount, onCartClick }) => {\n  const { isAuthenticated, user, logout } = useAuth();\n  const navigate = useNavigate();
  return (
    <Navbar bg="dark" variant="dark" expand="lg" fixed="top" collapseOnSelect>
      <Container>
        <Navbar.Brand href="#home" className="logo-brand">
          InfiniteCraft.store
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        
        <Navbar.Collapse id="basic-navbar-nav">
          
          <Nav className="me-auto">
            <Nav.Link href="#home">Inicio</Nav.Link>
            <Nav.Link href="#productos">Productos</Nav.Link>
            <Nav.Link href="#nosotros">Nosotros</Nav.Link>
            <Nav.Link href="#contacto">Contacto</Nav.Link>
          </Nav>
          
          <Nav>\n            {isAuthenticated && (\n              <div className="d-flex align-items-center me-3">\n                <span className="text-light me-2">Bienvenido, {user?.role === 'SELLER' ? 'Vendedor' : user?.role === 'ADMIN' ? 'Admin' : 'Cliente'} {user?.nombre}</span>\n                <Button onClick={logout} className="btn-sm btn-outline-light me-2">Cerrar Sesión</Button>\n                {(user?.role === 'SELLER' || user?.role === 'ADMIN') && (\n                  <Button onClick={() => navigate('/admin')} className="btn-sm btn-warning">Panel</Button>\n                )}\n              </div>\n            )}
            <Button onClick={onCartClick} className="btn-carrito ms-2">
              Carrito (<span>{cartCount}</span>)
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;