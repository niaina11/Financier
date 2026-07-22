import React from 'react';
import { Bell, User } from 'lucide-react';

const titles = {
  dashboard: 'Tableau de Bord',
  agences: 'Gestion des Agences',
  operations: 'Opérations',
  alertes: 'Alertes',
  audit: 'Journal d\'Audit',
  rapports: 'Rapports',
  parametres: 'Paramètres & Seuils',
};

export default function Header({ page }) {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
      <h2 className="font-display text-xl font-bold text-gray-800">{titles[page]}</h2>
      <div className="flex items-center gap-4">
        <button className="relative p-2 text-gray-500 hover:text-gray-800">
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        <div className="flex items-center gap-2 text-sm">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">A</div>
          <span className="font-medium text-gray-700">Administrateur</span>
        </div>
      </div>
    </header>
  );
}