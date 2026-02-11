import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { useOrders } from '../context/OrderContext';

const TRACKING_STEPS = [
  { key: 'confirmee', label: 'Commande confirmée', emoji: '✓' },
  { key: 'preparation', label: 'En préparation', emoji: '👨‍🍳' },
  { key: 'livraison', label: 'En livraison', emoji: '🚗' },
  { key: 'livree', label: 'Livrée', emoji: '✅' },
];

export default function TrackingScreen({ route }) {
  const { orderId } = route.params;
  const { orders } = useOrders();
  const order = orders.find(o => o.id === orderId);

  if (!order) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Commande introuvable</Text>
      </View>
    );
  }

  const currentStepIndex = TRACKING_STEPS.findIndex(s => s.key === order.statut);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Suivi de commande</Text>
      <Text style={styles.orderId}>{order.id}</Text>

      {/* Timeline */}
      <View style={styles.timeline}>
        {TRACKING_STEPS.map((step, index) => {
          const isCompleted = index <= currentStepIndex;
          const isCurrent = index === currentStepIndex;
          return (
            <View key={step.key} style={styles.timelineStep}>
              <View style={styles.timelineLeft}>
                <View
                  style={[
                    styles.timelineDot,
                    isCompleted && styles.dotCompleted,
                    isCurrent && styles.dotCurrent,
                  ]}
                >
                  <Text style={styles.dotEmoji}>
                    {isCompleted ? step.emoji : '○'}
                  </Text>
                </View>
                {index < TRACKING_STEPS.length - 1 && (
                  <View
                    style={[
                      styles.timelineLine,
                      isCompleted && styles.lineCompleted,
                    ]}
                  />
                )}
              </View>
              <View style={styles.timelineContent}>
                <Text
                  style={[
                    styles.stepLabel,
                    isCompleted && styles.stepLabelCompleted,
                    isCurrent && styles.stepLabelCurrent,
                  ]}
                >
                  {step.label}
                </Text>
                {order.timeline.find(t => t.statut === step.key) && (
                  <Text style={styles.stepDate}>
                    {new Date(
                      order.timeline.find(t => t.statut === step.key).date
                    ).toLocaleString('fr-FR', {
                      day: 'numeric',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </Text>
                )}
              </View>
            </View>
          );
        })}
      </View>

      {/* Détails commande */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📦 Votre commande</Text>
        {order.items.map((item, index) => (
          <View key={index} style={styles.item}>
            <Text style={styles.itemEmoji}>{item.emoji}</Text>
            <Text style={styles.itemName}>{item.nom}</Text>
            <Text style={styles.itemQty}>x{item.quantity}</Text>
            <Text style={styles.itemPrice}>
              {(item.prix * item.quantity).toFixed(2)}€
            </Text>
          </View>
        ))}
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>{order.total.toFixed(2)}€</Text>
        </View>
      </View>

      {/* Livraison */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📍 Livraison</Text>
        <Text style={styles.address}>{order.adresse}</Text>
        <Text style={styles.creneau}>🕐 Créneau : {order.creneau}</Text>
      </View>

      {/* Contact */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📞 Une question ?</Text>
        <Text style={styles.contact}>📧 cremeetcookiess@gmail.com</Text>
        <Text style={styles.contact}>📸 @creme.et.cookies</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5E6D3',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4A2C2A',
    marginTop: 40,
  },
  orderId: {
    color: '#FFB7C5',
    fontWeight: 'bold',
    marginTop: 5,
    marginBottom: 25,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 100,
  },
  timeline: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
  },
  timelineStep: {
    flexDirection: 'row',
  },
  timelineLeft: {
    alignItems: 'center',
    width: 40,
  },
  timelineDot: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dotCompleted: {
    backgroundColor: '#FFB7C5',
  },
  dotCurrent: {
    backgroundColor: '#FFB7C5',
    borderWidth: 3,
    borderColor: '#4A2C2A',
  },
  dotEmoji: {
    fontSize: 16,
  },
  timelineLine: {
    width: 3,
    height: 40,
    backgroundColor: '#E5E7EB',
  },
  lineCompleted: {
    backgroundColor: '#FFB7C5',
  },
  timelineContent: {
    marginLeft: 15,
    paddingBottom: 30,
    flex: 1,
  },
  stepLabel: {
    fontSize: 16,
    color: '#9CA3AF',
  },
  stepLabelCompleted: {
    color: '#4A2C2A',
  },
  stepLabelCurrent: {
    fontWeight: 'bold',
    color: '#FFB7C5',
  },
  stepDate: {
    color: '#9CA3AF',
    fontSize: 12,
    marginTop: 3,
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4A2C2A',
    marginBottom: 15,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  itemEmoji: {
    fontSize: 24,
    marginRight: 10,
  },
  itemName: {
    flex: 1,
    color: '#4A2C2A',
  },
  itemQty: {
    color: '#666',
    marginRight: 10,
  },
  itemPrice: {
    fontWeight: 'bold',
    color: '#4A2C2A',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 2,
    borderTopColor: '#FFB7C5',
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4A2C2A',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFB7C5',
  },
  address: {
    color: '#4A2C2A',
    fontSize: 16,
    lineHeight: 22,
  },
  creneau: {
    color: '#666',
    marginTop: 10,
  },
  contact: {
    color: '#4A2C2A',
    marginBottom: 5,
  },
});
