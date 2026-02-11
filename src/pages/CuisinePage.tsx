import { Navigate } from 'react-router-dom';
import { ChefHat, Clock, CheckCircle, AlertTriangle, Package } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { tiramisus, boissons } from '@/data/products';

export function CuisinePage() {
  const { user, isAuthenticated, commandes, updateCommandeStatut } = useStore();

  if (!isAuthenticated || !user || !['admin', 'cuisine'].includes(user.role)) {
    return <Navigate to="/connexion" replace />;
  }

  const commandesAPreparer = commandes.filter((c) => c.statut === 'confirmee');
  const commandesEnPreparation = commandes.filter((c) => c.statut === 'preparation');
  const commandesPretes = commandes.filter((c) => c.statut === 'prete');

  const getProduct = (productId: string, type: 'tiramisu' | 'boisson') => {
    if (type === 'tiramisu') {
      return tiramisus.find((p) => p.id === productId);
    }
    return boissons.find((b) => b.id === productId);
  };

  const isUrgent = (commande: typeof commandes[0]) => {
    const now = new Date();
    const [hours, minutes] = commande.creneauHoraire.split(':').map(Number);
    const creneauDate = new Date();
    creneauDate.setHours(hours, minutes, 0, 0);
    const diffMinutes = (creneauDate.getTime() - now.getTime()) / 60000;
    return diffMinutes < 30 && diffMinutes > 0;
  };

  const CommandeCard = ({ commande }: { commande: typeof commandes[0] }) => (
    <div
      className={`bg-white rounded-xl shadow-lg overflow-hidden ${
        isUrgent(commande) ? 'ring-2 ring-red-400' : ''
      }`}
    >
      <div
        className={`p-3 ${
          isUrgent(commande)
            ? 'bg-red-500 text-white'
            : 'bg-gradient-to-r from-rose-100 to-amber-100'
        }`}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className={`font-bold ${isUrgent(commande) ? 'text-white' : 'text-amber-900'}`}>
              {commande.id}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <Clock className={`w-4 h-4 ${isUrgent(commande) ? 'text-white' : 'text-amber-600'}`} />
              <span className={`text-sm ${isUrgent(commande) ? 'text-white' : 'text-amber-600'}`}>
                {commande.creneauHoraire}
              </span>
            </div>
          </div>
          {isUrgent(commande) && (
            <div className="flex items-center gap-1 bg-white/20 px-2 py-1 rounded-full">
              <AlertTriangle className="w-4 h-4" />
              <span className="text-xs font-semibold">URGENT</span>
            </div>
          )}
        </div>
      </div>

      <div className="p-4">
        <div className="space-y-2 mb-4">
          {commande.items
            .filter((item) => item.type === 'tiramisu')
            .map((item) => {
              const product = getProduct(item.productId, item.type);
              if (!product) return null;
              return (
                <div key={item.productId} className="flex items-center gap-3 bg-amber-50 p-2 rounded-lg">
                  <Package className="w-5 h-5 text-amber-600" />
                  <span className="font-medium text-amber-900">
                    {item.quantite}x {product.nom}
                  </span>
                </div>
              );
            })}
        </div>

        {commande.items.filter((item) => item.type === 'boisson').length > 0 && (
          <div className="border-t border-amber-100 pt-3 mb-4">
            <p className="text-amber-600 text-sm mb-2">Boissons:</p>
            <div className="flex flex-wrap gap-2">
              {commande.items
                .filter((item) => item.type === 'boisson')
                .map((item) => {
                  const product = getProduct(item.productId, item.type);
                  if (!product) return null;
                  return (
                    <span
                      key={item.productId}
                      className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs"
                    >
                      {item.quantite}x {product.nom}
                    </span>
                  );
                })}
            </div>
          </div>
        )}

        <div className="flex gap-2">
          {commande.statut === 'confirmee' && (
            <button
              onClick={() => updateCommandeStatut(commande.id, 'preparation')}
              className="flex-1 bg-amber-500 text-white py-2 rounded-lg font-semibold hover:bg-amber-600 transition-colors"
            >
              Commencer
            </button>
          )}
          {commande.statut === 'preparation' && (
            <button
              onClick={() => updateCommandeStatut(commande.id, 'prete')}
              className="flex-1 bg-green-500 text-white py-2 rounded-lg font-semibold hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
            >
              <CheckCircle className="w-5 h-5" />
              Marquer Prêt
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center">
          <ChefHat className="w-7 h-7 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-amber-900">Cuisine</h1>
          <p className="text-amber-600">Gestion des commandes à préparer</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* À préparer */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-4 h-4 bg-purple-500 rounded-full" />
            <h2 className="font-bold text-lg text-amber-900">
              À préparer ({commandesAPreparer.length})
            </h2>
          </div>
          <div className="space-y-4">
            {commandesAPreparer.length === 0 ? (
              <p className="text-amber-500 text-center py-8 bg-amber-50 rounded-xl">
                Aucune commande en attente
              </p>
            ) : (
              commandesAPreparer.map((c) => <CommandeCard key={c.id} commande={c} />)
            )}
          </div>
        </div>

        {/* En préparation */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-4 h-4 bg-amber-500 rounded-full" />
            <h2 className="font-bold text-lg text-amber-900">
              En cours ({commandesEnPreparation.length})
            </h2>
          </div>
          <div className="space-y-4">
            {commandesEnPreparation.length === 0 ? (
              <p className="text-amber-500 text-center py-8 bg-amber-50 rounded-xl">
                Aucune commande en préparation
              </p>
            ) : (
              commandesEnPreparation.map((c) => <CommandeCard key={c.id} commande={c} />)
            )}
          </div>
        </div>

        {/* Prêtes */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-4 h-4 bg-green-500 rounded-full" />
            <h2 className="font-bold text-lg text-amber-900">
              Prêtes ({commandesPretes.length})
            </h2>
          </div>
          <div className="space-y-4">
            {commandesPretes.length === 0 ? (
              <p className="text-amber-500 text-center py-8 bg-amber-50 rounded-xl">
                Aucune commande prête
              </p>
            ) : (
              commandesPretes.map((c) => (
                <div key={c.id} className="bg-green-50 border-2 border-green-200 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-bold text-green-800">{c.id}</p>
                    <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                      PRÊTE
                    </span>
                  </div>
                  <p className="text-green-700 text-sm">Créneau: {c.creneauHoraire}</p>
                  <p className="text-green-600 text-sm mt-1">{c.adresseLivraison}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
