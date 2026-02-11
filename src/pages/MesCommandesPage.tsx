import { Navigate, Link } from 'react-router-dom';
import { Package, ArrowLeft, MapPin, Clock, Eye } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { tiramisus, boissons } from '@/data/products';

export function MesCommandesPage() {
  const { user, isAuthenticated, commandes } = useStore();

  if (!isAuthenticated || !user) {
    return <Navigate to="/connexion" replace />;
  }

  const mesCommandes = commandes.filter((c) => c.clientId === user.id);

  const getProduct = (productId: string, type: 'tiramisu' | 'boisson') => {
    if (type === 'tiramisu') {
      return tiramisus.find((p) => p.id === productId);
    }
    return boissons.find((b) => b.id === productId);
  };

  const getStatutColor = (statut: string) => {
    switch (statut) {
      case 'livree':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'livraison':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'preparation':
      case 'prete':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'confirmee':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatutLabel = (statut: string) => {
    switch (statut) {
      case 'confirmee':
        return '📋 Confirmée';
      case 'preparation':
        return '👨‍🍳 En préparation';
      case 'prete':
        return '✅ Prête';
      case 'livraison':
        return '🚗 En livraison';
      case 'livree':
        return '🎉 Livrée';
      default:
        return statut;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-8">
        <Link
          to="/mon-compte"
          className="p-2 rounded-full hover:bg-amber-100 transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-amber-700" />
        </Link>
        <h1 className="text-3xl font-bold text-amber-900">Mes Commandes</h1>
      </div>

      {mesCommandes.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
          <Package className="w-16 h-16 mx-auto text-amber-300 mb-4" />
          <h2 className="text-xl font-bold text-amber-900 mb-2">Aucune commande</h2>
          <p className="text-amber-600 mb-6">
            Vous n'avez pas encore passé de commande.
          </p>
          <Link
            to="/"
            className="inline-block bg-rose-400 text-white px-6 py-3 rounded-full font-semibold hover:bg-rose-500 transition-colors"
          >
            Découvrir le menu
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {mesCommandes.map((commande) => (
            <div
              key={commande.id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden"
            >
              <div className="bg-gradient-to-r from-rose-100 to-amber-100 p-4 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="font-bold text-amber-900 text-lg">{commande.id}</p>
                  <p className="text-amber-600 text-sm">
                    {new Date(commande.createdAt).toLocaleDateString('fr-FR', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
                <span
                  className={`px-4 py-2 rounded-full font-medium border ${getStatutColor(commande.statut)}`}
                >
                  {getStatutLabel(commande.statut)}
                </span>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Produits */}
                  <div>
                    <h3 className="font-semibold text-amber-900 mb-3">Produits</h3>
                    <div className="space-y-2">
                      {commande.items.map((item) => {
                        const product = getProduct(item.productId, item.type);
                        if (!product) return null;
                        return (
                          <div
                            key={item.productId}
                            className="flex items-center gap-3 bg-amber-50 p-2 rounded-lg"
                          >
                            <img
                              src={product.image}
                              alt={product.nom}
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                            <div className="flex-1">
                              <p className="font-medium text-amber-900">{product.nom}</p>
                              <p className="text-amber-600 text-sm">x{item.quantite}</p>
                            </div>
                            <p className="font-semibold text-rose-500">
                              {(product.prix * item.quantite).toFixed(2)}€
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Infos livraison */}
                  <div>
                    <h3 className="font-semibold text-amber-900 mb-3">Livraison</h3>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3 text-amber-700">
                        <MapPin className="w-5 h-5 mt-1 text-rose-400" />
                        <p className="text-sm">{commande.adresseLivraison}</p>
                      </div>
                      <div className="flex items-center gap-3 text-amber-700">
                        <Clock className="w-5 h-5 text-rose-400" />
                        <p className="text-sm">Créneau: {commande.creneauHoraire}</p>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-amber-100">
                      <div className="flex justify-between items-center">
                        <span className="text-amber-700">Total</span>
                        <span className="text-xl font-bold text-rose-500">
                          {commande.total.toFixed(2)}€
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Suivi en temps réel pour les commandes en livraison */}
                {commande.statut === 'livraison' && (
                  <div className="mt-6 pt-6 border-t border-amber-100">
                    <Link
                      to={`/mon-compte/mes-commandes/${commande.id}`}
                      className="flex items-center justify-center gap-2 bg-blue-500 text-white py-3 rounded-xl font-semibold hover:bg-blue-600 transition-colors"
                    >
                      <Eye className="w-5 h-5" />
                      Suivre en temps réel
                    </Link>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
