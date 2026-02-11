import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export function ConditionsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-amber-600 hover:text-amber-800 mb-8"
      >
        <ArrowLeft className="w-5 h-5" />
        Retour à l'accueil
      </Link>

      <h1 className="text-4xl font-bold text-amber-900 mb-8">
        Conditions Générales d'Utilisation
      </h1>

      <div className="prose prose-amber max-w-none space-y-8 text-amber-800">
        <section>
          <h2 className="text-2xl font-semibold text-amber-900 mb-4">
            1. Présentation
          </h2>
          <p>
            Le site Crème et Cookies est une plateforme de commande en ligne de tiramisus artisanaux, 
            exploitée par Crème et Cookies, située à Angers (49100). En passant commande sur notre site, 
            vous acceptez les présentes conditions générales d'utilisation.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-amber-900 mb-4">
            2. Produits et Commandes
          </h2>
          <p>
            Nos tiramisus sont des produits frais, faits maison et préparés le jour même de la livraison. 
            Les photos présentes sur le site sont non contractuelles et peuvent légèrement différer du produit final.
          </p>
          <p className="mt-2">
            Les commandes sont soumises à disponibilité et peuvent être refusées en cas de stock insuffisant. 
            Nous vous préviendrons dans ce cas dans les plus brefs délais.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-amber-900 mb-4">
            3. Prix et Paiement
          </h2>
          <p>Les prix affichés sont en euros (€) et TTC. Nous acceptons les moyens de paiement suivants :</p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Espèces (à la livraison)</li>
            <li>PayPal (lien envoyé par email)</li>
          </ul>
          <p className="mt-2">
            En cas de paiement par PayPal, un lien de paiement vous sera envoyé après validation de votre commande.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-amber-900 mb-4">
            4. Livraison
          </h2>
          <p>
            Nous livrons dans Angers et ses environs proches. Les livraisons sont effectuées du lundi au dimanche, 
            de 18h00 à 00h00.
          </p>
          <p className="mt-2">
            Le délai de livraison estimé vous sera communiqué lors de la confirmation de commande. 
            En cas de retard significatif, nous vous contacterons pour vous tenir informé.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-amber-900 mb-4">
            5. Annulation et Remboursement
          </h2>
          <p>
            Étant donné la nature périssable de nos produits, les annulations doivent être effectuées au moins 
            2 heures avant le créneau de livraison prévu.
          </p>
          <p className="mt-2">
            En cas de problème avec votre commande (produit endommagé, erreur de commande), 
            veuillez nous contacter dans les 24 heures suivant la livraison à cremeetcookiess@gmail.com.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-amber-900 mb-4">
            6. Programme de Fidélité
          </h2>
          <p>
            Notre programme de fidélité vous permet de cumuler des tampons à chaque achat. 
            Après 10 tiramisus achetés (peu importe la taille), le 11ème tiramisu de votre choix vous est offert.
          </p>
          <p className="mt-2">
            Les tampons sont nominatifs et non transférables. Ils n'ont pas de date d'expiration.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-amber-900 mb-4">
            7. Allergènes
          </h2>
          <p>
            Nos tiramisus contiennent des allergènes courants (œufs, lait, gluten). 
            Pour toute allergie spécifique, veuillez nous contacter avant de passer commande.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-amber-900 mb-4">
            8. Protection des Données
          </h2>
          <p>
            Les informations collectées lors de votre commande sont utilisées uniquement pour le traitement 
            de celle-ci et ne sont jamais partagées avec des tiers. Conformément à la loi RGPD, vous pouvez 
            demander la suppression de vos données à tout moment.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-amber-900 mb-4">
            9. Contact
          </h2>
          <p>Pour toute question concernant ces conditions ou votre commande :</p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Email : cremeetcookiess@gmail.com</li>
            <li>Instagram : @creme.et.cookies</li>
            <li>Snapchat : cremeetcookiess</li>
          </ul>
        </section>

        <section className="bg-amber-50 p-6 rounded-xl">
          <p className="text-sm text-amber-600">
            Dernière mise à jour : {new Date().toLocaleDateString('fr-FR', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </section>
      </div>
    </div>
  );
}
