import { MapPin, Phone, Instagram, Clock, Cookie } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-creme-brun text-white mt-16">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo & Description */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-creme-rose rounded-full flex items-center justify-center">
                <Cookie className="w-5 h-5 text-white" />
              </div>
              <span className="font-display text-xl font-bold">Crème & Cookies</span>
            </div>
            <p className="text-creme-beige text-sm">
              Tiramisus artisanaux préparés avec amour à Angers. 
              Des recettes originales pour tous les gourmands.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display text-lg font-semibold mb-4">Contact</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-creme-rose" />
                <span>7 rue Marcel Cerdan, 49100 Angers</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-creme-rose" />
                <span>06 XX XX XX XX</span>
              </div>
              <div className="flex items-center gap-3">
                <Instagram className="w-4 h-4 text-creme-rose" />
                <a href="#" className="hover:text-creme-rose transition-colors">
                  @cremeetcookies
                </a>
              </div>
            </div>
          </div>

          {/* Horaires */}
          <div>
            <h4 className="font-display text-lg font-semibold mb-4">Horaires de livraison</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-creme-rose" />
                <div>
                  <p>Lundi - Vendredi : 18h - 22h</p>
                  <p>Samedi - Dimanche : 14h - 22h</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/20 mt-8 pt-8 text-center text-sm text-creme-beige">
          <p>© {new Date().getFullYear()} Crème & Cookies. Tous droits réservés.</p>
          <p className="mt-1">Fait avec 💗 à Angers</p>
        </div>
      </div>
    </footer>
  );
}
