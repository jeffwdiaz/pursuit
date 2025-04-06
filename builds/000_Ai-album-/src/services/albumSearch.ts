import { Album } from '@/types/album';

// YouTube Data API v3 key limit is 10,000 units per day (1 search = ~100 units)
// For demo purposes, we're using a free-tier approach
const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY; // Replace with your actual key

export async function searchForAlbum(query: string): Promise<Album[]> {
  try {
    // For demo purposes, if no API key is set, use a mock response
    if (YOUTUBE_API_KEY === 'YOUR_YOUTUBE_API_KEY') {
      return getMockAlbums(query);
    }
    
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
        query + ' full album'
      )}&type=video&videoCategoryId=10&maxResults=6&key=${YOUTUBE_API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error('YouTube API error');
    }
    
    const data = await response.json();
    
    return data.items.map((item: any) => ({
      id: item.id.videoId,
      title: item.snippet.title,
      artist: extractArtistFromTitle(item.snippet.title),
      thumbnailUrl: item.snippet.thumbnails.high.url,
      link: `https://www.youtube.com/watch?v=${item.id.videoId}`,
      type: detectReleaseType(item.snippet.title),
      year: extractYearFromTitle(item.snippet.title),
    }));
  } catch (error) {
    console.error('Album search error:', error);
    return getMockAlbums(query);
  }
}

function extractArtistFromTitle(title: string): string {
  // Try to extract artist from "Artist - Title" format
  const dashMatch = title.match(/^(.*?)\s*[-–—]\s/);
  if (dashMatch) return dashMatch[1].trim();
  
  // If the title contains "by", try to extract what comes after
  const byMatch = title.match(/\bby\s+(.*?)(\s|\(|$)/i);
  if (byMatch) return byMatch[1].trim();
  
  // Otherwise return the first part (best guess)
  return title.split(' ').slice(0, 2).join(' ');
}

function extractYearFromTitle(title: string): string | undefined {
  // Look for a year in parentheses
  const yearMatch = title.match(/\((\d{4})\)/);
  if (yearMatch) return yearMatch[1];
  
  // Look for just a 4-digit year
  const digitMatch = title.match(/\b(19|20)\d{2}\b/);
  if (digitMatch) return digitMatch[0];
  
  return undefined;
}

function detectReleaseType(title: string): 'Album' | 'Single' | 'EP' | 'Compilation' {
  const lowerTitle = title.toLowerCase();
  
  if (lowerTitle.includes('single') || lowerTitle.includes('track')) {
    return 'Single';
  } else if (lowerTitle.includes('ep')) {
    return 'EP';
  } else if (lowerTitle.includes('compilation') || lowerTitle.includes('collection') || lowerTitle.includes('best of')) {
    return 'Compilation';
  }
  
  return 'Album';
}

// Mock function for demo purposes without API key
function getMockAlbums(query: string): Album[] {
  // Extract potential artist and album name
  const parts = query.split(/\s+/);
  const artistPart = parts.slice(0, Math.ceil(parts.length / 2)).join(' ');
  const albumPart = parts.slice(Math.ceil(parts.length / 2)).join(' ');
  
  // Create mock albums based on the search query
  return [
    {
      id: '1',
      title: query.length > 10 ? query : 'The Album',
      artist: artistPart || 'The Artist',
      thumbnailUrl: 'https://picsum.photos/seed/album1/300/300',
      link: 'https://youtube.com/watch?v=dQw4w9WgXcQ',
      type: 'Album',
      year: '2023',
    },
    {
      id: '2',
      title: albumPart + ' (Deluxe Edition)',
      artist: artistPart || 'The Artist',
      thumbnailUrl: 'https://picsum.photos/seed/album2/300/300',
      link: 'https://open.spotify.com/album/sample',
      type: 'Compilation',
      year: '2022',
    },
    {
      id: '3',
      title: albumPart + ' EP',
      artist: artistPart || 'The Artist',
      thumbnailUrl: 'https://picsum.photos/seed/album3/300/300',
      link: 'https://youtube.com/watch?v=sample3',
      type: 'EP',
      year: '2021',
    },
  ];
}
