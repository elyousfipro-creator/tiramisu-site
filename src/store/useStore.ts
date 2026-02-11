import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, User, Commande, FideliteProgress } from '@/types';

// Fonction pour créer une fidélité par défaut
export const createDefaultFidelite = (): FideliteProgress => ({
  carteCourante: 'bronze',
  commandesDefi: 0,
  recompenseDisponible: false,
  recompensesUtilisees: {
    cookieGratuit: 0,
    miniTiramisuGratuit: 0,
    tiramisuXLGratuit: 0,
  },
});

interface AppState {
  // Auth
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
  incrementFidelite: () => void;

  // Cart
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantite: number) => void;
  clearCart: () => void;

  // Commandes (simulation)
  commandes: Commande[];
  addCommande: (commande: Commande) => void;
  updateCommandeStatut: (commandeId: string, statut: Commande['statut']) => void;
  updateLivreurPosition: (commandeId: string, position: { lat: number; lng: number }) => void;
  assignLivreur: (commandeId: string, livreurId: string) => void;
}

// Utilisateurs de démonstration
export const demoUsers: User[] = [
  { id: 'admin-1', email: 'admin@cremecookies.fr', nom: 'Admin', telephone: '0600000000', adresse: '', role: 'admin', pointsFidelite: 0, fidelite: createDefaultFidelite() },
  { id: 'cuisine-1', email: 'cuisine@cremecookies.fr', nom: 'Chef Cuisine', telephone: '0600000001', adresse: '', role: 'cuisine', pointsFidelite: 0, fidelite: createDefaultFidelite() },
  { id: 'livreur-1', email: 'livreur@cremecookies.fr', nom: 'Livreur Thomas', telephone: '0600000002', adresse: '', role: 'livreur', pointsFidelite: 0, fidelite: createDefaultFidelite() },
];

// Adresse de départ (Marcel Cerdan, Angers)
export const ADRESSE_DEPART = {
  adresse: '7 rue Marcel Cerdan, 49100 Angers',
  lat: 47.4784,
  lng: -0.5632
};

function generateOrderId(): string {
  const date = new Date();
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
  const rand = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `TIRA-${dateStr}-${rand}`;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      // Auth
      user: null,
      isAuthenticated: false,
      login: (user) => set({ user, isAuthenticated: true }),
      logout: () => set({ user: null, isAuthenticated: false, cart: [] }),
      incrementFidelite: () =>
        set((state) => {
          if (!state.user || state.user.role !== 'client') return state;
          const fidelite = { ...state.user.fidelite };
          fidelite.commandesDefi += 1;
          if (fidelite.commandesDefi >= 6) {
            fidelite.recompenseDisponible = true;
          }
          return { user: { ...state.user, fidelite } };
        }),

      // Cart
      cart: [],
      addToCart: (item) =>
        set((state) => {
          const existing = state.cart.find((i) => i.productId === item.productId && i.type === item.type);
          if (existing) {
            return {
              cart: state.cart.map((i) =>
                i.productId === item.productId && i.type === item.type
                  ? { ...i, quantite: i.quantite + item.quantite }
                  : i
              ),
            };
          }
          return { cart: [...state.cart, item] };
        }),
      removeFromCart: (productId) =>
        set((state) => ({
          cart: state.cart.filter((i) => i.productId !== productId),
        })),
      updateQuantity: (productId, quantite) =>
        set((state) => ({
          cart: state.cart.map((i) =>
            i.productId === productId ? { ...i, quantite: Math.max(0, quantite) } : i
          ).filter((i) => i.quantite > 0),
        })),
      clearCart: () => set({ cart: [] }),

      // Commandes
      commandes: [],
      addCommande: (commande) =>
        set((state) => ({ commandes: [commande, ...state.commandes] })),
      updateCommandeStatut: (commandeId, statut) =>
        set((state) => ({
          commandes: state.commandes.map((c) =>
            c.id === commandeId ? { ...c, statut } : c
          ),
        })),
      updateLivreurPosition: (commandeId, position) =>
        set((state) => ({
          commandes: state.commandes.map((c) =>
            c.id === commandeId ? { ...c, positionLivreur: position } : c
          ),
        })),
      assignLivreur: (commandeId, livreurId) =>
        set((state) => ({
          commandes: state.commandes.map((c) =>
            c.id === commandeId ? { ...c, livreurId } : c
          ),
        })),
    }),
    {
      name: 'creme-cookies-storage',
    }
  )
);

export { generateOrderId };
