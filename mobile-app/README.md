# 🍪 Crème et Cookies - Application Mobile

Application mobile React Native / Expo pour la commande de tiramisus artisanaux.

## 🚀 Lancement rapide

```bash
# 1. Aller dans le dossier
cd mobile-app

# 2. Installer les dépendances
npm install

# 3. Lancer l'application
npx expo start
```

## 📱 Tester l'app

Après `npx expo start`, tu peux :
- Scanner le QR code avec l'app **Expo Go** (iOS/Android)
- Appuyer sur `a` pour ouvrir sur émulateur Android
- Appuyer sur `i` pour ouvrir sur simulateur iOS

## 👤 Comptes de test

### Client
- Crée un compte via l'inscription

### Staff (mot de passe : `Ayoub1821305!`)
| Email | Rôle |
|-------|------|
| admin@cremeetcookies.fr | Admin (Dashboard complet) |
| cuisine@cremeetcookies.fr | Cuisine (Préparation) |
| livreur@cremeetcookies.fr | Livreur (Livraisons) |

## 📂 Structure du projet

```
mobile-app/
├── App.js                    # Point d'entrée + Navigation
├── src/
│   ├── context/
│   │   ├── AuthContext.js    # Authentification
│   │   ├── CartContext.js    # Panier
│   │   └── OrderContext.js   # Commandes
│   ├── data/
│   │   └── products.js       # Catalogue produits
│   └── screens/
│       ├── HomeScreen.js     # Accueil / Menu
│       ├── CartScreen.js     # Panier
│       ├── LoginScreen.js    # Connexion
│       ├── RegisterScreen.js # Inscription
│       ├── CheckoutScreen.js # Paiement
│       ├── OrdersScreen.js   # Mes commandes
│       ├── TrackingScreen.js # Suivi commande
│       ├── LoyaltyScreen.js  # Fidélité
│       ├── AccountScreen.js  # Mon compte
│       ├── KitchenDashboard.js  # Cuisine
│       ├── DeliveryDashboard.js # Livreur
│       └── AdminDashboard.js    # Admin
└── assets/                   # Images, icônes
```

## 🎨 Couleurs

- Rose pastelle : `#FFB7C5`
- Beige : `#F5E6D3`
- Marron : `#4A2C2A`

## 💳 Moyens de paiement

- 💵 Espèces (à la livraison)
- 💳 PayPal (cremeetcookiess@gmail.com)

## 🏆 Programme Fidélité

- **Bronze** : 6 commandes → 1 Cookie offert
- **Argent** : 6 commandes → 1 Mini Tiramisu offert
- **Or** : 6 commandes → 1 Tiramisu XL au choix

## 📞 Contact

- 📧 cremeetcookiess@gmail.com
- 📸 @creme.et.cookies
- 👻 cremeetcookiess
- 🕐 18h00 - 00h00, 7j/7
- 📍 Angers
