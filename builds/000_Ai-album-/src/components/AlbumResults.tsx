
import React from 'react';
import AlbumCard from './AlbumCard';
import { Album } from '@/types/album';
import { Music, SearchX } from 'lucide-react';

interface AlbumResultsProps {
  albums: Album[];
  loading: boolean;
  error: string | null;
  onSaveAlbum: (album: Album) => void;
  savedAlbums: Album[];
}

const AlbumResults: React.FC<AlbumResultsProps> = ({ 
  albums, 
  loading, 
  error, 
  onSaveAlbum,
  savedAlbums
}) => {
  const isAlbumSaved = (album: Album) => {
    return savedAlbums.some(saved => saved.id === album.id);
  };

  if (loading) {
    return (
      <div className="my-10 flex flex-col items-center justify-center py-12 animate-fade-in">
        <div className="loading-wave mb-4">
          <div className="loading-wave-bar"></div>
          <div className="loading-wave-bar"></div>
          <div className="loading-wave-bar"></div>
          <div className="loading-wave-bar"></div>
        </div>
        <p className="text-album-dark/70 text-center">Searching for albums...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="my-10 flex flex-col items-center justify-center py-12 animate-fade-in">
        <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-4">
          <SearchX className="h-8 w-8 text-red-500" />
        </div>
        <h3 className="text-lg font-semibold text-red-500 mb-1">Search Error</h3>
        <p className="text-album-dark/70 text-center max-w-md">{error}</p>
      </div>
    );
  }

  if (albums.length === 0) {
    return null;
  }

  return (
    <div className="my-10 animate-fade-in">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-8 h-8 rounded-full bg-album-accent/10 flex items-center justify-center">
          <Music className="h-4 w-4 text-album-accent" />
        </div>
        <h2 className="text-xl font-semibold">Found Albums</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {albums.map((album) => (
          <AlbumCard 
            key={album.id} 
            album={album} 
            onSave={onSaveAlbum}
            isSaved={isAlbumSaved(album)}
          />
        ))}
      </div>
    </div>
  );
};

export default AlbumResults;
