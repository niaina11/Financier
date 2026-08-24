import React, { useState } from 'react';
import { ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Login({ onLogin }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]= useState(null);
  const [isLoading, setIsLoading]= useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(false);
    try {
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type' : 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          email,
          mot_de_passe: password
        })
      })

      const result = await response.json();

      if(!response.ok){
        throw new Error(result.message || 'Erreur lors de login')
      }

      localStorage.setItem('token', result.data.token);
      localStorage.setItem('role', result.data.role);
      localStorage.setItem('id_utilisateur', result.data.id_utilisateur);
      alert(localStorage.getItem('id_utilisateur'))
      navigate('/dashboard');
      
      
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }

  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #1a3a5c 0%, #2980b9 100%)' }}>
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center mb-4">
            <ShieldCheck size={32} className="text-white" />
          </div>
          <h1 className="font-display text-2xl font-bold text-gray-800">Surveillance Financière</h1>
          <p className="text-gray-400 text-sm mt-1">{error && <p className='text-red'>{error}</p>}</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              placeholder="admin@surveillance.mg"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            disabled={isLoading}
            type="submit"
            className="w-full py-3 rounded-xl font-semibold text-white text-sm transition"
            style={{ backgroundColor: '#1a3a5c' }}
          >
            {isLoading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>
      </div>
    </div>
  );
}