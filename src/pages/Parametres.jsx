import React, { useState } from 'react';

export default function Parametres() {
  const [plafond, setPlafond] = useState('5000000');
  const [seuilMin, setSeuilMin] = useState('200000');
  const [maxModif, setMaxModif] = useState('3');

  return (
    <div className="max-w-2xl space-y-6">
      <div className="bg-white rounded-xl border shadow-sm p-6">
        <h3 className="font-display font-bold text-gray-800 mb-4">Paramètres Globaux</h3>
        <div className="space-y-4">
          {[
            { label: 'Plafond de dépense (Ar)', value: plafond, setter: setPlafond },
            { label: 'Seuil minimum solde (Ar)', value: seuilMin, setter: setSeuilMin },
            { label: 'Nb max modifications / opération', value: maxModif, setter: setMaxModif },
          ].map(({ label, value, setter }) => (
            <div key={label}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
              <input
                type="number"
                value={value}
                onChange={e => setter(e.target.value)}
                className="w-full border rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          ))}
        </div>
        <button className="mt-6 px-6 py-2 rounded-xl text-sm font-semibold text-white" style={{ backgroundColor: '#1a3a5c' }}>
          Enregistrer
        </button>
      </div>
    </div>
  );
}