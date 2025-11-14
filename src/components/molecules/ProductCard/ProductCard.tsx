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
  onViewDetails: (id: number) => void; // Prop onAddToCart eliminada
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onViewDetails }) => {
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
      </div>
    </div>
  );
};

export default ProductCard;