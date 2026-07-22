import React from 'react';
import { Building2, Users, TrendingUp, TrendingDown, Bell } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import StatCard from '../components/StatCard';
import AlertCard from '../components/AlertCard';

const lineData = [
  { mois: 'Jan', recettes: 40, depenses: 30 },
  { mois: 'Fév', recettes: 55, depenses: 40 },
  { mois: 'Mar', recettes: 45, depenses: 50 },
  { mois: 'Avr', recettes: 70, depenses: 45 },
  { mois: 'Mai', recettes: 60, depenses: 55 },
  { mois: 'Jun', recettes: 80, depenses: 60 },
];

const agencesData = [
  { name: 'Ag1', solde: 12 }, { name: 'Ag2', solde: 8 }, { name: 'Ag3', solde: 15 },
  { name: 'Ag4', solde: -3 }, { name: 'Ag5', solde: 10 }, { name: 'Ag6', solde: 7 },
];

const recentAlerts = [
  { type: 'Dépassement de plafond', description: 'Dépense de 8 500 000 Ar — Agence 7', level: 'CRITIQUE', date: '10:45' },
  { type: 'Modification d\'opération', description: 'OP-2024-015 modifiée — Agence 3', level: 'ÉLEVÉ', date: '10:30' },
  { type: 'Solde faible', description: 'Agence 12 — solde < seuil minimum', level: 'MOYEN', date: '09:50' },
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Agences" value="19" sub="Toutes actives" color="blue" icon={Building2} />
        <StatCard title="Utilisateurs" value="125" sub="Agents connectés" color="green" icon={Users} />
        <StatCard title="Total Recettes" value="258,45M Ar" sub="Ce mois" color="green" icon={TrendingUp} />
        <StatCard title="Total Dépenses" value="210,23M Ar" sub="Ce mois" color="red" icon={TrendingDown} />
      </div>

      {/* Solde global */}
      <div className="bg-white rounded-xl p-5 border shadow-sm">
        <p className="text-sm text-gray-500 mb-1">Solde Global Consolidé</p>
        <p className="font-display text-3xl font-bold text-green-600">48 220 000 Ar</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Graphe évolution */}
        <div className="lg:col-span-2 bg-white rounded-xl p-5 border shadow-sm">
          <h3 className="font-semibold text-gray-700 mb-4">Évolution Recettes / Dépenses</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={lineData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="mois" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Line type="monotone" dataKey="recettes" stroke="#27ae60" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="depenses" stroke="#e74c3c" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Alertes récentes */}
        <div className="bg-white rounded-xl p-5 border shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-700">Alertes Récentes</h3>
            <Bell size={16} className="text-red-500" />
          </div>
          {recentAlerts.map((a, i) => <AlertCard key={i} {...a} />)}
        </div>
      </div>

      {/* Solde par agence */}
      <div className="bg-white rounded-xl p-5 border shadow-sm">
        <h3 className="font-semibold text-gray-700 mb-4">Solde par Agence (en M Ar)</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={agencesData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Bar dataKey="solde" fill="#2980b9" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}