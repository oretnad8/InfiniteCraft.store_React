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
  onViewDetails: (id: number) => void; // Prop onAddToCart eliminada
}

const ProductGrid: React.FC<ProductGridProps> = ({ products, onViewDetails }) => {
  return (
    <section id="productos" className="seccion">
      <h2>Nuestros Productos</h2>
      <div className="grid-productos">
        {products.map(product => (
          <ProductCard 
            key={product.id} 
            product={product} 
            onViewDetails={onViewDetails}
          />
        ))}
      </div>
    </section>
  );
};

export default ProductGrid;