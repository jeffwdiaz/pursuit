
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import ImageUploader from '@/components/ImageUploader';
import AlbumResults from '@/components/AlbumResults';
import { extractTextFromImage, parseAlbumInfo } from '@/services/imageProcessing';
import { searchForAlbum } from '@/services/albumSearch';
import { Album } from '@/types/album';
import { toast } from '@/components/ui/use-toast';
import { ScanLine, BookOpen } from 'lucide-react';

const Index: React.FC = () => {
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const [isSearchingAlbums, setIsSearchingAlbums] = useState(false);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [savedAlbums, setSavedAlbums] = useState<Album[]>([]);

  // Load saved albums from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('savedAlbums');
    if (saved) {
      setSavedAlbums(JSON.parse(saved));
    }
  }, []);

  const handleImageSelected = async (imageUrl: string) => {
    setError(null);
    setAlbums([]);
    setIsProcessingImage(true);
    
    try {
      // Validate image URL
      if (!imageUrl || !imageUrl.startsWith('data:image/')) {
        throw new Error('Invalid image format. Please upload a valid image file.');
      }

      console.log('Starting image processing...');
      
      // Extract text from image
      const extractedText = await extractTextFromImage(imageUrl);
      console.log('Extracted text:', extractedText);
      
      if (!extractedText || extractedText.trim().length === 0) {
        throw new Error('No text could be extracted from the image. Please ensure the album text is clearly visible.');
      }
      
      // Parse album info
      const albumInfo = parseAlbumInfo(extractedText);
      
      if (!albumInfo) {
        throw new Error('Could not detect album information in the image. Please ensure the artist and album name are visible.');
      }
      
      console.log('Parsed album info:', albumInfo);
      
      // Search for the album
      setIsSearchingAlbums(true);
      setIsProcessingImage(false);
      
      const searchQuery = `${albumInfo.artist} ${albumInfo.album}`.trim();
      
      if (searchQuery.length < 3) {
        throw new Error('Could not extract enough information from the image. Please ensure both artist and album name are visible.');
      }
      
      const foundAlbums = await searchForAlbum(searchQuery);
      setAlbums(foundAlbums);
      
      if (foundAlbums.length === 0) {
        throw new Error('No albums found matching the extracted information. The text might not have been recognized correctly.');
      }
      
      toast({
        title: 'Albums found!',
        description: `Found ${foundAlbums.length} results for "${searchQuery}"`,
      });
      
    } catch (err) {
      console.error('Error processing image:', err);
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred while processing the image';
      setError(errorMessage);
      
      toast({
        title: 'Processing Error',
        description: errorMessage,
        variant: 'destructive',
      });
      
    } finally {
      setIsProcessingImage(false);
      setIsSearchingAlbums(false);
    }
  };

  const handleSaveAlbum = (album: Album) => {
    // Check if album is already saved
    const isAlreadySaved = savedAlbums.some(a => a.id === album.id);
    
    if (isAlreadySaved) {
      // Remove from saved
      const updated = savedAlbums.filter(a => a.id !== album.id);
      setSavedAlbums(updated);
      localStorage.setItem('savedAlbums', JSON.stringify(updated));
      
      toast({
        title: 'Album removed',
        description: `"${album.title}" has been removed from your saved albums`,
      });
    } else {
      // Add to saved
      const updated = [...savedAlbums, album];
      setSavedAlbums(updated);
      localStorage.setItem('savedAlbums', JSON.stringify(updated));
      
      toast({
        title: 'Album saved',
        description: `"${album.title}" has been added to your saved albums`,
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-album-primary to-white">
      <Header />
      
      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-8">
        <div className="text-center mb-10 animate-fade-in">
          <div className="inline-flex items-center justify-center p-2 bg-album-accent/10 rounded-lg mb-4">
            <ScanLine className="w-6 h-6 text-album-accent" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Album Finder AI</h1>
          <p className="text-album-dark/70 max-w-xl mx-auto">
            Upload an image of an album cover and we'll find it on streaming platforms for you
          </p>
        </div>
        
        <ImageUploader 
          onImageSelected={handleImageSelected} 
          isProcessing={isProcessingImage}
        />
        
        <AlbumResults 
          albums={albums} 
          loading={isSearchingAlbums} 
          error={error}
          onSaveAlbum={handleSaveAlbum}
          savedAlbums={savedAlbums}
        />
        
        {albums.length === 0 && !isSearchingAlbums && !error && (
          <div className="my-16 flex flex-col items-center justify-center animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-album-secondary flex items-center justify-center mb-4">
              <BookOpen className="h-8 w-8 text-album-dark/50" />
            </div>
            <h3 className="text-lg font-semibold mb-1">How it works</h3>
            <div className="text-album-dark/70 text-center max-w-lg space-y-4">
              <p>
                1. Take a photo or upload an image of an album cover that contains the album title and artist name
              </p>
              <p>
                2. Our AI will extract the text and search for the album on music streaming platforms
              </p>
              <p>
                3. Browse results and save your favorite albums for later listening
              </p>
            </div>
          </div>
        )}
      </main>
      
      <footer className="py-6 border-t border-album-dark/10 mt-auto">
        <div className="max-w-5xl mx-auto px-6 text-center text-sm text-album-dark/60">
          AlbumFinderAI • Powered by Tesseract OCR
        </div>
      </footer>
    </div>
  );
};

export default Index;
