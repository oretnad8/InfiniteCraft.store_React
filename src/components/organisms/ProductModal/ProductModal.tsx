import React from 'react';
import Button from '../../atoms/Button/Button';
import './ProductModal.css';

interface Product {
  id: number;
  nombre: string;
  precio: number;
  imagen: string;
  categoria: string;
  descripcion: string; // Añadimos una descripción para el detalle
}

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (id: number) => void;
}

const ProductModal: React.FC<ProductModalProps> = ({ product, onClose, onAddToCart }) => {
  if (!product) {
    return null;
  }

  return (
    <div className="custom-modal">
      <div className="custom-modal-contenido">
        <span className="cerrar" onClick={onClose}>&times;</span>
        <h2>{product.nombre}</h2>
        <div className="modal-body">
            <img src={product.imagen} alt={product.nombre} className="modal-img" />
            <div className="modal-details">
                <p><strong>Categoría:</strong> {product.categoria}</p>
                <p>{product.descripcion}</p>
                <p className="modal-price">Precio: ${product.precio.toLocaleString('es-CL')}</p>
                <Button onClick={() => onAddToCart(product.id)}>Agregar al Carrito</Button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;