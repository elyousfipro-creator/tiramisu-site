import { Link, Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { 
  LayoutDashboard, 
  ChefHat, 
  Truck, 
  Package, 
  BarChart3, 
  LogOut,
  Cookie
} from 'lucide-react';

export function DashboardLayout() {
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated || !user) {
    return <Navigate to="/connexion" replace />;
  }

  if (user.role === 'client') {
    return <Navigate to="/mon-compte" replace />;
  }

  const navItems = [
    { 
      path: '/dashboard', 
      label: 'Vue d\'ensemble', 
      icon: LayoutDashboard, 
      roles: ['admin'] 
    },
    { 
      path: '/dashboard/commandes', 
      label: 'Commandes', 
      icon: Package, 
      roles: ['admin'] 
    },
    { 
      path: '/dashboard/cuisine', 
      label: 'Cuisine', 
      icon: ChefHat, 
      roles: ['admin', 'cuisine'] 
    },
    { 
      path: '/dashboard/livraison', 
      label: 'Livraison', 
      icon: Truck, 
      roles: ['admin', 'livreur'] 
    },
    { 
      path: '/dashboard/stats', 
      label: 'Statistiques', 
      icon: BarChart3, 
      roles: ['admin'] 
    }
  ];

  const filteredNav = navItems.filter(item => item.roles.includes(user.role));

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-creme-brun text-white flex flex-col">
        <div className="p-4 border-b border-white/10">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-creme-rose rounded-lg flex items-center justify-center">
              <Cookie className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold">Crème & Cookies</h1>
              <p className="text-xs text-white/60">Espace équipe</p>
            </div>
          </Link>
        </div>

        <nav className="flex-1 p-4">
          <ul className="space-y-1">
            {filteredNav.map(item => {
              const isActive = location.pathname === item.path;
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-creme-rose text-white'
                        : 'text-white/70 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <span className="text-sm font-bold">
                {user.nom.charAt(0)}
              </span>
            </div>
            <div>
              <p className="font-medium text-sm">{user.nom}</p>
              <p className="text-xs text-white/60 capitalize">{user.role}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors w-full"
          >
            <LogOut className="w-4 h-4" />
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
