
import React from 'react';
import { AppView } from '../types';

interface BottomNavProps {
  isAdmin: boolean;
  currentView: AppView;
  onNavigate: (view: AppView) => void;
  onFabClick: () => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ isAdmin, currentView, onNavigate, onFabClick }) => {
  return (
    <div className="fixed bottom-0 w-full flex justify-center z-50">
      <div className="w-full max-w-xl bg-background-dark/80 backdrop-blur-2xl border-t md:border-x border-white/5 md:rounded-t-[2.5rem] pb-safe pt-2 px-10 shadow-2xl">
        <div className="flex justify-around items-center h-16 relative">
          <button
            onClick={() => onNavigate('LANDING')}
            className={`flex flex-col items-center gap-1.5 transition-all duration-300 ${currentView === 'LANDING' ? 'text-primary' : 'text-slate-500 hover:text-slate-300'}`}
          >
            <span className={`material-symbols-outlined text-2xl ${currentView === 'LANDING' ? 'filled' : ''}`}>home</span>
            <span className="text-[9px] font-black uppercase tracking-[0.1em]">Inicio</span>
          </button>

          <button
            onClick={() => onNavigate('ALBUMS')}
            className={`flex flex-col items-center gap-1.5 transition-all duration-300 ${currentView === 'ALBUMS' || currentView === 'GALLERY_DETAIL' ? 'text-primary' : 'text-slate-500 hover:text-slate-300'}`}
          >
            <span className={`material-symbols-outlined text-2xl ${(currentView === 'ALBUMS' || currentView === 'GALLERY_DETAIL') ? 'filled' : ''}`}>collections</span>
            <span className="text-[9px] font-black uppercase tracking-[0.1em]">Galerías</span>
          </button>

          {isAdmin && (
            <div className="-mt-12">
              <button
                onClick={onFabClick}
                className="flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-primary text-white shadow-xl shadow-primary/30 active:scale-90 transition-all rotate-45 hover:rotate-[135deg] duration-500"
              >
                <span className="material-symbols-outlined text-2xl md:text-3xl -rotate-45">add</span>
              </button>
            </div>
          )}

          <button
            onClick={() => onNavigate('DASHBOARD')}
            className={`flex flex-col items-center gap-1.5 transition-all duration-300 ${currentView === 'DASHBOARD' ? 'text-primary' : 'text-slate-500 hover:text-slate-300'}`}
          >
            <span className={`material-symbols-outlined text-2xl ${currentView === 'DASHBOARD' ? 'filled' : ''}`}>person</span>
            <span className="text-[9px] font-black uppercase tracking-[0.1em]">Sobre Mi</span>
          </button>
        </div>
        <div className="h-1 md:h-2" />
      </div>
    </div>
  );
};

export default BottomNav;
