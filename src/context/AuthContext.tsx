import { createContext, useContext, useState, ReactNode } from 'react';
import { User, UserRole, LoyaltyTier } from '../types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => void;
  updateLoyalty: (tier: LoyaltyTier, progress: number, totalOrders: number, pendingReward: string | null) => void;
}

interface RegisterData {
  email: string;
  password: string;
  nom: string;
  telephone: string;
  adresse: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STAFF_PASSWORD = 'Ayoub1821305!';

const staffAccounts: Record<string, { role: UserRole; nom: string; telephone: string }> = {
  'admin@cremeetcookies.fr': { role: 'admin', nom: 'Admin', telephone: '' },
  'cuisine@cremeetcookies.fr': { role: 'cuisine', nom: 'Cuisine', telephone: '' },
  'livreur@cremeetcookies.fr': { role: 'livreur', nom: 'Livreur', telephone: '' },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string): Promise<boolean> => {
    const staffAccount = staffAccounts[email.toLowerCase()];
    
    if (staffAccount) {
      if (password !== STAFF_PASSWORD) {
        return false;
      }
      setUser({
        id: `staff-${staffAccount.role}`,
        email: email.toLowerCase(),
        nom: staffAccount.nom,
        telephone: staffAccount.telephone,
        adresse: '',
        role: staffAccount.role,
        loyaltyTier: 'bronze',
        loyaltyProgress: 0,
        totalOrders: 0,
        pendingReward: null,
      });
      return true;
    }

    const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const foundUser = storedUsers.find((u: User & { password: string }) => 
      u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      return true;
    }

    return false;
  };

  const register = async (data: RegisterData): Promise<boolean> => {
    const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
    
    if (storedUsers.some((u: User) => u.email.toLowerCase() === data.email.toLowerCase())) {
      return false;
    }

    const newUser: User & { password: string } = {
      id: `user-${Date.now()}`,
      email: data.email.toLowerCase(),
      password: data.password,
      nom: data.nom,
      telephone: data.telephone,
      adresse: data.adresse,
      role: 'client',
      loyaltyTier: 'bronze',
      loyaltyProgress: 0,
      totalOrders: 0,
      pendingReward: null,
    };

    storedUsers.push(newUser);
    localStorage.setItem('users', JSON.stringify(storedUsers));

    const { password: _, ...userWithoutPassword } = newUser;
    setUser(userWithoutPassword);
    return true;
  };

  const logout = () => {
    setUser(null);
  };

  const updateLoyalty = (tier: LoyaltyTier, progress: number, totalOrders: number, pendingReward: string | null) => {
    if (user) {
      const updatedUser = { ...user, loyaltyTier: tier, loyaltyProgress: progress, totalOrders, pendingReward };
      setUser(updatedUser);
      
      const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
      const userIndex = storedUsers.findIndex((u: User) => u.id === user.id);
      if (userIndex !== -1) {
        storedUsers[userIndex] = { ...storedUsers[userIndex], ...updatedUser };
        localStorage.setItem('users', JSON.stringify(storedUsers));
      }
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, register, logout, updateLoyalty }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
