import { Plus, Minus } from 'lucide-react';
import { Boisson } from '@/types';
import { useStore } from '@/store/useStore';

interface BoissonCardProps {
  boisson: Boisson;
}

export function BoissonCard({ boisson }: BoissonCardProps) {
  const { addToCart, cart, updateQuantity } = useStore();
  
  const cartItem = cart.find((item) => item.productId === boisson.id && item.type === 'boisson');
  const quantity = cartItem?.quantite || 0;

  const handleAdd = () => {
    addToCart({ productId: boisson.id, type: 'boisson', quantite: 1 });
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-4 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <img
        src={boisson.image}
        alt={boisson.nom}
        className="w-16 h-16 mx-auto mb-3 rounded-lg object-cover"
      />
      <h3 className="font-semibold text-amber-900 text-sm mb-1">
        {boisson.nom}
      </h3>
      <p className="text-rose-500 font-bold mb-3">{boisson.prix.toFixed(2)}€</p>
      
      {boisson.disponible ? (
        quantity > 0 ? (
          <div className="flex items-center justify-center gap-2 bg-amber-100 rounded-full px-2 py-1">
            <button
              onClick={() => updateQuantity(boisson.id, quantity - 1)}
              className="w-7 h-7 rounded-full bg-white text-amber-900 flex items-center justify-center hover:bg-rose-100 transition-colors"
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="font-bold text-amber-900 w-5 text-center text-sm">
              {quantity}
            </span>
            <button
              onClick={() => updateQuantity(boisson.id, quantity + 1)}
              className="w-7 h-7 rounded-full bg-white text-amber-900 flex items-center justify-center hover:bg-rose-100 transition-colors"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>
        ) : (
          <button
            onClick={handleAdd}
            className="w-full bg-rose-400 text-white py-2 rounded-full text-sm font-medium hover:bg-rose-500 transition-all duration-200 active:scale-95 flex items-center justify-center gap-1"
          >
            <Plus className="w-4 h-4" />
            Ajouter
          </button>
        )
      ) : (
        <span className="text-gray-400 text-sm">Indisponible</span>
      )}
    </div>
  );
}
