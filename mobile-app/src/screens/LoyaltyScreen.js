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
  bronze: {
    name: 'Bronze',
    emoji: '🥉',
    color: '#CD7F32',
    reward: '1 Cookie offert',
    rewardEmoji: '🍪',
    nextTier: 'argent',
  },
  argent: {
    name: 'Argent',
    emoji: '🥈',
    color: '#C0C0C0',
    reward: '1 Mini Tiramisu offert',
    rewardEmoji: '🍰',
    nextTier: 'or',
  },
  or: {
    name: 'Or',
    emoji: '🥇',
    color: '#FFD700',
    reward: '1 Tiramisu XL au choix',
    rewardEmoji: '🎂',
    nextTier: null,
  },
};

export default function LoyaltyScreen({ navigation }) {
  const { user, claimReward } = useAuth();

  if (!user || user.role !== 'client') {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyEmoji}>🏆</Text>
        <Text style={styles.emptyTitle}>Programme Fidélité</Text>
        <Text style={styles.emptyText}>
          Connectez-vous pour accéder à votre carte de fidélité.
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

  const tier = TIERS[user.loyaltyTier] || TIERS.bronze;
  const progress = user.tierProgress || 0;
  const canClaim = progress >= 6;

  const handleClaimReward = async () => {
    Alert.alert(
      '🎁 Récupérer ma récompense',
      `Choisissez votre option :\n\n${tier.rewardEmoji} ${tier.reward}\n\nou\n\n⬆️ Passer au niveau supérieur`,
      [
        {
          text: `${tier.rewardEmoji} Prendre la récompense`,
          onPress: async () => {
            await claimReward(false);
            Alert.alert('🎉 Félicitations !', `Vous avez obtenu : ${tier.reward}\n\nPrésentez ce message lors de votre prochaine commande !`);
          },
        },
        tier.nextTier && {
          text: `⬆️ Niveau ${TIERS[tier.nextTier].name}`,
          onPress: async () => {
            await claimReward(true);
            Alert.alert('🚀 Niveau supérieur !', `Vous êtes maintenant ${TIERS[tier.nextTier].emoji} ${TIERS[tier.nextTier].name} !\n\nContinuez pour débloquer : ${TIERS[tier.nextTier].reward}`);
          },
        },
        { text: 'Annuler', style: 'cancel' },
      ].filter(Boolean)
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Programme Fidélité</Text>

      {/* Carte actuelle */}
      <View style={[styles.card, { borderColor: tier.color }]}>
        <Text style={styles.tierEmoji}>{tier.emoji}</Text>
        <Text style={styles.tierName}>Carte {tier.name}</Text>
        <Text style={styles.tierReward}>
          Récompense : {tier.rewardEmoji} {tier.reward}
        </Text>

        {/* Progression */}
        <View style={styles.progressContainer}>
          <Text style={styles.progressLabel}>
            {progress}/6 commandes
          </Text>
          <View style={styles.progressBar}>
            {[1, 2, 3, 4, 5, 6].map(i => (
              <View
                key={i}
                style={[
                  styles.progressDot,
                  i <= progress && { backgroundColor: tier.color },
                ]}
              />
            ))}
          </View>
        </View>

        {canClaim && (
          <TouchableOpacity
            style={[styles.claimButton, { backgroundColor: tier.color }]}
            onPress={handleClaimReward}
          >
            <Text style={styles.claimButtonText}>
              🎁 Récupérer ma récompense !
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Statistiques */}
      <View style={styles.stats}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{user.completedOrders || 0}</Text>
          <Text style={styles.statLabel}>Commandes totales</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{6 - progress}</Text>
          <Text style={styles.statLabel}>Avant récompense</Text>
        </View>
      </View>

      {/* Explication des paliers */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Comment ça marche ?</Text>
        
        {Object.entries(TIERS).map(([key, tierInfo]) => (
          <View
            key={key}
            style={[
              styles.tierRow,
              user.loyaltyTier === key && styles.tierRowActive,
            ]}
          >
            <Text style={styles.tierRowEmoji}>{tierInfo.emoji}</Text>
            <View style={styles.tierRowInfo}>
              <Text style={styles.tierRowName}>Carte {tierInfo.name}</Text>
              <Text style={styles.tierRowReward}>
                6 commandes = {tierInfo.rewardEmoji} {tierInfo.reward}
              </Text>
            </View>
            {user.loyaltyTier === key && (
              <Text style={styles.currentBadge}>ACTIF</Text>
            )}
          </View>
        ))}
      </View>

      {/* Info */}
      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>💡 Bon à savoir</Text>
        <Text style={styles.infoText}>
          • Chaque commande compte pour 1 point{'\n'}
          • À 6 commandes, choisissez votre récompense{'\n'}
          • Ou passez au niveau supérieur !{'\n'}
          • La carte Or offre un Tiramisu XL composé au choix
        </Text>
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
  card: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    borderWidth: 3,
    marginBottom: 20,
  },
  tierEmoji: {
    fontSize: 60,
  },
  tierName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4A2C2A',
    marginTop: 10,
  },
  tierReward: {
    color: '#666',
    marginTop: 5,
  },
  progressContainer: {
    width: '100%',
    marginTop: 25,
  },
  progressLabel: {
    textAlign: 'center',
    color: '#4A2C2A',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  progressBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressDot: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E5E7EB',
  },
  claimButton: {
    marginTop: 20,
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  claimButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  stats: {
    flexDirection: 'row',
    gap: 15,
    marginBottom: 20,
  },
  statItem: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFB7C5',
  },
  statLabel: {
    color: '#666',
    marginTop: 5,
    textAlign: 'center',
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4A2C2A',
    marginBottom: 15,
  },
  tierRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#F5E6D3',
    borderRadius: 12,
    marginBottom: 10,
  },
  tierRowActive: {
    backgroundColor: '#FFF0F3',
    borderWidth: 2,
    borderColor: '#FFB7C5',
  },
  tierRowEmoji: {
    fontSize: 30,
    marginRight: 15,
  },
  tierRowInfo: {
    flex: 1,
  },
  tierRowName: {
    fontWeight: 'bold',
    color: '#4A2C2A',
  },
  tierRowReward: {
    color: '#666',
    fontSize: 12,
    marginTop: 2,
  },
  currentBadge: {
    backgroundColor: '#FFB7C5',
    color: 'white',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    fontSize: 10,
    fontWeight: 'bold',
  },
  infoBox: {
    backgroundColor: '#FFB7C5',
    borderRadius: 15,
    padding: 20,
    marginBottom: 40,
  },
  infoTitle: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 10,
  },
  infoText: {
    color: 'white',
    lineHeight: 22,
  },
});
