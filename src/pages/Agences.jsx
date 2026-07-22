import React, { useState } from 'react';
import { Plus, Search, Eye, Edit } from 'lucide-react';

const agences = Array.from({ length: 19 }, (_, i) => ({
  id: i + 1,
  nom: `Agence ${i + 1}`,
  ville: ['Antananarivo', 'Toamasina', 'Mahajanga', 'Fianarantsoa', 'Toliara'][i % 5],
  solde: Math.floor(Math.random() * 20000000 - 2000000),
  statut: i % 7 === 0 ? 'Alerte' : 'Actif',
  agents: Math.floor(Math.random() * 8) + 2,
}));

export default function Agences() {
  const [search, setSearch] = useState('');
  const filtered = agences.filter(a => a.nom.toLowerCase().includes(search.toLowerCase()) || a.ville.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher une agence..."
            className="pl-10 pr-4 py-2 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 w-64"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white" style={{ backgroundColor: '#1a3a5c' }}>
          <Plus size={16} /> Nouvelle Agence
        </button>
      </div>

      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              {['ID', 'Nom', 'Ville', 'Solde (Ar)', 'Agents', 'Statut', 'Actions'].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(a => (
              <tr key={a.id} className="border-b hover:bg-gray-50 transition">
                <td className="px-4 py-3 text-gray-400 font-mono text-xs">#{String(a.id).padStart(2, '0')}</td>
                <td className="px-4 py-3 font-semibold text-gray-700">{a.nom}</td>
                <td className="px-4 py-3 text-gray-500">{a.ville}</td>
                <td className={`px-4 py-3 font-bold ${a.solde < 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {a.solde.toLocaleString()} Ar
                </td>
                <td className="px-4 py-3 text-gray-500">{a.agents}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${a.statut === 'Alerte' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                    {a.statut}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button className="p-1 text-blue-500 hover:bg-blue-50 rounded"><Eye size={16} /></button>
                    <button className="p-1 text-gray-500 hover:bg-gray-50 rounded"><Edit size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}