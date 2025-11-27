// InfiniteCraft.store_React/src/hooks/useCart.ts

import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { ENDPOINTS } from '../constants/api';
import { useAuth } from './useAuth';

export interface CartItem {
  productId: number;
  nombre: string;
  precio: number;
  imagen: string;
  quantity: number;
  requiresPhoto?: boolean;
  referencePhotos?: File[];
}

export interface CartState {
  items: CartItem[];
  total: number;
}

const CART_STORAGE_KEY = 'infinitecraft_cart';

export const useCart = () => {
  const { isAuthenticated, user, token } = useAuth();
  const [cart, setCart] = useState<CartState>({ items: [], total: 0 });
  const [isLoading, setIsLoading] = useState(false);

  // Cargar carrito desde localStorage al iniciar
  useEffect(() => {
    const storedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (storedCart) {
      try {
        const parsedCart = JSON.parse(storedCart);
        setCart(parsedCart);
      } catch (error) {
        console.error('Error parsing stored cart:', error);
      }
    }
  }, []);

  // Guardar carrito en localStorage cada vez que cambie
  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  }, [cart]);

  // Calcular el total del carrito
  const calculateTotal = useCallback((items: CartItem[]) => {
    return items.reduce((sum, item) => sum + item.precio * item.quantity, 0);
  }, []);

  // Agregar producto al carrito
  const addToCart = useCallback((product: any, quantity: number = 1, referencePhotos?: File[]) => {
    setCart(prevCart => {
      const existingItem = prevCart.items.find(item => item.productId === product.id);

      let updatedItems;
      if (existingItem) {
        updatedItems = prevCart.items.map(item =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + quantity, referencePhotos }
            : item
        );
      } else {
        updatedItems = [
          ...prevCart.items,
          {
            productId: product.id,
            nombre: product.nombre,
            precio: product.precio,
            imagen: product.imagen,
            quantity,
            requiresPhoto: product.requiresPhoto || false,
            referencePhotos: referencePhotos || [],
          },
        ];
      }

      return {
        items: updatedItems,
        total: calculateTotal(updatedItems),
      };
    });
  }, [calculateTotal]);

  // Eliminar producto del carrito
  const removeFromCart = useCallback((productId: number) => {
    setCart(prevCart => {
      const updatedItems = prevCart.items.filter(item => item.productId !== productId);
      return {
        items: updatedItems,
        total: calculateTotal(updatedItems),
      };
    });
  }, [calculateTotal]);

  // Actualizar cantidad de un producto
  const updateQuantity = useCallback((productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart(prevCart => {
      const updatedItems = prevCart.items.map(item =>
        item.productId === productId ? { ...item, quantity } : item
      );
      return {
        items: updatedItems,
        total: calculateTotal(updatedItems),
      };
    });
  }, [calculateTotal, removeFromCart]);

  // Vaciar carrito
  const clearCart = useCallback(() => {
    setCart({ items: [], total: 0 });
  }, []);

  // Enviar carrito al servidor si el usuario está autenticado
  const syncCartToServer = useCallback(async () => {
    if (!isAuthenticated || !user || !token) {
      console.warn('User not authenticated. Cart remains in localStorage.');
      return;
    }

    setIsLoading(true);
    try {
      // Limpiar carrito en el servidor primero
      await axios.delete(ENDPOINTS.GET_USER_CART(user.id), {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Agregar cada item del carrito al servidor
      for (const item of cart.items) {
        await axios.post(
          ENDPOINTS.ADD_TO_CART(user.id),
          {
            productId: item.productId,
            quantity: item.quantity,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      }

      console.log('Cart synced to server successfully.');
    } catch (error) {
      console.error('Error syncing cart to server:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, user, token, cart.items]);

  // Realizar checkout
  const checkout = useCallback(async () => {
    if (!isAuthenticated || !user || !token) {
      throw new Error('Por favor, inicia sesión para continuar con la compra.');
    }

    if (cart.items.length === 0) {
      throw new Error('El carrito está vacío.');
    }

    setIsLoading(true);
    try {
      // Sincronizar carrito con el servidor
      await syncCartToServer();

      // Realizar checkout
      const response = await axios.post(
        ENDPOINTS.CHECKOUT(user.id),
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Limpiar carrito local tras checkout exitoso
      clearCart();

      return response.data;
    } catch (error) {
      console.error('Error during checkout:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, user, token, cart.items, syncCartToServer, clearCart]);

  return {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    checkout,
    syncCartToServer,
    isLoading,
  };
};
