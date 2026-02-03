import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from './axios';
import { Category, Product, Order, Modifier } from '@saj/types';

// Categories
export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data } = await api.get<{ data: Category[] }>('/categories?active=true');
      return data.data;
    },
  });
};

// Products
// Products
export const useProducts = (categoryId?: number | null) => {
  return useQuery({
    queryKey: ['products', categoryId],
    queryFn: async () => {
      const params = categoryId ? { categoryId, active: true } : {};
      const { data } = await api.get<{ data: Product[] }>('/products', { params });
      return data.data;
    },
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (productData: Partial<Product>) => {
      const { data } = await api.post<{ data: { id: number } }>('/products', productData);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<Product> }) => {
      const response = await api.put<{ data: { success: boolean } }>(`/products/${id}`, data);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const response = await api.delete<{ data: { success: boolean } }>(`/products/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};

// Categories CRUD
export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (categoryData: Partial<Category>) => {
      const { data } = await api.post<{ data: { id: number } }>('/categories', categoryData);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<Category> }) => {
      const response = await api.put<{ data: { success: boolean } }>(`/categories/${id}`, data);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const response = await api.delete<{ data: { success: boolean } }>(`/categories/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
};

// Modifiers
export const useModifiers = () => {
  return useQuery({
    queryKey: ['modifiers'],
    queryFn: async () => {
      const { data } = await api.get<{ data: Modifier[] }>('/modifiers');
      return data.data;
    },
  });
};

// Orders
export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (orderData: Partial<Order>) => {
      const { data } = await api.post<{ data: { id: number } }>('/orders', orderData);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
};

export const useSendToKitchen = () => {
  return useMutation({
    mutationFn: async (orderId: number) => {
      const { data } = await api.post<{ data: Order }>(`/orders/${orderId}/send-kitchen`);
      return data.data;
    },
  });
};

export const useProcessPayment = () => {
  return useMutation({
    mutationFn: async (paymentData: any) => {
      const { data } = await api.post('/payments', paymentData);
      return data.data;
    },
  });
};
