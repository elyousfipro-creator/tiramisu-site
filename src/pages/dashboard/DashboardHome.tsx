import { useOrders } from '@/context/OrderContext';
import { Package, Euro, TrendingUp, Clock, ChefHat, Truck, CheckCircle } from 'lucide-react';

export function DashboardHome() {
  const { orders } = useOrders();

  const today = new Date().toDateString();
  const todayOrders = orders.filter(o => new Date(o.createdAt).toDateString() === today);
  const todayRevenue = todayOrders.reduce((sum, o) => sum + o.total, 0);

  const pendingOrders = orders.filter(o => o.statut === 'confirmee').length;
  const preparingOrders = orders.filter(o => o.statut === 'preparation').length;
  const deliveringOrders = orders.filter(o => o.statut === 'livraison').length;
  const deliveredOrders = orders.filter(o => o.statut === 'livree').length;

  const stats = [
    {
      label: "Commandes aujourd'hui",
      value: todayOrders.length,
      icon: Package,
      color: 'bg-blue-500'
    },
    {
      label: "Chiffre du jour",
      value: `${todayRevenue.toFixed(2)}€`,
      icon: Euro,
      color: 'bg-green-500'
    },
    {
      label: 'Commandes totales',
      value: orders.length,
      icon: TrendingUp,
      color: 'bg-purple-500'
    },
    {
      label: 'En attente',
      value: pendingOrders,
      icon: Clock,
      color: 'bg-orange-500'
    }
  ];

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-8">
        Vue d'ensemble
      </h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Order Pipeline */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
        <h2 className="font-semibold text-gray-800 mb-6">Pipeline des commandes</h2>
        <div className="grid grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-xl">
            <Clock className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-blue-600">{pendingOrders}</p>
            <p className="text-sm text-blue-600/70">En attente</p>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-xl">
            <ChefHat className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-yellow-600">{preparingOrders}</p>
            <p className="text-sm text-yellow-600/70">En préparation</p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-xl">
            <Truck className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-purple-600">{deliveringOrders}</p>
            <p className="text-sm text-purple-600/70">En livraison</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-xl">
            <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-green-600">{deliveredOrders}</p>
            <p className="text-sm text-green-600/70">Livrées</p>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="font-semibold text-gray-800">Commandes récentes</h2>
        </div>
        {orders.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            Aucune commande pour le moment
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {orders.slice(0, 5).map(order => (
              <div key={order.id} className="p-4 flex items-center gap-4">
                <div className="flex-1">
                  <p className="font-medium text-gray-800">{order.id}</p>
                  <p className="text-sm text-gray-500">{order.clientNom}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-creme-rose">{order.total.toFixed(2)}€</p>
                  <p className="text-xs text-gray-400">
                    {new Date(order.createdAt).toLocaleTimeString('fr-FR', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  order.statut === 'livree' ? 'bg-green-100 text-green-700' :
                  order.statut === 'livraison' ? 'bg-purple-100 text-purple-700' :
                  order.statut === 'preparation' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-blue-100 text-blue-700'
                }`}>
                  {order.statut}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
