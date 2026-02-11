import { createContext, useContext, useState, ReactNode } from 'react';
import { Order, OrderStatus, CartItem, PaymentMethod } from '../types';

interface OrderContextType {
  orders: Order[];
  createOrder: (data: CreateOrderData) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  getOrderById: (orderId: string) => Order | undefined;
  getOrdersByClient: (clientId: string) => Order[];
  updateLivreurPosition: (orderId: string, lat: number, lng: number) => void;
}

interface CreateOrderData {
  clientId: string;
  clientNom: string;
  clientTelephone: string;
  items: CartItem[];
  total: number;
  adresse: string;
  creneau: string;
  paymentMethod: PaymentMethod;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

function generateOrderId(): string {
  const date = new Date();
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `TIRA-${dateStr}-${random}`;
}

export function OrderProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);

  const createOrder = (data: CreateOrderData): Order => {
    const newOrder: Order = {
      id: generateOrderId(),
      clientId: data.clientId,
      clientNom: data.clientNom,
      items: data.items,
      total: data.total,
      statut: 'confirmee',
      adresse: data.adresse,
      adresseLivraison: data.adresse,
      telephone: data.clientTelephone,
      creneau: data.creneau,
      creneauHoraire: data.creneau,
      paymentMethod: data.paymentMethod,
      createdAt: new Date().toISOString(),
    };

    setOrders(prev => [...prev, newOrder]);
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders(prev =>
      prev.map(order =>
        order.id === orderId ? { ...order, statut: status } : order
      )
    );
  };

  const getOrderById = (orderId: string): Order | undefined => {
    return orders.find(order => order.id === orderId);
  };

  const getOrdersByClient = (clientId: string): Order[] => {
    return orders.filter(order => order.clientId === clientId);
  };

  const updateLivreurPosition = (orderId: string, lat: number, lng: number) => {
    setOrders(prev =>
      prev.map(order =>
        order.id === orderId
          ? { ...order, livreurPosition: { lat, lng } }
          : order
      )
    );
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        createOrder,
        updateOrderStatus,
        getOrderById,
        getOrdersByClient,
        updateLivreurPosition,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders() {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
}
