
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { ENDPOINTS } from '../constants/api';
import { useAuth } from './useAuth';

export interface OrderDetail {
  id: number;
  productId: number;
  quantity: number;
  price: number;
}

export interface Order {
  id: number;
  userId: number;
  date: string;
  status: 'PENDING' | 'RECEIVED' | 'IN_PREPARATION' | 'COMPLETED' | null;
  total: number;
  details: OrderDetail[];
}

export const useOrders = () => {
  const { user, token, isAuthenticated } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Obtener órdenes del usuario autenticado
  const fetchUserOrders = useCallback(async () => {
    if (!isAuthenticated || !user || !token) {
      console.warn('User not authenticated. Cannot fetch orders.');
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(ENDPOINTS.GET_USER_ORDERS(user.id), {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(response.data);
    } catch (err) {
      console.error('Error fetching user orders:', err);
      setError('Error al cargar las órdenes.');
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, user, token]);

  // Obtener todas las órdenes (solo para admin/seller)
  const fetchAllOrders = useCallback(async () => {
    if (!isAuthenticated || !user || !token) {
      console.warn('User not authenticated. Cannot fetch all orders.');
      return;
    }

    if (user.role !== 'ADMIN' && user.role !== 'SELLER') {
      console.warn('User does not have permission to fetch all orders.');
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(ENDPOINTS.GET_ALL_ORDERS, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(response.data);
    } catch (err) {
      console.error('Error fetching all orders:', err);
      setError('Error al cargar las órdenes.');
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, user, token]);

  // Actualizar el estado de una orden (solo para admin/seller)
  const updateOrderStatus = useCallback(
    async (orderId: number, newStatus: 'RECEIVED' | 'IN_PREPARATION' | 'COMPLETED') => {
      if (!isAuthenticated || !user || !token) {
        throw new Error('User not authenticated.');
      }

      if (user.role !== 'ADMIN' && user.role !== 'SELLER') {
        throw new Error('User does not have permission to update order status.');
      }

      try {
        const response = await axios.put(
          `${ENDPOINTS.GET_ALL_ORDERS}/${orderId}/status`,
          { status: newStatus },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        // Actualizar la orden en el estado local
        setOrders(prevOrders =>
          prevOrders.map(order =>
            order.id === orderId ? { ...order, status: newStatus } : order
          )
        );

        return response.data;
      } catch (err) {
        console.error('Error updating order status:', err);
        throw err;
      }
    },
    [isAuthenticated, user, token]
  );

  // Cargar órdenes al montar el componente
  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === 'ADMIN' || user.role === 'SELLER') {
        fetchAllOrders();
      } else {
        fetchUserOrders();
      }
    }
  }, [isAuthenticated, user, fetchUserOrders, fetchAllOrders]);

  return {
    orders,
    isLoading,
    error,
    fetchUserOrders,
    fetchAllOrders,
    updateOrderStatus,
  };
};
