
import React, { useState } from 'react';
import Landing from './components/Landing';
import Dashboard from './components/Dashboard';
import Organization from './components/Organization';
import Uploader from './components/Uploader';
import GalleryDetail from './components/GalleryDetail';
import AdminLogin from './components/AdminLogin';
import BottomNav from './components/BottomNav';
import { AppView } from './types';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>('LANDING');
  const [isAdmin, setIsAdmin] = useState(false);

  const handleAdminLoginSuccess = () => {
    setIsAdmin(true);
    setView('ALBUMS');
  };

  const handleAdminLogout = () => {
    setIsAdmin(false);
    setView('ALBUMS');
  };

  const renderView = () => {
    switch (view) {
      case 'LANDING':
        return <Landing onExplore={() => setView('ALBUMS')} />;
      case 'ADMIN_LOGIN':
        return (
          <AdminLogin 
            onLoginSuccess={handleAdminLoginSuccess} 
            onCancel={() => setView('ALBUMS')} 
          />
        );
      case 'DASHBOARD':
        return <Dashboard 
          isAdmin={isAdmin}
          onNavigate={(v) => setView(v)} 
          onOpenGallery={() => setView('GALLERY_DETAIL')} 
        />;
      case 'ALBUMS':
        return <Organization 
          isAdmin={isAdmin}
          onAdminLogout={handleAdminLogout}
          onAdminLoginRequest={() => setView('ADMIN_LOGIN')}
          onBack={() => setView('DASHBOARD')} 
          onOpenGallery={() => setView('GALLERY_DETAIL')} 
        />;
      case 'UPLOADER':
        return <Uploader onBack={() => setView('ALBUMS')} onDone={() => setView('ALBUMS')} />;
      case 'GALLERY_DETAIL':
        return <GalleryDetail isAdmin={isAdmin} onBack={() => setView('ALBUMS')} />;
      default:
        return <Organization 
          isAdmin={isAdmin}
          onAdminLogout={handleAdminLogout}
          onAdminLoginRequest={() => setView('ADMIN_LOGIN')}
          onBack={() => setView('DASHBOARD')} 
          onOpenGallery={() => setView('GALLERY_DETAIL')} 
        />;
    }
  };

  const showBottomNav = view !== 'ADMIN_LOGIN' && view !== 'LANDING';

  return (
    <div className="flex flex-col min-h-screen bg-background-dark text-white">
      <main className="flex-1">
        {renderView()}
      </main>
      {showBottomNav && (
        <div className="pb-20">
          <BottomNav 
            isAdmin={isAdmin}
            currentView={view} 
            onNavigate={(v) => setView(v)} 
            onFabClick={() => setView('UPLOADER')} 
          />
        </div>
      )}
    </div>
  );
};

export default App;
