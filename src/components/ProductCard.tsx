import { Plus, Check } from 'lucide-react';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import { useState } from 'react';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart, items } = useCart();
  const [justAdded, setJustAdded] = useState(false);
  
  const inCart = items.find(item => item.product.id === product.id);

  const handleAdd = () => {
    addToCart(product);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  return (
    <div className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden">
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={product.image}
          alt={product.nom}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        {!product.disponible && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white font-bold text-lg">Indisponible</span>
          </div>
        )}
        {product.gamme && (
          <span className="absolute top-3 left-3 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-semibold text-creme-brun">
            {product.gamme === 'large' ? 'Signature' : 'Mini M'}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-display text-lg font-semibold text-creme-brun">
            {product.emoji} {product.nom}
          </h3>
          <span className="text-lg font-bold text-creme-rose whitespace-nowrap">
            {product.prix.toFixed(2)}€
          </span>
        </div>
        
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {product.description}
        </p>

        <button
          onClick={handleAdd}
          disabled={!product.disponible}
          className={`w-full py-2.5 rounded-xl font-medium flex items-center justify-center gap-2 transition-all ${
            justAdded
              ? 'bg-green-500 text-white'
              : product.disponible
              ? 'bg-creme-rose hover:bg-creme-rose-dark text-white'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          {justAdded ? (
            <>
              <Check className="w-4 h-4" />
              Ajouté !
            </>
          ) : (
            <>
              <Plus className="w-4 h-4" />
              Ajouter au panier
              {inCart && ` (${inCart.quantity})`}
            </>
          )}
        </button>
      </div>
    </div>
  );
}
