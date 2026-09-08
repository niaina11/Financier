import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom'; // 1. Importer les outils de routage
import {
  LayoutDashboard, Building2, Activity, Bell,
  FileText, BarChart2, Settings, LogOut,
  Users
} from 'lucide-react';



export default function Sidebar({ page }) {
  const navigate = useNavigate();
  const userRole = localStorage.getItem('role') || 'AGENT'; // Récupération du rôle connecté

  const navItems = [
  { id: 'dashboard', label: 'Tableau de bord', icon: LayoutDashboard, path: '/dashboard', roles: ['ADMIN', 'AGENT'] },
  { id: 'operations', label: 'Opérations', icon: Activity, path: '/operations', roles: ['ADMIN', 'AGENT'] },
  { id: 'parametres', label: 'Demandes', icon: FileText, path: '/parametres', roles: ['ADMIN', 'AGENT'] },
  // Menus réservés uniquement à l'ADMIN
  { id: 'agences', label: 'Agences', icon: Building2, path: '/agences', roles: ['ADMIN'] },
  { id: 'alertes', label: 'Alertes', icon: Bell, path: '/alertes', roles: ['ADMIN'] },
  { id: 'audit', label: 'Audit (Journal)', icon: FileText, path: '/audit', roles: ['ADMIN'] },
  { id: 'rapports', label: 'Rapports', icon: BarChart2, path: '/rapports', roles: ['ADMIN'] },
  { id: 'utilisateurs', label: 'Utilisateurs', icon: Users, path: '/utilisateur', roles: ['ADMIN'] },
];

  // 2. Gestion de la déconnexion sécurisée
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('id_agence');
    navigate('/login', { replace: true }); // Redirection et blocage du retour arrière
  };

  // 3. Filtrer les éléments de navigation selon le rôle de l'utilisateur
  const filteredNavItems = navItems.filter(item => item.roles.includes(userRole));

  return (
    <aside className="w-64 bg-primary text-white flex flex-col" style={{ backgroundColor: '#1a335a' }}>
      <div className="p-6 border-b border-white/10">
        <p className="font-display text-xs uppercase tracking-widest text-blue-300 mb-1">Système</p>
        <h1 className="font-display text-lg font-bold leading-tight">Surveillance Financière</h1>
        <p className="text-xs text-blue-200 mt-1">Mode : {userRole}</p> 
      </div>

      <nav className="flex-1 py-4">
        {filteredNavItems.map(({ id, label, icon: Icon, badge, path }) => (
          /* 4. Remplacement du <button> par un <NavLink> pour gérer les URLs */
          <NavLink
            key={id}
            to={path}
            className={({ isActive }) =>
              `w-full flex items-center gap-3 px-6 py-3 text-sm transition-all ${
                isActive
                  ? 'bg-white/15 text-white font-semibold border-r-4 border-blue-300'
                  : 'text-blue-100 hover:bg-white/10'
              }`
            }
          >
            <Icon size={18} />
            <span className="flex-1 text-left">{label}</span>
            {badge && (
              <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{badge}</span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* 5. Bouton de déconnexion sécurisé */}
      <div className="p-4 border-t border-white/10">
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-300 hover:bg-red-500/20 rounded-lg transition"
        >
          <LogOut size={18} />
          Déconnexion
        </button>
      </div>
    </aside>
  );
}
