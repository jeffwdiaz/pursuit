
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import SavedAlbums from '@/components/SavedAlbums';
import { Album } from '@/types/album';
import { toast } from '@/components/ui/use-toast';
import { History as HistoryIcon, Trash2 } from 'lucide-react';

const History: React.FC = () => {
  const [savedAlbums, setSavedAlbums] = useState<Album[]>([]);
  
  // Load saved albums from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('savedAlbums');
    if (saved) {
      setSavedAlbums(JSON.parse(saved));
    }
  }, []);
  
  const handleRemoveAlbum = (albumId: string) => {
    const albumToRemove = savedAlbums.find(album => album.id === albumId);
    const updated = savedAlbums.filter(album => album.id !== albumId);
    
    setSavedAlbums(updated);
    localStorage.setItem('savedAlbums', JSON.stringify(updated));
    
    if (albumToRemove) {
      toast({
        title: 'Album removed',
        description: `"${albumToRemove.title}" has been removed from your saved albums`,
      });
    }
  };
  
  const handleClearAll = () => {
    if (savedAlbums.length === 0) return;
    
    if (confirm('Are you sure you want to remove all saved albums?')) {
      setSavedAlbums([]);
      localStorage.removeItem('savedAlbums');
      
      toast({
        title: 'All albums removed',
        description: 'Your saved albums list has been cleared',
      });
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-album-primary to-white">
      <Header />
      
      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-8">
        <div className="flex justify-between items-center mb-8 animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-album-accent/10 flex items-center justify-center">
              <HistoryIcon className="h-5 w-5 text-album-accent" />
            </div>
            <h1 className="text-2xl font-bold">Your Saved Albums</h1>
          </div>
          
          {savedAlbums.length > 0 && (
            <button 
              onClick={handleClearAll}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm text-red-500 hover:bg-red-50 transition-colors"
            >
              <Trash2 className="h-4 w-4" />
              <span>Clear All</span>
            </button>
          )}
        </div>
        
        <SavedAlbums 
          albums={savedAlbums} 
          onRemove={handleRemoveAlbum} 
        />
      </main>
      
      <footer className="py-6 border-t border-album-dark/10 mt-auto">
        <div className="max-w-5xl mx-auto px-6 text-center text-sm text-album-dark/60">
          AlbumFinderAI • Powered by Tesseract OCR
        </div>
      </footer>
    </div>
  );
};

export default History;
