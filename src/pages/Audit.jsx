import React, { useState } from 'react';

const logs = [
  { action: 'AJOUT_OPERATION', user: 'Agent 3', agence: 'Agence 3', ancienne: '-', nouvelle: '1 200 000 Ar', date: '10:30:12' },
  { action: 'MODIFICATION_OPERATION', user: 'Agent 7', agence: 'Agence 7', ancienne: '500 000 Ar', nouvelle: '8 500 000 Ar', date: '10:45:03' },
  { action: 'SUPPRESSION_OPERATION', user: 'Agent 7', agence: 'Agence 12', ancienne: '300 000 Ar', nouvelle: '-', date: '10:15:44' },
  { action: 'CONNEXION', user: 'Admin', agence: '-', ancienne: '-', nouvelle: 'Session ouverte', date: '09:00:00' },
];

export default function Audit() {
  const [auditLogs, setAuditLogs] = useState([]);
  const [error, setError] = useState(null);

  const fetchAuditLogs = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/audit/getAudits', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const result = await response.json();
      if (result.success) {
        setAuditLogs(result.data);
      } else {
        setError(result.message);
      }
    }
    catch (err) {
      console.error('Error fetching audit logs:', err);
      setError('Erreur lors de la récupération des journaux d\'audit.');
    }
  };

  React.useEffect(() => {
    fetchAuditLogs();
  }, []);
  return (
    <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 border-b">
          <tr>
            {['Action', 'Utilisateur', 'Agence', 'Module', 'Description', 'Heure'].map(h => (
              <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {auditLogs.map((l, i) => (
            <tr key={i} className="border-b hover:bg-gray-50">
              <td className="px-4 py-3 font-mono text-xs text-blue-600">{l.action}</td>
              <td className="px-4 py-3 font-semibold text-gray-700">{l.utilisateur?.nom || 'N/A'}</td>
              <td className="px-4 py-3 text-gray-500">{l.agence?.nom || 'N/A'}</td>
              <td className="px-4 py-3 text-red-400">{l.module}</td>
              <td className="px-4 py-3 text-green-600">{l.description}</td>
              <td className="px-4 py-3 text-gray-400 font-mono text-xs">{l.date_action}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}