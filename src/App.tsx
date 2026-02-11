import { useState, useEffect } from 'react';

// Types
interface Product {
  id: string;
  nom: string;
  gamme: 'Large' | 'Mini';
  description: string;
  prix: number;
  image: string;
  categorie: 'tiramisu' | 'boisson';
  disponible: boolean;
}

interface CartItem {
  product: Product;
  quantity: number;
}

interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: 'panier' | 'confirmee' | 'preparation' | 'livraison' | 'livree';
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  clientAddress: string;
  paymentMethod: 'especes' | 'paypal';
  createdAt: Date;
}

interface User {
  id: string;
  email: string;
  name: string;
  role: 'client' | 'cuisine' | 'livreur' | 'admin';
  loyaltyTier: 'bronze' | 'argent' | 'or';
  tierProgress: number;
  totalOrders: number;
  pendingReward: 'cookie' | 'mini' | 'xl' | null;
}

// Données produits
const products: Product[] = [
  // Gamme Large - 10€
  { id: 'tira-cook', nom: "TiraCook's", gamme: 'Large', description: "Cookies maison, pépites chocolat. Le préféré des vrais gourmands 🍪", prix: 10.00, image: '🍪', categorie: 'tiramisu', disponible: true },
  { id: 'tira-kinder', nom: "TiraKinder's", gamme: 'Large', description: "Chocolat fondant, cœur ultra gourmand. Impossible d'y résister 😍", prix: 10.00, image: '🍫', categorie: 'tiramisu', disponible: true },
  { id: 'tira-specu', nom: "TiraSpecu's", gamme: 'Large', description: "Speculoos croustillant, saveur caramélisée. Un délice belge revisité", prix: 10.00, image: '🧁', categorie: 'tiramisu', disponible: true },
  { id: 'tira-twik', nom: "TiraTwik's", gamme: 'Large', description: "Twix croquant, caramel onctueux. Le mariage parfait", prix: 10.00, image: '🍬', categorie: 'tiramisu', disponible: true },
  { id: 'tira-nem', nom: "TiraNem's", gamme: 'Large', description: "M&M's colorés, explosion de saveurs. Fun et gourmand", prix: 10.00, image: '🌈', categorie: 'tiramisu', disponible: true },
  { id: 'tira-oreo', nom: "TiraOreo's", gamme: 'Large', description: "Oreo intense, crème vanillée. Le classique américain", prix: 10.00, image: '⚫', categorie: 'tiramisu', disponible: true },
  
  // Gamme Mini - 5€
  { id: 'mini-cook', nom: "MiniCook's", gamme: 'Mini', description: "Version mini du TiraCook's. Parfait pour une pause gourmande", prix: 5.00, image: '🍪', categorie: 'tiramisu', disponible: true },
  { id: 'mini-kinder', nom: "MiniKinder's", gamme: 'Mini', description: "Mini mais intense en chocolat. Le plaisir en petit format", prix: 5.00, image: '🍫', categorie: 'tiramisu', disponible: true },
  { id: 'mini-specu', nom: "MiniSpecu's", gamme: 'Mini', description: "Speculoos en portion individuelle. Idéal pour craquer", prix: 5.00, image: '🧁', categorie: 'tiramisu', disponible: true },
  { id: 'mini-twik', nom: "MiniTwik's", gamme: 'Mini', description: "Twix croquant, caramel onctueux. Le mini plaisir parfait 🍫", prix: 5.00, image: '🍬', categorie: 'tiramisu', disponible: true },
  { id: 'mini-nem', nom: "MiniNem's", gamme: 'Mini', description: "M&M's colorés, explosion de fun. Le mini arc-en-ciel 🌈", prix: 5.00, image: '🌈', categorie: 'tiramisu', disponible: true },
  { id: 'mini-oreo', nom: "MiniOreo's", gamme: 'Mini', description: "Le goût Oreo en version compacte. Petit mais puissant", prix: 5.00, image: '⚫', categorie: 'tiramisu', disponible: true },
  
  // Boissons
  { id: 'coca', nom: 'Coca-Cola', gamme: 'Mini', description: 'Canette 33cl', prix: 2.00, image: '🥤', categorie: 'boisson', disponible: true },
  { id: 'oasis', nom: 'Oasis', gamme: 'Mini', description: 'Tropical 33cl', prix: 2.00, image: '🧃', categorie: 'boisson', disponible: true },
  { id: 'lipton', nom: 'Lipton Ice Tea', gamme: 'Mini', description: 'Pêche 33cl', prix: 2.00, image: '🍵', categorie: 'boisson', disponible: true },
  { id: 'fanta', nom: 'Fanta Orange', gamme: 'Mini', description: 'Canette 33cl', prix: 2.00, image: '🍊', categorie: 'boisson', disponible: true },
  { id: 'eau', nom: 'Eau minérale', gamme: 'Mini', description: 'Bouteille 50cl', prix: 1.50, image: '💧', categorie: 'boisson', disponible: true },
];

export function App() {
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    const savedUser = localStorage.getItem('user');
    const savedOrders = localStorage.getItem('orders');
    if (savedCart) setCart(JSON.parse(savedCart));
    if (savedUser) setUser(JSON.parse(savedUser));
    if (savedOrders) setOrders(JSON.parse(savedOrders));
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('orders', JSON.stringify(orders));
  }, [orders]);

  const showNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  };

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    showNotification(`${product.nom} ajouté au panier ! 🛒`);
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev =>
      prev.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.product.prix * item.quantity, 0);
  };

  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  const handleLogin = (email: string, password: string) => {
    const correctPassword = 'Ayoub1821305!';
    const staffAccounts = ['admin@cremeetcookies.fr', 'cuisine@cremeetcookies.fr', 'livreur@cremeetcookies.fr'];
    
    if (staffAccounts.includes(email) && password !== correctPassword) {
      showNotification('❌ Mot de passe incorrect');
      return;
    }
    
    let role: 'client' | 'cuisine' | 'livreur' | 'admin' = 'client';
    if (email === 'admin@cremeetcookies.fr') role = 'admin';
    else if (email === 'cuisine@cremeetcookies.fr') role = 'cuisine';
    else if (email === 'livreur@cremeetcookies.fr') role = 'livreur';

    const newUser: User = {
      id: Date.now().toString(),
      email,
      name: email.split('@')[0],
      role,
      loyaltyTier: 'bronze',
      tierProgress: 0,
      totalOrders: 0,
      pendingReward: null
    };
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
    showNotification('Connexion réussie ! 🎉');
    
    if (role === 'admin') setCurrentPage('dashboard');
    else if (role === 'cuisine') setCurrentPage('cuisine');
    else if (role === 'livreur') setCurrentPage('livraison');
    else setCurrentPage('home');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    setCurrentPage('home');
    showNotification('Déconnexion réussie');
  };

  const handleCheckout = (clientInfo: { name: string; email: string; phone: string; address: string; paymentMethod: 'especes' | 'paypal' }) => {
    const newOrder: Order = {
      id: `TIRA-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`,
      items: [...cart],
      total: getCartTotal(),
      status: 'confirmee',
      clientName: clientInfo.name,
      clientEmail: clientInfo.email,
      clientPhone: clientInfo.phone,
      clientAddress: clientInfo.address,
      paymentMethod: clientInfo.paymentMethod,
      createdAt: new Date()
    };
    setOrders(prev => [...prev, newOrder]);
    
    if (user) {
      const newTierProgress = user.tierProgress + 1;
      let newPendingReward = user.pendingReward;
      
      if (newTierProgress >= 6) {
        if (user.loyaltyTier === 'bronze') newPendingReward = 'cookie';
        else if (user.loyaltyTier === 'argent') newPendingReward = 'mini';
        else if (user.loyaltyTier === 'or') newPendingReward = 'xl';
      }
      
      const updatedUser = {
        ...user,
        totalOrders: user.totalOrders + 1,
        tierProgress: newTierProgress,
        pendingReward: newPendingReward
      };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
    
    setCart([]);
    showNotification(`Commande ${newOrder.id} confirmée ! 🎉`);
    setCurrentPage('orders');
  };

  // Navbar
  const Navbar = () => (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <button 
            onClick={() => setCurrentPage('home')}
            className="text-2xl font-bold text-[#4A2C2A] hover:text-[#FFB7C5] transition-colors"
          >
            Crème et Cookies
          </button>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setCurrentPage('loyalty')}
              className="text-[#4A2C2A] hover:text-[#FFB7C5] transition-colors hidden sm:block"
            >
              🎁 Fidélité
            </button>
            <button
              onClick={() => setCurrentPage('cart')}
              className="relative bg-[#FFB7C5] text-white px-4 py-2 rounded-full hover:bg-pink-400 transition-colors"
            >
              🛒 {getCartCount() > 0 && <span className="ml-1">{getCartCount()}</span>}
            </button>
            {user ? (
              <div className="flex items-center space-x-2">
                <span className={`text-xs px-2 py-1 rounded-full font-bold ${
                  user.loyaltyTier === 'or' ? 'bg-yellow-400 text-amber-800' :
                  user.loyaltyTier === 'argent' ? 'bg-gray-300 text-gray-700' :
                  'bg-amber-500 text-white'
                }`}>
                  {user.loyaltyTier === 'or' ? '🥇' : user.loyaltyTier === 'argent' ? '🥈' : '🥉'} {user.tierProgress}/6
                </span>
                <button onClick={() => setCurrentPage('orders')} className="text-[#4A2C2A] hover:text-[#FFB7C5] hidden sm:block">
                  Commandes
                </button>
                <button onClick={handleLogout} className="text-gray-500 hover:text-red-500">
                  ↪️
                </button>
              </div>
            ) : (
              <button
                onClick={() => setCurrentPage('login')}
                className="text-[#4A2C2A] hover:text-[#FFB7C5] transition-colors"
              >
                Connexion
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );

  // Carte produit
  const ProductCard = ({ product, onAdd, small = false }: { product: Product; onAdd: (p: Product) => void; small?: boolean }) => (
    <div className={`bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${small ? 'p-4' : 'p-6'}`}>
      <div className={`text-center ${small ? 'text-4xl mb-2' : 'text-6xl mb-4'}`}>
        {product.image}
      </div>
      <h3 className={`font-bold text-[#4A2C2A] ${small ? 'text-lg' : 'text-xl'} mb-2`}>{product.nom}</h3>
      <p className={`text-gray-600 ${small ? 'text-sm' : ''} mb-4`}>{product.description}</p>
      <div className="flex justify-between items-center">
        <span className={`font-bold text-[#FFB7C5] ${small ? 'text-lg' : 'text-2xl'}`}>
          {product.prix.toFixed(2)}€
        </span>
        <button
          onClick={() => onAdd(product)}
          className={`bg-[#FFB7C5] text-white rounded-full hover:bg-pink-400 transition-colors ${small ? 'px-3 py-1 text-sm' : 'px-4 py-2'}`}
        >
          + Ajouter
        </button>
      </div>
    </div>
  );

  // Page d'accueil
  const HomePage = () => {
    const tiramisusLarge = products.filter(p => p.categorie === 'tiramisu' && p.gamme === 'Large');
    const tiramisusMini = products.filter(p => p.categorie === 'tiramisu' && p.gamme === 'Mini');
    const boissons = products.filter(p => p.categorie === 'boisson');

    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-[#4A2C2A] mb-4">🍰 Tiramisus Artisanaux</h1>
          <p className="text-xl text-gray-600">Faits maison à Angers avec amour</p>
          <p className="text-[#FFB7C5] mt-2">📅 Lundi - Dimanche | 🕕 18h - 00h</p>
        </header>

        {/* Programme fidélité */}
        <section className="bg-gradient-to-r from-amber-600 via-gray-400 to-yellow-400 rounded-2xl p-6 text-white text-center mb-12">
          <h2 className="text-2xl font-bold mb-2">🏆 Programme Fidélité</h2>
          <div className="flex justify-center items-center space-x-2 mb-2">
            <span>🥉</span><span>→</span><span>🥈</span><span>→</span><span>🥇</span>
          </div>
          <p>6 commandes = 1 récompense !</p>
          <button
            onClick={() => setCurrentPage('loyalty')}
            className="mt-4 bg-white text-[#4A2C2A] px-6 py-2 rounded-full font-bold hover:bg-gray-100"
          >
            Découvrir
          </button>
        </section>

        {/* Gamme Large */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-[#FFB7C5] mb-6 border-b-4 border-[#FFB7C5] inline-block pb-2">
            La Gamme Signature — 10€
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tiramisusLarge.map(product => (
              <ProductCard key={product.id} product={product} onAdd={addToCart} />
            ))}
          </div>
        </section>

        {/* Gamme Mini */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-[#FFB7C5] mb-6 border-b-4 border-[#FFB7C5] inline-block pb-2">
            Les Mini — 5€
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tiramisusMini.map(product => (
              <ProductCard key={product.id} product={product} onAdd={addToCart} />
            ))}
          </div>
        </section>

        {/* Boissons */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-[#FFB7C5] mb-6 border-b-4 border-[#FFB7C5] inline-block pb-2">
            🥤 Boissons
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {boissons.map(product => (
              <ProductCard key={product.id} product={product} onAdd={addToCart} small />
            ))}
          </div>
        </section>
      </div>
    );
  };

  // Page Panier
  const CartPage = () => (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-[#4A2C2A] mb-8">🛒 Mon Panier</h1>
      {cart.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-6xl mb-4">🛒</p>
          <p className="text-gray-500 text-xl">Votre panier est vide</p>
          <button
            onClick={() => setCurrentPage('home')}
            className="mt-4 bg-[#FFB7C5] text-white px-6 py-3 rounded-full hover:bg-pink-400"
          >
            Découvrir nos tiramisus
          </button>
        </div>
      ) : (
        <>
          <div className="space-y-4 mb-8">
            {cart.map(item => (
              <div key={item.product.id} className="bg-white rounded-xl shadow p-4 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <span className="text-4xl">{item.product.image}</span>
                  <div>
                    <h3 className="font-bold text-[#4A2C2A]">{item.product.nom}</h3>
                    <p className="text-gray-500">{item.product.prix.toFixed(2)}€</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      className="w-8 h-8 bg-gray-200 rounded-full hover:bg-gray-300"
                    >
                      -
                    </button>
                    <span className="font-bold w-8 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      className="w-8 h-8 bg-[#FFB7C5] text-white rounded-full hover:bg-pink-400"
                    >
                      +
                    </button>
                  </div>
                  <span className="font-bold text-[#4A2C2A] w-20 text-right">
                    {(item.product.prix * item.quantity).toFixed(2)}€
                  </span>
                  <button onClick={() => removeFromCart(item.product.id)} className="text-red-500 hover:text-red-700">
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-[#F5E6D3] rounded-xl p-6">
            <div className="flex justify-between items-center text-xl font-bold text-[#4A2C2A] mb-4">
              <span>Total</span>
              <span>{getCartTotal().toFixed(2)}€</span>
            </div>
            <button
              onClick={() => setCurrentPage('checkout')}
              className="w-full bg-[#FFB7C5] text-white py-4 rounded-full text-xl font-bold hover:bg-pink-400"
            >
              Valider ma commande →
            </button>
          </div>
        </>
      )}
    </div>
  );

  // Page Checkout
  const CheckoutPage = () => {
    const [form, setForm] = useState({
      name: user?.name || '',
      email: user?.email || '',
      phone: '',
      address: '',
      paymentMethod: 'especes' as 'especes' | 'paypal'
    });

    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-[#4A2C2A] mb-8">📦 Finaliser ma commande</h1>
        
        <div className="bg-white rounded-xl shadow p-6 mb-8">
          <h2 className="font-bold text-[#4A2C2A] mb-4">Récapitulatif</h2>
          {cart.map(item => (
            <div key={item.product.id} className="flex justify-between py-2 border-b">
              <span>{item.product.nom} x{item.quantity}</span>
              <span>{(item.product.prix * item.quantity).toFixed(2)}€</span>
            </div>
          ))}
          <div className="flex justify-between py-2 font-bold text-lg text-[#4A2C2A]">
            <span>Total</span>
            <span>{getCartTotal().toFixed(2)}€</span>
          </div>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); handleCheckout(form); }} className="bg-white rounded-xl shadow p-6 space-y-4">
          <div>
            <label className="block text-[#4A2C2A] font-bold mb-2">Nom complet</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={e => setForm({...form, name: e.target.value})}
              className="w-full border-2 border-gray-200 rounded-lg p-3 focus:border-[#FFB7C5] outline-none"
            />
          </div>
          <div>
            <label className="block text-[#4A2C2A] font-bold mb-2">Email</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={e => setForm({...form, email: e.target.value})}
              className="w-full border-2 border-gray-200 rounded-lg p-3 focus:border-[#FFB7C5] outline-none"
            />
          </div>
          <div>
            <label className="block text-[#4A2C2A] font-bold mb-2">Téléphone</label>
            <input
              type="tel"
              required
              value={form.phone}
              onChange={e => setForm({...form, phone: e.target.value})}
              className="w-full border-2 border-gray-200 rounded-lg p-3 focus:border-[#FFB7C5] outline-none"
            />
          </div>
          <div>
            <label className="block text-[#4A2C2A] font-bold mb-2">Adresse de livraison</label>
            <textarea
              required
              value={form.address}
              onChange={e => setForm({...form, address: e.target.value})}
              className="w-full border-2 border-gray-200 rounded-lg p-3 focus:border-[#FFB7C5] outline-none"
              rows={3}
            />
          </div>
          
          <div>
            <label className="block text-[#4A2C2A] font-bold mb-2">Mode de paiement</label>
            <div className="space-y-2">
              <label className="flex items-center space-x-3 p-3 border-2 rounded-lg cursor-pointer hover:border-[#FFB7C5]">
                <input
                  type="radio"
                  name="payment"
                  value="especes"
                  checked={form.paymentMethod === 'especes'}
                  onChange={() => setForm({...form, paymentMethod: 'especes'})}
                  className="w-5 h-5"
                />
                <span className="text-2xl">💵</span>
                <span>Espèces (à la livraison)</span>
              </label>
              <label className="flex items-center space-x-3 p-3 border-2 rounded-lg cursor-pointer hover:border-[#FFB7C5]">
                <input
                  type="radio"
                  name="payment"
                  value="paypal"
                  checked={form.paymentMethod === 'paypal'}
                  onChange={() => setForm({...form, paymentMethod: 'paypal'})}
                  className="w-5 h-5"
                />
                <span className="text-2xl">💳</span>
                <span>PayPal</span>
              </label>
            </div>
          </div>

          {form.paymentMethod === 'paypal' && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="font-bold text-blue-800">Paiement PayPal :</p>
              <p className="text-blue-700">Envoyez {getCartTotal().toFixed(2)}€ à : cremeetcookiess@gmail.com</p>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-[#FFB7C5] text-white py-4 rounded-full text-xl font-bold hover:bg-pink-400"
          >
            Confirmer ma commande ✓
          </button>
        </form>
      </div>
    );
  };

  // Page Connexion
  const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    return (
      <div className="max-w-md mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-[#4A2C2A] mb-8 text-center">Connexion</h1>
        <form onSubmit={(e) => { e.preventDefault(); handleLogin(email, password); }} className="bg-white rounded-xl shadow p-6 space-y-4">
          <div>
            <label className="block text-[#4A2C2A] font-bold mb-2">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full border-2 border-gray-200 rounded-lg p-3 focus:border-[#FFB7C5] outline-none"
              placeholder="votre@email.com"
            />
          </div>
          <div>
            <label className="block text-[#4A2C2A] font-bold mb-2">Mot de passe</label>
            <input
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full border-2 border-gray-200 rounded-lg p-3 focus:border-[#FFB7C5] outline-none"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-[#FFB7C5] text-white py-3 rounded-full font-bold hover:bg-pink-400"
          >
            Se connecter
          </button>
        </form>
        <p className="text-center mt-4 text-gray-600">
          Pas encore de compte ?{' '}
          <button onClick={() => setCurrentPage('register')} className="text-[#FFB7C5] hover:underline">
            S'inscrire
          </button>
        </p>
      </div>
    );
  };

  // Page Inscription
  const RegisterPage = () => {
    const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const newUser: User = {
        id: Date.now().toString(),
        email: form.email,
        name: form.name,
        role: 'client',
        loyaltyTier: 'bronze',
        tierProgress: 0,
        totalOrders: 0,
        pendingReward: null
      };
      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
      showNotification('Inscription réussie ! Bienvenue 🎉');
      setCurrentPage('home');
    };

    return (
      <div className="max-w-md mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-[#4A2C2A] mb-8 text-center">Inscription</h1>
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-6 space-y-4">
          <div>
            <label className="block text-[#4A2C2A] font-bold mb-2">Nom</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={e => setForm({...form, name: e.target.value})}
              className="w-full border-2 border-gray-200 rounded-lg p-3 focus:border-[#FFB7C5] outline-none"
            />
          </div>
          <div>
            <label className="block text-[#4A2C2A] font-bold mb-2">Email</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={e => setForm({...form, email: e.target.value})}
              className="w-full border-2 border-gray-200 rounded-lg p-3 focus:border-[#FFB7C5] outline-none"
            />
          </div>
          <div>
            <label className="block text-[#4A2C2A] font-bold mb-2">Téléphone</label>
            <input
              type="tel"
              required
              value={form.phone}
              onChange={e => setForm({...form, phone: e.target.value})}
              className="w-full border-2 border-gray-200 rounded-lg p-3 focus:border-[#FFB7C5] outline-none"
            />
          </div>
          <div>
            <label className="block text-[#4A2C2A] font-bold mb-2">Mot de passe</label>
            <input
              type="password"
              required
              value={form.password}
              onChange={e => setForm({...form, password: e.target.value})}
              className="w-full border-2 border-gray-200 rounded-lg p-3 focus:border-[#FFB7C5] outline-none"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-[#FFB7C5] text-white py-3 rounded-full font-bold hover:bg-pink-400"
          >
            S'inscrire
          </button>
        </form>
      </div>
    );
  };

  // Page Mes Commandes
  const OrdersPage = () => (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-[#4A2C2A] mb-8">📦 Mes Commandes</h1>
      {orders.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-6xl mb-4">📭</p>
          <p className="text-gray-500 text-xl">Aucune commande pour le moment</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order.id} className="bg-white rounded-xl shadow p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-[#4A2C2A] text-lg">{order.id}</h3>
                  <p className="text-gray-500 text-sm">
                    {new Date(order.createdAt).toLocaleDateString('fr-FR', {
                      day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
                    })}
                  </p>
                </div>
                <span className={`px-4 py-2 rounded-full text-sm font-bold ${
                  order.status === 'livree' ? 'bg-green-100 text-green-800' :
                  order.status === 'livraison' ? 'bg-blue-100 text-blue-800' :
                  order.status === 'preparation' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {order.status === 'confirmee' && '✓ Confirmée'}
                  {order.status === 'preparation' && '👨‍🍳 En préparation'}
                  {order.status === 'livraison' && '🚗 En livraison'}
                  {order.status === 'livree' && '✅ Livrée'}
                </span>
              </div>
              <div className="border-t pt-4">
                {order.items.map(item => (
                  <div key={item.product.id} className="flex justify-between py-1">
                    <span>{item.product.nom} x{item.quantity}</span>
                    <span>{(item.product.prix * item.quantity).toFixed(2)}€</span>
                  </div>
                ))}
                <div className="flex justify-between py-2 font-bold text-[#4A2C2A] border-t mt-2">
                  <span>Total</span>
                  <span>{order.total.toFixed(2)}€</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // Page Fidélité
  const LoyaltyPage = () => {
    const handleClaimReward = (choice: 'take' | 'upgrade') => {
      if (!user) return;
      
      let updatedUser = { ...user };
      
      if (choice === 'take') {
        showNotification(
          user.loyaltyTier === 'bronze' ? '🍪 Cookie offert réclamé !' :
          user.loyaltyTier === 'argent' ? '🍰 Mini Tiramisu offert réclamé !' :
          '🎂 Tiramisu XL au choix réclamé !'
        );
        updatedUser.tierProgress = 0;
        updatedUser.pendingReward = null;
      } else {
        if (user.loyaltyTier === 'bronze') {
          updatedUser.loyaltyTier = 'argent';
          showNotification('🥈 Vous passez à la Carte Argent !');
        } else if (user.loyaltyTier === 'argent') {
          updatedUser.loyaltyTier = 'or';
          showNotification('🥇 Vous passez à la Carte Or !');
        }
        updatedUser.tierProgress = 0;
        updatedUser.pendingReward = null;
      }
      
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    };

    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-[#4A2C2A] mb-8 text-center">🎁 Programme Fidélité</h1>
        
        {user && (
          <div className={`rounded-2xl p-8 text-white text-center mb-8 shadow-lg ${
            user.loyaltyTier === 'or' ? 'bg-gradient-to-r from-yellow-500 to-yellow-300' :
            user.loyaltyTier === 'argent' ? 'bg-gradient-to-r from-gray-400 to-gray-300' :
            'bg-gradient-to-r from-amber-600 to-amber-400'
          }`}>
            <span className="text-4xl">{user.loyaltyTier === 'or' ? '🥇' : user.loyaltyTier === 'argent' ? '🥈' : '🥉'}</span>
            <h2 className="text-2xl font-bold mt-2">Carte {user.loyaltyTier.charAt(0).toUpperCase() + user.loyaltyTier.slice(1)}</h2>
            
            <div className="flex justify-center gap-2 my-4">
              {[1, 2, 3, 4, 5, 6].map((step) => (
                <div
                  key={step}
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                    step <= user.tierProgress ? 'bg-white text-[#4A2C2A]' : 'bg-white/30'
                  }`}
                >
                  {step <= user.tierProgress ? '✓' : step}
                </div>
              ))}
            </div>
            <p>{user.tierProgress < 6 ? `${6 - user.tierProgress} commande(s) pour débloquer` : 'Défi complété !'}</p>
          </div>
        )}

        {user && user.tierProgress >= 6 && (
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border-4 border-[#FFB7C5]">
            <h2 className="text-2xl font-bold text-[#4A2C2A] text-center mb-6">🎉 Défi complété !</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <button
                onClick={() => handleClaimReward('take')}
                className="bg-green-500 text-white p-6 rounded-xl hover:bg-green-600"
              >
                <p className="text-4xl mb-2">
                  {user.loyaltyTier === 'bronze' && '🍪'}
                  {user.loyaltyTier === 'argent' && '🍰'}
                  {user.loyaltyTier === 'or' && '🎂'}
                </p>
                <p className="font-bold">
                  {user.loyaltyTier === 'bronze' && 'Récupérer 1 Cookie'}
                  {user.loyaltyTier === 'argent' && 'Récupérer 1 Mini Tiramisu'}
                  {user.loyaltyTier === 'or' && 'Récupérer 1 Tiramisu XL'}
                </p>
              </button>
              
              {user.loyaltyTier !== 'or' && (
                <button
                  onClick={() => handleClaimReward('upgrade')}
                  className={`p-6 rounded-xl text-white ${
                    user.loyaltyTier === 'bronze' ? 'bg-gray-500' : 'bg-yellow-500'
                  }`}
                >
                  <p className="text-4xl mb-2">{user.loyaltyTier === 'bronze' ? '🥈' : '🥇'}</p>
                  <p className="font-bold">Passer à la Carte {user.loyaltyTier === 'bronze' ? 'Argent' : 'Or'}</p>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Explication des paliers */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-amber-600 to-amber-400 rounded-xl p-6 text-white text-center">
            <p className="text-4xl mb-2">🥉</p>
            <h3 className="font-bold text-xl mb-2">BRONZE</h3>
            <p>6 commandes = 🍪 1 Cookie</p>
          </div>
          <div className="bg-gradient-to-br from-gray-400 to-gray-300 rounded-xl p-6 text-white text-center">
            <p className="text-4xl mb-2">🥈</p>
            <h3 className="font-bold text-xl mb-2">ARGENT</h3>
            <p>6 commandes = 🍰 1 Mini Tiramisu</p>
          </div>
          <div className="bg-gradient-to-br from-yellow-500 to-yellow-300 rounded-xl p-6 text-amber-800 text-center">
            <p className="text-4xl mb-2">🥇</p>
            <h3 className="font-bold text-xl mb-2">OR</h3>
            <p>6 commandes = 🎂 1 Tiramisu XL au choix</p>
          </div>
        </div>

        {!user && (
          <div className="bg-white rounded-xl shadow p-8 text-center mt-8">
            <p className="text-4xl mb-4">🔐</p>
            <h3 className="font-bold text-[#4A2C2A] text-xl mb-2">Connectez-vous</h3>
            <button
              onClick={() => setCurrentPage('register')}
              className="bg-[#FFB7C5] text-white px-6 py-3 rounded-full font-bold hover:bg-pink-400"
            >
              S'inscrire maintenant
            </button>
          </div>
        )}
      </div>
    );
  };

  // Conditions d'utilisation
  const ConditionsPage = () => (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-[#4A2C2A] mb-8">📋 Conditions d'utilisation</h1>
      <div className="bg-white rounded-xl shadow p-6 space-y-6">
        <section>
          <h2 className="font-bold text-xl text-[#4A2C2A] mb-3">1. Présentation</h2>
          <p className="text-gray-600">
            Le site Crème et Cookies est une plateforme de commande en ligne de tiramisus artisanaux à Angers.
          </p>
        </section>
        <section>
          <h2 className="font-bold text-xl text-[#4A2C2A] mb-3">2. Horaires</h2>
          <p className="text-gray-600">
            Commandes acceptées du lundi au dimanche, de 18h00 à 00h00.
          </p>
        </section>
        <section>
          <h2 className="font-bold text-xl text-[#4A2C2A] mb-3">3. Paiement</h2>
          <p className="text-gray-600">Modes de paiement acceptés : Espèces, PayPal</p>
        </section>
        <section>
          <h2 className="font-bold text-xl text-[#4A2C2A] mb-3">4. Contact</h2>
          <p className="text-gray-600">
            Email : cremeetcookiess@gmail.com<br />
            Instagram : @creme.et.cookies<br />
            Snapchat : cremeetcookiess
          </p>
        </section>
      </div>
    </div>
  );

  // Dashboard Admin
  const DashboardPage = () => {
    const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-[#4A2C2A] mb-8">📊 Dashboard Admin</h1>
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow p-6">
            <p className="text-gray-500">Total commandes</p>
            <p className="text-4xl font-bold text-[#FFB7C5]">{orders.length}</p>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <p className="text-gray-500">Chiffre d'affaires</p>
            <p className="text-4xl font-bold text-green-600">{totalRevenue.toFixed(2)}€</p>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <p className="text-gray-500">En préparation</p>
            <p className="text-4xl font-bold text-yellow-600">
              {orders.filter(o => o.status === 'preparation').length}
            </p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="font-bold text-xl text-[#4A2C2A] mb-4">Commandes</h2>
          {orders.map(order => (
            <div key={order.id} className="border rounded-lg p-4 mb-2">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-bold">{order.id}</p>
                  <p className="text-gray-500">{order.clientName} - {order.clientAddress}</p>
                </div>
                <select
                  value={order.status}
                  onChange={(e) => {
                    const newOrders = orders.map(o =>
                      o.id === order.id ? { ...o, status: e.target.value as Order['status'] } : o
                    );
                    setOrders(newOrders);
                  }}
                  className="border rounded-lg p-2"
                >
                  <option value="confirmee">Confirmée</option>
                  <option value="preparation">En préparation</option>
                  <option value="livraison">En livraison</option>
                  <option value="livree">Livrée</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Dashboard Cuisine
  const CuisinePage = () => {
    const ordersToPrep = orders.filter(o => o.status === 'confirmee' || o.status === 'preparation');
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-[#4A2C2A] mb-8">👨‍🍳 Cuisine</h1>
        {ordersToPrep.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-6xl mb-4">✅</p>
            <p className="text-gray-500 text-xl">Aucune commande en attente</p>
          </div>
        ) : (
          ordersToPrep.map(order => (
            <div key={order.id} className={`bg-white rounded-xl shadow p-6 mb-4 border-l-4 ${
              order.status === 'confirmee' ? 'border-red-500' : 'border-yellow-500'
            }`}>
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-bold text-xl">{order.id}</h3>
                {order.status === 'confirmee' && (
                  <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-bold">🔴 NOUVEAU</span>
                )}
              </div>
              <div className="space-y-2 mb-4">
                {order.items.map(item => (
                  <div key={item.product.id} className="flex items-center space-x-2">
                    <span className="text-2xl">{item.product.image}</span>
                    <span className="font-bold">{item.quantity}x</span>
                    <span>{item.product.nom}</span>
                  </div>
                ))}
              </div>
              <button
                onClick={() => {
                  const newOrders = orders.map(o =>
                    o.id === order.id ? { ...o, status: 'livraison' as const } : o
                  );
                  setOrders(newOrders);
                  showNotification('Commande prête !');
                }}
                className="w-full bg-green-500 text-white py-3 rounded-lg font-bold hover:bg-green-600"
              >
                ✓ Marquer comme PRÊT
              </button>
            </div>
          ))
        )}
      </div>
    );
  };

  // Dashboard Livreur
  const LivraisonPage = () => {
    const ordersToDeliver = orders.filter(o => o.status === 'livraison');
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-[#4A2C2A] mb-8">🚗 Livraisons</h1>
        {ordersToDeliver.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-6xl mb-4">🎉</p>
            <p className="text-gray-500 text-xl">Aucune livraison en attente</p>
          </div>
        ) : (
          ordersToDeliver.map(order => (
            <div key={order.id} className="bg-white rounded-xl shadow p-6 mb-4">
              <h3 className="font-bold text-xl mb-2">{order.id}</h3>
              <p className="font-bold text-[#4A2C2A]">{order.clientName}</p>
              <p className="text-gray-600">📍 {order.clientAddress}</p>
              <p className="text-gray-500">📞 {order.clientPhone}</p>
              <p className="text-gray-600 mt-2">
                💰 {order.total.toFixed(2)}€ - {order.paymentMethod === 'especes' ? '💵 Espèces' : '💳 PayPal'}
              </p>
              <button
                onClick={() => {
                  const newOrders = orders.map(o =>
                    o.id === order.id ? { ...o, status: 'livree' as const } : o
                  );
                  setOrders(newOrders);
                  showNotification('Livraison confirmée !');
                }}
                className="w-full mt-4 bg-green-500 text-white py-3 rounded-lg font-bold hover:bg-green-600"
              >
                ✓ Marquer comme LIVRÉ
              </button>
            </div>
          ))
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#F5E6D3]">
      <Navbar />
      
      {notification && (
        <div className="fixed top-20 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50">
          {notification}
        </div>
      )}

      {currentPage === 'home' && <HomePage />}
      {currentPage === 'cart' && <CartPage />}
      {currentPage === 'checkout' && <CheckoutPage />}
      {currentPage === 'login' && <LoginPage />}
      {currentPage === 'register' && <RegisterPage />}
      {currentPage === 'orders' && <OrdersPage />}
      {currentPage === 'loyalty' && <LoyaltyPage />}
      {currentPage === 'conditions' && <ConditionsPage />}
      {currentPage === 'dashboard' && <DashboardPage />}
      {currentPage === 'cuisine' && <CuisinePage />}
      {currentPage === 'livraison' && <LivraisonPage />}

      {/* Footer */}
      <footer className="bg-[#4A2C2A] text-white py-12 mt-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold text-[#FFB7C5] mb-4">Crème et Cookies</h3>
              <p className="text-gray-300">Tiramisus artisanaux faits maison à Angers.</p>
            </div>
            <div>
              <h3 className="text-xl font-bold text-[#FFB7C5] mb-4">Horaires</h3>
              <p className="text-gray-300">📅 Lundi - Dimanche<br />🕕 18h00 - 00h00</p>
            </div>
            <div>
              <h3 className="text-xl font-bold text-[#FFB7C5] mb-4">Contact</h3>
              <p className="text-gray-300">📍 Angers<br />✉️ cremeetcookiess@gmail.com</p>
            </div>
            <div>
              <h3 className="text-xl font-bold text-[#FFB7C5] mb-4">Réseaux</h3>
              <div className="flex flex-col space-y-2">
                <a href="https://instagram.com/creme.et.cookies" target="_blank" rel="noopener noreferrer" className="text-[#FFB7C5] hover:text-white">
                  📸 @creme.et.cookies
                </a>
                <a href="https://snapchat.com/add/cremeetcookiess" target="_blank" rel="noopener noreferrer" className="text-[#FFB7C5] hover:text-white">
                  👻 cremeetcookiess
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-600 mt-8 pt-8 text-center text-gray-400">
            <p>© 2024 Crème et Cookies. Tous droits réservés.</p>
            <div className="mt-2 flex justify-center space-x-4">
              <span>💵 Espèces</span>
              <span>💳 PayPal</span>
            </div>
            <button 
              onClick={() => setCurrentPage('conditions')}
              className="text-[#FFB7C5] hover:text-white mt-2"
            >
              Conditions d'utilisation
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
