import { ProductCard } from '@/components/ProductCard';
import { BoissonCard } from '@/components/BoissonCard';
import { tiramisus, boissons } from '@/data/products';
import { ChefHat, Truck, Heart, Star } from 'lucide-react';

export function HomePage() {
  const gammeSignature = tiramisus.filter((t) => t.gamme === 'Large');
  const gammeMini = tiramisus.filter((t) => t.gamme === 'Mini');

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-rose-200 via-rose-100 to-amber-50 py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 bg-rose-400 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-48 h-48 bg-amber-300 rounded-full blur-3xl" />
        </div>
        
        <div className="max-w-6xl mx-auto px-4 relative">
          <div className="text-center">
            {/* Titre Crème et Cookies */}
            <h1 className="text-5xl md:text-6xl font-bold text-amber-900 mb-4">
              Crème et Cookies
            </h1>
            
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
              <span className="text-amber-800 font-medium">Fait maison à Angers</span>
            </div>
            
            <p className="text-xl text-amber-700 max-w-2xl mx-auto mb-8">
              Tiramisus artisanaux faits maison, préparés avec amour chaque jour. 
              Livraison à domicile dans tout Angers !
            </p>

            <div className="flex flex-wrap justify-center gap-6 text-amber-800">
              <div className="flex items-center gap-2">
                <ChefHat className="w-6 h-6 text-rose-500" />
                <span>Fait maison</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-6 h-6 text-rose-500" />
                <span>Livraison rapide</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="w-6 h-6 text-rose-500" />
                <span>Avec amour</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Catalogue */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Gamme Signature */}
        <section className="mb-16">
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-3xl font-bold text-amber-900">
              La Gamme Signature
            </h2>
            <span className="bg-rose-400 text-white px-4 py-1 rounded-full text-sm font-semibold">
              10€
            </span>
          </div>
          <p className="text-amber-700 mb-6 max-w-2xl">
            Nos tiramisus en format généreux, parfaits pour se faire plaisir ou partager un moment gourmand.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {gammeSignature.map((product) => (
              <ProductCard key={product.id} product={product} type="tiramisu" />
            ))}
          </div>
        </section>

        {/* Gamme Mini */}
        <section className="mb-16">
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-3xl font-bold text-amber-900">
              Les Mini M
            </h2>
            <span className="bg-amber-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
              5,00€
            </span>
          </div>
          <p className="text-amber-700 mb-6 max-w-2xl">
            Format parfait pour une petite pause gourmande ou pour goûter plusieurs saveurs !
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {gammeMini.map((product) => (
              <ProductCard key={product.id} product={product} type="tiramisu" />
            ))}
          </div>
        </section>

        {/* Boissons */}
        <section>
          <h2 className="text-3xl font-bold text-amber-900 mb-8">
            Les Boissons 🥤
          </h2>
          <p className="text-amber-700 mb-6 max-w-2xl">
            Accompagnez votre tiramisu d'une boisson fraîche !
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {boissons.map((boisson) => (
              <BoissonCard key={boisson.id} boisson={boisson} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
