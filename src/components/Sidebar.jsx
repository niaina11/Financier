import React from 'react';
import {
  LayoutDashboard, Building2, Activity, Bell,
  FileText, BarChart2, Settings, LogOut
} from 'lucide-react';

const navItems = [
  { id: 'dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
  { id: 'agences', label: 'Agences', icon: Building2 },
  { id: 'operations', label: 'Opérations', icon: Activity },
  { id: 'alertes', label: 'Alertes', icon: Bell, badge: 12 },
  { id: 'audit', label: 'Audit (Journal)', icon: FileText },
  { id: 'rapports', label: 'Rapports', icon: BarChart2 },
  { id: 'parametres', label: 'Paramètres', icon: Settings },
];

export default function Sidebar({ page, setPage }) {
  return (
    <aside className="w-64 bg-primary text-white flex flex-col" style={{ backgroundColor: '#1a3a5c' }}>
      <div className="p-6 border-b border-white/10">
        <p className="font-display text-xs uppercase tracking-widest text-blue-300 mb-1">Système</p>
        <h1 className="font-display text-lg font-bold leading-tight">Surveillance Financière</h1>
        <p className="text-xs text-blue-200 mt-1">19 Agences</p>
      </div>
      <nav className="flex-1 py-4">
        {navItems.map(({ id, label, icon: Icon, badge }) => (
          <button
            key={id}
            onClick={() => setPage(id)}
            className={`w-full flex items-center gap-3 px-6 py-3 text-sm transition-all ${
              page === id
                ? 'bg-white/15 text-white font-semibold border-r-4 border-blue-300'
                : 'text-blue-100 hover:bg-white/10'
            }`}
          >
            <Icon size={18} />
            <span className="flex-1 text-left">{label}</span>
            {badge && (
              <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{badge}</span>
            )}
          </button>
        ))}
      </nav>
      <div className="p-4 border-t border-white/10">
        <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-300 hover:bg-red-500/20 rounded-lg transition">
          <LogOut size={18} />
          Déconnexion
        </button>
      </div>
    </aside>
  );
}