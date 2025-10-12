import React from 'react';
import Header from '../organisms/Header/Header';
import Footer from '../organisms/Footer/Footer';

interface MainLayoutProps {
  children: React.ReactNode;
  cartCount: number;
  onCartClick: () => void;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children, cartCount, onCartClick }) => {
  return (
    <>
      <Header cartCount={cartCount} onCartClick={onCartClick} />
      <main>
        {children}
      </main>
      <Footer />
    </>
  );
};

export default MainLayout;