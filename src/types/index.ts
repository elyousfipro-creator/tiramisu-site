export interface Product {
  id: string;
  nom: string;
  gamme: 'Large' | 'Mini';
  description: string;
  prix: number;
  image: string;
  disponible: boolean;
}

export interface Boisson {
  id: string;
  nom: string;
  prix: number;
  image: string;
  disponible: boolean;
}

export interface CartItem {
  productId: string;
  type: 'tiramisu' | 'boisson';
  quantite: number;
}

export type CarteFidelite = 'bronze' | 'argent' | 'or';

export interface FideliteProgress {
  carteCourante: CarteFidelite;
  commandesDefi: number; // Nombre de commandes dans le défi actuel (0-6)
  recompenseDisponible: boolean; // Si le défi de 6 est atteint
  recompensesUtilisees: {
    cookieGratuit: number;
    miniTiramisuGratuit: number;
    tiramisuXLGratuit: number;
  };
}

export interface User {
  id: string;
  email: string;
  nom: string;
  telephone: string;
  adresse: string;
  role: 'client' | 'cuisine' | 'livreur' | 'admin';
  pointsFidelite: number;
  fidelite: FideliteProgress;
}

export interface Commande {
  id: string;
  clientId: string;
  clientNom: string;
  clientTelephone: string;
  adresseLivraison: string;
  items: CartItem[];
  total: number;
  statut: 'panier' | 'confirmee' | 'preparation' | 'prete' | 'livraison' | 'livree' | 'annulee';
  creneauHoraire: string;
  createdAt: Date;
  livreurId?: string;
  positionLivreur?: { lat: number; lng: number };
}
