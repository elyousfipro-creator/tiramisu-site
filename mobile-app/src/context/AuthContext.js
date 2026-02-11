import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext();

const STAFF_PASSWORD = 'Ayoub1821305!';

const STAFF_ACCOUNTS = {
  'admin@cremeetcookies.fr': { role: 'admin', nom: 'Administrateur' },
  'cuisine@cremeetcookies.fr': { role: 'cuisine', nom: 'Équipe Cuisine' },
  'livreur@cremeetcookies.fr': { role: 'livreur', nom: 'Équipe Livraison' },
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const savedUser = await AsyncStorage.getItem('user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    } catch (error) {
      console.error('Erreur chargement utilisateur:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const emailLower = email.toLowerCase();
    
    // Vérifier si c'est un compte staff
    if (STAFF_ACCOUNTS[emailLower]) {
      if (password !== STAFF_PASSWORD) {
        throw new Error('Mot de passe incorrect');
      }
      const staffUser = {
        id: emailLower,
        email: emailLower,
        nom: STAFF_ACCOUNTS[emailLower].nom,
        role: STAFF_ACCOUNTS[emailLower].role,
        loyaltyTier: 'bronze',
        completedOrders: 0,
        tierProgress: 0,
      };
      await AsyncStorage.setItem('user', JSON.stringify(staffUser));
      setUser(staffUser);
      return staffUser;
    }

    // Client normal
    const savedUsers = await AsyncStorage.getItem('users');
    const users = savedUsers ? JSON.parse(savedUsers) : {};
    
    if (users[emailLower] && users[emailLower].password === password) {
      const clientUser = { ...users[emailLower] };
      delete clientUser.password;
      await AsyncStorage.setItem('user', JSON.stringify(clientUser));
      setUser(clientUser);
      return clientUser;
    }

    throw new Error('Email ou mot de passe incorrect');
  };

  const register = async (userData) => {
    const emailLower = userData.email.toLowerCase();
    
    if (STAFF_ACCOUNTS[emailLower]) {
      throw new Error('Cet email est réservé');
    }

    const savedUsers = await AsyncStorage.getItem('users');
    const users = savedUsers ? JSON.parse(savedUsers) : {};

    if (users[emailLower]) {
      throw new Error('Cet email est déjà utilisé');
    }

    const newUser = {
      id: Date.now().toString(),
      email: emailLower,
      password: userData.password,
      nom: userData.nom,
      telephone: userData.telephone,
      adresse: userData.adresse,
      role: 'client',
      loyaltyTier: 'bronze',
      completedOrders: 0,
      tierProgress: 0,
      createdAt: new Date().toISOString(),
    };

    users[emailLower] = newUser;
    await AsyncStorage.setItem('users', JSON.stringify(users));

    const userWithoutPassword = { ...newUser };
    delete userWithoutPassword.password;
    await AsyncStorage.setItem('user', JSON.stringify(userWithoutPassword));
    setUser(userWithoutPassword);

    return userWithoutPassword;
  };

  const logout = async () => {
    await AsyncStorage.removeItem('user');
    setUser(null);
  };

  const updateLoyalty = async () => {
    if (!user || user.role !== 'client') return;

    const newProgress = user.tierProgress + 1;
    let updatedUser = { ...user, tierProgress: newProgress, completedOrders: user.completedOrders + 1 };

    if (newProgress >= 6) {
      updatedUser.canClaimReward = true;
    }

    await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
    setUser(updatedUser);

    // Mettre à jour dans la liste des users aussi
    const savedUsers = await AsyncStorage.getItem('users');
    const users = savedUsers ? JSON.parse(savedUsers) : {};
    if (users[user.email]) {
      users[user.email] = { ...users[user.email], ...updatedUser };
      await AsyncStorage.setItem('users', JSON.stringify(users));
    }
  };

  const claimReward = async (upgradeToNextTier) => {
    if (!user) return;

    let updatedUser = { ...user, tierProgress: 0, canClaimReward: false };

    if (upgradeToNextTier) {
      if (user.loyaltyTier === 'bronze') {
        updatedUser.loyaltyTier = 'argent';
      } else if (user.loyaltyTier === 'argent') {
        updatedUser.loyaltyTier = 'or';
      }
    }

    await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
    setUser(updatedUser);

    const savedUsers = await AsyncStorage.getItem('users');
    const users = savedUsers ? JSON.parse(savedUsers) : {};
    if (users[user.email]) {
      users[user.email] = { ...users[user.email], ...updatedUser };
      await AsyncStorage.setItem('users', JSON.stringify(users));
    }

    return updatedUser;
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      register,
      logout,
      updateLoyalty,
      claimReward,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider');
  }
  return context;
}
