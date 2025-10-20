import React from 'react';
import Button from '../../atoms/Button/Button';
import './Cart.css';

interface CartItem {
  id: number;
  nombre: string;
  precio: number;
  cantidad: number;
}

interface CartProps {
  cart: CartItem[];
  onClose: () => void;
  onRemoveFromCart: (index: number) => void;
  onCheckout: () => void;
}

const Cart: React.FC<CartProps> = ({ cart, onClose, onRemoveFromCart, onCheckout }) => {
  const total = cart.reduce((sum, item) => sum + item.precio * item.cantidad, 0);

  return (
    <div className="custom-modal">
      <div className="custom-modal-contenido">
        <span className="cerrar" onClick={onClose}>&times;</span>
        <h2>Mi Carrito de Compras</h2>
        <div id="items-carrito">
          {cart.length === 0 ? (
            <p>El carrito está vacío</p>
          ) : (
            cart.map((item, index) => (
              <div className="item-carrito" key={index}>
                <span>{item.nombre} x{item.cantidad}</span>
                <span>${(item.precio * item.cantidad).toLocaleString('es-CL')}</span>
                <Button onClick={() => onRemoveFromCart(index)} className="btn-danger">Eliminar</Button>
              </div>
            ))
          )}
        </div>
        <div id="total-carrito">Total: ${total.toLocaleString('es-CL')}</div>
        <Button onClick={onCheckout}>Pagar</Button>
      </div>
    </div>
  );
};

export default Cart;