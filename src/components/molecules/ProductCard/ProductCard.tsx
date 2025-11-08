import React from 'react';
import Button from '../../atoms/Button/Button';
import './ProductCard.css';

interface ProductCardProps {
  product: {
    id: number;
    nombre: string;
    precio: number;
    imagen: string;
    categoria: string;
  };
  onAddToCart: (id: number) => void;
  onViewDetails: (id: number) => void; // Nueva prop
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, onViewDetails }) => {
  return (
    <div className="producto-card">
      <div className="producto-card-img-container" onClick={() => onViewDetails(product.id)}>
        <img src={product.imagen} alt={product.nombre} />
      </div>
      <h3>{product.nombre}</h3>
      <p>Precio: ${product.precio.toLocaleString('es-CL')}</p>
      <p>Categoría: {product.categoria}</p>
      <div className="producto-card-actions">
        <Button onClick={() => onViewDetails(product.id)}>Ver Detalle</Button>
        <Button onClick={() => onAddToCart(product.id)}>Agregar al Carrito</Button>
      </div>
    </div>
  );
};

export default ProductCard;