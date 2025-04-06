
import React, { useState, useRef } from 'react';
import { Upload, Camera, Loader2 } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface ImageUploaderProps {
  onImageSelected: (image: string) => void;
  isProcessing: boolean;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelected, isProcessing }) => {
  const [dragActive, setDragActive] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file",
        variant: "destructive"
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const imageUrl = e.target?.result as string;
      setPreviewUrl(imageUrl);
      onImageSelected(imageUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const toggleCamera = async () => {
    if (!isCameraOpen) {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
        setIsCameraOpen(true);
      } catch (err) {
        toast({
          title: "Camera access denied",
          description: "Please allow camera access to use this feature",
          variant: "destructive"
        });
      }
    } else {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
        setStream(null);
      }
      setIsCameraOpen(false);
    }
  };

  const takePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        const imageUrl = canvas.toDataURL('image/png');
        setPreviewUrl(imageUrl);
        onImageSelected(imageUrl);
        
        // Stop camera after taking photo
        if (stream) {
          stream.getTracks().forEach(track => track.stop());
          setStream(null);
        }
        setIsCameraOpen(false);
      }
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto mt-8 animate-fade-in">
      <div className="flex flex-col items-center">
        <div 
          className={`w-full h-64 mb-6 rounded-xl border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center relative overflow-hidden
            ${dragActive ? 'border-album-accent bg-album-accent/5' : 'border-album-dark/20 hover:border-album-accent/50 hover:bg-album-secondary/50'}`}
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          {isCameraOpen ? (
            <div className="w-full h-full flex flex-col items-center justify-center">
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                className="max-w-full max-h-full object-contain"
              />
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  takePhoto();
                }}
                className="absolute bottom-4 left-1/2 transform -translate-x-1/2 btn-primary"
              >
                Take Photo
              </button>
            </div>
          ) : (
            <>
              {previewUrl ? (
                <div className="relative w-full h-full">
                  <img 
                    src={previewUrl} 
                    alt="Uploaded album" 
                    className="w-full h-full object-contain animate-blur-in"
                  />
                  {isProcessing && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 backdrop-blur-sm animate-fade-in">
                      <div className="flex flex-col items-center">
                        <Loader2 className="h-8 w-8 text-album-accent animate-spin mb-2" />
                        <p className="text-sm font-medium text-album-dark">Processing image...</p>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center p-6">
                  <Upload className="h-10 w-10 mb-2 text-album-accent mx-auto" />
                  <p className="text-album-dark font-medium mb-1">Drag an album cover image here or click to upload</p>
                  <p className="text-sm text-album-dark/60">Supports PNG, JPG, GIF</p>
                </div>
              )}
            </>
          )}
          
          <input 
            ref={fileInputRef} 
            type="file" 
            accept="image/*" 
            onChange={handleChange} 
            className="hidden" 
          />
        </div>
        
        <canvas ref={canvasRef} className="hidden" />
        
        <div className="flex gap-4 mt-2">
          <button 
            onClick={(e) => {
              e.preventDefault();
              fileInputRef.current?.click();
            }}
            className="btn-secondary"
            disabled={isProcessing}
          >
            <Upload className="h-4 w-4 mr-2 inline-block" />
            Upload Image
          </button>
          
          <button 
            onClick={(e) => {
              e.preventDefault();
              toggleCamera();
            }}
            className={`btn-secondary ${isCameraOpen ? 'bg-album-accent/10 border-album-accent/30' : ''}`}
            disabled={isProcessing}
          >
            <Camera className="h-4 w-4 mr-2 inline-block" />
            {isCameraOpen ? 'Close Camera' : 'Open Camera'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageUploader;
