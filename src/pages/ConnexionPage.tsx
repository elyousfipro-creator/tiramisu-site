import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Phone, MapPin, Eye, EyeOff } from 'lucide-react';
import { useStore, demoUsers, createDefaultFidelite } from '@/store/useStore';
import type { User as UserType } from '@/types';

export function ConnexionPage() {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nom, setNom] = useState('');
  const [telephone, setTelephone] = useState('');
  const [adresse, setAdresse] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simulation d'authentification
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (mode === 'login') {
      // Vérifier les comptes démo (staff)
      const demoUser = demoUsers.find((u) => u.email === email);
      if (demoUser && password === 'demo123') {
        login(demoUser);
        switch (demoUser.role) {
          case 'admin':
            navigate('/dashboard');
            break;
          case 'cuisine':
            navigate('/dashboard/cuisine');
            break;
          case 'livreur':
            navigate('/dashboard/livraison');
            break;
          default:
            navigate('/');
        }
        return;
      }

      // Client régulier (simulation)
      if (email && password.length >= 6) {
        const clientUser: UserType = {
          id: `client-${Date.now()}`,
          email,
          nom: email.split('@')[0],
          telephone: '',
          adresse: '',
          role: 'client',
          pointsFidelite: 0,
          fidelite: createDefaultFidelite(),
        };
        login(clientUser);
        navigate('/mon-compte');
      } else {
        setError('Email ou mot de passe incorrect');
      }
    } else {
      // Inscription
      if (!nom || !email || !telephone || !adresse || password.length < 6) {
        setError('Veuillez remplir tous les champs (mot de passe minimum 6 caractères)');
        setLoading(false);
        return;
      }

      const newUser: UserType = {
        id: `client-${Date.now()}`,
        email,
        nom,
        telephone,
        adresse,
        role: 'client',
        pointsFidelite: 0,
        fidelite: createDefaultFidelite(),
      };
      login(newUser);
      navigate('/mon-compte');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-amber-900 mb-2">
            {mode === 'login' ? 'Connexion' : 'Créer un compte'}
          </h1>
          <p className="text-amber-600">
            {mode === 'login'
              ? 'Connectez-vous pour passer commande'
              : 'Rejoignez-nous pour commander vos tiramisus préférés'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-400" />
                <input
                  type="text"
                  placeholder="Votre nom"
                  value={nom}
                  onChange={(e) => setNom(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-amber-200 rounded-xl focus:ring-2 focus:ring-rose-300 focus:border-rose-400 outline-none transition-all"
                />
              </div>

              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-400" />
                <input
                  type="tel"
                  placeholder="Téléphone (06...)"
                  value={telephone}
                  onChange={(e) => setTelephone(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-amber-200 rounded-xl focus:ring-2 focus:ring-rose-300 focus:border-rose-400 outline-none transition-all"
                />
              </div>

              <div className="relative">
                <MapPin className="absolute left-3 top-3 w-5 h-5 text-amber-400" />
                <textarea
                  placeholder="Adresse de livraison complète"
                  value={adresse}
                  onChange={(e) => setAdresse(e.target.value)}
                  rows={2}
                  className="w-full pl-12 pr-4 py-3 border border-amber-200 rounded-xl focus:ring-2 focus:ring-rose-300 focus:border-rose-400 outline-none transition-all resize-none"
                />
              </div>
            </>
          )}

          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-400" />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-amber-200 rounded-xl focus:ring-2 focus:ring-rose-300 focus:border-rose-400 outline-none transition-all"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-12 pr-12 py-3 border border-amber-200 rounded-xl focus:ring-2 focus:ring-rose-300 focus:border-rose-400 outline-none transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-amber-400 hover:text-amber-600"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center bg-red-50 py-2 rounded-lg">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-rose-400 text-white py-3 rounded-xl font-semibold hover:bg-rose-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Chargement...' : mode === 'login' ? 'Se connecter' : "S'inscrire"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => {
              setMode(mode === 'login' ? 'register' : 'login');
              setError('');
            }}
            className="text-amber-600 hover:text-rose-500 transition-colors"
          >
            {mode === 'login'
              ? "Pas encore de compte ? S'inscrire"
              : 'Déjà un compte ? Se connecter'}
          </button>
        </div>

        {mode === 'login' && (
          <div className="mt-8 pt-6 border-t border-amber-100">
            <p className="text-xs text-amber-500 text-center mb-3">
              Comptes de démonstration (mot de passe: demo123)
            </p>
            <div className="flex flex-wrap gap-2 justify-center text-xs">
              <button
                type="button"
                onClick={() => { setEmail('admin@cremecookies.fr'); setPassword('demo123'); }}
                className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full hover:bg-amber-200 transition-colors"
              >
                Admin
              </button>
              <button
                type="button"
                onClick={() => { setEmail('cuisine@cremecookies.fr'); setPassword('demo123'); }}
                className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full hover:bg-amber-200 transition-colors"
              >
                Cuisine
              </button>
              <button
                type="button"
                onClick={() => { setEmail('livreur@cremecookies.fr'); setPassword('demo123'); }}
                className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full hover:bg-amber-200 transition-colors"
              >
                Livreur
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
