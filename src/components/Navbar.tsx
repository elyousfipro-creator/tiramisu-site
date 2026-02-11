import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, LogOut } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';

export function Navbar() {
  const { itemCount } = useCart();
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <h1 className="font-display text-2xl font-bold text-creme-brun hover:text-creme-rose transition-colors">
              Crème et Cookies
            </h1>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-creme-brun hover:text-creme-rose transition-colors font-medium">
              Nos Tiramisus
            </Link>
            <Link to="/#boissons" className="text-creme-brun hover:text-creme-rose transition-colors font-medium">
              Boissons
            </Link>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {/* Cart */}
            <Link
              to="/panier"
              className="relative p-2 bg-creme-beige hover:bg-creme-rose-light rounded-full transition-colors"
            >
              <ShoppingCart className="w-5 h-5 text-creme-brun" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-creme-rose text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* Auth */}
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <Link
                  to={user?.role === 'client' ? '/mon-compte' : '/dashboard'}
                  className="flex items-center gap-2 px-3 py-2 bg-creme-beige hover:bg-creme-rose-light rounded-full transition-colors"
                >
                  <User className="w-4 h-4 text-creme-brun" />
                  <span className="hidden sm:inline text-sm text-creme-brun font-medium">
                    {user?.nom.split(' ')[0]}
                  </span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2 text-creme-brun-light hover:text-creme-rose transition-colors"
                  title="Déconnexion"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                to="/connexion"
                className="px-4 py-2 bg-creme-rose hover:bg-creme-rose-dark text-white font-medium rounded-full transition-colors text-sm"
              >
                Connexion
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
