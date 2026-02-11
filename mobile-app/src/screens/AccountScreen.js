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

const TIERS = {
  bronze: { emoji: '🥉', name: 'Bronze' },
  argent: { emoji: '🥈', name: 'Argent' },
  or: { emoji: '🥇', name: 'Or' },
};

export default function AccountScreen({ navigation }) {
  const { user, logout } = useAuth();

  if (!user) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyEmoji}>👤</Text>
        <Text style={styles.emptyTitle}>Mon Compte</Text>
        <Text style={styles.emptyText}>
          Connectez-vous pour accéder à votre compte.
        </Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.buttonText}>Se connecter</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buttonOutline}
          onPress={() => navigation.navigate('Register')}
        >
          <Text style={styles.buttonOutlineText}>Créer un compte</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const tier = TIERS[user.loyaltyTier] || TIERS.bronze;

  const handleLogout = () => {
    Alert.alert(
      'Déconnexion',
      'Êtes-vous sûr de vouloir vous déconnecter ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Déconnexion',
          style: 'destructive',
          onPress: async () => {
            await logout();
            navigation.replace('MainTabs');
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Mon Compte</Text>

      {/* Profil */}
      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {user.nom?.charAt(0).toUpperCase() || '?'}
          </Text>
        </View>
        <Text style={styles.userName}>{user.nom}</Text>
        <Text style={styles.userEmail}>{user.email}</Text>
        {user.role === 'client' && (
          <View style={styles.tierBadge}>
            <Text style={styles.tierText}>
              {tier.emoji} Carte {tier.name}
            </Text>
          </View>
        )}
      </View>

      {/* Menu Client */}
      {user.role === 'client' && (
        <View style={styles.menuSection}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate('Orders')}
          >
            <Text style={styles.menuIcon}>📦</Text>
            <Text style={styles.menuLabel}>Mes Commandes</Text>
            <Text style={styles.menuArrow}>→</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate('Loyalty')}
          >
            <Text style={styles.menuIcon}>🏆</Text>
            <Text style={styles.menuLabel}>Programme Fidélité</Text>
            <Text style={styles.menuArrow}>→</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Infos personnelles */}
      {user.role === 'client' && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informations</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>📞 Téléphone</Text>
            <Text style={styles.infoValue}>{user.telephone || '-'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>📍 Adresse</Text>
            <Text style={styles.infoValue}>{user.adresse || '-'}</Text>
          </View>
        </View>
      )}

      {/* Statistiques fidélité */}
      {user.role === 'client' && (
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{user.completedOrders || 0}</Text>
            <Text style={styles.statLabel}>Commandes</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{user.tierProgress || 0}/6</Text>
            <Text style={styles.statLabel}>Progression</Text>
          </View>
        </View>
      )}

      {/* Contact */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Contact</Text>
        <Text style={styles.contactText}>📧 cremeetcookiess@gmail.com</Text>
        <Text style={styles.contactText}>📸 @creme.et.cookies</Text>
        <Text style={styles.contactText}>👻 cremeetcookiess</Text>
        <Text style={styles.contactText}>🕐 18h00 - 00h00, 7j/7</Text>
      </View>

      {/* Déconnexion */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Déconnexion</Text>
      </TouchableOpacity>

      <View style={{ height: 50 }} />
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
    marginBottom: 20,
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
    paddingHorizontal: 50,
    paddingVertical: 15,
    borderRadius: 25,
    marginTop: 25,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  buttonOutline: {
    borderWidth: 2,
    borderColor: '#FFB7C5',
    paddingHorizontal: 50,
    paddingVertical: 15,
    borderRadius: 25,
    marginTop: 15,
  },
  buttonOutlineText: {
    color: '#FFB7C5',
    fontWeight: 'bold',
    fontSize: 16,
  },
  profileCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFB7C5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#4A2C2A',
    marginTop: 15,
  },
  userEmail: {
    color: '#666',
    marginTop: 5,
  },
  tierBadge: {
    backgroundColor: '#F5E6D3',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 15,
  },
  tierText: {
    color: '#4A2C2A',
    fontWeight: 'bold',
  },
  menuSection: {
    backgroundColor: 'white',
    borderRadius: 15,
    marginBottom: 20,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  menuIcon: {
    fontSize: 24,
    marginRight: 15,
  },
  menuLabel: {
    flex: 1,
    fontSize: 16,
    color: '#4A2C2A',
  },
  menuArrow: {
    fontSize: 18,
    color: '#FFB7C5',
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4A2C2A',
    marginBottom: 15,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  infoLabel: {
    color: '#666',
  },
  infoValue: {
    color: '#4A2C2A',
    fontWeight: '500',
    flex: 1,
    textAlign: 'right',
    marginLeft: 20,
  },
  statsRow: {
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
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFB7C5',
  },
  statLabel: {
    color: '#666',
    marginTop: 5,
  },
  contactText: {
    color: '#4A2C2A',
    marginBottom: 8,
  },
  logoutButton: {
    backgroundColor: '#EF4444',
    padding: 18,
    borderRadius: 15,
    alignItems: 'center',
  },
  logoutText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
