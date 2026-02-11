import { Link, useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft, Truck } from 'lucide-react';
import { FREE_DELIVERY_THRESHOLD } from '@/data/products';

export function CartPage() {
  const { items, updateQuantity, removeFromCart, subtotal, deliveryFee, total } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (isAuthenticated) {
      navigate('/commander');
    } else {
      navigate('/connexion?redirect=/commander');
    }
  };

  const remainingForFreeDelivery = FREE_DELIVERY_THRESHOLD - subtotal;

  return (
    <div className="min-h-screen bg-creme-beige-light flex flex-col">
      <Navbar />

      <main className="flex-1 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center gap-4 mb-8">
            <Link
              to="/"
              className="p-2 bg-white rounded-full hover:bg-creme-beige transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-creme-brun" />
            </Link>
            <h1 className="font-display text-3xl font-bold text-creme-brun">
              Mon Panier
            </h1>
          </div>

          {items.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
              <ShoppingBag className="w-16 h-16 text-creme-rose mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-creme-brun mb-2">
                Votre panier est vide
              </h2>
              <p className="text-gray-600 mb-6">
                Ajoutez des délicieux tiramisus pour commencer
              </p>
              <Link
                to="/"
                className="inline-flex items-center gap-2 px-6 py-3 bg-creme-rose hover:bg-creme-rose-dark text-white font-medium rounded-full transition-colors"
              >
                Voir la carte
              </Link>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {/* Free delivery progress */}
                {remainingForFreeDelivery > 0 && (
                  <div className="bg-white p-4 rounded-xl shadow-sm">
                    <div className="flex items-center gap-3 text-sm">
                      <Truck className="w-5 h-5 text-creme-rose" />
                      <span className="text-creme-brun">
                        Plus que <strong>{remainingForFreeDelivery.toFixed(2)}€</strong> pour la livraison gratuite !
                      </span>
                    </div>
                    <div className="mt-2 h-2 bg-creme-beige rounded-full overflow-hidden">
                      <div
                        className="h-full bg-creme-rose transition-all duration-500"
                        style={{ width: `${Math.min((subtotal / FREE_DELIVERY_THRESHOLD) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                )}

                {items.map(item => (
                  <div
                    key={item.product.id}
                    className="bg-white rounded-xl shadow-sm p-4 flex gap-4"
                  >
                    <img
                      src={item.product.image}
                      alt={item.product.nom}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-creme-brun">
                        {item.product.emoji} {item.product.nom}
                      </h3>
                      <p className="text-sm text-gray-500 truncate">
                        {item.product.description}
                      </p>
                      <p className="text-creme-rose font-bold mt-1">
                        {item.product.prix.toFixed(2)}€
                      </p>
                    </div>
                    <div className="flex flex-col items-end justify-between">
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <div className="flex items-center gap-2 bg-creme-beige rounded-lg">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="p-2 hover:bg-creme-beige-light rounded-l-lg transition-colors"
                        >
                          <Minus className="w-4 h-4 text-creme-brun" />
                        </button>
                        <span className="w-8 text-center font-semibold text-creme-brun">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="p-2 hover:bg-creme-beige-light rounded-r-lg transition-colors"
                        >
                          <Plus className="w-4 h-4 text-creme-brun" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
                  <h2 className="font-display text-xl font-semibold text-creme-brun mb-4">
                    Récapitulatif
                  </h2>
                  
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Sous-total</span>
                      <span className="font-medium">{subtotal.toFixed(2)}€</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Livraison</span>
                      <span className={`font-medium ${deliveryFee === 0 ? 'text-green-600' : ''}`}>
                        {deliveryFee === 0 ? 'Offerte' : `${deliveryFee.toFixed(2)}€`}
                      </span>
                    </div>
                    <div className="border-t border-creme-beige pt-3 flex justify-between">
                      <span className="font-semibold text-creme-brun">Total</span>
                      <span className="text-xl font-bold text-creme-rose">{total.toFixed(2)}€</span>
                    </div>
                  </div>

                  <button
                    onClick={handleCheckout}
                    className="w-full mt-6 py-3 bg-creme-rose hover:bg-creme-rose-dark text-white font-semibold rounded-xl transition-colors"
                  >
                    {isAuthenticated ? 'Passer commande' : 'Continuer'}
                  </button>

                  <Link
                    to="/"
                    className="block text-center mt-4 text-sm text-creme-brun hover:text-creme-rose transition-colors"
                  >
                    ← Continuer mes achats
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
