import React, { useState } from 'react';
import MainLayout from '../components/templates/MainLayout';
import ProductGrid from '../components/organisms/ProductGrid/ProductGrid';
import RegisterForm from '../components/organisms/RegisterForm/RegisterForm';
import LoginForm from '../components/organisms/LoginForm/LoginForm';
import ContactForm from '../components/organisms/ContactForm/ContactForm';
import Cart from '../components/organisms/Cart/Cart';
import ProductModal from '../components/organisms/ProductModal/ProductModal';
import { Carousel } from 'react-bootstrap';
import ProcessSection from '../components/organisms/ProcessSection/ProcessSection';
import { useProducts } from '../hooks/useProducts';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';

const HomePage: React.FC = () => {
  const { products, isLoading: productsLoading, error: productsError } = useProducts();
  const { cart, addToCart, removeFromCart, updateQuantity, clearCart, checkout, isLoading: cartLoading } = useCart();
  const { isAuthenticated } = useAuth();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  const handleAddToCart = (id: number, quantity: number, photos: File[]) => {
    const product = products.find(p => p.id === id);
    if (!product) return;

    addToCart(product, quantity, photos);
    setSelectedProduct(null);
  };

  const handleRemoveFromCart = (productId: number) => {
    removeFromCart(productId);
  };

  const handleUpdateQuantity = (productId: number, quantity: number) => {
    updateQuantity(productId, quantity);
  };

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      alert('Por favor, inicia sesión para continuar con la compra.');
      return;
    }

    try {
      setCheckoutError(null);
      await checkout();
      alert('¡Compra realizada con éxito!');
      setIsCartOpen(false);
    } catch (error) {
      if (error instanceof Error) {
        setCheckoutError(error.message);
        alert(`Error en el checkout: ${error.message}`);
      } else {
        setCheckoutError('Error desconocido durante el checkout.');
        alert('Error desconocido durante el checkout.');
      }
    }
  };

  const cartCount = cart.items.length;

  const handleViewDetails = (id: number) => {
    const product = products.find(p => p.id === id);
    if (product) {
      setSelectedProduct(product);
    }
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
  };

  if (productsLoading) {
    return <div>Cargando productos...</div>;
  }

  return (
    <MainLayout cartCount={cartCount} onCartClick={() => setIsCartOpen(true)}>
      <section id="home" className="seccion">
        <h1>¡Bienvenido coleccionista!</h1>
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
        <p>¡Transforma tus ideas en figuras 3D de resina únicas!</p>
      </section>

      {productsError && <div className="alert alert-danger">{productsError}</div>}

      <ProductGrid
        products={products}
        onViewDetails={handleViewDetails}
      />

      <RegisterForm />
      <LoginForm />

      <section id="nosotros" className="seccion">
        <h2>Sobre Nosotros</h2>
        <article>
          <p>Somos una Pyme dedicada a la impresión 3D personalizada, creada por un estudiante con pasión por la tecnología, el arte y la innovación. Nos especializamos en crear figuras personalizadas a partir de fotos de referencia, utilizando diversos estilos de escultura digital para ofrecer productos únicos y detallados.</p>
        </article>
      </section>

      <ProcessSection />
      <ContactForm />

      {isCartOpen && (
        <Cart
          cart={cart}
          onClose={() => setIsCartOpen(false)}
          onRemoveFromCart={handleRemoveFromCart}
          onUpdateQuantity={handleUpdateQuantity}
          onCheckout={handleCheckout}
          isLoading={cartLoading}
          checkoutError={checkoutError}
        />
      )}

      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={handleCloseModal}
          onAddToCart={handleAddToCart}
        />
      )}
    </MainLayout>
  );
};

export default HomePage;
