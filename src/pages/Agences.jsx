import React, { useEffect, useState } from 'react';
import { Plus, Search, Eye, Edit, X } from 'lucide-react';

export default function Agences() {
  const [search, setSearch] = useState('');
  const [listeAgences, setListeAgences] = useState([]); // État de la liste
  const [isOpen, setIsOpen] = useState(false); // État d'ouverture de la modale
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Formulaire combinant les champs de la table Agence et ParametreAgence
  const [formData, setFormData] = useState({
    nom: '',
    ville: 'Antananarivo', // Par défaut pour le mock
    adresse: '',
    telephone: '',
    fonds_minimum: '',
    fonds_maximum: '',
    seuil_alerte: ''
  });

  const fetchAgence = async () => {
    try {
      const idAdmin = localStorage.getItem('id_utilisateur');
      const response = await fetch(`http://localhost:3000/api/admin/getAgences?id_utilisateur_admin=${idAdmin}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (!response.ok) {
        const errorResult = await response.json().catch(() => ({ message: "Erreur serveur HTTP " + response.status }));
        throw new Error(errorResult.message);
      }

      const result = await response.json();
      setListeAgences(result.data || []);

    } catch (err) {
      console.error("Erreur lors de la lecture des données :", err.message);
    }
  };

  useEffect(() => {
    fetchAgence()
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const idAdmin = localStorage.getItem('id_utilisateur');

      const response = await fetch('http://localhost:3000/api/admin/agences',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            id_utilisateur_admin: idAdmin,
            nom: formData.nom,
            adresse: formData.adresse,
            telephone: formData.telephone,
            fonds_minimum: parseFloat(formData.fonds_minimum),
            fonds_maximum: parseFloat(formData.fonds_maximum),
            seuil_alerte: parseFloat(formData.seuil_alerte)
          })
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Erreur lors de la création de l'agence");
      }

      alert("Agence et configurations financières créées avec succès !");
      setIsOpen(false);

      // Réinitialiser le formulaire
      setFormData({ nom: '', adresse: '', telephone: '', fonds_minimum: '', fonds_maximum: '', seuil_alerte: '' });

      // Rafraîchir instantanément la table avec les nouvelles données de la BDD
      fetchAgence();

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }

    setIsOpen(false);
    setFormData({ nom: '', ville: 'Antananarivo', adresse: '', telephone: '', fonds_minimum: '', fonds_maximum: '', seuil_alerte: '' });

    alert("Simulation : Agence et paramètres financiers validés localement !");
  };

  // Filtrage basé sur l'état local
  const filtered = listeAgences.filter(a =>
    a.nom?.toLowerCase().includes(search.toLowerCase()) ||
    a.adresse?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4 relative">
      {/* BARRE D'OUTILS */}
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

        {/* Déclencheur de la modale */}
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white transition hover:opacity-90"
          style={{ backgroundColor: '#1a3a5c' }}
        >
          <Plus size={16} /> Nouvelle Agence
        </button>
      </div>

      {/* TABLEAU DES AGENCES */}
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              {['ID', 'Nom', 'Ville', 'Solde actuel (Ar)','Seuil minimal','Seuil maximal', 'Agents', 'Actions'].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(a => {
              // 1. Récupération sécurisée du montant numérique (généralement .montant dans votre table Solde)
              const soldeNumerique = a.solde?.montant_actuel || 0;

              // 2. Récupération du seuil d'alerte depuis la relation "parametre" de la BDD
              const seuilAlerte = a.parametre?.seuil_alerte || 0;

              // 3. Calcul automatique de l'alerte en comparant le solde actuel au seuil
              const estEnAlerte = soldeNumerique <= seuilAlerte;

              return (
                <tr key={a.id_agence} className="border-b hover:bg-gray-50 transition">
                  {/* Utilisation de l'id_agence de Prisma (raccourci pour rester lisible) */}
                  <td className="px-4 py-3 text-gray-400 font-mono text-xs">
                    #{String(a.id_agence).substring(0, 5)}...
                  </td>

                  <td className="px-4 py-3 font-semibold text-gray-700">{a.nom}</td>

                  {/* Remplacement de la ville par l'adresse réelle de la BDD */}
                  <td className="px-4 py-3 text-gray-500">{a.adresse}</td>

                  {/* Affichage du solde formaté proprement */}
                  <td className={`px-4 py-3 font-bold ${soldeNumerique < 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {soldeNumerique.toLocaleString()} Ar
                  </td>
                  <td className="px-4 py-3">{a.parametre?.fonds_minimum?.toLocaleString() || 'N/A'} Ar</td>
                  <td className="px-4 py-3">{a.parametre?.fonds_maximum?.toLocaleString() || 'N/A'} Ar</td>

                  {/* Statut dynamique basé sur le seuil financier */}
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${estEnAlerte ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
                      }`}>
                      {estEnAlerte ? 'Alerte' : 'Actif'}
                    </span>
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button className="p-1 text-blue-500 hover:bg-blue-50 rounded" title="Consulter">
                        <Eye size={16} />
                      </button>
                      <button className="p-1 text-gray-500 hover:bg-gray-50 rounded" title="Modifier">
                        <Edit size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}

          </tbody>
        </table>
      </div>

      {/* BOÎTE MODALE D'AJOUT D'AGENCE */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden flex flex-col max-h-[90vh]">

            {/* Entête Modale */}
            <div className="p-6 border-b flex justify-between items-center bg-gray-50">
              <h2 className="text-lg font-bold text-gray-800">Ajouter une nouvelle agence</h2>
              <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:bg-gray-200 p-1 rounded-lg transition">
                <X size={20} />
              </button>
            </div>

            {/* Corps du Formulaire */}
            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1">

              {/* SECTION 1 : BLOC AGENCE */}
              <p className="text-xs font-bold text-blue-600 uppercase tracking-wider">1. Informations Générales</p>
              <div className="grid grid-cols-1 gap-3">
                <div>
                  <label className="text-xs font-medium text-gray-600">Nom de l'agence</label>
                  <input required name="nom" value={formData.nom} onChange={handleChange} placeholder="Ex: Agence Centrale" className="w-full border rounded-lg p-2 text-sm mt-1 focus:ring-2 focus:ring-blue-400 focus:outline-none" />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600">Adresse physique</label>
                  <input required name="adresse" value={formData.adresse} onChange={handleChange} placeholder="Ex: Lot IVG 24 Analakely" className="w-full border rounded-lg p-2 text-sm mt-1 focus:ring-2 focus:ring-blue-400 focus:outline-none" />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600">Téléphone de contact</label>
                  <input required name="telephone" value={formData.telephone} onChange={handleChange} placeholder="Ex: +261 34 00 000 00" className="w-full border rounded-lg p-2 text-sm mt-1 focus:ring-2 focus:ring-blue-400 focus:outline-none" />
                </div>
              </div>

              {/* SECTION 2 : BLOC PARAMETREAGENCE */}
              <p className="text-xs font-bold text-blue-600 uppercase tracking-wider pt-2">2. Paramètres de Coffre / Trésorerie (Ar)</p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-gray-600">Fonds Minimum requis</label>
                  <input required type="number" name="fonds_minimum" value={formData.fonds_minimum} onChange={handleChange} placeholder="Ex: 5000000" className="w-full border rounded-lg p-2 text-sm mt-1 focus:ring-2 focus:ring-blue-400 focus:outline-none" />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600">Fonds Maximum autorisé</label>
                  <input required type="number" name="fonds_maximum" value={formData.fonds_maximum} onChange={handleChange} placeholder="Ex: 50000000" className="w-full border rounded-lg p-2 text-sm mt-1 focus:ring-2 focus:ring-blue-400 focus:outline-none" />
                </div>
                <div className="col-span-2">
                  <label className="text-xs font-medium text-gray-600">Seuil de déclenchement d'alerte</label>
                  <input required type="number" name="seuil_alerte" value={formData.seuil_alerte} onChange={handleChange} placeholder="Ex: 10000000" className="w-full border rounded-lg p-2 text-sm mt-1 focus:ring-2 focus:ring-blue-400 focus:outline-none" />
                </div>
              </div>

              {/* PIED DE MODALE ET BOUTONS */}
              <div className="flex justify-end gap-3 pt-4 border-t mt-6">
                <button type="button" onClick={() => setIsOpen(false)} className="px-4 py-2 border rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-100 transition">
                  Annuler
                </button>
                <button type="submit" className="px-4 py-2 rounded-xl text-sm font-semibold text-white transition hover:opacity-90" style={{ backgroundColor: '#1a3a5c' }}>
                  Valider la création
                </button>
              </div>
            </form>

          </div>
        </div>
      )}
    </div>
  );
}
