import { Link, Navigate } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';
import { useOrders } from '@/context/OrderContext';
import { Package, User, MapPin, Phone, Mail, ChevronRight, ShoppingBag } from 'lucide-react';

const statusLabels: Record<string, { label: string; color: string }> = {
  panier: { label: 'Panier', color: 'bg-gray-100 text-gray-600' },
  confirmee: { label: 'Confirmée', color: 'bg-blue-100 text-blue-700' },
  preparation: { label: 'En préparation', color: 'bg-yellow-100 text-yellow-700' },
  pret: { label: 'Prêt', color: 'bg-orange-100 text-orange-700' },
  livraison: { label: 'En livraison', color: 'bg-purple-100 text-purple-700' },
  livree: { label: 'Livrée', color: 'bg-green-100 text-green-700' }
};

export function AccountPage() {
  const { user, isAuthenticated } = useAuth();
  const { orders } = useOrders();

  if (!isAuthenticated || !user) {
    return <Navigate to="/connexion" replace />;
  }

  const userOrders = orders.filter(o => o.clientId === user.id);

  return (
    <div className="min-h-screen bg-creme-beige-light flex flex-col">
      <Navbar />

      <main className="flex-1 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="font-display text-3xl font-bold text-creme-brun mb-8">
            Mon compte
          </h1>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Profile Card */}
            <div className="md:col-span-1">
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <div className="w-16 h-16 bg-creme-rose/20 rounded-full flex items-center justify-center mb-4">
                  <User className="w-8 h-8 text-creme-rose" />
                </div>
                <h2 className="font-semibold text-creme-brun text-lg">{user.nom}</h2>
                
                <div className="mt-4 space-y-3 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Mail className="w-4 h-4" />
                    <span>{user.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone className="w-4 h-4" />
                    <span>{user.telephone}</span>
                  </div>
                  {user.adresse && (
                    <div className="flex items-start gap-2 text-gray-600">
                      <MapPin className="w-4 h-4 mt-0.5" />
                      <span>{user.adresse}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Orders */}
            <div className="md:col-span-2">
              <div className="bg-white rounded-2xl shadow-sm">
                <div className="p-6 border-b border-creme-beige">
                  <h2 className="font-display text-xl font-semibold text-creme-brun flex items-center gap-2">
                    <Package className="w-5 h-5 text-creme-rose" />
                    Mes commandes
                  </h2>
                </div>

                {userOrders.length === 0 ? (
                  <div className="p-8 text-center">
                    <ShoppingBag className="w-12 h-12 text-creme-beige mx-auto mb-3" />
                    <p className="text-gray-500 mb-4">Aucune commande pour le moment</p>
                    <Link
                      to="/"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-creme-rose hover:bg-creme-rose-dark text-white font-medium rounded-full transition-colors text-sm"
                    >
                      Découvrir nos tiramisus
                    </Link>
                  </div>
                ) : (
                  <div className="divide-y divide-creme-beige">
                    {userOrders.map(order => (
                      <Link
                        key={order.id}
                        to={`/suivi/${order.id}`}
                        className="flex items-center gap-4 p-4 hover:bg-creme-beige-light transition-colors"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-creme-brun">
                              {order.id}
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                statusLabels[order.statut]?.color || 'bg-gray-100 text-gray-600'
                              }`}
                            >
                              {statusLabels[order.statut]?.label || order.statut}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500 truncate">
                            {order.items.map(i => `${i.product.nom} x${i.quantity}`).join(', ')}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            {new Date(order.createdAt).toLocaleDateString('fr-FR', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-creme-rose">
                            {order.total.toFixed(2)}€
                          </p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
