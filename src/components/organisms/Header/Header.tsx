import React from 'react';
import Logo from '../../atoms/Logo/Logo';
import Navigation from '../../molecules/Navigation/Navigation';
import Button from '../../atoms/Button/Button';
import './Header.css';

interface HeaderProps {
  cartCount: number;
  onCartClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ cartCount, onCartClick }) => {
  return (
    <header>
      <nav>
        <Logo />
        <Navigation />
        <Button onClick={onCartClick} className="btn-carrito">
          Carrito (<span>{cartCount}</span>)
        </Button>
      </nav>
    </header>
  );
};

export default Header;