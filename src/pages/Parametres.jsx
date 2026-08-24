import React, { useEffect, useState } from 'react';

export default function Parametres() {
  const [filter, setFilter] = useState('TOUS');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [allDemandes, setAllDemandes] = useState([]);

  // Aligné avec l'enum Prisma StatutDemande
  const statut = ["TOUS", "EN_ATTENTE", "VALIDEE", "REFUSEE"];

  const filteredDemandes =
    filter === 'TOUS'
      ? allDemandes
      : allDemandes.filter((d) => d.statut === filter);

  const fetchDemandes = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token"); // localStorage est synchrone, pas besoin de await
      const response = await fetch('http://localhost:3000/api/agence/all_demandes', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Erreur lors du chargement des demandes");
      setAllDemandes(result.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDemandes();
  }, []);

  const handleValider = async (id_demande) => {
    setActionLoadingId(id_demande);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:3000/api/agence/demandes/${id_demande}/valider`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Erreur lors de la validation");

      setAllDemandes(prev =>
        prev.map(d => d.id_demande === id_demande ? { ...d, statut: 'VALIDEE' } : d)
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleRefuser = async (id_demande) => {
    setActionLoadingId(id_demande);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:3000/api/agence/demandes/${id_demande}/refuser`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Erreur lors du refus");

      setAllDemandes(prev =>
        prev.map(d => d.id_demande === id_demande ? { ...d, statut: 'REFUSEE' } : d)
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setActionLoadingId(null);
    }
  };

  const statutBadgeStyle = (s) => {
    switch (s) {
      case 'VALIDEE': return 'bg-green-50 text-green-600';
      case 'REFUSEE': return 'bg-red-50 text-red-500';
      case 'EN_ATTENTE': return 'bg-amber-50 text-amber-600';
      default: return 'bg-blue-50 text-blue-500';
    }
  };

  return (
    <div className="p-6">

      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Demandes
      </h1>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-600">
          {error}
        </div>
      )}

      {isLoading && (
        <p className="text-gray-500 mb-4">
          Chargement des demandes...
        </p>
      )}

      <div className="flex gap-2 mb-6 flex-wrap">
        {statut.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${filter === s
              ? "bg-blue-600 text-white"
              : "bg-white text-gray-600 border hover:bg-gray-50"
              }`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="space-y-3">

        {!isLoading && filteredDemandes.length === 0 && (
          <div className="bg-white rounded-xl p-6 text-center text-gray-500">
            Aucune demande trouvée.
          </div>
        )}

        {filteredDemandes.map((d) => (
          <div
            key={d.id_demande}
            className="bg-white rounded-xl p-4 shadow-sm border"
          >
            <div className="flex justify-between items-start">
              <div>
                <span className="text-sm font-bold text-gray-800">
                  {d.description?.replace(/_/g, " ")}
                </span>
                <p className="text-xs text-gray-400 mt-2">
                  {d.agence?.nom || "Agence inconnue"}
                  {" — "}
                  {d.date_demande
                    ? new Date(d.date_demande).toLocaleString("fr-FR")
                    : ""}
                </p>
                <p className="text-xs text-gray-400 mt-2 font-semibold">
                  Montant demandé: {d.montant_demande ? d.montant_demande.toLocaleString() + " Ar" : "N/A"}
                </p>
                <p className="text-xs text-gray-400 mt-2 font-semibold">
                  Fait par: {d.agent?.nom || "Agent inconnu"} {d.agent?.prenom}
                </p>
              </div>

              <span className={`text-xs px-2 py-1 rounded-full font-bold ${statutBadgeStyle(d.statut)}`}>
                {d.statut}
              </span>
            </div>

            {d.statut === 'EN_ATTENTE' && (
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => handleValider(d.id_demande)}
                  disabled={actionLoadingId === d.id_demande}
                  className="flex-1 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white text-sm font-semibold rounded-lg py-2 transition"
                >
                  {actionLoadingId === d.id_demande ? '...' : '✓ Valider'}
                </button>
                <button
                  onClick={() => handleRefuser(d.id_demande)}
                  disabled={actionLoadingId === d.id_demande}
                  className="flex-1 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white text-sm font-semibold rounded-lg py-2 transition"
                >
                  {actionLoadingId === d.id_demande ? '...' : '✗ Refuser'}
                </button>
              </div>
            )}
          </div>
        ))}

      </div>
    </div>
  );
}