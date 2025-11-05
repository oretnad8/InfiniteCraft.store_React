import React, { useState, useEffect } from 'react';
import MainLayout from '../components/templates/MainLayout';
import ProductGrid from '../components/organisms/ProductGrid/ProductGrid';
import RegisterForm from '../components/organisms/RegisterForm/RegisterForm';
import LoginForm from '../components/organisms/LoginForm/LoginForm';
import ContactForm from '../components/organisms/ContactForm/ContactForm';
import Cart from '../components/organisms/Cart/Cart';
import { products as initialProducts } from '../data/products';
import { Carousel } from 'react-bootstrap'; 
import ProcessSection from '../components/organisms/ProcessSection/ProcessSection';

/* define la forma de un producto */
interface Product {
  id: number;
  nombre: string;
  precio: number;
  imagen: string;
  categoria: string;
}
/* define la forma del producto + cantidad */
interface CartItem extends Product {
  cantidad: number;
}
/* componente de la pagina */
const HomePage: React.FC = () => {
  const [products] = useState<Product[]>(initialProducts);  /* valor inicial de productos */
  const [cart, setCart] = useState<CartItem[]>([]);   /* valor inicial para el carrito */
  const [isCartOpen, setIsCartOpen] = useState(false);    /* estado booleano para el carrito */

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');     /* busca si hay un carrito guardado */
    if (savedCart) {
      setCart(JSON.parse(savedCart));   /* si hay parcea el json */
    }
  }, []);   /* se ejecuta una vez, solo al iniciar */

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
            <Carousel controls={false} indicators={false} interval={3000}>
                  <Carousel.Item>
                    <img
                      className="d-block w-100"
                      src="/assets/img/banner.png"
                      alt="InfiniteCraft Store"
                    />
                  </Carousel.Item>
                  <Carousel.Item>
                    <img
                      className="d-block w-100"
                      src="/assets/img/banner1.png"
                      alt="Elegoo Saturn 4 Ultra 16k"
                    />
                  </Carousel.Item>
                  <Carousel.Item>
                    <img
                      className="d-block w-100"
                      src="/assets/img/banner2.png"
                      alt="Anycubic Wash & Cure 3 plus"
                    />
                  </Carousel.Item>
                </Carousel>
        <p>Transforma tus ideas en figuras 3D de resina unicas!</p>
      </section>
      <ProductGrid products={products} onAddToCart={handleAddToCart} />
      <RegisterForm />
      <LoginForm />
      <section id="nosotros" className="seccion">
        <h2>Sobre Nosotros</h2>
        <article>
          <p>Somos una Pyme dedicada a la impresión 3D personalizada, creada por un estudiante con pasión por la tecnología, el arte y la innovación. Nos especializamos en crear figuras personalizadas a partir de fotos de referencia, utilizando diversos estilos de escultura digital para ofrecer productos únicos y detallados!</p>
        </article>
      </section>
      <ProcessSection />
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