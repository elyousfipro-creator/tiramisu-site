import { Link } from 'react-router-dom';
import { Award, Gift, Star, Crown, ChevronRight, Check, Lock, Sparkles, Cookie } from 'lucide-react';
import { useStore } from '@/store/useStore';
import type { CarteFidelite } from '@/types';

const carteInfos: Record<CarteFidelite, { nom: string; couleur: string; bgCouleur: string; icon: React.ReactNode; recompense: string }> = {
  bronze: {
    nom: 'Bronze',
    couleur: 'text-amber-700',
    bgCouleur: 'bg-gradient-to-br from-amber-200 to-amber-400',
    icon: <Award className="w-12 h-12" />,
    recompense: '1 Cookie offert',
  },
  argent: {
    nom: 'Argent',
    couleur: 'text-gray-500',
    bgCouleur: 'bg-gradient-to-br from-gray-200 to-gray-400',
    icon: <Star className="w-12 h-12" />,
    recompense: '1 Mini Tiramisu gratuit',
  },
  or: {
    nom: 'Or',
    couleur: 'text-yellow-500',
    bgCouleur: 'bg-gradient-to-br from-yellow-300 to-yellow-500',
    icon: <Crown className="w-12 h-12" />,
    recompense: '1 Tiramisu XL au choix',
  },
};

export function FidelitePage() {
  const { user, isAuthenticated, login } = useStore();

  const fidelite = user?.fidelite || {
    carteCourante: 'bronze' as CarteFidelite,
    commandesDefi: 0,
    recompenseDisponible: false,
    recompensesUtilisees: { cookieGratuit: 0, miniTiramisuGratuit: 0, tiramisuXLGratuit: 0 },
  };

  const carteActuelle = carteInfos[fidelite.carteCourante];
  const progression = (fidelite.commandesDefi / 6) * 100;

  const handleClaimReward = (choice: 'promo' | 'upgrade') => {
    if (!user) return;

    const newFidelite = { ...fidelite };

    if (choice === 'promo') {
      // Prendre la récompense du niveau actuel
      if (fidelite.carteCourante === 'bronze') {
        newFidelite.recompensesUtilisees.cookieGratuit += 1;
      } else if (fidelite.carteCourante === 'argent') {
        newFidelite.recompensesUtilisees.miniTiramisuGratuit += 1;
      } else if (fidelite.carteCourante === 'or') {
        newFidelite.recompensesUtilisees.tiramisuXLGratuit += 1;
      }
      newFidelite.commandesDefi = 0;
      newFidelite.recompenseDisponible = false;
    } else {
      // Passer au niveau supérieur
      if (fidelite.carteCourante === 'bronze') {
        newFidelite.carteCourante = 'argent';
      } else if (fidelite.carteCourante === 'argent') {
        newFidelite.carteCourante = 'or';
      }
      newFidelite.commandesDefi = 0;
      newFidelite.recompenseDisponible = false;
    }

    login({ ...user, fidelite: newFidelite });
  };

  const getNextCardInfo = () => {
    if (fidelite.carteCourante === 'bronze') return carteInfos.argent;
    if (fidelite.carteCourante === 'argent') return carteInfos.or;
    return null;
  };

  const nextCard = getNextCardInfo();

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-rose-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-rose-400 rounded-full mb-4">
            <Gift className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-amber-900 mb-2">Programme Fidélité</h1>
          <p className="text-amber-600">Gagnez des récompenses à chaque commande !</p>
        </div>

        {!isAuthenticated ? (
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <Lock className="w-16 h-16 text-amber-300 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-amber-900 mb-2">Connectez-vous</h2>
            <p className="text-amber-600 mb-6">
              Créez un compte pour profiter du programme de fidélité
            </p>
            <Link
              to="/connexion"
              className="inline-block bg-rose-400 text-white px-8 py-3 rounded-xl font-semibold hover:bg-rose-500 transition-colors"
            >
              Se connecter
            </Link>
          </div>
        ) : (
          <>
            {/* Carte de fidélité actuelle */}
            <div className={`${carteActuelle.bgCouleur} rounded-3xl p-6 shadow-2xl mb-8 relative overflow-hidden`}>
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-white/80 text-sm">Carte de fidélité</p>
                    <h2 className="text-2xl font-bold text-white">Niveau {carteActuelle.nom}</h2>
                  </div>
                  <div className="text-white">
                    {carteActuelle.icon}
                  </div>
                </div>

                <div className="bg-white/20 rounded-full p-1 mb-4">
                  <div className="bg-white/30 rounded-full h-4 overflow-hidden">
                    <div
                      className="h-full bg-white rounded-full transition-all duration-500"
                      style={{ width: `${progression}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-white">
                  <span>{fidelite.commandesDefi}/6 commandes</span>
                  <span className="flex items-center gap-1">
                    <Sparkles className="w-4 h-4" />
                    {6 - fidelite.commandesDefi} restantes
                  </span>
                </div>

                {user && (
                  <div className="mt-4 pt-4 border-t border-white/20">
                    <p className="text-white/80 text-sm">{user.nom}</p>
                    <p className="text-white text-xs">{user.email}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Récompense disponible */}
            {fidelite.recompenseDisponible && (
              <div className="bg-gradient-to-r from-rose-400 to-pink-400 rounded-2xl p-6 mb-8 shadow-lg">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center">
                    <Gift className="w-8 h-8 text-rose-500" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">🎉 Félicitations !</h3>
                    <p className="text-white/90">Vous avez complété votre défi !</p>
                  </div>
                </div>

                <div className="grid gap-3">
                  <button
                    onClick={() => handleClaimReward('promo')}
                    className="w-full bg-white text-rose-500 py-4 rounded-xl font-semibold hover:bg-rose-50 transition-colors flex items-center justify-center gap-2"
                  >
                    <Cookie className="w-5 h-5" />
                    Récupérer : {carteActuelle.recompense}
                  </button>
                  
                  {nextCard && (
                    <button
                      onClick={() => handleClaimReward('upgrade')}
                      className="w-full bg-white/20 text-white py-4 rounded-xl font-semibold hover:bg-white/30 transition-colors flex items-center justify-center gap-2 border-2 border-white/50"
                    >
                      <Crown className="w-5 h-5" />
                      Passer à la Carte {nextCard.nom}
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Explication des niveaux */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
              <h3 className="text-xl font-bold text-amber-900 mb-6 flex items-center gap-2">
                <Award className="w-6 h-6 text-rose-400" />
                Les Niveaux de Fidélité
              </h3>

              <div className="space-y-4">
                {/* Bronze */}
                <div className={`p-4 rounded-xl border-2 ${fidelite.carteCourante === 'bronze' ? 'border-amber-400 bg-amber-50' : 'border-gray-200'}`}>
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full ${carteInfos.bronze.bgCouleur} flex items-center justify-center text-white`}>
                      <Award className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-amber-900">Carte Bronze</h4>
                        {fidelite.carteCourante === 'bronze' && (
                          <span className="bg-amber-200 text-amber-800 text-xs px-2 py-0.5 rounded-full">Actuel</span>
                        )}
                        {(fidelite.carteCourante === 'argent' || fidelite.carteCourante === 'or') && (
                          <Check className="w-5 h-5 text-green-500" />
                        )}
                      </div>
                      <p className="text-sm text-amber-600">6 commandes → 1 Cookie offert</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-amber-400" />
                  </div>
                </div>

                {/* Argent */}
                <div className={`p-4 rounded-xl border-2 ${fidelite.carteCourante === 'argent' ? 'border-gray-400 bg-gray-50' : fidelite.carteCourante === 'or' ? 'border-gray-200' : 'border-gray-200 opacity-60'}`}>
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full ${carteInfos.argent.bgCouleur} flex items-center justify-center text-white`}>
                      <Star className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-amber-900">Carte Argent</h4>
                        {fidelite.carteCourante === 'argent' && (
                          <span className="bg-gray-300 text-gray-700 text-xs px-2 py-0.5 rounded-full">Actuel</span>
                        )}
                        {fidelite.carteCourante === 'or' && (
                          <Check className="w-5 h-5 text-green-500" />
                        )}
                        {fidelite.carteCourante === 'bronze' && (
                          <Lock className="w-4 h-4 text-gray-400" />
                        )}
                      </div>
                      <p className="text-sm text-amber-600">6 commandes → 1 Mini Tiramisu gratuit</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                </div>

                {/* Or */}
                <div className={`p-4 rounded-xl border-2 ${fidelite.carteCourante === 'or' ? 'border-yellow-400 bg-yellow-50' : 'border-gray-200 opacity-60'}`}>
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full ${carteInfos.or.bgCouleur} flex items-center justify-center text-white`}>
                      <Crown className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-amber-900">Carte Or</h4>
                        {fidelite.carteCourante === 'or' && (
                          <span className="bg-yellow-300 text-yellow-800 text-xs px-2 py-0.5 rounded-full">Actuel</span>
                        )}
                        {fidelite.carteCourante !== 'or' && (
                          <Lock className="w-4 h-4 text-gray-400" />
                        )}
                      </div>
                      <p className="text-sm text-amber-600">6 commandes → 1 Tiramisu XL au choix</p>
                    </div>
                    <Crown className="w-5 h-5 text-yellow-500" />
                  </div>
                </div>
              </div>
            </div>

            {/* Comment ça marche */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
              <h3 className="text-xl font-bold text-amber-900 mb-4">Comment ça marche ?</h3>
              
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-rose-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-rose-500 font-bold">1</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-amber-900">Commandez vos tiramisus</h4>
                    <p className="text-sm text-amber-600">Chaque commande validée compte pour votre défi</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-rose-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-rose-500 font-bold">2</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-amber-900">Complétez 6 commandes</h4>
                    <p className="text-sm text-amber-600">Une fois les 6 commandes atteintes, vous débloquez votre récompense</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-rose-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-rose-500 font-bold">3</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-amber-900">Choisissez votre récompense</h4>
                    <p className="text-sm text-amber-600">Prenez la promo immédiate OU passez au niveau supérieur pour une meilleure récompense</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Historique des récompenses */}
            {(fidelite.recompensesUtilisees.cookieGratuit > 0 || 
              fidelite.recompensesUtilisees.miniTiramisuGratuit > 0 || 
              fidelite.recompensesUtilisees.tiramisuXLGratuit > 0) && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-amber-900 mb-4">Vos récompenses obtenues</h3>
                <div className="space-y-2">
                  {fidelite.recompensesUtilisees.cookieGratuit > 0 && (
                    <div className="flex items-center justify-between p-3 bg-amber-50 rounded-xl">
                      <span className="text-amber-800">Cookies offerts</span>
                      <span className="font-bold text-amber-600">x{fidelite.recompensesUtilisees.cookieGratuit}</span>
                    </div>
                  )}
                  {fidelite.recompensesUtilisees.miniTiramisuGratuit > 0 && (
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                      <span className="text-gray-800">Mini Tiramisus gratuits</span>
                      <span className="font-bold text-gray-600">x{fidelite.recompensesUtilisees.miniTiramisuGratuit}</span>
                    </div>
                  )}
                  {fidelite.recompensesUtilisees.tiramisuXLGratuit > 0 && (
                    <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-xl">
                      <span className="text-yellow-800">Tiramisus XL gratuits</span>
                      <span className="font-bold text-yellow-600">x{fidelite.recompensesUtilisees.tiramisuXLGratuit}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}

        {/* Règlement */}
        <div className="mt-8 p-4 bg-white/50 rounded-xl">
          <h4 className="font-semibold text-amber-900 mb-2">Règlement du programme</h4>
          <ul className="text-xs text-amber-600 space-y-1">
            <li>• 1 commande validée = 1 point vers votre défi (peu importe le montant)</li>
            <li>• Il faut 6 commandes pour compléter un défi</li>
            <li>• À chaque défi complété, choisissez entre la récompense ou le niveau supérieur</li>
            <li>• Les récompenses sont valables 3 mois après obtention</li>
            <li>• Non cumulable avec d'autres offres en cours</li>
            <li>• Crème et Cookies se réserve le droit de modifier ce programme</li>
          </ul>
        </div>

        {/* Bouton retour */}
        <div className="mt-8 text-center">
          <Link
            to="/"
            className="inline-block bg-rose-400 text-white px-8 py-3 rounded-xl font-semibold hover:bg-rose-500 transition-colors"
          >
            Commander maintenant
          </Link>
        </div>
      </div>
    </div>
  );
}
