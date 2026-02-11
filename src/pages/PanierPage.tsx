import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, CreditCard, MapPin, Clock } from 'lucide-react';
import { useStore, generateOrderId } from '@/store/useStore';
import { tiramisus, boissons } from '@/data/products';
import type { Commande } from '@/types';

export function PanierPage() {
  const { cart, updateQuantity, removeFromCart, clearCart, user, isAuthenticated, addCommande, incrementFidelite } = useStore();
  const navigate = useNavigate();
  
  const [step, setStep] = useState<'panier' | 'livraison' | 'paiement' | 'confirmation'>('panier');
  const [adresse, setAdresse] = useState(user?.adresse || '');
  const [telephone, setTelephone] = useState(user?.telephone || '');
  const [creneau, setCreneau] = useState('');
  const [orderId, setOrderId] = useState('');
  const [processing, setProcessing] = useState(false);

  const FRAIS_LIVRAISON = 2.50;

  const getProduct = (productId: string, type: 'tiramisu' | 'boisson') => {
    if (type === 'tiramisu') {
      return tiramisus.find((p) => p.id === productId);
    }
    return boissons.find((b) => b.id === productId);
  };

  const sousTotal = cart.reduce((total, item) => {
    const product = getProduct(item.productId, item.type);
    return total + (product?.prix || 0) * item.quantite;
  }, 0);

  const total = sousTotal + (sousTotal > 0 ? FRAIS_LIVRAISON : 0);

  const generateCreneaux = () => {
    const creneaux = [];
    // Horaires: 18h à 00h
    for (let h = 18; h <= 23; h++) {
      for (let m = 0; m < 60; m += 30) {
        const time = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
        creneaux.push(time);
      }
    }
    creneaux.push('00:00');
    return creneaux;
  };

  const handlePaiement = async () => {
    if (!isAuthenticated) {
      navigate('/connexion');
      return;
    }

    setProcessing(true);
    
    // Simulation de paiement Stripe
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const newOrderId = generateOrderId();
    const commande: Commande = {
      id: newOrderId,
      clientId: user!.id,
      clientNom: user!.nom,
      clientTelephone: telephone,
      adresseLivraison: adresse,
      items: [...cart],
      total,
      statut: 'confirmee',
      creneauHoraire: creneau,
      createdAt: new Date(),
    };

    addCommande(commande);
    incrementFidelite(); // Ajouter un point de fidélité
    setOrderId(newOrderId);
    clearCart();
    setStep('confirmation');
    setProcessing(false);
  };

  if (cart.length === 0 && step !== 'confirmation') {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <ShoppingBag className="w-24 h-24 mx-auto text-amber-300 mb-6" />
        <h1 className="text-3xl font-bold text-amber-900 mb-4">Votre panier est vide</h1>
        <p className="text-amber-600 mb-8">
          Découvrez nos délicieux tiramisus et ajoutez-les à votre panier !
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-rose-400 text-white px-6 py-3 rounded-full font-semibold hover:bg-rose-500 transition-colors"
        >
          Voir le menu
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Étapes */}
      <div className="flex justify-center mb-8">
        <div className="flex items-center gap-2 text-sm">
          {['panier', 'livraison', 'paiement', 'confirmation'].map((s, i) => (
            <div key={s} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                  step === s
                    ? 'bg-rose-400 text-white'
                    : ['panier', 'livraison', 'paiement', 'confirmation'].indexOf(step) > i
                    ? 'bg-green-500 text-white'
                    : 'bg-amber-100 text-amber-400'
                }`}
              >
                {i + 1}
              </div>
              {i < 3 && <div className="w-12 h-1 bg-amber-100 mx-1" />}
            </div>
          ))}
        </div>
      </div>

      {/* Étape 1: Panier */}
      {step === 'panier' && (
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h1 className="text-2xl font-bold text-amber-900 mb-6">Votre Panier</h1>

          <div className="space-y-4 mb-6">
            {cart.map((item) => {
              const product = getProduct(item.productId, item.type);
              if (!product) return null;

              return (
                <div
                  key={`${item.productId}-${item.type}`}
                  className="flex items-center gap-4 p-4 bg-amber-50 rounded-xl"
                >
                  <img
                    src={product.image}
                    alt={product.nom}
                    className="w-20 h-20 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-amber-900">{product.nom}</h3>
                    <p className="text-rose-500 font-bold">{product.prix.toFixed(2)}€</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantite - 1)}
                      className="w-8 h-8 rounded-full bg-white text-amber-900 flex items-center justify-center hover:bg-rose-100"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="font-bold w-8 text-center">{item.quantite}</span>
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantite + 1)}
                      className="w-8 h-8 rounded-full bg-white text-amber-900 flex items-center justify-center hover:bg-rose-100"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.productId)}
                    className="text-red-400 hover:text-red-600"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              );
            })}
          </div>

          <div className="border-t border-amber-100 pt-4 space-y-2">
            <div className="flex justify-between text-amber-700">
              <span>Sous-total</span>
              <span>{sousTotal.toFixed(2)}€</span>
            </div>
            <div className="flex justify-between text-amber-700">
              <span>Frais de livraison</span>
              <span>{FRAIS_LIVRAISON.toFixed(2)}€</span>
            </div>
            <div className="flex justify-between text-xl font-bold text-amber-900 pt-2 border-t border-amber-100">
              <span>Total</span>
              <span>{total.toFixed(2)}€</span>
            </div>
          </div>

          <button
            onClick={() => setStep('livraison')}
            className="w-full mt-6 bg-rose-400 text-white py-3 rounded-xl font-semibold hover:bg-rose-500 transition-colors flex items-center justify-center gap-2"
          >
            Continuer
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Étape 2: Livraison */}
      {step === 'livraison' && (
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h1 className="text-2xl font-bold text-amber-900 mb-6">Adresse de livraison</h1>

          <div className="space-y-4">
            <div>
              <label className="block text-amber-700 mb-2 font-medium">
                <MapPin className="w-4 h-4 inline mr-2" />
                Adresse complète
              </label>
              <textarea
                value={adresse}
                onChange={(e) => setAdresse(e.target.value)}
                placeholder="Numéro, rue, code postal, ville..."
                rows={3}
                className="w-full p-4 border border-amber-200 rounded-xl focus:ring-2 focus:ring-rose-300 outline-none"
              />
            </div>

            <div>
              <label className="block text-amber-700 mb-2 font-medium">
                Téléphone
              </label>
              <input
                type="tel"
                value={telephone}
                onChange={(e) => setTelephone(e.target.value)}
                placeholder="06 XX XX XX XX"
                className="w-full p-4 border border-amber-200 rounded-xl focus:ring-2 focus:ring-rose-300 outline-none"
              />
            </div>

            <div>
              <label className="block text-amber-700 mb-2 font-medium">
                <Clock className="w-4 h-4 inline mr-2" />
                Créneau de livraison
              </label>
              <select
                value={creneau}
                onChange={(e) => setCreneau(e.target.value)}
                className="w-full p-4 border border-amber-200 rounded-xl focus:ring-2 focus:ring-rose-300 outline-none"
              >
                <option value="">Choisir un créneau...</option>
                {generateCreneaux().map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex gap-4 mt-6">
            <button
              onClick={() => setStep('panier')}
              className="flex-1 border border-amber-300 text-amber-700 py-3 rounded-xl font-semibold hover:bg-amber-50 transition-colors"
            >
              Retour
            </button>
            <button
              onClick={() => setStep('paiement')}
              disabled={!adresse || !telephone || !creneau}
              className="flex-1 bg-rose-400 text-white py-3 rounded-xl font-semibold hover:bg-rose-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              Continuer
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Étape 3: Paiement */}
      {step === 'paiement' && (
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h1 className="text-2xl font-bold text-amber-900 mb-6">Récapitulatif & Paiement</h1>

          <div className="bg-amber-50 rounded-xl p-4 mb-6">
            <h3 className="font-semibold text-amber-900 mb-2">Livraison</h3>
            <p className="text-amber-700">{adresse}</p>
            <p className="text-amber-600 text-sm mt-1">Créneau: {creneau}</p>
          </div>

          <div className="space-y-2 mb-6">
            {cart.map((item) => {
              const product = getProduct(item.productId, item.type);
              if (!product) return null;
              return (
                <div key={item.productId} className="flex justify-between text-amber-700">
                  <span>
                    {product.nom} x{item.quantite}
                  </span>
                  <span>{(product.prix * item.quantite).toFixed(2)}€</span>
                </div>
              );
            })}
            <div className="flex justify-between text-amber-700 pt-2 border-t border-amber-100">
              <span>Livraison</span>
              <span>{FRAIS_LIVRAISON.toFixed(2)}€</span>
            </div>
            <div className="flex justify-between text-xl font-bold text-amber-900 pt-2 border-t border-amber-100">
              <span>Total</span>
              <span>{total.toFixed(2)}€</span>
            </div>
          </div>

          <div className="bg-gradient-to-r from-rose-100 to-amber-100 rounded-xl p-4 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <CreditCard className="w-6 h-6 text-rose-500" />
              <span className="font-semibold text-amber-900">Moyens de paiement acceptés</span>
            </div>
            <div className="space-y-2 text-amber-700">
              <div className="flex items-center gap-3">
                <span className="text-xl">💵</span>
                <span>Espèces (à la livraison)</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xl">🅿️</span>
                <span>PayPal</span>
              </div>
            </div>
            <p className="text-amber-500 text-sm mt-3">
              Le paiement s'effectue à la livraison ou par PayPal (lien envoyé par email).
            </p>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => setStep('livraison')}
              className="flex-1 border border-amber-300 text-amber-700 py-3 rounded-xl font-semibold hover:bg-amber-50 transition-colors"
            >
              Retour
            </button>
            <button
              onClick={handlePaiement}
              disabled={processing}
              className="flex-1 bg-green-500 text-white py-3 rounded-xl font-semibold hover:bg-green-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {processing ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Traitement...
                </>
              ) : (
                <>
                  Confirmer ma commande
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Étape 4: Confirmation */}
      {step === 'confirmation' && (
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-10 h-10 text-green-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h1 className="text-3xl font-bold text-amber-900 mb-2">Commande confirmée ! 🎉</h1>
          <p className="text-amber-600 mb-6">Merci pour votre commande chez Crème & Cookies</p>

          <div className="bg-amber-50 rounded-xl p-4 mb-6">
            <p className="text-amber-700">Numéro de commande</p>
            <p className="text-2xl font-bold text-rose-500">{orderId}</p>
          </div>

          <p className="text-amber-600 mb-8">
            Vous recevrez un email de confirmation. Suivez votre commande depuis votre espace client.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/mon-compte/mes-commandes"
              className="bg-rose-400 text-white px-6 py-3 rounded-full font-semibold hover:bg-rose-500 transition-colors"
            >
              Suivre ma commande
            </Link>
            <Link
              to="/"
              className="border border-amber-300 text-amber-700 px-6 py-3 rounded-full font-semibold hover:bg-amber-50 transition-colors"
            >
              Retour à l'accueil
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
