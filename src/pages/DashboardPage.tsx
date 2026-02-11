import { Navigate, Link } from 'react-router-dom';
import { Package, ChefHat, Truck, Euro, TrendingUp, Clock } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { tiramisus, boissons } from '@/data/products';

export function DashboardPage() {
  const { user, isAuthenticated, commandes } = useStore();

  if (!isAuthenticated || !user || user.role !== 'admin') {
    return <Navigate to="/connexion" replace />;
  }

  const today = new Date().toDateString();
  const commandesAujourdhui = commandes.filter(
    (c) => new Date(c.createdAt).toDateString() === today
  );

  const chiffreAffaires = commandesAujourdhui.reduce((sum, c) => sum + c.total, 0);
  const commandesEnCours = commandes.filter(
    (c) => ['confirmee', 'preparation', 'prete', 'livraison'].includes(c.statut)
  );

  const getProduct = (productId: string, type: 'tiramisu' | 'boisson') => {
    if (type === 'tiramisu') {
      return tiramisus.find((p) => p.id === productId);
    }
    return boissons.find((b) => b.id === productId);
  };

  // Calcul des produits les plus vendus
  const ventesProduits: Record<string, number> = {};
  commandes.forEach((c) => {
    c.items.forEach((item) => {
      ventesProduits[item.productId] = (ventesProduits[item.productId] || 0) + item.quantite;
    });
  });

  const topProduits = Object.entries(ventesProduits)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([id, qty]) => {
      const product = getProduct(id, 'tiramisu') || getProduct(id, 'boisson');
      return { product, quantity: qty };
    });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-amber-900">Tableau de bord</h1>
          <p className="text-amber-600">Bienvenue, {user.nom}</p>
        </div>
        <div className="flex gap-4">
          <Link
            to="/dashboard/cuisine"
            className="flex items-center gap-2 bg-amber-100 text-amber-700 px-4 py-2 rounded-xl hover:bg-amber-200 transition-colors"
          >
            <ChefHat className="w-5 h-5" />
            Vue Cuisine
          </Link>
          <Link
            to="/dashboard/livraison"
            className="flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-xl hover:bg-blue-200 transition-colors"
          >
            <Truck className="w-5 h-5" />
            Vue Livreur
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <Euro className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-amber-600 text-sm">CA du jour</p>
              <p className="text-2xl font-bold text-amber-900">{chiffreAffaires.toFixed(2)}€</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <Package className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-amber-600 text-sm">Commandes aujourd'hui</p>
              <p className="text-2xl font-bold text-amber-900">{commandesAujourdhui.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <p className="text-amber-600 text-sm">En cours</p>
              <p className="text-2xl font-bold text-amber-900">{commandesEnCours.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-rose-100 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-rose-600" />
            </div>
            <div>
              <p className="text-amber-600 text-sm">Total commandes</p>
              <p className="text-2xl font-bold text-amber-900">{commandes.length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Dernières commandes */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="font-bold text-xl text-amber-900 mb-4 flex items-center gap-2">
            <Package className="w-6 h-6 text-rose-500" />
            Dernières commandes
          </h2>

          {commandes.length === 0 ? (
            <p className="text-amber-600 text-center py-8">Aucune commande pour le moment</p>
          ) : (
            <div className="space-y-3">
              {commandes.slice(0, 8).map((commande) => (
                <div
                  key={commande.id}
                  className="flex items-center justify-between p-3 bg-amber-50 rounded-xl"
                >
                  <div>
                    <p className="font-semibold text-amber-900 text-sm">{commande.id}</p>
                    <p className="text-amber-600 text-xs">{commande.clientNom}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-rose-500">{commande.total.toFixed(2)}€</p>
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                        commande.statut === 'livree'
                          ? 'bg-green-100 text-green-700'
                          : commande.statut === 'livraison'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}
                    >
                      {commande.statut}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top produits */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="font-bold text-xl text-amber-900 mb-4 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-rose-500" />
            Produits les plus vendus
          </h2>

          {topProduits.length === 0 ? (
            <p className="text-amber-600 text-center py-8">Pas encore de ventes</p>
          ) : (
            <div className="space-y-3">
              {topProduits.map(({ product, quantity }, index) => (
                product && (
                  <div
                    key={product.id}
                    className="flex items-center gap-4 p-3 bg-amber-50 rounded-xl"
                  >
                    <span className="w-8 h-8 bg-rose-400 text-white rounded-full flex items-center justify-center font-bold">
                      {index + 1}
                    </span>
                    <img
                      src={product.image}
                      alt={product.nom}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <p className="font-semibold text-amber-900">{product.nom}</p>
                      <p className="text-amber-600 text-sm">{product.prix.toFixed(2)}€</p>
                    </div>
                    <span className="bg-rose-100 text-rose-700 px-3 py-1 rounded-full font-semibold">
                      {quantity} vendus
                    </span>
                  </div>
                )
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
