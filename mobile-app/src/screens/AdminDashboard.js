import React, { useState } from 'react';
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
  confirmee: { label: 'Confirmée', color: '#3B82F6' },
  preparation: { label: 'En préparation', color: '#F59E0B' },
  livraison: { label: 'En livraison', color: '#8B5CF6' },
  livree: { label: 'Livrée', color: '#10B981' },
  annulee: { label: 'Annulée', color: '#EF4444' },
};

export default function AdminDashboard({ navigation }) {
  const { user, logout } = useAuth();
  const { orders } = useOrders();
  const [activeTab, setActiveTab] = useState('today');

  const today = new Date().toDateString();
  const todayOrders = orders.filter(o => 
    new Date(o.createdAt).toDateString() === today
  );

  const todayRevenue = todayOrders
    .filter(o => o.statut !== 'annulee')
    .reduce((sum, o) => sum + o.total, 0);

  const handleLogout = async () => {
    await logout();
    navigation.replace('MainTabs');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>📊 Dashboard</Text>
          <Text style={styles.subtitle}>Administration</Text>
        </View>
        <TouchableOpacity onPress={handleLogout}>
          <Text style={styles.logoutText}>Déconnexion</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Stats du jour */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{todayOrders.length}</Text>
            <Text style={styles.statLabel}>Commandes du jour</Text>
          </View>
          <View style={[styles.statCard, styles.statCardPink]}>
            <Text style={[styles.statValue, styles.statValueWhite]}>
              {todayRevenue.toFixed(2)}€
            </Text>
            <Text style={[styles.statLabel, styles.statLabelWhite]}>
              CA du jour
            </Text>
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'today' && styles.tabActive]}
            onPress={() => setActiveTab('today')}
          >
            <Text style={[
              styles.tabText,
              activeTab === 'today' && styles.tabTextActive
            ]}>
              Aujourd'hui
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'all' && styles.tabActive]}
            onPress={() => setActiveTab('all')}
          >
            <Text style={[
              styles.tabText,
              activeTab === 'all' && styles.tabTextActive
            ]}>
              Toutes
            </Text>
          </TouchableOpacity>
        </View>

        {/* Liste des commandes */}
        {(activeTab === 'today' ? todayOrders : orders).map(order => {
          const status = STATUS_CONFIG[order.statut];
          return (
            <View key={order.id} style={styles.orderCard}>
              <View style={styles.orderHeader}>
                <View>
                  <Text style={styles.orderId}>{order.id}</Text>
                  <Text style={styles.orderDate}>
                    {new Date(order.createdAt).toLocaleString('fr-FR')}
                  </Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: status.color }]}>
                  <Text style={styles.statusText}>{status.label}</Text>
                </View>
              </View>

              <View style={styles.orderDetails}>
                <Text style={styles.clientName}>👤 {order.clientNom}</Text>
                <Text style={styles.orderInfo}>
                  📍 {order.adresse}
                </Text>
                <Text style={styles.orderInfo}>
                  🕐 Créneau : {order.creneau}
                </Text>
              </View>

              <View style={styles.orderItems}>
                {order.items.map((item, index) => (
                  <Text key={index} style={styles.itemText}>
                    {item.emoji} {item.nom} x{item.quantity}
                  </Text>
                ))}
              </View>

              <View style={styles.orderFooter}>
                <Text style={styles.paymentMethod}>
                  {order.paymentMethod === 'especes' ? '💵 Espèces' : '💳 PayPal'}
                </Text>
                <Text style={styles.orderTotal}>{order.total.toFixed(2)}€</Text>
              </View>
            </View>
          );
        })}

        {(activeTab === 'today' ? todayOrders : orders).length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>Aucune commande</Text>
          </View>
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
    backgroundColor: '#4A2C2A',
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
    color: 'rgba(255,255,255,0.7)',
    marginTop: 5,
  },
  logoutText: {
    color: '#FFB7C5',
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 15,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
  },
  statCardPink: {
    backgroundColor: '#FFB7C5',
  },
  statValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4A2C2A',
  },
  statValueWhite: {
    color: 'white',
  },
  statLabel: {
    color: '#666',
    marginTop: 5,
    textAlign: 'center',
  },
  statLabelWhite: {
    color: 'rgba(255,255,255,0.9)',
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 25,
    padding: 4,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 22,
  },
  tabActive: {
    backgroundColor: '#FFB7C5',
  },
  tabText: {
    color: '#666',
    fontWeight: '600',
  },
  tabTextActive: {
    color: 'white',
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
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  orderId: {
    fontWeight: 'bold',
    color: '#4A2C2A',
  },
  orderDate: {
    color: '#999',
    fontSize: 12,
    marginTop: 3,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 15,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  orderDetails: {
    backgroundColor: '#F5E6D3',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  clientName: {
    fontWeight: 'bold',
    color: '#4A2C2A',
    marginBottom: 5,
  },
  orderInfo: {
    color: '#666',
    marginTop: 3,
  },
  orderItems: {
    paddingVertical: 10,
  },
  itemText: {
    color: '#4A2C2A',
    marginBottom: 3,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  paymentMethod: {
    color: '#666',
  },
  orderTotal: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFB7C5',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    color: '#666',
    fontSize: 16,
  },
});
