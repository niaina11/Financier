import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, User } from 'lucide-react';
import { useSocket } from '../hooks/useSocket';

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
  const navigate = useNavigate();
  const { notifications, retirerNotification } = useSocket();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Ferme le dropdown si on clique en dehors
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNotificationClick = async (notif) => {
    // 1. Marque comme lue côté backend
    try {
      const token = localStorage.getItem('token');
      await fetch(`http://localhost:3000/api/admin/${notif.id_notification}/lire`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` }
      });
    } catch (err) {
      console.error('Erreur marquage lu :', err);
    }

    // 2. Retire de la liste affichée immédiatement (optimiste)
    retirerNotification(notif.id_notification);
    setDropdownOpen(false);

    // 3. Redirige selon le contenu de la notification
    if (notif.id_operation) {
      navigate('/operations');
    } else if (notif.id_alerte) {
      navigate('/alertes');
    } else {
      // Pas d'id_operation ni id_alerte → c'est une demande
      navigate('/parametres');
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
      <h2 className="font-display text-xl font-bold text-gray-800">{titles[page]}</h2>
      <div className="flex items-center gap-4">
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(prev => !prev)}
            className="relative p-2 text-gray-500 hover:text-gray-800"
          >
            <Bell size={20} />
            {notifications.length > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            )}
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white border rounded-xl shadow-lg z-50 max-h-96 overflow-y-auto">
              <div className="px-4 py-3 border-b font-semibold text-sm text-gray-700">
                Notifications {notifications.length > 0 && `(${notifications.length})`}
              </div>

              {notifications.length === 0 ? (
                <p className="p-4 text-sm text-gray-400 text-center">Aucune notification</p>
              ) : (
                notifications.map((notif) => (
                  <button
                    key={notif.id_notification}
                    onClick={() => handleNotificationClick(notif)}
                    className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b last:border-b-0 transition"
                  >
                    <p className="text-sm font-semibold text-gray-800">{notif.titre}</p>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">{notif.message}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(notif.createdAt).toLocaleString('fr-FR')}
                    </p>
                  </button>
                ))
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 text-sm">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">A</div>
          <span className="font-medium text-gray-700">Administrateur</span>
        </div>
      </div>
    </header>
  );
}