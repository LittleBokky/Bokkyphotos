
import React, { useState } from 'react';

interface AdminLoginProps {
  onLoginSuccess: () => void;
  onCancel: () => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess, onCancel }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would be a secure API call. 
    // For this prototype, we use a default admin credential.
    if (username === 'bokkyphotos@gmail.com' && password === 'RafabokkyphotosAdmin2002?!.,') {
      onLoginSuccess();
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-background-dark flex flex-col items-center justify-center px-6">
      {/* Background Decor */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-500/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-primary/20">
            <span className="material-symbols-outlined text-4xl text-primary filled">lock</span>
          </div>
          <h1 className="text-3xl font-black tracking-tighter text-white mb-2">Acceso Privado</h1>
          <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">Solo Personal Autorizado</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Email Administrador</label>
            <input
              type="email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full h-14 bg-surface-dark border border-white/5 rounded-2xl px-6 text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none font-bold placeholder:text-slate-700"
              placeholder="admin@ejemplo.com"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-14 bg-surface-dark border border-white/5 rounded-2xl px-6 text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none font-bold placeholder:text-slate-700"
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl text-center">
              <p className="text-red-500 text-xs font-bold uppercase tracking-widest">Credenciales Incorrectas</p>
            </div>
          )}

          <div className="flex flex-col gap-4 pt-4">
            <button
              type="submit"
              className="w-full h-14 bg-primary text-white font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
            >
              Iniciar Sesión
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="w-full h-14 bg-white/5 text-slate-400 font-black uppercase tracking-widest rounded-2xl border border-white/5 hover:bg-white/10 transition-all"
            >
              Cancelar
            </button>
          </div>
        </form>

        <p className="mt-12 text-center text-[10px] text-slate-600 font-bold uppercase tracking-widest">
          Bokkyphotos Pro Engine v2.5
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
