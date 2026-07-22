import React from 'react';
import { Download } from 'lucide-react';

const rapports = [
  { titre: 'Rapport mensuel — Mai 2024', type: 'PDF', date: '01/06/2024', taille: '2.4 MB' },
  { titre: 'Récapitulatif alertes — Semaine 22', type: 'Excel', date: '03/06/2024', taille: '1.1 MB' },
  { titre: 'Soldes agences — Juin 2024', type: 'PDF', date: '07/06/2024', taille: '0.8 MB' },
];

export default function Rapports() {
  return (
    <div className="space-y-4">
      <button className="px-4 py-2 rounded-xl text-sm font-semibold text-white flex items-center gap-2" style={{ backgroundColor: '#1a3a5c' }}>
        <Download size={16} /> Générer un rapport
      </button>
      <div className="bg-white rounded-xl border shadow-sm divide-y">
        {rapports.map((r, i) => (
          <div key={i} className="flex items-center justify-between p-4 hover:bg-gray-50 transition">
            <div>
              <p className="font-semibold text-gray-700 text-sm">{r.titre}</p>
              <p className="text-xs text-gray-400">{r.date} — {r.taille}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className={`px-2 py-1 rounded text-xs font-bold ${r.type === 'PDF' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>{r.type}</span>
              <button className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg"><Download size={16} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}