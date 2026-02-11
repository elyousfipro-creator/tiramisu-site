import { Link } from 'react-router-dom';
import { Instagram, Mail, Clock, MapPin, CreditCard } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-amber-900 text-amber-100 mt-16">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo et description */}
          <div className="md:col-span-1">
            <h3 className="text-2xl font-bold text-white mb-4">Crème et Cookies</h3>
            <p className="text-amber-200 text-sm">
              Tiramisus artisanaux faits maison avec amour à Angers. Chaque création est unique !
            </p>
          </div>

          {/* Horaires */}
          <div>
            <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Horaires
            </h4>
            <p className="text-amber-200">Lundi - Dimanche</p>
            <p className="text-white font-medium">18h00 - 00h00</p>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-white mb-4">Nous contacter</h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="https://instagram.com/creme.et" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-rose-300 transition-colors"
                >
                  <Instagram className="w-5 h-5" />
                  @creme.et.cookies
                </a>
              </li>
              <li>
                <a
                  href="https://snapchat.com/add/cremeetcookiess"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-rose-300 transition-colors"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.206.793c.99 0 4.347.276 5.93 3.821.529 1.193.403 3.219.299 4.847l-.003.06c-.012.18-.022.345-.03.51.075.045.203.09.401.09.3-.016.659-.12 1.033-.301.165-.088.344-.104.464-.104.182 0 .359.029.509.09.45.149.734.479.734.838.015.449-.39.839-1.213 1.168-.089.029-.209.075-.344.119-.45.135-1.139.36-1.333.81-.09.224-.061.524.12.868l.015.015c.06.136 1.526 3.475 4.791 4.014.255.044.435.27.42.509 0 .075-.015.149-.045.225-.24.569-1.273.988-3.146 1.271-.059.091-.12.375-.164.57-.029.179-.074.36-.134.553-.076.271-.27.405-.555.405h-.03c-.135 0-.313-.031-.538-.074-.36-.075-.765-.135-1.273-.135-.3 0-.599.015-.913.074-.6.104-1.123.464-1.723.884-.853.599-1.826 1.288-3.294 1.288-.06 0-.119-.015-.18-.015h-.149c-1.468 0-2.427-.675-3.279-1.288-.599-.42-1.107-.779-1.707-.884-.314-.045-.629-.074-.928-.074-.54 0-.958.089-1.272.149-.211.043-.391.074-.54.074-.374 0-.523-.224-.583-.42-.061-.192-.09-.389-.135-.567-.046-.181-.105-.494-.166-.57-1.918-.222-2.95-.642-3.189-1.226-.031-.063-.052-.15-.055-.225-.015-.243.165-.465.42-.509 3.264-.54 4.73-3.879 4.791-4.02l.016-.029c.18-.345.224-.645.119-.869-.195-.434-.884-.658-1.332-.809-.121-.029-.24-.074-.346-.119-.809-.329-1.224-.72-1.227-1.153-.015-.359.284-.69.733-.848.165-.06.374-.09.57-.09.12 0 .313.031.449.103.388.181.747.286 1.048.302.194 0 .313-.045.388-.091-.03-.165-.044-.33-.06-.51l-.004-.06c-.104-1.627-.225-3.654.304-4.847C7.862 1.054 11.216.793 12.206.793z"/>
                  </svg>
                  cremeetcookiess
                </a>
              </li>
              <li>
                <a
                  href="mailto:cremeetcookiess@gmail.com"
                  className="flex items-center gap-2 hover:text-rose-300 transition-colors"
                >
                  <Mail className="w-5 h-5" />
                  cremeetcookiess@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-2 text-amber-200">
                <MapPin className="w-5 h-5" />
                Angers, 49100
              </li>
            </ul>
          </div>

          {/* Paiements & Liens */}
          <div>
            <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Moyens de paiement
            </h4>
            <ul className="space-y-2 text-amber-200 mb-6">
              <li>💵 Espèces</li>
              <li>🅿️ PayPal</li>
            </ul>
            
            <div className="space-y-2">
              <Link
                to="/fidelite"
                className="block hover:text-rose-300 transition-colors"
              >
                🎁 Carte de fidélité
              </Link>
              <Link
                to="/conditions"
                className="block hover:text-rose-300 transition-colors text-sm"
              >
                Conditions d'utilisation
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-amber-800 mt-8 pt-8 text-center text-amber-300 text-sm">
          <p>© {new Date().getFullYear()} Crème et Cookies - Tous droits réservés</p>
          <p className="mt-2">Fait avec ❤️ à Angers</p>
        </div>
      </div>
    </footer>
  );
}
