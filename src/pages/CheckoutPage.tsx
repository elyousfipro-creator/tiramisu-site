import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useOrders } from '@/context/OrderContext';
import { ArrowLeft, Banknote, Clock, MapPin, Check } from 'lucide-react';
import { PaymentMethod } from '@/types';

const timeSlots = [
  '18:00 - 18:30',
  '18:30 - 19:00',
  '19:00 - 19:30',
  '19:30 - 20:00',
  '20:00 - 20:30',
  '20:30 - 21:00',
  '21:00 - 21:30',
  '21:30 - 22:00',
  '22:00 - 22:30',
  '22:30 - 23:00',
  '23:00 - 23:30',
  '23:30 - 00:00'
];

export function CheckoutPage() {
  const { items, subtotal, deliveryFee, total, clearCart } = useCart();
  const { user, updateLoyalty } = useAuth();
  const { createOrder } = useOrders();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [address, setAddress] = useState(user?.adresse || '');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('especes');
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState('');

  const handleConfirmOrder = async () => {
    if (!user || !selectedSlot || !address) return;
    
    setLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const order = createOrder({
      clientId: user.id,
      clientNom: user.nom,
      clientTelephone: user.telephone,
      items,
      total,
      adresse: address,
      creneau: selectedSlot,
      paymentMethod
    });

    // Update loyalty progress
    const newTotalOrders = user.totalOrders + 1;
    let newProgress = user.loyaltyProgress + 1;
    let newTier = user.loyaltyTier;
    let pendingReward = user.pendingReward;

    if (newProgress >= 6) {
      pendingReward = user.loyaltyTier === 'bronze' ? 'cookie' : user.loyaltyTier === 'argent' ? 'mini' : 'xl';
    }

    updateLoyalty(newTier, newProgress, newTotalOrders, pendingReward);
    
    setOrderId(order.id);
    clearCart();
    setStep(3);
    setLoading(false);
  };

  if (items.length === 0 && step !== 3) {
    navigate('/panier');
    return null;
  }

  return (
    <div className="min-h-screen bg-creme-beige-light">
      <Navbar />

      <main className="py-8">
        <div className="max-w-2xl mx-auto px-4">
          {/* Progress */}
          <div className="flex items-center justify-center gap-4 mb-8">
            {[1, 2, 3].map(s => (
              <div key={s} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                    step >= s
                      ? 'bg-creme-rose text-white'
                      : 'bg-creme-beige text-creme-brun-light'
                  }`}
                >
                  {step > s ? <Check className="w-4 h-4" /> : s}
                </div>
                {s < 3 && (
                  <div
                    className={`w-16 h-1 mx-2 rounded ${
                      step > s ? 'bg-creme-rose' : 'bg-creme-beige'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Step 1: Delivery */}
          {step === 1 && (
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="font-display text-2xl font-bold text-creme-brun mb-6 flex items-center gap-3">
                <MapPin className="w-6 h-6 text-creme-rose" />
                Livraison
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-creme-brun mb-2">
                    Adresse de livraison
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-creme-beige focus:border-creme-rose focus:ring-2 focus:ring-creme-rose/20 outline-none"
                    placeholder="12 rue de la Paix, 49000 Angers"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-creme-brun mb-2 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Créneau de livraison
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {timeSlots.map(slot => (
                      <button
                        key={slot}
                        onClick={() => setSelectedSlot(slot)}
                        className={`p-3 rounded-xl text-sm font-medium transition-all ${
                          selectedSlot === slot
                            ? 'bg-creme-rose text-white'
                            : 'bg-creme-beige-light hover:bg-creme-beige text-creme-brun'
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-4 mt-8">
                <button
                  onClick={() => navigate('/panier')}
                  className="flex items-center gap-2 px-4 py-3 text-creme-brun hover:text-creme-rose transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Retour
                </button>
                <button
                  onClick={() => setStep(2)}
                  disabled={!address || !selectedSlot}
                  className="flex-1 py-3 bg-creme-rose hover:bg-creme-rose-dark text-white font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continuer vers le paiement
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Payment */}
          {step === 2 && (
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="font-display text-2xl font-bold text-creme-brun mb-6 flex items-center gap-3">
                <Banknote className="w-6 h-6 text-creme-rose" />
                Paiement
              </h2>

              {/* Order Summary */}
              <div className="bg-creme-beige-light rounded-xl p-4 mb-6">
                <h3 className="font-semibold text-creme-brun mb-3">Récapitulatif</h3>
                <div className="space-y-2 text-sm">
                  {items.map(item => (
                    <div key={item.product.id} className="flex justify-between">
                      <span>{item.product.emoji} {item.product.nom} x{item.quantity}</span>
                      <span>{(item.product.prix * item.quantity).toFixed(2)}€</span>
                    </div>
                  ))}
                  <div className="border-t border-creme-beige pt-2 mt-2">
                    <div className="flex justify-between">
                      <span>Sous-total</span>
                      <span>{subtotal.toFixed(2)}€</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Livraison</span>
                      <span>{deliveryFee === 0 ? 'Offerte' : `${deliveryFee.toFixed(2)}€`}</span>
                    </div>
                  </div>
                  <div className="flex justify-between font-bold text-creme-brun pt-2 border-t border-creme-beige">
                    <span>Total</span>
                    <span className="text-creme-rose">{total.toFixed(2)}€</span>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-creme-beige text-sm text-gray-600">
                  <p>📍 {address}</p>
                  <p>🕐 {selectedSlot}</p>
                </div>
              </div>

              {/* Payment Method Selection */}
              <div className="space-y-3 mb-6">
                <label className="block text-sm font-medium text-creme-brun mb-2">
                  Mode de paiement
                </label>
                
                <button
                  onClick={() => setPaymentMethod('especes')}
                  className={`w-full p-4 rounded-xl border-2 transition-all flex items-center gap-4 ${
                    paymentMethod === 'especes'
                      ? 'border-creme-rose bg-creme-rose/5'
                      : 'border-creme-beige hover:border-creme-rose/50'
                  }`}
                >
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl">💵</span>
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-creme-brun">Espèces</p>
                    <p className="text-sm text-gray-500">Paiement à la livraison</p>
                  </div>
                  {paymentMethod === 'especes' && (
                    <Check className="w-5 h-5 text-creme-rose ml-auto" />
                  )}
                </button>

                <button
                  onClick={() => setPaymentMethod('paypal')}
                  className={`w-full p-4 rounded-xl border-2 transition-all flex items-center gap-4 ${
                    paymentMethod === 'paypal'
                      ? 'border-creme-rose bg-creme-rose/5'
                      : 'border-creme-beige hover:border-creme-rose/50'
                  }`}
                >
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl">💳</span>
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-creme-brun">PayPal</p>
                    <p className="text-sm text-gray-500">cremeetcookiess@gmail.com</p>
                  </div>
                  {paymentMethod === 'paypal' && (
                    <Check className="w-5 h-5 text-creme-rose ml-auto" />
                  )}
                </button>
              </div>

              {paymentMethod === 'paypal' && (
                <div className="bg-blue-50 rounded-xl p-4 mb-6">
                  <p className="text-sm text-blue-800">
                    <strong>Instructions PayPal :</strong><br />
                    Envoyez le montant de <strong>{total.toFixed(2)}€</strong> à <strong>cremeetcookiess@gmail.com</strong> avec votre nom en commentaire.
                  </p>
                </div>
              )}

              <div className="flex gap-4 mt-8">
                <button
                  onClick={() => setStep(1)}
                  className="flex items-center gap-2 px-4 py-3 text-creme-brun hover:text-creme-rose transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Retour
                </button>
                <button
                  onClick={handleConfirmOrder}
                  disabled={loading}
                  className="flex-1 py-3 bg-creme-rose hover:bg-creme-rose-dark text-white font-semibold rounded-xl transition-colors disabled:opacity-50"
                >
                  {loading ? 'Confirmation...' : 'Confirmer la commande'}
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Confirmation */}
          {step === 3 && (
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="w-10 h-10 text-green-600" />
              </div>
              <h2 className="font-display text-2xl font-bold text-creme-brun mb-2">
                Commande confirmée ! 🎉
              </h2>
              <p className="text-gray-600 mb-4">
                Merci pour votre commande. Nous préparons vos délicieux tiramisus !
              </p>
              <div className="bg-creme-beige-light rounded-xl p-4 mb-6 inline-block">
                <p className="text-sm text-gray-600">Numéro de commande</p>
                <p className="text-xl font-bold text-creme-brun">{orderId}</p>
              </div>

              {paymentMethod === 'especes' && (
                <div className="bg-green-50 rounded-xl p-4 mb-6 text-left">
                  <p className="text-sm text-green-800">
                    💵 <strong>Paiement en espèces</strong> - Préparez {total.toFixed(2)}€ pour le livreur
                  </p>
                </div>
              )}

              {paymentMethod === 'paypal' && (
                <div className="bg-blue-50 rounded-xl p-4 mb-6 text-left">
                  <p className="text-sm text-blue-800">
                    💳 <strong>N'oubliez pas</strong> - Envoyez {total.toFixed(2)}€ sur PayPal à cremeetcookiess@gmail.com
                  </p>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => navigate(`/suivi/${orderId}`)}
                  className="px-6 py-3 bg-creme-rose hover:bg-creme-rose-dark text-white font-semibold rounded-xl transition-colors"
                >
                  Suivre ma commande
                </button>
                <button
                  onClick={() => navigate('/')}
                  className="px-6 py-3 bg-creme-beige hover:bg-creme-beige-light text-creme-brun font-semibold rounded-xl transition-colors"
                >
                  Retour à l'accueil
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
