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
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  return (
    <div className="producto-card">
      <img src={product.imagen} alt={product.nombre} />
      <h3>{product.nombre}</h3>
      <p>Precio: ${product.precio.toLocaleString('es-CL')}</p>
      <p>Categoría: {product.categoria}</p>
      <Button onClick={() => onAddToCart(product.id)}>Agregar al Carrito</Button>
    </div>
  );
};

export default ProductCard;