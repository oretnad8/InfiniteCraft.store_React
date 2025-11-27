// InfiniteCraft.store_React/src/hooks/useProducts.ts

import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { ENDPOINTS } from '../constants/api';

export interface Product {
  id: number;
  nombre: string;
  precio: number;
  imagen: string;
  categoria: string;
  descripcion: string;
  requiresPhoto?: boolean;
}

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Obtener todos los productos
  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(ENDPOINTS.GET_PRODUCTS);
      setProducts(response.data);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Error al cargar los productos. Por favor, intenta más tarde.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Obtener un producto por ID
  const fetchProductById = useCallback(async (id: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${ENDPOINTS.GET_PRODUCTS}/${id}`);
      return response.data;
    } catch (err) {
      console.error('Error fetching product:', err);
      setError('Error al cargar el producto.');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Cargar productos al montar el componente
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return {
    products,
    isLoading,
    error,
    fetchProducts,
    fetchProductById,
  };
};
