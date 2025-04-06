import { createWorker, PSM } from 'tesseract.js';

export async function extractTextFromImage(imageUrl: string): Promise<string> {
  try {
    console.log('Starting OCR process...');
    console.log('Creating worker...');
    const worker = await createWorker();
    
    console.log('Loading language...');
    await worker.loadLanguage('eng');
    console.log('Initializing...');
    await worker.initialize('eng');
    
    console.log('Setting parameters...');
    await worker.setParameters({
      tessedit_pageseg_mode: PSM.AUTO
    });
    
    console.log('Processing image...');
    console.log('Image URL:', imageUrl);
    const { data } = await worker.recognize(imageUrl);
    console.log('OCR Result:', data);
    
    await worker.terminate();
    console.log('Worker terminated');
    
    if (!data.text) {
      throw new Error('No text was extracted from the image');
    }
    
    return data.text;
  } catch (error) {
    console.error('OCR Error:', error);
    if (error instanceof Error) {
      throw new Error(`Failed to extract text from image: ${error.message}`);
    } else {
      throw new Error('Failed to extract text from image: Unknown error');
    }
  }
}

export function parseAlbumInfo(text: string): { artist: string; album: string } | null {
  // Remove extra whitespace and normalize text
  const normalizedText = text.trim().replace(/\s+/g, ' ');
  
  // Split into lines and filter out empty ones
  const lines = normalizedText.split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0);
  
  if (lines.length === 0) {
    return null;
  }
  
  // Common patterns for artist - album separation
  const patterns = [
    // Artist - Album pattern
    /^(.+?)\s*[-–—]\s*(.+)$/,
    // "by" pattern (Album by Artist)
    /^(.+?)\s+by\s+(.+)$/i,
    // "presents" pattern (Artist presents Album)
    /^(.+?)\s+presents\s+(.+)$/i,
    // Parentheses pattern (Artist (Album))
    /^(.+?)\s*\((.*?)\)$/,
  ];
  
  // Try each pattern on each line
  for (const line of lines) {
    for (const pattern of patterns) {
      const match = line.match(pattern);
      if (match) {
        // For "by" pattern, swap the groups since album comes first
        if (pattern.toString().includes('by')) {
          return {
            artist: match[2].trim(),
            album: match[1].trim()
          };
        }
        return {
          artist: match[1].trim(),
          album: match[2].trim()
        };
      }
    }
  }
  
  // If no patterns match and we have multiple lines
  if (lines.length >= 2) {
    // Assume first line is artist, second is album
    return {
      artist: lines[0],
      album: lines[1]
    };
  }
  
  // Last resort: split single line by common separators
  const words = lines[0].split(/\s+/);
  if (words.length > 2) {
    const midpoint = Math.ceil(words.length / 2);
    return {
      artist: words.slice(0, midpoint).join(' '),
      album: words.slice(midpoint).join(' ')
    };
  }
  
  return null;
}
