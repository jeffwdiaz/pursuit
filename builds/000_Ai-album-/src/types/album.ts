
export interface Album {
  id: string;
  title: string;
  artist: string;
  thumbnailUrl: string;
  link: string;
  type: 'Album' | 'Single' | 'EP' | 'Compilation';
  year?: string;
}
