import { Plus, Minus } from 'lucide-react';
import { Product, Boisson } from '@/types';
import { useStore } from '@/store/useStore';
import { useState } from 'react';

interface ProductCardProps {
  product: Product | Boisson;
  type: 'tiramisu' | 'boisson';
}

export function ProductCard({ product, type }: ProductCardProps) {
  const { addToCart, cart, updateQuantity } = useStore();
  const [isAdding, setIsAdding] = useState(false);
  
  const cartItem = cart.find((item) => item.productId === product.id && item.type === type);
  const quantity = cartItem?.quantite || 0;

  const handleAdd = () => {
    setIsAdding(true);
    addToCart({ productId: product.id, type, quantite: 1 });
    setTimeout(() => setIsAdding(false), 300);
  };

  const isProduct = (p: Product | Boisson): p is Product => {
    return 'gamme' in p;
  };

  return (
    <div className={`bg-white rounded-2xl shadow-md overflow-hidden transform transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${isAdding ? 'scale-105' : ''}`}>
      <div className="relative">
        <img
          src={product.image}
          alt={product.nom}
          className="w-full h-48 object-cover"
        />
        {!product.disponible && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="bg-red-500 text-white px-4 py-2 rounded-full font-semibold">
              Indisponible
            </span>
          </div>
        )}
        {isProduct(product) && (
          <span className="absolute top-3 right-3 bg-rose-400 text-white px-3 py-1 rounded-full text-sm font-medium">
            {product.gamme === 'Large' ? '7,50€' : '5,00€'}
          </span>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-bold text-lg text-amber-900 mb-1">{product.nom}</h3>
        {'description' in product && (
          <p className="text-amber-700 text-sm mb-3">{product.description}</p>
        )}

        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-rose-500">
            {product.prix.toFixed(2)}€
          </span>

          {product.disponible && (
            <div className="flex items-center gap-2">
              {quantity > 0 ? (
                <div className="flex items-center gap-2 bg-amber-100 rounded-full px-2 py-1">
                  <button
                    onClick={() => updateQuantity(product.id, quantity - 1)}
                    className="w-8 h-8 rounded-full bg-white text-amber-900 flex items-center justify-center hover:bg-rose-100 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="font-bold text-amber-900 w-6 text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(product.id, quantity + 1)}
                    className="w-8 h-8 rounded-full bg-white text-amber-900 flex items-center justify-center hover:bg-rose-100 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleAdd}
                  className="flex items-center gap-2 bg-rose-400 text-white px-4 py-2 rounded-full hover:bg-rose-500 transition-all duration-200 active:scale-95"
                >
                  <Plus className="w-5 h-5" />
                  <span>Ajouter</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
