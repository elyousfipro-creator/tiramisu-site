import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Linking,
  Alert,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useOrders } from '../context/OrderContext';

export default function DeliveryDashboard({ navigation }) {
  const { user, logout } = useAuth();
  const { orders, updateOrderStatus } = useOrders();

  const deliveryOrders = orders.filter(o => 
    ['preparation', 'livraison'].includes(o.statut)
  );

  const openMaps = (address) => {
    const url = `https://www.google.com/maps/dir/7+rue+Marcel+Cerdan,+Angers/${encodeURIComponent(address)}`;
    Linking.openURL(url);
  };

  const handleStartDelivery = (orderId) => {
    updateOrderStatus(orderId, 'livraison');
  };

  const handleDelivered = (orderId) => {
    Alert.alert(
      'Confirmer la livraison',
      'Le client a bien reçu sa commande ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Oui, livrée !',
          onPress: () => updateOrderStatus(orderId, 'livree'),
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
          <Text style={styles.title}>🚗 Livraisons</Text>
          <Text style={styles.subtitle}>Commandes à livrer</Text>
        </View>
        <TouchableOpacity onPress={handleLogout}>
          <Text style={styles.logoutText}>Déconnexion</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView}>
        {deliveryOrders.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>✅</Text>
            <Text style={styles.emptyText}>Aucune livraison en attente</Text>
          </View>
        ) : (
          deliveryOrders.map(order => (
            <View key={order.id} style={styles.orderCard}>
              <View style={styles.orderHeader}>
                <Text style={styles.orderId}>{order.id}</Text>
                <View style={[
                  styles.statusBadge,
                  order.statut === 'preparation' 
                    ? styles.statusPrep 
                    : styles.statusDelivery
                ]}>
                  <Text style={styles.statusText}>
                    {order.statut === 'preparation' ? '👨‍🍳 Prête' : '🚗 En route'}
                  </Text>
                </View>
              </View>

              <Text style={styles.timeLabel}>
                🕐 Créneau : {order.creneau}
              </Text>

              {/* Client Info */}
              <View style={styles.clientInfo}>
                <Text style={styles.clientName}>👤 {order.clientNom}</Text>
                <Text style={styles.clientPhone}>📞 {order.clientTelephone}</Text>
              </View>

              {/* Adresse */}
              <TouchableOpacity 
                style={styles.addressBox}
                onPress={() => openMaps(order.adresse)}
              >
                <Text style={styles.addressLabel}>📍 Adresse de livraison</Text>
                <Text style={styles.addressText}>{order.adresse}</Text>
                <Text style={styles.mapsLink}>Ouvrir dans Maps →</Text>
              </TouchableOpacity>

              {/* Produits */}
              <View style={styles.itemsList}>
                {order.items.map((item, index) => (
                  <Text key={index} style={styles.itemText}>
                    {item.emoji} {item.nom} x{item.quantity}
                  </Text>
                ))}
              </View>

              {/* Total */}
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Total à encaisser</Text>
                <Text style={styles.totalValue}>{order.total.toFixed(2)}€</Text>
              </View>

              {/* Paiement */}
              <View style={styles.paymentInfo}>
                <Text style={styles.paymentText}>
                  {order.paymentMethod === 'especes' 
                    ? '💵 Paiement en espèces' 
                    : '💳 Payé via PayPal'}
                </Text>
              </View>

              {/* Actions */}
              {order.statut === 'preparation' ? (
                <TouchableOpacity
                  style={styles.startButton}
                  onPress={() => handleStartDelivery(order.id)}
                >
                  <Text style={styles.buttonText}>🚗 Partir en livraison</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={styles.deliveredButton}
                  onPress={() => handleDelivered(order.id)}
                >
                  <Text style={styles.buttonText}>✅ Marquer comme livrée</Text>
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
    backgroundColor: '#8B5CF6',
    padding: 20,
    paddingTop: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
  },
  subtitle: {
    color: 'rgba(255,255,255,0.8)',
    marginTop: 5,
  },
  logoutText: {
    color: 'white',
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
  statusPrep: {
    backgroundColor: '#10B981',
  },
  statusDelivery: {
    backgroundColor: '#8B5CF6',
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
  clientInfo: {
    backgroundColor: '#F5E6D3',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  clientName: {
    fontWeight: 'bold',
    color: '#4A2C2A',
    fontSize: 16,
  },
  clientPhone: {
    color: '#666',
    marginTop: 5,
  },
  addressBox: {
    backgroundColor: '#EEF2FF',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  addressLabel: {
    fontWeight: 'bold',
    color: '#4A2C2A',
    marginBottom: 5,
  },
  addressText: {
    color: '#4A2C2A',
  },
  mapsLink: {
    color: '#8B5CF6',
    fontWeight: 'bold',
    marginTop: 10,
  },
  itemsList: {
    backgroundColor: '#F5E6D3',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  itemText: {
    color: '#4A2C2A',
    marginBottom: 5,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  totalLabel: {
    fontWeight: 'bold',
    color: '#4A2C2A',
  },
  totalValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFB7C5',
  },
  paymentInfo: {
    backgroundColor: '#FEF3C7',
    padding: 10,
    borderRadius: 10,
    marginBottom: 15,
    alignItems: 'center',
  },
  paymentText: {
    color: '#92400E',
    fontWeight: 'bold',
  },
  startButton: {
    backgroundColor: '#8B5CF6',
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
  },
  deliveredButton: {
    backgroundColor: '#10B981',
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
