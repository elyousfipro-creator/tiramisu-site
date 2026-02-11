import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, LogOut } from 'lucide-react';
import { useStore } from '@/store/useStore';

export function Navbar() {
  const { cart, user, isAuthenticated, logout } = useStore();
  const navigate = useNavigate();
  
  const totalItems = cart.reduce((sum, item) => sum + item.quantite, 0);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getDashboardLink = () => {
    if (!user) return null;
    switch (user.role) {
      case 'admin':
        return '/dashboard';
      case 'cuisine':
        return '/dashboard/cuisine';
      case 'livreur':
        return '/dashboard/livraison';
      default:
        return '/mon-compte';
    }
  };

  return (
    <nav className="bg-white/90 backdrop-blur-sm shadow-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold text-amber-900">
              Crème et Cookies
            </span>
          </Link>

          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <Link
                  to={getDashboardLink() || '/'}
                  className="flex items-center gap-2 text-amber-800 hover:text-rose-500 transition-colors"
                >
                  <User className="w-5 h-5" />
                  <span className="hidden sm:inline">{user?.nom}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-amber-600 hover:text-rose-500 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </>
            ) : (
              <Link
                to="/connexion"
                className="flex items-center gap-2 text-amber-800 hover:text-rose-500 transition-colors"
              >
                <User className="w-5 h-5" />
                <span className="hidden sm:inline">Connexion</span>
              </Link>
            )}

            <Link
              to="/panier"
              className="relative flex items-center gap-2 bg-rose-400 text-white px-4 py-2 rounded-full hover:bg-rose-500 transition-colors"
            >
              <ShoppingCart className="w-5 h-5" />
              <span className="hidden sm:inline">Panier</span>
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-amber-900 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center font-bold">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
