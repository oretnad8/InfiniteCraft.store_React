import React from 'react';
import ProductCard from '../../molecules/ProductCard/ProductCard';
import './ProductGrid.css';

interface Product {
  id: number;
  nombre: string;
  precio: number;
  imagen: string;
  categoria: string;
}

interface ProductGridProps {
  products: Product[];
  onAddToCart: (id: number) => void;
}

const ProductGrid: React.FC<ProductGridProps> = ({ products, onAddToCart }) => {
  return (
    <section id="productos" className="seccion">
      <h2>Nuestros Productos</h2>
      <div className="grid-productos">
        {products.map(product => (
          <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
        ))}
      </div>
    </section>
  );
};

export default ProductGrid;