import { useParams, Link } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { useOrders } from '@/context/OrderContext';
import { Package, ChefHat, Truck, CheckCircle, MapPin, Clock, ArrowLeft } from 'lucide-react';
import { OrderStatus } from '@/types';

const statusSteps: { status: OrderStatus; label: string; icon: React.ReactNode }[] = [
  { status: 'confirmee', label: 'Confirmée', icon: <Package className="w-5 h-5" /> },
  { status: 'preparation', label: 'En préparation', icon: <ChefHat className="w-5 h-5" /> },
  { status: 'livraison', label: 'En livraison', icon: <Truck className="w-5 h-5" /> },
  { status: 'livree', label: 'Livrée', icon: <CheckCircle className="w-5 h-5" /> }
];

export function TrackingPage() {
  const { orderId } = useParams();
  const { getOrderById } = useOrders();
  
  const order = orderId ? getOrderById(orderId) : undefined;

  if (!order) {
    return (
      <div className="min-h-screen bg-creme-beige-light">
        <Navbar />
        <main className="py-16 text-center">
          <div className="max-w-md mx-auto px-4">
            <Package className="w-16 h-16 text-creme-rose mx-auto mb-4" />
            <h1 className="font-display text-2xl font-bold text-creme-brun mb-2">
              Commande non trouvée
            </h1>
            <p className="text-gray-600 mb-6">
              Vérifiez le numéro de commande ou connectez-vous à votre compte.
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-creme-rose hover:bg-creme-rose-dark text-white font-medium rounded-full transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Retour à l'accueil
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const currentStepIndex = statusSteps.findIndex(s => s.status === order.statut);

  return (
    <div className="min-h-screen bg-creme-beige-light flex flex-col">
      <Navbar />

      <main className="flex-1 py-8">
        <div className="max-w-2xl mx-auto px-4">
          <Link
            to="/mon-compte"
            className="inline-flex items-center gap-2 text-creme-brun hover:text-creme-rose transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Mes commandes
          </Link>

          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-creme-rose to-creme-rose-dark p-6 text-white">
              <h1 className="font-display text-2xl font-bold mb-1">
                Suivi de commande
              </h1>
              <p className="text-white/80">{order.id}</p>
            </div>

            {/* Status Timeline */}
            <div className="p-6">
              <div className="relative">
                {statusSteps.map((step, index) => {
                  const isCompleted = index <= currentStepIndex;
                  const isCurrent = index === currentStepIndex;
                  
                  return (
                    <div key={step.status} className="flex items-start mb-8 last:mb-0">
                      {/* Line */}
                      {index < statusSteps.length - 1 && (
                        <div
                          className={`absolute left-5 w-0.5 h-12 -translate-x-1/2 mt-10 ${
                            index < currentStepIndex ? 'bg-creme-rose' : 'bg-creme-beige'
                          }`}
                          style={{ top: `${index * 80 + 20}px` }}
                        />
                      )}
                      
                      {/* Icon */}
                      <div
                        className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                          isCompleted
                            ? 'bg-creme-rose text-white'
                            : 'bg-creme-beige text-creme-brun-light'
                        } ${isCurrent ? 'ring-4 ring-creme-rose/30' : ''}`}
                      >
                        {step.icon}
                      </div>
                      
                      {/* Content */}
                      <div className="ml-4">
                        <h3
                          className={`font-semibold ${
                            isCompleted ? 'text-creme-brun' : 'text-gray-400'
                          }`}
                        >
                          {step.label}
                        </h3>
                        {isCurrent && step.status === 'preparation' && (
                          <p className="text-sm text-creme-rose mt-1">
                            Votre tiramisu est en cours de préparation...
                          </p>
                        )}
                        {isCurrent && step.status === 'livraison' && (
                          <p className="text-sm text-creme-rose mt-1">
                            Le livreur est en route vers vous !
                          </p>
                        )}
                        {isCurrent && step.status === 'livree' && (
                          <p className="text-sm text-green-600 mt-1">
                            Votre commande a été livrée. Bon appétit ! 🍰
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Map Placeholder */}
            {order.statut === 'livraison' && (
              <div className="px-6 pb-6">
                <div className="bg-gradient-to-br from-creme-beige to-creme-rose-light rounded-xl p-8 text-center">
                  <MapPin className="w-12 h-12 text-creme-rose mx-auto mb-4" />
                  <h3 className="font-semibold text-creme-brun mb-2">
                    Suivi en temps réel
                  </h3>
                  <p className="text-sm text-gray-600">
                    La carte Google Maps avec la position du livreur sera disponible
                    une fois l'API configurée.
                  </p>
                  <div className="mt-4 text-sm text-creme-brun-light">
                    📍 Départ : 7 rue Marcel Cerdan, 49100 Angers
                  </div>
                </div>
              </div>
            )}

            {/* Order Details */}
            <div className="border-t border-creme-beige p-6">
              <h3 className="font-semibold text-creme-brun mb-4">Détails de la commande</h3>
              
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-creme-rose mt-0.5" />
                  <div>
                    <p className="text-gray-600">Créneau de livraison</p>
                    <p className="font-medium text-creme-brun">{order.creneauHoraire}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-creme-rose mt-0.5" />
                  <div>
                    <p className="text-gray-600">Adresse de livraison</p>
                    <p className="font-medium text-creme-brun">{order.adresseLivraison}</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-creme-beige">
                <h4 className="text-sm text-gray-600 mb-2">Articles commandés</h4>
                {order.items.map(item => (
                  <div key={item.product.id} className="flex justify-between text-sm py-1">
                    <span>
                      {item.product.emoji} {item.product.nom} x{item.quantity}
                    </span>
                    <span className="font-medium">
                      {(item.product.prix * item.quantity).toFixed(2)}€
                    </span>
                  </div>
                ))}
                <div className="flex justify-between font-bold text-creme-brun pt-3 mt-2 border-t border-creme-beige">
                  <span>Total</span>
                  <span className="text-creme-rose">{order.total.toFixed(2)}€</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
