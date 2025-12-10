
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { ENDPOINTS } from '../constants/api';

export interface User {
    id: number;
    nombre?: string;
    email: string;
    role: 'ADMIN' | 'USER';
    password?: string;
}

export const useUsers = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Obtener todos los usuarios
    const fetchUsers = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await axios.get(ENDPOINTS.GET_USERS);
            setUsers(response.data);
        } catch (err) {
            console.error('Error fetching users:', err);
            setError('Error al cargar los usuarios.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Cargar usuarios al montar
    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    return {
        users,
        isLoading,
        error,
        fetchUsers,
    };
};
