import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ProductCard } from '@/components/ProductCard';
import { tiramisusLarge, tiramisusMini, boissons, FREE_DELIVERY_THRESHOLD } from '@/data/products';
import { ChevronDown, Truck, Heart, Clock } from 'lucide-react';

export function HomePage() {
  const scrollToProducts = () => {
    document.getElementById('produits')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-creme-beige-light">
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-creme-rose-light via-white to-creme-beige min-h-[70vh] flex items-center">
        <div className="max-w-6xl mx-auto px-4 py-16 grid md:grid-cols-2 gap-8 items-center">
          <div className="text-center md:text-left">
            <span className="inline-block px-4 py-1 bg-creme-rose/20 text-creme-brun rounded-full text-sm font-medium mb-4">
              🍪 Nouveau à Angers
            </span>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-creme-brun mb-4 leading-tight">
              Des Tiramisus{' '}
              <span className="text-creme-rose">gourmands</span>{' '}
              livrés chez vous
            </h1>
            <p className="text-lg text-creme-brun-light mb-8 max-w-lg">
              Découvrez nos créations artisanales : Cookies, Kinder, Speculoos, Oreo... 
              Préparés avec amour et livrés frais à votre porte.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <button
                onClick={scrollToProducts}
                className="px-8 py-4 bg-creme-rose hover:bg-creme-rose-dark text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
              >
                Voir la carte
              </button>
              <a
                href="#boissons"
                className="px-8 py-4 bg-white hover:bg-creme-beige text-creme-brun font-semibold rounded-full shadow-md hover:shadow-lg transition-all"
              >
                Nos boissons
              </a>
            </div>
          </div>
          <div className="relative hidden md:block">
            <div className="relative z-10">
              <img
                src="https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=600&h=500&fit=crop"
                alt="Tiramisu artisanal"
                className="rounded-3xl shadow-2xl transform rotate-2 hover:rotate-0 transition-transform duration-500"
              />
            </div>
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-creme-rose rounded-full opacity-50" />
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-creme-beige rounded-full opacity-70" />
          </div>
        </div>
        
        <button
          onClick={scrollToProducts}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce"
        >
          <ChevronDown className="w-8 h-8 text-creme-rose" />
        </button>
      </section>

      {/* Features */}
      <section className="py-12 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center gap-4 p-6 bg-creme-beige-light rounded-2xl">
              <div className="w-12 h-12 bg-creme-rose/20 rounded-full flex items-center justify-center">
                <Truck className="w-6 h-6 text-creme-rose" />
              </div>
              <div>
                <h3 className="font-semibold text-creme-brun">Livraison offerte</h3>
                <p className="text-sm text-gray-600">Dès {FREE_DELIVERY_THRESHOLD}€ d'achat</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-6 bg-creme-beige-light rounded-2xl">
              <div className="w-12 h-12 bg-creme-rose/20 rounded-full flex items-center justify-center">
                <Heart className="w-6 h-6 text-creme-rose" />
              </div>
              <div>
                <h3 className="font-semibold text-creme-brun">Fait maison</h3>
                <p className="text-sm text-gray-600">Préparé avec amour</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-6 bg-creme-beige-light rounded-2xl">
              <div className="w-12 h-12 bg-creme-rose/20 rounded-full flex items-center justify-center">
                <Clock className="w-6 h-6 text-creme-rose" />
              </div>
              <div>
                <h3 className="font-semibold text-creme-brun">Suivi en temps réel</h3>
                <p className="text-sm text-gray-600">De la cuisine à votre porte</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gamme Signature */}
      <section id="produits" className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-creme-rose font-medium">Notre sélection</span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-creme-brun mt-2">
              La Gamme Signature
            </h2>
            <p className="text-gray-600 mt-2">Nos tiramisus généreux à 7,50€</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {tiramisusLarge.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Gamme Mini */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-creme-rose font-medium">Format pocket</span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-creme-brun mt-2">
              Les Mini M
            </h2>
            <p className="text-gray-600 mt-2">Petits mais tout aussi gourmands à 5€</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {tiramisusMini.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Boissons */}
      <section id="boissons" className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-creme-rose font-medium">Pour accompagner</span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-creme-brun mt-2">
              Nos Boissons
            </h2>
            <p className="text-gray-600 mt-2">Le parfait combo avec votre tiramisu</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {boissons.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
