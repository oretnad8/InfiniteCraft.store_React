import React from 'react';
import Button from '../../atoms/Button/Button';
import './Cart.css';

interface CartItem {
  productId: number;
  nombre: string;
  precio: number;
  imagen: string;
  quantity: number;
  requiresPhoto?: boolean;
  referencePhotos?: File[];
}

interface CartState {
  items: CartItem[];
  total: number;
}

interface CartProps {
  cart: CartState;
  onClose: () => void;
  onRemoveFromCart: (productId: number) => void;
  onUpdateQuantity: (productId: number, quantity: number) => void;
  onCheckout: () => void;
  isLoading?: boolean;
  checkoutError?: string | null;
}

const Cart: React.FC<CartProps> = ({
  cart,
  onClose,
  onRemoveFromCart,
  onUpdateQuantity,
  onCheckout,
  isLoading = false,
  checkoutError = null,
}) => {
  return (
    <div className="custom-modal">
      <div className="custom-modal-contenido">
        <span className="cerrar" onClick={onClose}>&times;</span>
        <h2>Mi Carrito de Compras</h2>
        <div id="items-carrito">
          {cart.items.length === 0 ? (
            <p>El carrito está vacío</p>
          ) : (
            cart.items.map((item) => (
              <div className="item-carrito" key={item.productId}>
                <img
                  src={item.imagen}
                  alt={item.nombre}
                  style={{
                    width: '50px',
                    height: '50px',
                    objectFit: 'cover',
                    borderRadius: '4px',
                    marginRight: '10px',
                  }}
                />
                <div style={{ flexGrow: 1 }}>
                  <span>{item.nombre}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '5px' }}>
                    <button
                      onClick={() => onUpdateQuantity(item.productId, item.quantity - 1)}
                      style={{
                        padding: '2px 6px',
                        fontSize: '0.8rem',
                        cursor: 'pointer',
                      }}
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() => onUpdateQuantity(item.productId, item.quantity + 1)}
                      style={{
                        padding: '2px 6px',
                        fontSize: '0.8rem',
                        cursor: 'pointer',
                      }}
                    >
                      +
                    </button>
                  </div>
                  {item.requiresPhoto && item.referencePhotos && item.referencePhotos.length > 0 && (
                    <span style={{ display: 'block', fontSize: '0.8rem', color: '#777', marginTop: '5px' }}>
                      Foto de referencia adjunta
                    </span>
                  )}
                </div>
                <span>${(item.precio * item.quantity).toLocaleString('es-CL')}</span>
                <Button onClick={() => onRemoveFromCart(item.productId)} className="btn-danger">
                  Eliminar
                </Button>
              </div>
            ))
          )}
        </div>
        <div id="total-carrito">Total: ${cart.total.toLocaleString('es-CL')}</div>
        {checkoutError && <div className="alert alert-danger">{checkoutError}</div>}
        <Button onClick={onCheckout} disabled={isLoading || cart.items.length === 0}>
          {isLoading ? 'Procesando...' : 'Pagar'}
        </Button>
      </div>
    </div>
  );
};

export default Cart;
