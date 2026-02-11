import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import { useCart } from '../context/CartContext';
import { LARGE_PRODUCTS, MINI_PRODUCTS, BOISSONS } from '../data/products';

const ProductCard = ({ product, onAdd }) => (
  <View style={styles.card}>
    <Text style={styles.emoji}>{product.emoji}</Text>
    <Text style={styles.productName}>{product.nom}</Text>
    <Text style={styles.productDesc}>{product.description}</Text>
    <View style={styles.cardFooter}>
      <Text style={styles.price}>{product.prix.toFixed(2)}€</Text>
      <TouchableOpacity style={styles.addButton} onPress={() => onAdd(product)}>
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
    </View>
  </View>
);

export default function HomeScreen({ navigation }) {
  const { addToCart, getItemCount } = useCart();

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.logo}>🍪</Text>
          <Text style={styles.title}>Crème et Cookies</Text>
          <Text style={styles.subtitle}>Tiramisus Artisanaux à Angers</Text>
        </View>

        {/* Horaires */}
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>📍 Angers • 🕕 18h-00h • 7j/7</Text>
        </View>

        {/* Fidélité Promo */}
        <TouchableOpacity
          style={styles.promoBox}
          onPress={() => navigation.navigate('Loyalty')}
        >
          <Text style={styles.promoTitle}>🏆 Programme Fidélité</Text>
          <Text style={styles.promoText}>
            6 commandes = récompense ! Bronze → Argent → Or
          </Text>
        </TouchableOpacity>

        {/* Gamme Large */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>✨ La Gamme Signature - 10€</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {LARGE_PRODUCTS.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onAdd={addToCart}
              />
            ))}
          </ScrollView>
        </View>

        {/* Gamme Mini */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🍰 Les Mini M - 5€</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {MINI_PRODUCTS.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onAdd={addToCart}
              />
            ))}
          </ScrollView>
        </View>

        {/* Boissons */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🥤 Les Boissons</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {BOISSONS.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onAdd={addToCart}
              />
            ))}
          </ScrollView>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerTitle}>Crème et Cookies</Text>
          <Text style={styles.footerText}>📍 7 rue Marcel Cerdan, Angers</Text>
          <Text style={styles.footerText}>📧 cremeetcookiess@gmail.com</Text>
          <Text style={styles.footerText}>📸 @creme.et.cookies</Text>
          <Text style={styles.footerText}>👻 cremeetcookiess</Text>
          <View style={styles.paymentMethods}>
            <Text style={styles.paymentText}>💵 Espèces</Text>
            <Text style={styles.paymentText}>💳 PayPal</Text>
          </View>
        </View>
      </ScrollView>

      {/* Bouton Panier Flottant */}
      {getItemCount() > 0 && (
        <TouchableOpacity
          style={styles.cartButton}
          onPress={() => navigation.navigate('Cart')}
        >
          <Text style={styles.cartButtonText}>
            🛒 Voir le panier ({getItemCount()})
          </Text>
        </TouchableOpacity>
      )}
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
  },
  header: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#FFB7C5',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  logo: {
    fontSize: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4A2C2A',
    marginTop: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#4A2C2A',
    marginTop: 5,
  },
  infoBox: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginTop: 20,
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
  },
  infoText: {
    color: '#4A2C2A',
    fontSize: 14,
  },
  promoBox: {
    backgroundColor: '#FFB7C5',
    marginHorizontal: 20,
    marginTop: 15,
    padding: 20,
    borderRadius: 15,
  },
  promoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4A2C2A',
  },
  promoText: {
    color: '#4A2C2A',
    marginTop: 5,
  },
  section: {
    marginTop: 25,
    paddingLeft: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4A2C2A',
    marginBottom: 15,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    marginRight: 15,
    width: 160,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  emoji: {
    fontSize: 40,
    textAlign: 'center',
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4A2C2A',
    marginTop: 10,
    textAlign: 'center',
  },
  productDesc: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
    textAlign: 'center',
    height: 45,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFB7C5',
  },
  addButton: {
    backgroundColor: '#FFB7C5',
    width: 35,
    height: 35,
    borderRadius: 17.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  footer: {
    backgroundColor: '#4A2C2A',
    marginTop: 30,
    padding: 30,
    alignItems: 'center',
  },
  footerTitle: {
    color: '#FFB7C5',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  footerText: {
    color: 'white',
    marginBottom: 8,
  },
  paymentMethods: {
    flexDirection: 'row',
    marginTop: 15,
    gap: 20,
  },
  paymentText: {
    color: '#FFB7C5',
    fontSize: 16,
  },
  cartButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#FFB7C5',
    padding: 18,
    borderRadius: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  cartButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
