import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const OrderContext = createContext();

export function OrderProvider({ children }) {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const savedOrders = await AsyncStorage.getItem('orders');
      if (savedOrders) {
        setOrders(JSON.parse(savedOrders));
      }
    } catch (error) {
      console.error('Erreur chargement commandes:', error);
    }
  };

  const saveOrders = async (newOrders) => {
    await AsyncStorage.setItem('orders', JSON.stringify(newOrders));
    setOrders(newOrders);
  };

  const generateOrderId = () => {
    const date = new Date();
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `TIRA-${dateStr}-${random}`;
  };

  const createOrder = async (orderData) => {
    const newOrder = {
      id: generateOrderId(),
      ...orderData,
      statut: 'confirmee',
      createdAt: new Date().toISOString(),
      timeline: [
        { statut: 'confirmee', date: new Date().toISOString() }
      ],
    };

    const newOrders = [newOrder, ...orders];
    await saveOrders(newOrders);
    return newOrder;
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    const newOrders = orders.map(order => {
      if (order.id === orderId) {
        return {
          ...order,
          statut: newStatus,
          timeline: [
            ...order.timeline,
            { statut: newStatus, date: new Date().toISOString() }
          ],
        };
      }
      return order;
    });
    await saveOrders(newOrders);
  };

  const getOrdersByUser = (userId) => {
    return orders.filter(order => order.clientId === userId);
  };

  const getOrdersByStatus = (status) => {
    return orders.filter(order => order.statut === status);
  };

  const getPendingOrders = () => {
    return orders.filter(order => 
      ['confirmee', 'preparation'].includes(order.statut)
    );
  };

  const getDeliveryOrders = () => {
    return orders.filter(order => 
      ['preparation', 'livraison'].includes(order.statut)
    );
  };

  return (
    <OrderContext.Provider value={{
      orders,
      createOrder,
      updateOrderStatus,
      getOrdersByUser,
      getOrdersByStatus,
      getPendingOrders,
      getDeliveryOrders,
    }}>
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders() {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrders doit être utilisé dans un OrderProvider');
  }
  return context;
}
