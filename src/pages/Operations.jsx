import React, { useState } from 'react';
import { Plus, Search } from 'lucide-react';

const operations = Array.from({ length: 20 }, (_, i) => ({
  id: `OP-2024-${String(i + 1).padStart(3, '0')}`,
  type: i % 2 === 0 ? 'Recette' : 'Dépense',
  montant: Math.floor(Math.random() * 5000000) + 100000,
  agence: `Agence ${(i % 19) + 1}`,
  agent: `Agent ${(i % 5) + 1}`,
  date: `2024-06-${String(8 - (i % 8)).padStart(2, '0')}`,
  statut: ['VALIDE', 'EN_ATTENTE', 'ANNULEE'][i % 3],
}));

const statutStyle = {
  VALIDE: 'bg-green-100 text-green-700',
  EN_ATTENTE: 'bg-yellow-100 text-yellow-700',
  ANNULEE: 'bg-red-100 text-red-700',
};

export default function Operations() {
  const [search, setSearch] = useState('');
  const filtered = operations.filter(o =>
    o.id.includes(search) || o.agence.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher..." className="pl-10 pr-4 py-2 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 w-64" />
        </div>
      </div>
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              {['Référence', 'Type', 'Montant', 'Agence', 'Agent', 'Date', 'Statut'].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(o => (
              <tr key={o.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3 font-mono text-xs text-gray-600">{o.id}</td>
                <td className={`px-4 py-3 font-semibold ${o.type === 'Recette' ? 'text-green-600' : 'text-red-600'}`}>{o.type}</td>
                <td className="px-4 py-3 font-bold text-gray-700">{o.montant.toLocaleString()} Ar</td>
                <td className="px-4 py-3 text-gray-500">{o.agence}</td>
                <td className="px-4 py-3 text-gray-500">{o.agent}</td>
                <td className="px-4 py-3 text-gray-400">{o.date}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${statutStyle[o.statut]}`}>{o.statut}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}