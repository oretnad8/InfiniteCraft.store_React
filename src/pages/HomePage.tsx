import React, { useState, useEffect } from 'react';
import MainLayout from '../components/templates/MainLayout';
import ProductGrid from '../components/organisms/ProductGrid/ProductGrid';
import RegisterForm from '../components/organisms/RegisterForm/RegisterForm';
import LoginForm from '../components/organisms/LoginForm/LoginForm';
import ContactForm from '../components/organisms/ContactForm/ContactForm';
import Cart from '../components/organisms/Cart/Cart';
import ProductModal from '../components/organisms/ProductModal/ProductModal';
import { products as initialProducts } from '../data/products';
import { Carousel } from 'react-bootstrap'; 
import ProcessSection from '../components/organisms/ProcessSection/ProcessSection';

interface Product {
  id: number;
  nombre: string;
  precio: number;
  imagen: string;
  categoria: string;
  descripcion: string;
}

// Interface actualizada de CartItem para incluir la foto de referencia
interface CartItem extends Product {
  cantidad: number;
  photo: string; // Base64 string de la foto de referencia
}

const HomePage: React.FC = () => {
  const [products] = useState<Product[]>(initialProducts);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  // Lógica de añadir al carrito actualizada para aceptar la foto
  const handleAddToCart = (id: number, photo: string) => {
    const product = products.find(p => p.id === id);
    if (!product) return;

    setCart(prevCart => {
      // Un item personalizado es único por su foto, así que no agrupamos
      // si se suben fotos diferentes, incluso si es el mismo producto.
      // Si se quiere agrupar, se debería comprobar también item.photo === photo
      const existingItem = prevCart.find(item => item.id === id && item.photo === photo);
      
      if (existingItem) {
        return prevCart.map(item =>
          item.id === id && item.photo === photo ? { ...item, cantidad: item.cantidad + 1 } : item
        );
      }
      // Se añade como un nuevo item en el carrito
      return [...prevCart, { ...product, cantidad: 1, photo: photo }];
    });
    // Cierra el modal después de añadir
    handleCloseModal(); 
  };

  const handleRemoveFromCart = (index: number) => {
    setCart(prevCart => prevCart.filter((_, i) => i !== index));
  };
  
  // Lógica de checkout actualizada para guardar la orden en localStorage
  const handleCheckout = () => {
    // 1. Obtener órdenes existentes
    const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    
    // 2. Crear nueva orden con los items del carrito
    const newOrder = {
      id: `order-${Date.now()}`,
      date: new Date().toLocaleString('es-CL'),
      items: cart 
    };
    
    // 3. Guardar la nueva lista de órdenes
    const updatedOrders = [...existingOrders, newOrder];
    localStorage.setItem('orders', JSON.stringify(updatedOrders));
    
    // 4. Limpiar el carrito y estado
    alert('¡Compra realizada con éxito!');
    setCart([]);
    localStorage.removeItem('cart');
    setIsCartOpen(false);
  };
  
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);
  
  // Se usa cart.length porque cada item con foto distinta es una entrada separada
  const cartCount = cart.length; 

  const handleViewDetails = (id: number) => {
    const product = products.find(p => p.id === id);
    if(product) {
      setSelectedProduct(product);
    }
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
  };

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
      <ProductGrid 
        products={products} 
        onViewDetails={handleViewDetails}
        // Se elimina onAddToCart de aquí
      />
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
      {selectedProduct && (
        <ProductModal 
          product={selectedProduct}
          onClose={handleCloseModal}
          onAddToCart={handleAddToCart} // onAddToCart ahora espera la foto
        />
      )}
    </MainLayout>
  );
};

export default HomePage;