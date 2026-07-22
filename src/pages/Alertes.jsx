import React, { useState } from 'react';

const alertes = [
  { id: 1, type: 'DEPASSEMENT_PLAFOND', description: 'Dépense 8 500 000 Ar > plafond 5 000 000 Ar', agence: 'Agence 7', niveau: 'CRITIQUE', date: '2024-06-08 10:45', statut: 'OUVERTE' },
  { id: 2, type: 'MODIFICATION_OPERATION', description: 'OP-2024-015 modifiée : 500 000 → 1 200 000 Ar', agence: 'Agence 3', niveau: 'ÉLEVÉ', date: '2024-06-08 10:30', statut: 'EN_COURS' },
  { id: 3, type: 'SUPPRESSION_OPERATION', description: 'OP-2024-022 supprimée par Agent 7', agence: 'Agence 12', niveau: 'CRITIQUE', date: '2024-06-08 10:15', statut: 'OUVERTE' },
  { id: 4, type: 'DEPASSEMENT_SOLDE', description: 'Solde Agence 12 < seuil minimum 200 000 Ar', agence: 'Agence 12', niveau: 'MOYEN', date: '2024-06-08 09:50', statut: 'OUVERTE' },
  { id: 5, type: 'TRANSACTION_SUSPECTE', description: '5 opérations identiques 300 000 Ar / jour', agence: 'Agence 9', niveau: 'MOYEN', date: '2024-06-08 09:20', statut: 'EN_COURS' },
];

const niveauStyle = {
  CRITIQUE: 'bg-red-100 text-red-700',
  ÉLEVÉ: 'bg-orange-100 text-orange-700',
  MOYEN: 'bg-yellow-100 text-yellow-700',
  FAIBLE: 'bg-green-100 text-green-700',
};

export default function Alertes() {
  const [filter, setFilter] = useState('TOUS');
  const niveaux = ['TOUS', 'CRITIQUE', 'ÉLEVÉ', 'MOYEN', 'FAIBLE'];
  const filtered = filter === 'TOUS' ? alertes : alertes.filter(a => a.niveau === filter);

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {niveaux.map(n => (
          <button
            key={n}
            onClick={() => setFilter(n)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${filter === n ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 border hover:bg-gray-50'}`}
          >
            {n}
          </button>
        ))}
      </div>
      <div className="space-y-3">
        {filtered.map(a => (
          <div key={a.id} className="bg-white rounded-xl border shadow-sm p-4">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${niveauStyle[a.niveau]}`}>{a.niveau}</span>
                  <span className="text-sm font-semibold text-gray-700">{a.type.replace(/_/g, ' ')}</span>
                </div>
                <p className="text-sm text-gray-500">{a.description}</p>
                <p className="text-xs text-gray-400 mt-1">{a.agence} — {a.date}</p>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full ${a.statut === 'OUVERTE' ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-blue-500'}`}>
                {a.statut}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}