
import React, { useEffect, useState } from 'react';
import { AppView } from '../types';
import { getAIPortfolioTip } from '../services/geminiService';

interface DashboardProps {
  isAdmin: boolean;
  onNavigate: (view: AppView) => void;
  onOpenGallery: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ isAdmin, onNavigate, onOpenGallery }) => {
  const [aiTip, setAiTip] = useState<string>("Inspirando momentos únicos...");
  const [isLoadingTip, setIsLoadingTip] = useState(true);

  useEffect(() => {
    const fetchTip = async () => {
      setIsLoadingTip(true);
      const tip = await getAIPortfolioTip({ galleries: 12, photos: 1200, pending: 0 });
      setAiTip(tip || "Capturando la esencia de cada historia.");
      setIsLoadingTip(false);
    };
    fetchTip();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-background-dark text-slate-200 items-center">
      <div className="w-full max-w-5xl">
        {/* Bio / Hero Section */}
        <div className="relative w-full aspect-[4/5] sm:aspect-[16/9] md:aspect-[21/9] overflow-hidden md:rounded-b-[4rem]">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=1600&auto=format&fit=crop")' }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-background-dark/20 to-transparent" />
          <div className="absolute bottom-10 left-6 right-6 md:left-12 md:bottom-16">
            <span className="text-primary text-[10px] md:text-xs font-black uppercase tracking-[0.4em] mb-2 block">EL FOTÓGRAFO</span>
            <h1 className="text-5xl md:text-7xl font-black text-white leading-none mb-4 tracking-tighter">Rafael Bocanegra</h1>
            <p className="text-slate-300 text-sm md:text-base max-w-sm md:max-w-md leading-relaxed">
              Fotógrafo freelance especializado en la captura de paisajes majestuosos y la adrenalina de los eventos deportivos. 
              Transformando la realidad en arte visual con una mirada única y profesional.
            </p>
          </div>
        </div>

        {/* Info Sections */}
        <div className="px-6 py-10 md:px-12 md:py-16 space-y-12 md:space-y-20">
          {/* Quote / AI Insight */}
          <div className="relative p-8 md:p-12 rounded-[2.5rem] md:rounded-[4rem] bg-surface-dark border border-white/5 overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[80px] rounded-full group-hover:bg-primary/20 transition-all duration-700" />
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20">
                <span className="material-symbols-outlined text-xl md:text-2xl">camera</span>
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Filosofía AI</span>
            </div>
            <p className="text-xl md:text-3xl font-bold italic text-white leading-relaxed">
              {isLoadingTip ? "..." : `"${aiTip}"`}
            </p>
          </div>

          {/* Experience Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            <div className="p-6 md:p-8 rounded-3xl bg-card-dark border border-white/5 flex flex-col items-center text-center">
              <h3 className="text-3xl md:text-5xl font-black text-white mb-1">8+</h3>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Años de experiencia</p>
            </div>
            <div className="p-6 md:p-8 rounded-3xl bg-card-dark border border-white/5 flex flex-col items-center text-center">
              <h3 className="text-3xl md:text-5xl font-black text-white mb-1">120+</h3>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Eventos cubiertos</p>
            </div>
            <div className="p-6 md:p-8 rounded-3xl bg-card-dark border border-white/5 flex flex-col items-center text-center">
              <h3 className="text-3xl md:text-5xl font-black text-white mb-1">15k</h3>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Kilómetros viajados</p>
            </div>
            <div className="p-6 md:p-8 rounded-3xl bg-card-dark border border-white/5 flex flex-col items-center text-center">
              <h3 className="text-3xl md:text-5xl font-black text-white mb-1">05</h3>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Exposiciones</p>
            </div>
          </div>

          {/* Contact CTA */}
          <div className="flex flex-col gap-6">
            <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.3em] text-center md:text-left">Canales de Contacto</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <a href="mailto:bokkyphotos@gmail.com" className="flex items-center justify-between p-6 rounded-3xl bg-surface-dark border border-white/5 hover:border-primary transition-all group">
                  <div className="flex items-center gap-4">
                    <span className="material-symbols-outlined text-slate-400 group-hover:text-primary">mail</span>
                    <span className="font-bold">bokkyphotos@gmail.com</span>
                  </div>
                  <span className="material-symbols-outlined text-slate-600 group-hover:translate-x-1 transition-transform">arrow_forward</span>
               </a>
               <a 
                 href="https://www.instagram.com/bokkyphotos/" 
                 target="_blank" 
                 rel="noopener noreferrer" 
                 className="flex items-center justify-between p-6 rounded-3xl bg-surface-dark border border-white/5 hover:border-pink-500 transition-all group cursor-pointer"
               >
                  <div className="flex items-center gap-4">
                    <span className="material-symbols-outlined text-slate-400 group-hover:text-pink-500">photo_camera</span>
                    <span className="font-bold">@bokkyphotos</span>
                  </div>
                  <span className="material-symbols-outlined text-slate-600 group-hover:translate-x-1 transition-transform">arrow_forward</span>
               </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
