
import React, { useState } from 'react';
import { ExternalLink, PlayCircle, Heart, Award } from 'lucide-react';
import { Album } from '@/types/album';

interface AlbumCardProps {
  album: Album;
  onSave: (album: Album) => void;
  isSaved?: boolean;
}

const AlbumCard: React.FC<AlbumCardProps> = ({ album, onSave, isSaved = false }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  
  return (
    <div className="album-card animate-scale-in group">
      <div className="image-container mb-4">
        {!imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-album-secondary">
            <div className="loading-wave">
              <div className="loading-wave-bar"></div>
              <div className="loading-wave-bar"></div>
              <div className="loading-wave-bar"></div>
              <div className="loading-wave-bar"></div>
            </div>
          </div>
        )}
        <img 
          src={album.thumbnailUrl || '/placeholder.svg'} 
          alt={album.title}
          className={`aspect-square object-cover rounded-lg ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setImageLoaded(true)}
        />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
          <a 
            href={album.link} 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-white rounded-full p-3 shadow-lg transform transition-transform duration-300 hover:scale-110"
            onClick={(e) => e.stopPropagation()}
          >
            <PlayCircle className="h-7 w-7 text-album-accent" />
          </a>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="label-chip">{album.type}</div>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onSave(album);
            }}
            className={`p-2 rounded-full transition-all hover:bg-album-secondary ${isSaved ? 'text-red-500' : 'text-album-dark/50 hover:text-album-dark'}`}
          >
            <Heart className={`h-5 w-5 ${isSaved ? 'fill-red-500' : ''}`} />
          </button>
        </div>
        
        <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-album-accent transition-colors">
          {album.title}
        </h3>
        
        <p className="text-sm text-album-dark/70 line-clamp-1">
          {album.artist}
        </p>
        
        {album.year && (
          <div className="flex items-center text-xs text-album-dark/60 gap-1">
            <Award className="h-3 w-3" /> 
            <span>{album.year}</span>
          </div>
        )}
        
        <a 
          href={album.link} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-album-accent font-medium text-sm flex items-center gap-1 mt-2 hover:underline"
          onClick={(e) => e.stopPropagation()}
        >
          Listen <ExternalLink className="h-3 w-3" />
        </a>
      </div>
    </div>
  );
};

export default AlbumCard;
