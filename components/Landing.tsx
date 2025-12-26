
import React, { useState, useEffect } from 'react';

interface LandingProps {
  onExplore: () => void;
  onAbout: () => void;
}

const Landing: React.FC<LandingProps> = ({ onExplore, onAbout }) => {
  const [currentImage, setCurrentImage] = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);

  // Detectar si es desktop o móvil
  useEffect(() => {
    const checkIsDesktop = () => {
      setIsDesktop(window.innerWidth >= 768);
    };

    checkIsDesktop();
    window.addEventListener('resize', checkIsDesktop);

    return () => window.removeEventListener('resize', checkIsDesktop);
  }, []);

  // Imágenes diferentes para desktop y móvil
  const mobileImages = [
    "/hero1.jpg",
    "/hero2.jpg",
    "/hero3.jpg"
  ];

  const desktopImages = [
    "/hero-desktop1.jpg",
    "/hero-desktop2.jpg",
    "/hero-desktop3.jpg"
  ];

  const images = isDesktop ? desktopImages : mobileImages;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <div className="relative h-screen w-full overflow-hidden bg-black">
      {/* Carousel Background */}
      {images.map((img, index) => (
        <div
          key={index}
          className={`absolute inset-0 bg-cover bg-center transition-opacity duration-[2000ms] ease-in-out ${index === currentImage ? 'opacity-100 scale-105' : 'opacity-0 scale-100'
            }`}
          style={{
            backgroundImage: `url("${img}")`,
            transitionProperty: 'opacity, transform'
          }}
        />
      ))}

      {/* Overlays */}
      <div className="absolute inset-0 bg-black/40" />
      <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-transparent to-black/20" />

      {/* Central Content */}
      <div className="relative h-full flex flex-col items-center justify-center px-6 text-center">
        <div className="animate-fade-in-up flex flex-col items-center">
          <h1 className="text-5xl md:text-8xl lg:text-9xl font-black text-white tracking-tighter leading-none mb-6">
            Bienvenidos a <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-primary to-white bg-[length:200%_auto] animate-shimmer">
              BOKKYPHOTOS
            </span>
          </h1>
          <p className="text-slate-200 text-base md:text-xl font-medium max-w-md md:max-w-2xl mx-auto leading-relaxed mb-10 opacity-80">
            Capturando momentos, preservando historias. <br className="hidden md:block" />
            Descubre nuestro portafolio de alta gama y calidad cinematográfica.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={onExplore}
              className="group relative flex items-center justify-center gap-2.5 bg-white text-black px-8 py-4 md:px-10 md:py-5 rounded-xl font-black text-xs md:text-sm uppercase tracking-widest overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-xl shadow-white/5 w-full sm:w-auto"
            >
              <div className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-10 transition-opacity" />
              <span>Visitar Galería</span>
              <span className="material-symbols-outlined text-lg md:text-xl transition-transform group-hover:translate-x-1">arrow_forward</span>
            </button>

            <button
              onClick={onAbout}
              className="group relative flex items-center justify-center gap-2.5 bg-white/5 text-white border border-white/10 px-8 py-4 md:px-10 md:py-5 rounded-xl font-black text-xs md:text-sm uppercase tracking-widest backdrop-blur-md transition-all hover:bg-white/10 hover:scale-105 active:scale-95 w-full sm:w-auto"
            >
              <span>Sobre Mí</span>
              <span className="material-symbols-outlined text-lg md:text-xl transition-transform group-hover:translate-x-1">person</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Indicators */}
      <div className="absolute bottom-10 left-0 w-full flex justify-center gap-2">
        {images.map((_, index) => (
          <div
            key={index}
            className={`h-1 rounded-full transition-all duration-500 ${index === currentImage ? 'w-12 bg-primary' : 'w-3 bg-white/30'
              }`}
          />
        ))}
      </div>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          to { background-position: 200% center; }
        }
        .animate-fade-in-up {
          animation: fadeInUp 1.2s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        }
        .animate-shimmer {
          animation: shimmer 4s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default Landing;
