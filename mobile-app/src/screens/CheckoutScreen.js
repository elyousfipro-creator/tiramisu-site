import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useOrders } from '../context/OrderContext';

const TIME_SLOTS = [
  '18:00 - 18:30', '18:30 - 19:00', '19:00 - 19:30', '19:30 - 20:00',
  '20:00 - 20:30', '20:30 - 21:00', '21:00 - 21:30', '21:30 - 22:00',
  '22:00 - 22:30', '22:30 - 23:00', '23:00 - 23:30', '23:30 - 00:00',
];

export default function CheckoutScreen({ navigation }) {
  const { items, getTotal, clearCart } = useCart();
  const { user, updateLoyalty } = useAuth();
  const { createOrder } = useOrders();
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleOrder = async () => {
    if (!selectedSlot) {
      Alert.alert('Erreur', 'Veuillez sélectionner un créneau horaire');
      return;
    }
    if (!paymentMethod) {
      Alert.alert('Erreur', 'Veuillez sélectionner un moyen de paiement');
      return;
    }

    setLoading(true);
    try {
      const order = await createOrder({
        clientId: user.id,
        clientNom: user.nom,
        clientEmail: user.email,
        clientTelephone: user.telephone,
        adresse: user.adresse,
        items: items.map(item => ({
          id: item.id,
          nom: item.nom,
          prix: item.prix,
          quantity: item.quantity,
          emoji: item.emoji,
        })),
        total: getTotal(),
        creneau: selectedSlot,
        paymentMethod,
      });

      await updateLoyalty();
      clearCart();

      Alert.alert(
        '🎉 Commande confirmée !',
        `Numéro: ${order.id}\n\nVotre commande sera livrée entre ${selectedSlot}.\n\nMerci pour votre confiance !`,
        [
          {
            text: 'Voir ma commande',
            onPress: () => navigation.replace('MainTabs', { screen: 'Orders' }),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Erreur', 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Text style={styles.title}>Finaliser la commande</Text>

        {/* Récapitulatif */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📦 Récapitulatif</Text>
          {items.map(item => (
            <View key={item.id} style={styles.orderItem}>
              <Text style={styles.itemEmoji}>{item.emoji}</Text>
              <Text style={styles.itemName}>{item.nom} x{item.quantity}</Text>
              <Text style={styles.itemPrice}>
                {(item.prix * item.quantity).toFixed(2)}€
              </Text>
            </View>
          ))}
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>{getTotal().toFixed(2)}€</Text>
          </View>
        </View>

        {/* Adresse */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📍 Adresse de livraison</Text>
          <Text style={styles.address}>{user?.adresse}</Text>
        </View>

        {/* Créneaux */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🕐 Créneau de livraison</Text>
          <View style={styles.slotsGrid}>
            {TIME_SLOTS.map(slot => (
              <TouchableOpacity
                key={slot}
                style={[
                  styles.slotButton,
                  selectedSlot === slot && styles.slotSelected,
                ]}
                onPress={() => setSelectedSlot(slot)}
              >
                <Text
                  style={[
                    styles.slotText,
                    selectedSlot === slot && styles.slotTextSelected,
                  ]}
                >
                  {slot}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Paiement */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💳 Moyen de paiement</Text>
          <TouchableOpacity
            style={[
              styles.paymentOption,
              paymentMethod === 'especes' && styles.paymentSelected,
            ]}
            onPress={() => setPaymentMethod('especes')}
          >
            <Text style={styles.paymentEmoji}>💵</Text>
            <View style={styles.paymentInfo}>
              <Text style={styles.paymentName}>Espèces</Text>
              <Text style={styles.paymentDesc}>Paiement à la livraison</Text>
            </View>
            {paymentMethod === 'especes' && (
              <Text style={styles.checkmark}>✓</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.paymentOption,
              paymentMethod === 'paypal' && styles.paymentSelected,
            ]}
            onPress={() => setPaymentMethod('paypal')}
          >
            <Text style={styles.paymentEmoji}>💳</Text>
            <View style={styles.paymentInfo}>
              <Text style={styles.paymentName}>PayPal</Text>
              <Text style={styles.paymentDesc}>cremeetcookiess@gmail.com</Text>
            </View>
            {paymentMethod === 'paypal' && (
              <Text style={styles.checkmark}>✓</Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Bouton Commander */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={[styles.orderButton, loading && styles.buttonDisabled]}
          onPress={handleOrder}
          disabled={loading}
        >
          <Text style={styles.orderButtonText}>
            {loading ? 'Traitement...' : `Confirmer • ${getTotal().toFixed(2)}€`}
          </Text>
        </TouchableOpacity>
      </View>
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
  orderItem: {
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
  slotsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  slotButton: {
    backgroundColor: '#F5E6D3',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  slotSelected: {
    backgroundColor: '#FFB7C5',
    borderColor: '#4A2C2A',
  },
  slotText: {
    color: '#4A2C2A',
    fontSize: 13,
  },
  slotTextSelected: {
    color: 'white',
    fontWeight: 'bold',
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#F5E6D3',
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  paymentSelected: {
    borderColor: '#FFB7C5',
    backgroundColor: '#FFF0F3',
  },
  paymentEmoji: {
    fontSize: 30,
    marginRight: 15,
  },
  paymentInfo: {
    flex: 1,
  },
  paymentName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4A2C2A',
  },
  paymentDesc: {
    color: '#666',
    marginTop: 2,
  },
  checkmark: {
    fontSize: 24,
    color: '#FFB7C5',
    fontWeight: 'bold',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  orderButton: {
    backgroundColor: '#FFB7C5',
    padding: 18,
    borderRadius: 30,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  orderButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
