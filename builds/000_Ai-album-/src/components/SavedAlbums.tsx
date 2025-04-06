
import React, { useState } from 'react';
import AlbumCard from './AlbumCard';
import { Album } from '@/types/album';
import { BookmarkX, Search } from 'lucide-react';

interface SavedAlbumsProps {
  albums: Album[];
  onRemove: (albumId: string) => void;
}

const SavedAlbums: React.FC<SavedAlbumsProps> = ({ albums, onRemove }) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredAlbums = searchTerm 
    ? albums.filter(album => 
        album.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        album.artist.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : albums;
  
  if (albums.length === 0) {
    return (
      <div className="my-10 flex flex-col items-center justify-center py-12 animate-fade-in">
        <div className="w-16 h-16 rounded-full bg-album-secondary flex items-center justify-center mb-4">
          <BookmarkX className="h-8 w-8 text-album-dark/50" />
        </div>
        <h3 className="text-lg font-semibold mb-1">No saved albums yet</h3>
        <p className="text-album-dark/70 text-center max-w-md">
          Start by scanning album covers to find and save your favorite music
        </p>
      </div>
    );
  }
  
  return (
    <div className="my-10 animate-fade-in">
      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-album-dark/40" />
        </div>
        <input
          type="text"
          placeholder="Search your saved albums..."
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-album-dark/10 focus:outline-none focus:ring-2 focus:ring-album-accent/30 transition-all"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      {filteredAlbums.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-album-dark/70">No albums match your search</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAlbums.map((album) => (
            <AlbumCard 
              key={album.id} 
              album={album} 
              onSave={() => onRemove(album.id)}
              isSaved={true}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedAlbums;
