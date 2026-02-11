import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useOrders } from '../context/OrderContext';

export default function KitchenDashboard({ navigation }) {
  const { user, logout } = useAuth();
  const { orders, updateOrderStatus } = useOrders();

  const pendingOrders = orders.filter(o => 
    ['confirmee', 'preparation'].includes(o.statut)
  );

  const handleMarkReady = (orderId) => {
    Alert.alert(
      'Commande prête ?',
      'Marquer cette commande comme prête pour la livraison ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Oui, prête !',
          onPress: () => updateOrderStatus(orderId, 'preparation'),
        },
      ]
    );
  };

  const handleLogout = async () => {
    await logout();
    navigation.replace('MainTabs');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>👨‍🍳 Cuisine</Text>
          <Text style={styles.subtitle}>Commandes à préparer</Text>
        </View>
        <TouchableOpacity onPress={handleLogout}>
          <Text style={styles.logoutText}>Déconnexion</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView}>
        {pendingOrders.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>✅</Text>
            <Text style={styles.emptyText}>Aucune commande en attente</Text>
          </View>
        ) : (
          pendingOrders.map(order => (
            <View key={order.id} style={styles.orderCard}>
              <View style={styles.orderHeader}>
                <Text style={styles.orderId}>{order.id}</Text>
                <View style={[
                  styles.statusBadge,
                  order.statut === 'confirmee' 
                    ? styles.statusNew 
                    : styles.statusPrep
                ]}>
                  <Text style={styles.statusText}>
                    {order.statut === 'confirmee' ? '🆕 Nouvelle' : '👨‍🍳 En préparation'}
                  </Text>
                </View>
              </View>

              <Text style={styles.timeLabel}>
                🕐 Livraison : {order.creneau}
              </Text>

              <View style={styles.itemsList}>
                {order.items.map((item, index) => (
                  <View key={index} style={styles.item}>
                    <Text style={styles.itemEmoji}>{item.emoji}</Text>
                    <Text style={styles.itemName}>{item.nom}</Text>
                    <Text style={styles.itemQty}>x{item.quantity}</Text>
                  </View>
                ))}
              </View>

              {order.statut === 'confirmee' ? (
                <TouchableOpacity
                  style={styles.prepButton}
                  onPress={() => updateOrderStatus(order.id, 'preparation')}
                >
                  <Text style={styles.prepButtonText}>
                    👨‍🍳 Commencer la préparation
                  </Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={styles.readyButton}
                  onPress={() => handleMarkReady(order.id)}
                >
                  <Text style={styles.readyButtonText}>
                    ✅ Marquer comme prête
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5E6D3',
  },
  header: {
    backgroundColor: '#FFB7C5',
    padding: 20,
    paddingTop: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4A2C2A',
  },
  subtitle: {
    color: '#4A2C2A',
    marginTop: 5,
  },
  logoutText: {
    color: '#4A2C2A',
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyEmoji: {
    fontSize: 60,
  },
  emptyText: {
    color: '#666',
    marginTop: 15,
    fontSize: 18,
  },
  orderCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  orderId: {
    fontWeight: 'bold',
    color: '#4A2C2A',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 15,
  },
  statusNew: {
    backgroundColor: '#3B82F6',
  },
  statusPrep: {
    backgroundColor: '#F59E0B',
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  timeLabel: {
    color: '#666',
    marginBottom: 15,
  },
  itemsList: {
    backgroundColor: '#F5E6D3',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  itemEmoji: {
    fontSize: 24,
    marginRight: 10,
  },
  itemName: {
    flex: 1,
    color: '#4A2C2A',
    fontWeight: '500',
  },
  itemQty: {
    fontWeight: 'bold',
    color: '#4A2C2A',
    fontSize: 16,
  },
  prepButton: {
    backgroundColor: '#F59E0B',
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
  },
  prepButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  readyButton: {
    backgroundColor: '#10B981',
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
  },
  readyButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
