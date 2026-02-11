import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { useAuth } from '@/context/AuthContext';
import { Cookie, Eye, EyeOff, AlertCircle } from 'lucide-react';

export function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    nom: '',
    telephone: '',
    adresse: ''
  });

  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        const success = await login(formData.email, formData.password);
        if (success) {
          navigate(redirectTo);
        } else {
          setError('Email ou mot de passe incorrect');
        }
      } else {
        if (!formData.nom || !formData.telephone || !formData.adresse) {
          setError('Veuillez remplir tous les champs');
          setLoading(false);
          return;
        }
        const success = await register({
          email: formData.email,
          password: formData.password,
          nom: formData.nom,
          telephone: formData.telephone,
          adresse: formData.adresse
        });
        if (success) {
          navigate(redirectTo);
        } else {
          setError('Cet email est déjà utilisé');
        }
      }
    } catch {
      setError('Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-creme-rose-light via-white to-creme-beige">
      <Navbar />

      <main className="flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-creme-rose rounded-2xl shadow-lg mb-4">
              <Cookie className="w-8 h-8 text-white" />
            </div>
            <h1 className="font-display text-2xl font-bold text-creme-brun">
              {isLogin ? 'Connexion' : 'Créer un compte'}
            </h1>
            <p className="text-gray-600 mt-1">
              {isLogin 
                ? 'Connectez-vous pour commander' 
                : 'Inscrivez-vous pour profiter de nos tiramisus'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-6 space-y-4">
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}

            {!isLogin && (
              <>
                <div>
                  <label className="block text-sm font-medium text-creme-brun mb-1">
                    Nom complet
                  </label>
                  <input
                    type="text"
                    name="nom"
                    value={formData.nom}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-creme-beige focus:border-creme-rose focus:ring-2 focus:ring-creme-rose/20 outline-none transition-all"
                    placeholder="Jean Dupont"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-creme-brun mb-1">
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    name="telephone"
                    value={formData.telephone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-creme-beige focus:border-creme-rose focus:ring-2 focus:ring-creme-rose/20 outline-none transition-all"
                    placeholder="06 12 34 56 78"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-creme-brun mb-1">
                    Adresse de livraison
                  </label>
                  <input
                    type="text"
                    name="adresse"
                    value={formData.adresse}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-creme-beige focus:border-creme-rose focus:ring-2 focus:ring-creme-rose/20 outline-none transition-all"
                    placeholder="12 rue de la Paix, 49000 Angers"
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-creme-brun mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-creme-beige focus:border-creme-rose focus:ring-2 focus:ring-creme-rose/20 outline-none transition-all"
                placeholder="votre@email.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-creme-brun mb-1">
                Mot de passe
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 pr-12 rounded-xl border border-creme-beige focus:border-creme-rose focus:ring-2 focus:ring-creme-rose/20 outline-none transition-all"
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-creme-brun"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-creme-rose hover:bg-creme-rose-dark text-white font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Chargement...' : isLogin ? 'Se connecter' : 'Créer mon compte'}
            </button>
          </form>

          {/* Toggle */}
          <p className="text-center mt-6 text-gray-600">
            {isLogin ? "Pas encore de compte ?" : "Déjà inscrit ?"}
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
              }}
              className="ml-2 text-creme-rose hover:text-creme-rose-dark font-medium transition-colors"
            >
              {isLogin ? "S'inscrire" : "Se connecter"}
            </button>
          </p>

          <Link
            to="/"
            className="block text-center mt-4 text-sm text-gray-500 hover:text-creme-brun transition-colors"
          >
            ← Retour à l'accueil
          </Link>
        </div>
      </main>
    </div>
  );
}
