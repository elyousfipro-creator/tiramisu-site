import { useParams, Navigate, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Clock, Phone, Package, Truck } from 'lucide-react';
import { useStore, ADRESSE_DEPART } from '@/store/useStore';
import { tiramisus, boissons } from '@/data/products';

export function SuiviCommandePage() {
  const { orderId } = useParams<{ orderId: string }>();
  const { user, isAuthenticated, commandes } = useStore();

  if (!isAuthenticated || !user) {
    return <Navigate to="/connexion" replace />;
  }

  const commande = commandes.find((c) => c.id === orderId);

  if (!commande) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <Package className="w-16 h-16 mx-auto text-amber-300 mb-4" />
        <h1 className="text-2xl font-bold text-amber-900 mb-4">Commande introuvable</h1>
        <Link
          to="/mon-compte/mes-commandes"
          className="text-rose-500 hover:underline"
        >
          Retour à mes commandes
        </Link>
      </div>
    );
  }

  const getProduct = (productId: string, type: 'tiramisu' | 'boisson') => {
    if (type === 'tiramisu') {
      return tiramisus.find((p) => p.id === productId);
    }
    return boissons.find((b) => b.id === productId);
  };

  const getStatutStep = () => {
    switch (commande.statut) {
      case 'confirmee':
        return 1;
      case 'preparation':
        return 2;
      case 'prete':
        return 3;
      case 'livraison':
        return 4;
      case 'livree':
        return 5;
      default:
        return 0;
    }
  };

  const steps = [
    { label: 'Confirmée', icon: '📋' },
    { label: 'En préparation', icon: '👨‍🍳' },
    { label: 'Prête', icon: '✅' },
    { label: 'En livraison', icon: '🚗' },
    { label: 'Livrée', icon: '🎉' },
  ];

  const currentStep = getStatutStep();

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-8">
        <Link
          to="/mon-compte/mes-commandes"
          className="p-2 rounded-full hover:bg-amber-100 transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-amber-700" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-amber-900">Suivi de commande</h1>
          <p className="text-rose-500 font-semibold">{commande.id}</p>
        </div>
      </div>

      {/* Timeline de statut */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
        <div className="flex justify-between items-center mb-8">
          {steps.map((step, index) => (
            <div key={step.label} className="flex flex-col items-center relative">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${
                  index < currentStep
                    ? 'bg-green-500 text-white'
                    : index === currentStep - 1
                    ? 'bg-rose-500 text-white ring-4 ring-rose-200'
                    : 'bg-gray-100 text-gray-400'
                }`}
              >
                {step.icon}
              </div>
              <span
                className={`text-xs mt-2 text-center ${
                  index < currentStep ? 'text-green-600 font-medium' : 'text-gray-400'
                }`}
              >
                {step.label}
              </span>
              {index < steps.length - 1 && (
                <div
                  className={`absolute top-5 left-10 w-full h-0.5 -z-10 ${
                    index < currentStep - 1 ? 'bg-green-500' : 'bg-gray-200'
                  }`}
                  style={{ width: 'calc(100% - 40px)' }}
                />
              )}
            </div>
          ))}
        </div>

        {commande.statut === 'livraison' && (
          <div className="bg-blue-50 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-3">
              <Truck className="w-6 h-6 text-blue-500" />
              <p className="font-semibold text-blue-800">Votre commande est en route !</p>
            </div>
            <p className="text-blue-600 text-sm mb-4">
              Le livreur est parti de {ADRESSE_DEPART.adresse} et se dirige vers vous.
            </p>
            
            {/* Carte simplifiée (placeholder) */}
            <div className="bg-gradient-to-br from-rose-100 to-amber-100 rounded-xl h-48 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 opacity-30">
                <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-blue-500 rounded-full animate-ping" />
              </div>
              <div className="text-center z-10">
                <MapPin className="w-10 h-10 text-rose-500 mx-auto mb-2" />
                <p className="text-amber-800 font-medium">Carte en temps réel</p>
                <p className="text-amber-600 text-sm">
                  Intégration Google Maps disponible avec clé API
                </p>
              </div>
            </div>
          </div>
        )}

        {commande.statut === 'livree' && (
          <div className="bg-green-50 rounded-xl p-4 text-center">
            <div className="text-4xl mb-2">🎉</div>
            <p className="font-semibold text-green-800">Commande livrée avec succès !</p>
            <p className="text-green-600 text-sm">Merci pour votre confiance</p>
          </div>
        )}
      </div>

      {/* Détails de la commande */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="font-bold text-lg text-amber-900 mb-4">Détails</h2>

        <div className="space-y-4 mb-6">
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 mt-1 text-rose-400" />
            <div>
              <p className="text-amber-600 text-sm">Adresse de livraison</p>
              <p className="font-medium text-amber-900">{commande.adresseLivraison}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-rose-400" />
            <div>
              <p className="text-amber-600 text-sm">Créneau demandé</p>
              <p className="font-medium text-amber-900">{commande.creneauHoraire}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Phone className="w-5 h-5 text-rose-400" />
            <div>
              <p className="text-amber-600 text-sm">Téléphone</p>
              <p className="font-medium text-amber-900">{commande.clientTelephone}</p>
            </div>
          </div>
        </div>

        <div className="border-t border-amber-100 pt-4">
          <h3 className="font-semibold text-amber-900 mb-3">Articles</h3>
          <div className="space-y-2">
            {commande.items.map((item) => {
              const product = getProduct(item.productId, item.type);
              if (!product) return null;
              return (
                <div
                  key={item.productId}
                  className="flex items-center justify-between bg-amber-50 p-2 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={product.image}
                      alt={product.nom}
                      className="w-10 h-10 rounded-lg object-cover"
                    />
                    <span className="text-amber-900">
                      {item.quantite}x {product.nom}
                    </span>
                  </div>
                  <span className="font-semibold text-rose-500">
                    {(product.prix * item.quantite).toFixed(2)}€
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex justify-between items-center mt-4 pt-4 border-t border-amber-100">
            <span className="font-semibold text-amber-900">Total</span>
            <span className="text-xl font-bold text-rose-500">
              {commande.total.toFixed(2)}€
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
