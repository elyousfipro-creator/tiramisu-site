import { Link, Navigate } from 'react-router-dom';
import { Package, User, MapPin, LogOut } from 'lucide-react';
import { useStore } from '@/store/useStore';

export function MonComptePage() {
  const { user, isAuthenticated, logout, commandes } = useStore();

  if (!isAuthenticated || !user) {
    return <Navigate to="/connexion" replace />;
  }

  const mesCommandes = commandes.filter((c) => c.clientId === user.id);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-amber-900 mb-8">Mon Compte</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Info utilisateur */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-rose-500" />
            </div>
            <div>
              <h2 className="font-bold text-amber-900">{user.nom}</h2>
              <p className="text-amber-600 text-sm">{user.email}</p>
            </div>
          </div>

          {user.adresse && (
            <div className="flex items-start gap-3 text-amber-700 mb-4">
              <MapPin className="w-5 h-5 mt-1 text-rose-400" />
              <p className="text-sm">{user.adresse}</p>
            </div>
          )}

          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 border border-red-200 text-red-500 py-2 rounded-xl hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Déconnexion
          </button>
        </div>

        {/* Statistiques */}
        <div className="md:col-span-2 bg-white rounded-2xl shadow-lg p-6">
          <h2 className="font-bold text-xl text-amber-900 mb-4 flex items-center gap-2">
            <Package className="w-6 h-6 text-rose-500" />
            Mes Commandes
          </h2>

          {mesCommandes.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-amber-600 mb-4">Vous n'avez pas encore de commandes</p>
              <Link
                to="/"
                className="inline-block bg-rose-400 text-white px-6 py-2 rounded-full hover:bg-rose-500 transition-colors"
              >
                Découvrir le menu
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {mesCommandes.slice(0, 5).map((commande) => (
                <Link
                  key={commande.id}
                  to={`/mon-compte/mes-commandes/${commande.id}`}
                  className="block bg-amber-50 rounded-xl p-4 hover:bg-amber-100 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-amber-900">{commande.id}</p>
                      <p className="text-amber-600 text-sm">
                        {new Date(commande.createdAt).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'long',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-rose-500">{commande.total.toFixed(2)}€</p>
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-medium mt-1 ${
                          commande.statut === 'livree'
                            ? 'bg-green-100 text-green-700'
                            : commande.statut === 'livraison'
                            ? 'bg-blue-100 text-blue-700'
                            : commande.statut === 'preparation' || commande.statut === 'prete'
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {commande.statut === 'confirmee' && 'Confirmée'}
                        {commande.statut === 'preparation' && 'En préparation'}
                        {commande.statut === 'prete' && 'Prête'}
                        {commande.statut === 'livraison' && 'En livraison'}
                        {commande.statut === 'livree' && 'Livrée'}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}

              <Link
                to="/mon-compte/mes-commandes"
                className="block text-center text-rose-500 hover:text-rose-600 font-medium py-2"
              >
                Voir toutes mes commandes →
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
