import React, { useState } from 'react';
import { Download, FileText } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function Rapports() {
  const [modalOpen, setModalOpen] = useState(false);
  const [periode, setPeriode] = useState('mois');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [rapportsGeneres, setRapportsGeneres] = useState([]);

  const genererPDF = (rapport) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // En-tête avec bandeau coloré (même bleu que le reste de l'app)
    doc.setFillColor(26, 58, 92); // #1a3a5c
    doc.rect(0, 0, pageWidth, 30, 'F');

    // "Logo" simple — un cercle + initiales, en attendant un vrai fichier logo
    doc.setFillColor(255, 255, 255);
    doc.circle(18, 15, 8, 'F');
    doc.setTextColor(26, 58, 92);
    doc.setFontSize(11);
    doc.setFont(undefined, 'bold');
    doc.text('SF', 18, 18, { align: 'center' });

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.text('Surveillance Financière', 32, 14);
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.text(
      `Rapport ${periode === 'jour' ? 'journalier' : 'mensuel'} — ${new Date(rapport.date_debut).toLocaleDateString('fr-FR')} au ${new Date(rapport.date_fin).toLocaleDateString('fr-FR')}`,
      32, 22
    );

    let y = 40;

    // Résumé financier
    doc.setTextColor(26, 58, 92);
    doc.setFontSize(13);
    doc.setFont(undefined, 'bold');
    doc.text('Résumé financier', 14, y);
    y += 6;

    autoTable(doc, {
      startY: y,
      head: [['Indicateur', 'Valeur']],
      body: [
        ['Total Recettes', `${rapport.resume.total_recettes.toLocaleString('fr-FR')} Ar`],
        ['Total Dépenses', `${rapport.resume.total_depenses.toLocaleString('fr-FR')} Ar`],
        ['Solde Net', `${rapport.resume.solde_net.toLocaleString('fr-FR')} Ar`],
        ["Nombre d'opérations", rapport.resume.nombre_operations],
      ],
      theme: 'grid',
      headStyles: { fillColor: [26, 58, 92] },
      styles: { fontSize: 10 },
      margin: { left: 14, right: 14 },
    });

    y = doc.lastAutoTable.finalY + 12;

    // Demandes par statut
    if (rapport.demandes?.length) {
      doc.setFontSize(13);
      doc.setFont(undefined, 'bold');
      doc.text('Demandes', 14, y);
      y += 6;

      autoTable(doc, {
        startY: y,
        head: [['Statut', 'Nombre']],
        body: rapport.demandes.map(d => [d.statut, d.nombre]),
        theme: 'grid',
        headStyles: { fillColor: [26, 58, 92] },
        styles: { fontSize: 10 },
        margin: { left: 14, right: 14 },
      });
      y = doc.lastAutoTable.finalY + 12;
    }

    // Alertes par type
    if (rapport.alertes_par_type?.length) {
      doc.setFontSize(13);
      doc.setFont(undefined, 'bold');
      doc.text('Alertes par type', 14, y);
      y += 6;

      autoTable(doc, {
        startY: y,
        head: [['Type', 'Nombre']],
        body: rapport.alertes_par_type.map(a => [a.type, a.nombre]),
        theme: 'grid',
        headStyles: { fillColor: [26, 58, 92] },
        styles: { fontSize: 10 },
        margin: { left: 14, right: 14 },
      });
      y = doc.lastAutoTable.finalY + 12;
    }

    // Détail par agence — nouvelle page pour ne pas tasser
    doc.addPage();
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(26, 58, 92);
    doc.text('Détail par agence', 14, 18);

    autoTable(doc, {
      startY: 24,
      head: [['Agence', 'Recettes', 'Dépenses', 'Solde', 'Alertes']],
      body: rapport.detail_agences.map(a => [
        a.agence,
        `${a.recettes.toLocaleString('fr-FR')} Ar`,
        `${a.depenses.toLocaleString('fr-FR')} Ar`,
        `${a.solde.toLocaleString('fr-FR')} Ar`,
        a.nombre_alertes,
      ]),
      theme: 'grid',
      headStyles: { fillColor: [26, 58, 92] },
      styles: { fontSize: 9 },
      margin: { left: 14, right: 14 },
    });

    // Pied de page avec date de génération
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150);
      doc.text(
        `Généré le ${new Date().toLocaleString('fr-FR')}`,
        14,
        doc.internal.pageSize.getHeight() - 10
      );
    }

    doc.save(`rapport_${periode}_${date}.pdf`);
  };

  const handleGenerer = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `http://localhost:3000/api/admin/rapports?periode=${periode}&date=${date}`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Erreur lors de la génération");

      genererPDF(result.data);

      setRapportsGeneres(prev => [
        { titre: `Rapport ${periode === 'jour' ? 'journalier' : 'mensuel'} — ${date}`, type: 'PDF', date: new Date().toLocaleDateString('fr-FR') },
        ...prev
      ]);
      setModalOpen(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <button
        onClick={() => setModalOpen(true)}
        className="px-4 py-2 rounded-xl text-sm font-semibold text-white flex items-center gap-2"
        style={{ backgroundColor: '#1a3a5c' }}
      >
        <Download size={16} /> Générer un rapport
      </button>

      {rapportsGeneres.length === 0 ? (
        <div className="bg-white rounded-xl border shadow-sm p-8 text-center text-gray-400">
          <FileText size={32} className="mx-auto mb-2 opacity-50" />
          Aucun rapport généré pour l'instant
        </div>
      ) : (
        <div className="bg-white rounded-xl border shadow-sm divide-y">
          {rapportsGeneres.map((r, i) => (
            <div key={i} className="flex items-center justify-between p-4 hover:bg-gray-50 transition">
              <div>
                <p className="font-semibold text-gray-700 text-sm">{r.titre}</p>
                <p className="text-xs text-gray-400">{r.date}</p>
              </div>
              <span className="px-2 py-1 rounded text-xs font-bold bg-red-100 text-red-600">{r.type}</span>
            </div>
          ))}
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <h3 className="font-bold text-lg text-gray-800 mb-4">Générer un rapport</h3>

            <label className="text-sm font-semibold text-gray-600 mb-2 block">Type de période</label>
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setPeriode('jour')}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold border ${periode === 'jour' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600'}`}
              >
                Journalier
              </button>
              <button
                onClick={() => setPeriode('mois')}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold border ${periode === 'mois' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600'}`}
              >
                Mensuel
              </button>
            </div>

            <label className="text-sm font-semibold text-gray-600 mb-2 block">
              {periode === 'jour' ? 'Choisir le jour' : 'Choisir un jour du mois'}
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm mb-4"
            />

            {error && <p className="text-red-500 text-xs mb-3">{error}</p>}

            <div className="flex gap-2">
              <button onClick={() => setModalOpen(false)} className="flex-1 py-2 rounded-lg border text-gray-600 text-sm font-semibold">
                Annuler
              </button>
              <button
                onClick={handleGenerer}
                disabled={isLoading}
                className="flex-1 py-2 rounded-lg text-white text-sm font-semibold disabled:opacity-50"
                style={{ backgroundColor: '#1a3a5c' }}
              >
                {isLoading ? 'Génération...' : 'Générer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}