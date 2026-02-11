import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Truck, MapPin, Phone, CheckCircle, Navigation, Package, Camera } from 'lucide-react';
import { useStore, ADRESSE_DEPART } from '@/store/useStore';
import { tiramisus, boissons } from '@/data/products';

export function LivraisonPage() {
  const { user, isAuthenticated, commandes, updateCommandeStatut, assignLivreur, updateLivreurPosition } = useStore();
  const [signatureMode, setSignatureMode] = useState<string | null>(null);

  if (!isAuthenticated || !user || !['admin', 'livreur'].includes(user.role)) {
    return <Navigate to="/connexion" replace />;
  }

  const commandesPretes = commandes.filter((c) => c.statut === 'prete');
  const commandesEnLivraison = commandes.filter((c) => c.statut === 'livraison' && c.livreurId === user.id);
  const commandesLivrees = commandes.filter(
    (c) => c.statut === 'livree' && c.livreurId === user.id
  ).slice(0, 5);

  const getProduct = (productId: string, type: 'tiramisu' | 'boisson') => {
    if (type === 'tiramisu') {
      return tiramisus.find((p) => p.id === productId);
    }
    return boissons.find((b) => b.id === productId);
  };

  const handlePrendreCommande = (commandeId: string) => {
    assignLivreur(commandeId, user.id);
    updateCommandeStatut(commandeId, 'livraison');
    // Simulation de position initiale
    updateLivreurPosition(commandeId, { lat: ADRESSE_DEPART.lat, lng: ADRESSE_DEPART.lng });
  };

  const handleMarquerLivree = (commandeId: string) => {
    updateCommandeStatut(commandeId, 'livree');
    setSignatureMode(null);
  };

  const openMaps = (adresse: string) => {
    const url = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(ADRESSE_DEPART.adresse)}&destination=${encodeURIComponent(adresse)}&travelmode=driving`;
    window.open(url, '_blank');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
          <Truck className="w-7 h-7 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-amber-900">Livraisons</h1>
          <p className="text-amber-600">Bonjour {user.nom} - Départ: {ADRESSE_DEPART.adresse}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* À récupérer */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse" />
            <h2 className="font-bold text-lg text-amber-900">
              À récupérer ({commandesPretes.length})
            </h2>
          </div>
          <div className="space-y-4">
            {commandesPretes.length === 0 ? (
              <p className="text-amber-500 text-center py-8 bg-amber-50 rounded-xl">
                Aucune commande prête
              </p>
            ) : (
              commandesPretes.map((c) => (
                <div key={c.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
                  <div className="bg-green-500 text-white p-3">
                    <p className="font-bold">{c.id}</p>
                    <p className="text-green-100 text-sm">Créneau: {c.creneauHoraire}</p>
                  </div>
                  <div className="p-4">
                    <div className="flex items-start gap-2 text-amber-700 mb-3">
                      <MapPin className="w-5 h-5 mt-0.5 text-rose-500" />
                      <p className="text-sm">{c.adresseLivraison}</p>
                    </div>
                    <div className="flex items-center gap-2 text-amber-700 mb-4">
                      <Phone className="w-5 h-5 text-rose-500" />
                      <p className="text-sm">{c.clientTelephone}</p>
                    </div>
                    <div className="bg-amber-50 rounded-lg p-2 mb-4">
                      <p className="text-amber-700 text-xs mb-1">Contenu:</p>
                      {c.items.map((item) => {
                        const product = getProduct(item.productId, item.type);
                        return product ? (
                          <span key={item.productId} className="text-amber-900 text-sm mr-2">
                            {item.quantite}x {product.nom}
                          </span>
                        ) : null;
                      })}
                    </div>
                    <button
                      onClick={() => handlePrendreCommande(c.id)}
                      className="w-full bg-blue-500 text-white py-2 rounded-lg font-semibold hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
                    >
                      <Package className="w-5 h-5" />
                      Récupérer
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* En cours de livraison */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-4 h-4 bg-blue-500 rounded-full animate-pulse" />
            <h2 className="font-bold text-lg text-amber-900">
              En cours ({commandesEnLivraison.length})
            </h2>
          </div>
          <div className="space-y-4">
            {commandesEnLivraison.length === 0 ? (
              <p className="text-amber-500 text-center py-8 bg-amber-50 rounded-xl">
                Aucune livraison en cours
              </p>
            ) : (
              commandesEnLivraison.map((c) => (
                <div key={c.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
                  <div className="bg-blue-500 text-white p-3">
                    <p className="font-bold">{c.id}</p>
                    <p className="text-blue-100 text-sm">{c.clientNom}</p>
                  </div>
                  <div className="p-4">
                    <div className="flex items-start gap-2 text-amber-700 mb-3">
                      <MapPin className="w-5 h-5 mt-0.5 text-rose-500" />
                      <p className="text-sm font-medium">{c.adresseLivraison}</p>
                    </div>
                    <a
                      href={`tel:${c.clientTelephone}`}
                      className="flex items-center gap-2 text-blue-600 mb-4 hover:underline"
                    >
                      <Phone className="w-5 h-5" />
                      <span>{c.clientTelephone}</span>
                    </a>

                    <button
                      onClick={() => openMaps(c.adresseLivraison)}
                      className="w-full bg-green-500 text-white py-2 rounded-lg font-semibold hover:bg-green-600 transition-colors flex items-center justify-center gap-2 mb-2"
                    >
                      <Navigation className="w-5 h-5" />
                      Ouvrir GPS
                    </button>

                    {signatureMode === c.id ? (
                      <div className="border-2 border-dashed border-amber-300 rounded-lg p-4 bg-amber-50">
                        <p className="text-amber-700 text-center mb-3 text-sm">
                          Zone de signature (simulation)
                        </p>
                        <div className="h-24 bg-white rounded-lg border border-amber-200 mb-3 flex items-center justify-center text-amber-400">
                          Signature du client
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setSignatureMode(null)}
                            className="flex-1 border border-amber-300 text-amber-700 py-2 rounded-lg"
                          >
                            Annuler
                          </button>
                          <button
                            onClick={() => handleMarquerLivree(c.id)}
                            className="flex-1 bg-green-500 text-white py-2 rounded-lg font-semibold"
                          >
                            Confirmer
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <button
                          className="flex-1 border border-amber-300 text-amber-700 py-2 rounded-lg flex items-center justify-center gap-1"
                        >
                          <Camera className="w-4 h-4" />
                          Photo
                        </button>
                        <button
                          onClick={() => setSignatureMode(c.id)}
                          className="flex-1 bg-rose-500 text-white py-2 rounded-lg font-semibold flex items-center justify-center gap-1"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Livré
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Livrées */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-4 h-4 bg-gray-400 rounded-full" />
            <h2 className="font-bold text-lg text-amber-900">
              Livrées aujourd'hui ({commandesLivrees.length})
            </h2>
          </div>
          <div className="space-y-4">
            {commandesLivrees.length === 0 ? (
              <p className="text-amber-500 text-center py-8 bg-amber-50 rounded-xl">
                Aucune livraison terminée
              </p>
            ) : (
              commandesLivrees.map((c) => (
                <div key={c.id} className="bg-gray-50 rounded-xl p-4 opacity-75">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-semibold text-gray-700">{c.id}</p>
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">
                      ✓ Livrée
                    </span>
                  </div>
                  <p className="text-gray-500 text-sm">{c.clientNom}</p>
                  <p className="text-gray-400 text-xs mt-1">{c.adresseLivraison}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
