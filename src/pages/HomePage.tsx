import React, { useState, useEffect } from 'react';
import MainLayout from '../components/templates/MainLayout';
import ProductGrid from '../components/organisms/ProductGrid/ProductGrid';
import RegisterForm from '../components/organisms/RegisterForm/RegisterForm';
import LoginForm from '../components/organisms/LoginForm/LoginForm';
import ContactForm from '../components/organisms/ContactForm/ContactForm';
import Cart from '../components/organisms/Cart/Cart';
import { products as initialProducts } from '../data/products';

interface Product {
  id: number;
  nombre: string;
  precio: number;
  imagen: string;
  categoria: string;
}

interface CartItem extends Product {
  cantidad: number;
}

const HomePage: React.FC = () => {
  const [products] = useState<Product[]>(initialProducts);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  const handleAddToCart = (id: number) => {
    const product = products.find(p => p.id === id);
    if (!product) return;

    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === id ? { ...item, cantidad: item.cantidad + 1 } : item
        );
      }
      return [...prevCart, { ...product, cantidad: 1 }];
    });
  };

  const handleRemoveFromCart = (index: number) => {
    setCart(prevCart => prevCart.filter((_, i) => i !== index));
  };

  const handleCheckout = () => {
    alert('¡Compra realizada con éxito!');
    setCart([]);
    localStorage.removeItem('cart');
    setIsCartOpen(false);
  };

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const cartCount = cart.reduce((total, item) => total + item.cantidad, 0);

  return (
    <MainLayout cartCount={cartCount} onCartClick={() => setIsCartOpen(true)}>
      <section id="home" className="seccion">
        <h1>Bienvenido coleccionista!</h1>
        {/* Aquí puedes agregar el carrusel de Bootstrap si lo deseas */}
        <p>Transforma tus ideas en figuras 3D de resina unicas!</p>
      </section>
      <ProductGrid products={products} onAddToCart={handleAddToCart} />
      <RegisterForm />
      <LoginForm />
      <section id="nosotros" className="seccion">
        <h2>Sobre Nosotros</h2>
        <article>
          <p>Somos una Pyme dedicada a la impresión 3D personalizada...</p>
        </article>
      </section>
      <ContactForm />
      {isCartOpen && (
        <Cart
          cart={cart}
          onClose={() => setIsCartOpen(false)}
          onRemoveFromCart={handleRemoveFromCart}
          onCheckout={handleCheckout}
        />
      )}
    </MainLayout>
  );
};

export default HomePage;