import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Agences from './pages/Agences';
import Operations from './pages/Operations';
import Alertes from './pages/Alertes';
import Audit from './pages/Audit';
import Rapports from './pages/Rapports';
import Parametres from './pages/Parametres';
import Sidebar from './components/Sidebar';
import Header from './components/Header';

function Layout({ children, page, setPage }) {
  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <Sidebar page={page} setPage={setPage} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header page={page} />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [page, setPage] = useState('dashboard');

  if (!isLoggedIn) return <Login onLogin={() => setIsLoggedIn(true)} />;

  const pages = {
    dashboard: <Dashboard />,
    agences: <Agences />,
    operations: <Operations />,
    alertes: <Alertes />,
    audit: <Audit />,
    rapports: <Rapports />,
    parametres: <Parametres />,
  };

  return (
    <Layout page={page} setPage={setPage}>
      {pages[page] || <Dashboard />}
    </Layout>
  );
}