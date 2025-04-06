
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Music, History, BookMarked } from 'lucide-react';

const Header: React.FC = () => {
  const location = useLocation();
  
  return (
    <header className="w-full py-4 px-6 sticky top-0 z-50 glass">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-album-accent rounded-xl flex items-center justify-center text-white transition-all group-hover:scale-110">
            <Music size={20} />
          </div>
          <span className="font-semibold text-xl bg-clip-text bg-gradient-to-r from-album-dark to-album-accent">
            AlbumFinderAI
          </span>
        </Link>
        
        <nav className="flex items-center gap-4">
          <Link 
            to="/" 
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
              location.pathname === '/' 
                ? 'bg-album-accent/10 text-album-accent font-medium' 
                : 'hover:bg-album-secondary'
            }`}
          >
            <BookMarked size={18} />
            <span>Scan Albums</span>
          </Link>
          
          <Link 
            to="/history" 
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
              location.pathname === '/history' 
                ? 'bg-album-accent/10 text-album-accent font-medium' 
                : 'hover:bg-album-secondary'
            }`}
          >
            <History size={18} />
            <span>History</span>
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
