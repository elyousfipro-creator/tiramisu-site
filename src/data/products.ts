import { Product, Boisson } from '@/types';

export const tiramisus: Product[] = [
  {
    id: 'tira-cook',
    nom: "TiraCook's",
    gamme: 'Large',
    description: "Cookies maison, pépites chocolat. Le préféré des vrais gourmands 🍪",
    prix: 10.00,
    image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&h=300&fit=crop',
    disponible: true
  },
  {
    id: 'tira-kinder',
    nom: "TiraKinder's",
    gamme: 'Large',
    description: "Chocolat fondant, cœur ultra gourmand. Impossible d'y résister 😍",
    prix: 10.00,
    image: 'https://images.unsplash.com/photo-1586040140378-b5634cb4c8fc?w=400&h=300&fit=crop',
    disponible: true
  },
  {
    id: 'tira-specu',
    nom: "TiraSpecu's",
    gamme: 'Large',
    description: "Spéculoos croustillant, saveur caramélisée. Un classique revisité ✨",
    prix: 10.00,
    image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&h=300&fit=crop',
    disponible: true
  },
  {
    id: 'tira-twik',
    nom: "TiraTwik's",
    gamme: 'Large',
    description: "Twix croquant, caramel fondant. Le marriage parfait 🍫",
    prix: 10.00,
    image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&h=300&fit=crop',
    disponible: true
  },
  {
    id: 'tira-oreo',
    nom: "TiraOreo's",
    gamme: 'Large',
    description: "Oreo intense, crème légère. Pour les fans de cookies noirs 🖤",
    prix: 10.00,
    image: 'https://images.unsplash.com/photo-1559620192-032c4bc4674e?w=400&h=300&fit=crop',
    disponible: true
  },
  {
    id: 'tira-nem',
    nom: "TiraNem's",
    gamme: 'Large',
    description: "Noisettes caramélisées, M&M's colorés. La folie gourmande 🌈",
    prix: 10.00,
    image: 'https://images.unsplash.com/photo-1464305795204-6f5bbfc7fb81?w=400&h=300&fit=crop',
    disponible: true
  },
  {
    id: 'mini-cook',
    nom: "MiniCook's",
    gamme: 'Mini',
    description: "Cookies croquants, crème onctueuse. Indispensable 🍪",
    prix: 5.00,
    image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&h=300&fit=crop',
    disponible: true
  },
  {
    id: 'mini-kinder',
    nom: "MiniKinder's",
    gamme: 'Mini',
    description: "Chocolat fondant en format mini. Petit mais puissant 😍",
    prix: 5.00,
    image: 'https://images.unsplash.com/photo-1586040140378-b5634cb4c8fc?w=400&h=300&fit=crop',
    disponible: true
  },
  {
    id: 'mini-specu',
    nom: "MiniSpecu's",
    gamme: 'Mini',
    description: "Spéculoos en version compacte. Parfait pour une pause ✨",
    prix: 5.00,
    image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&h=300&fit=crop',
    disponible: true
  },
  {
    id: 'mini-oreo',
    nom: "MiniOreo's",
    gamme: 'Mini',
    description: "Oreo en format pocket. Noir c'est noir 🖤",
    prix: 5.00,
    image: 'https://images.unsplash.com/photo-1559620192-032c4bc4674e?w=400&h=300&fit=crop',
    disponible: true
  },
  {
    id: 'mini-twik',
    nom: "MiniTwik's",
    gamme: 'Mini',
    description: "Twix croquant, caramel fondant en version mini 🍫",
    prix: 5.00,
    image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&h=300&fit=crop',
    disponible: true
  },
  {
    id: 'mini-nem',
    nom: "MiniNem's",
    gamme: 'Mini',
    description: "Noisettes et M&M's en format pocket. Mini mais coloré 🌈",
    prix: 5.00,
    image: 'https://images.unsplash.com/photo-1464305795204-6f5bbfc7fb81?w=400&h=300&fit=crop',
    disponible: true
  }
];

export const boissons: Boisson[] = [
  {
    id: 'coca',
    nom: 'Coca-Cola',
    prix: 2.00,
    image: 'https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=100&h=100&fit=crop',
    disponible: true
  },
  {
    id: 'coca-zero',
    nom: 'Coca-Cola Zero',
    prix: 2.00,
    image: 'https://images.unsplash.com/photo-1624552184280-9e9631bbeee9?w=100&h=100&fit=crop',
    disponible: true
  },
  {
    id: 'fanta',
    nom: 'Fanta Orange',
    prix: 2.00,
    image: 'https://images.unsplash.com/photo-1624517452488-04869289c4ca?w=100&h=100&fit=crop',
    disponible: true
  },
  {
    id: 'oasis',
    nom: 'Oasis Tropical',
    prix: 2.00,
    image: 'https://images.unsplash.com/photo-1534353473418-4cfa6c56fd38?w=100&h=100&fit=crop',
    disponible: true
  },
  {
    id: 'lipton',
    nom: 'Lipton Ice Tea Pêche',
    prix: 2.50,
    image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=100&h=100&fit=crop',
    disponible: true
  },
  {
    id: 'eau',
    nom: 'Eau Minérale 50cl',
    prix: 1.50,
    image: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=100&h=100&fit=crop',
    disponible: true
  }
];
