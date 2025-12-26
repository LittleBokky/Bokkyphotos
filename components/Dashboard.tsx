
import React, { useEffect, useState } from 'react';
import { AppView } from '../types';
import { getAIPortfolioTip } from '../services/geminiService';

interface DashboardProps {
  isAdmin: boolean;
  onNavigate: (view: AppView) => void;
  onOpenGallery: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ isAdmin, onNavigate, onOpenGallery }) => {
  return (
    <div className="flex flex-col min-h-screen bg-background-dark text-slate-200 items-center">
      <div className="w-full max-w-6xl">
        {/* Bio / Hero Section - Split Layout for PC */}
        <div className="flex flex-col md:flex-row md:items-stretch min-h-[60vh] md:min-h-[80vh] bg-surface-dark md:rounded-b-[4rem] overflow-hidden">
          {/* Image Side */}
          <div className="w-full md:w-1/2 relative aspect-square md:aspect-auto">
            <div
              className="absolute inset-0 bg-cover bg-[center_5%] md:bg-center"
              style={{ backgroundImage: 'url("/profile.jpg")' }}
            />
            {/* Overlay for mobile to ensure text readability if it goes on top, but here we split */}
            <div className="absolute inset-0 bg-gradient-to-t from-surface-dark via-transparent to-transparent md:hidden" />
          </div>

          {/* Text Side */}
          <div className="w-full md:w-1/2 p-8 md:p-20 flex flex-col justify-center relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] rounded-full" />

            <div className="relative z-10">
              <span className="text-primary text-[10px] md:text-xs font-black uppercase tracking-[0.4em] mb-4 block">EL FOTÓGRAFO</span>
              <h1 className="text-5xl md:text-8xl font-black text-white leading-none mb-8 tracking-tighter">
                Rafael <br className="hidden md:block" /> Bocanegra
              </h1>
              <div className="w-20 h-1.5 bg-primary mb-8 md:mb-12 rounded-full" />
              <p className="text-slate-300 text-lg md:text-xl max-w-md leading-relaxed font-medium">
                Fotógrafo freelance especializado en la captura de paisajes majestuosos y la adrenalina de los eventos deportivos.
                Transformando la realidad en arte visual con una mirada única y profesional.
              </p>
            </div>
          </div>
        </div>

        {/* Info Sections */}
        <div className="px-6 py-12 md:px-12 md:py-24 space-y-20 md:space-y-32">
          {/* Experience Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            <div className="p-8 rounded-[2rem] bg-card-dark border border-white/5 flex flex-col items-center text-center group hover:border-primary/30 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined">workspace_premium</span>
              </div>
              <h3 className="text-3xl font-black text-white mb-1">8+ Años</h3>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">De Experiencia</p>
            </div>
            <div className="p-8 rounded-[2rem] bg-card-dark border border-white/5 flex flex-col items-center text-center group hover:border-primary/30 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined">sports_mma</span>
              </div>
              <h3 className="text-xl font-black text-white mb-1 leading-tight">Campeonatos Grappling</h3>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Cobertura Nacional</p>
            </div>
            <div className="p-8 rounded-[2rem] bg-card-dark border border-white/5 flex flex-col items-center text-center group hover:border-primary/30 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined">business_center</span>
              </div>
              <h3 className="text-xl font-black text-white mb-1 leading-tight">Servicios Empresa</h3>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Actividades Profesionales</p>
            </div>
            <div className="p-8 rounded-[2rem] bg-card-dark border border-white/5 flex flex-col items-center text-center group hover:border-primary/30 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined">person_pin_circle</span>
              </div>
              <h3 className="text-xl font-black text-white mb-1 leading-tight">Sesiones Freelance</h3>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Clientes Personalizados</p>
            </div>
          </div>

          {/* Contact CTA */}
          <div className="flex flex-col gap-10">
            <div className="flex flex-col items-center md:items-start">
              <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.4em] mb-4">Canales de Contacto</h3>
              <div className="w-12 h-1 bg-white/10 rounded-full" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <a href="mailto:bokkyphotos@gmail.com" className="flex items-center justify-between p-8 rounded-[2rem] bg-surface-dark border border-white/5 hover:border-primary transition-all group overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-[50px] rounded-full group-hover:bg-primary/10 transition-all" />
                <div className="flex items-center gap-6 relative z-10">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined">mail</span>
                  </div>
                  <span className="text-lg font-bold">bokkyphotos@gmail.com</span>
                </div>
                <span className="material-symbols-outlined text-slate-600 group-hover:translate-x-2 transition-transform relative z-10">arrow_forward</span>
              </a>
              <a
                href="https://www.instagram.com/bokkyphotos/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-8 rounded-[2rem] bg-surface-dark border border-white/5 hover:border-pink-500 transition-all group overflow-hidden relative"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/5 blur-[50px] rounded-full group-hover:bg-pink-500/10 transition-all" />
                <div className="flex items-center gap-6 relative z-10">
                  <div className="w-12 h-12 rounded-2xl bg-pink-500/10 text-pink-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined">photo_camera</span>
                  </div>
                  <span className="text-lg font-bold">@bokkyphotos</span>
                </div>
                <span className="material-symbols-outlined text-slate-600 group-hover:translate-x-2 transition-transform relative z-10">arrow_forward</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
