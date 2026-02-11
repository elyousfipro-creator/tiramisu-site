import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { HomePage } from '@/pages/HomePage';
import { ConnexionPage } from '@/pages/ConnexionPage';
import { PanierPage } from '@/pages/PanierPage';
import { MonComptePage } from '@/pages/MonComptePage';
import { MesCommandesPage } from '@/pages/MesCommandesPage';
import { SuiviCommandePage } from '@/pages/SuiviCommandePage';
import { DashboardPage } from '@/pages/DashboardPage';
import { CuisinePage } from '@/pages/CuisinePage';
import { LivraisonPage } from '@/pages/LivraisonPage';
import { ConditionsPage } from '@/pages/ConditionsPage';
import { FidelitePage } from '@/pages/FidelitePage';

export function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-rose-50 flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/connexion" element={<ConnexionPage />} />
            <Route path="/panier" element={<PanierPage />} />
            <Route path="/conditions" element={<ConditionsPage />} />
            <Route path="/fidelite" element={<FidelitePage />} />

            {/* Client Routes */}
            <Route path="/mon-compte" element={<MonComptePage />} />
            <Route path="/mon-compte/mes-commandes" element={<MesCommandesPage />} />
            <Route path="/mon-compte/mes-commandes/:orderId" element={<SuiviCommandePage />} />

            {/* Dashboard Routes (pas de "admin" visible) */}
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/dashboard/cuisine" element={<CuisinePage />} />
            <Route path="/dashboard/livraison" element={<LivraisonPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
