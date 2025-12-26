
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
  const [selectedAlbumId, setSelectedAlbumId] = useState<string | null>(null);

  const handleAdminLoginSuccess = () => {
    setIsAdmin(true);
    setView('ALBUMS');
  };

  const handleAdminLogout = () => {
    setIsAdmin(false);
    setView('ALBUMS');
  };

  const renderView = () => {
    let content;
    switch (view) {
      case 'LANDING':
        content = <Landing onExplore={() => setView('ALBUMS')} />;
        break;
      case 'ADMIN_LOGIN':
        content = (
          <AdminLogin
            onLoginSuccess={handleAdminLoginSuccess}
            onCancel={() => setView('ALBUMS')}
          />
        );
        break;
      case 'DASHBOARD':
        content = <Dashboard
          isAdmin={isAdmin}
          onNavigate={(v) => {
            if (v === 'ALBUMS') setSelectedAlbumId(null);
            setView(v);
          }}
          onOpenGallery={() => {
            setView('ALBUMS');
          }}
        />;
        break;
      case 'ALBUMS':
        content = <Organization
          isAdmin={isAdmin}
          onAdminLogout={handleAdminLogout}
          onAdminLoginRequest={() => setView('ADMIN_LOGIN')}
          onBack={() => setView('DASHBOARD')}
          onOpenGallery={(albumId) => {
            setSelectedAlbumId(albumId);
            setView('GALLERY_DETAIL');
          }}
        />;
        break;
      case 'UPLOADER':
        content = <Uploader albumId={selectedAlbumId} onBack={() => setView('ALBUMS')} onDone={() => setView('ALBUMS')} />;
        break;
      case 'GALLERY_DETAIL':
        content = (
          <GalleryDetail
            isAdmin={isAdmin}
            albumId={selectedAlbumId}
            onBack={() => {
              setSelectedAlbumId(null);
              setView('ALBUMS');
            }}
            onAddPhotos={() => setView('UPLOADER')}
          />
        );
        break;
      default:
        content = <Organization
          isAdmin={isAdmin}
          onAdminLogout={handleAdminLogout}
          onAdminLoginRequest={() => setView('ADMIN_LOGIN')}
          onBack={() => setView('DASHBOARD')}
          onOpenGallery={(albumId) => {
            setSelectedAlbumId(albumId);
            setView('GALLERY_DETAIL');
          }}
        />;
        break;
    }

    return (
      <div key={view} className="animate-page-fade-in min-h-screen">
        {content}
      </div>
    );
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
