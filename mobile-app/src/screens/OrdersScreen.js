import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useOrders } from '../context/OrderContext';

const STATUS_CONFIG = {
  confirmee: { label: 'Confirmée', color: '#3B82F6', emoji: '✓' },
  preparation: { label: 'En préparation', color: '#F59E0B', emoji: '👨‍🍳' },
  livraison: { label: 'En livraison', color: '#8B5CF6', emoji: '🚗' },
  livree: { label: 'Livrée', color: '#10B981', emoji: '✅' },
  annulee: { label: 'Annulée', color: '#EF4444', emoji: '❌' },
};

export default function OrdersScreen({ navigation }) {
  const { user } = useAuth();
  const { getOrdersByUser } = useOrders();

  const orders = user ? getOrdersByUser(user.id) : [];

  if (!user) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyEmoji}>🔒</Text>
        <Text style={styles.emptyTitle}>Connectez-vous</Text>
        <Text style={styles.emptyText}>
          Pour voir vos commandes, veuillez vous connecter.
        </Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.buttonText}>Se connecter</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (orders.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyEmoji}>📦</Text>
        <Text style={styles.emptyTitle}>Aucune commande</Text>
        <Text style={styles.emptyText}>
          Vous n'avez pas encore passé de commande.
        </Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={styles.buttonText}>Voir le menu</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Text style={styles.title}>Mes Commandes</Text>

        {orders.map(order => {
          const status = STATUS_CONFIG[order.statut] || STATUS_CONFIG.confirmee;
          return (
            <TouchableOpacity
              key={order.id}
              style={styles.orderCard}
              onPress={() => navigation.navigate('Tracking', { orderId: order.id })}
            >
              <View style={styles.orderHeader}>
                <View>
                  <Text style={styles.orderId}>{order.id}</Text>
                  <Text style={styles.orderDate}>
                    {new Date(order.createdAt).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: status.color }]}>
                  <Text style={styles.statusEmoji}>{status.emoji}</Text>
                  <Text style={styles.statusText}>{status.label}</Text>
                </View>
              </View>

              <View style={styles.orderItems}>
                {order.items.slice(0, 3).map((item, index) => (
                  <Text key={index} style={styles.orderItemText}>
                    {item.emoji} {item.nom} x{item.quantity}
                  </Text>
                ))}
                {order.items.length > 3 && (
                  <Text style={styles.moreItems}>
                    +{order.items.length - 3} autres produits
                  </Text>
                )}
              </View>

              <View style={styles.orderFooter}>
                <Text style={styles.orderTotal}>{order.total.toFixed(2)}€</Text>
                <Text style={styles.trackLink}>Suivre →</Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5E6D3',
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4A2C2A',
    marginBottom: 20,
    marginTop: 40,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5E6D3',
    padding: 40,
  },
  emptyEmoji: {
    fontSize: 80,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4A2C2A',
    marginTop: 20,
  },
  emptyText: {
    color: '#666',
    textAlign: 'center',
    marginTop: 10,
  },
  button: {
    backgroundColor: '#FFB7C5',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    marginTop: 25,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  orderCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  orderId: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4A2C2A',
  },
  orderDate: {
    color: '#666',
    marginTop: 3,
    fontSize: 13,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusEmoji: {
    marginRight: 5,
  },
  statusText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  orderItems: {
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  orderItemText: {
    color: '#4A2C2A',
    marginBottom: 5,
  },
  moreItems: {
    color: '#999',
    fontStyle: 'italic',
    marginTop: 5,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  orderTotal: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFB7C5',
  },
  trackLink: {
    color: '#FFB7C5',
    fontWeight: 'bold',
  },
});
