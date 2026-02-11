export type ProductType = 'tiramisu' | 'boisson';
export type ProductSize = 'large' | 'mini';
export type UserRole = 'client' | 'cuisine' | 'livreur' | 'admin';
export type OrderStatus = 'panier' | 'confirmee' | 'preparation' | 'pret' | 'livraison' | 'livree';
export type LoyaltyTier = 'bronze' | 'argent' | 'or';
export type PaymentMethod = 'especes' | 'paypal';

export interface Product {
  id: string;
  nom: string;
  type: ProductType;
  gamme?: ProductSize;
  description: string;
  prix: number;
  emoji: string;
  image?: string;
  disponible: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface User {
  id: string;
  email: string;
  nom: string;
  telephone: string;
  adresse: string;
  role: UserRole;
  loyaltyTier: LoyaltyTier;
  loyaltyProgress: number;
  totalOrders: number;
  pendingReward: string | null;
}

export interface Order {
  id: string;
  clientId: string;
  clientNom?: string;
  items: CartItem[];
  total: number;
  statut: OrderStatus;
  adresse: string;
  adresseLivraison?: string;
  telephone: string;
  creneau: string;
  creneauHoraire?: string;
  paymentMethod: PaymentMethod;
  createdAt: string;
  livreurPosition?: {
    lat: number;
    lng: number;
  };
}
