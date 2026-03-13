import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, Image as ImageIcon, RotateCw, Sliders, Check, AlertCircle } from 'lucide-react';
import { blogsApi } from '@/app/lib/blogs';
import { toast } from 'sonner';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  alt: string;
  onAltChange: (alt: string) => void;
  editable: boolean;
  suggestedAlt?: string;
}

export default function ImageUpload({ 
  value, 
  onChange, 
  alt, 
  onAltChange, 
  editable,
  suggestedAlt 
}: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [filters, setFilters] = useState({
    brightness: 100,
    contrast: 100,
    saturate: 100,
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    setUploading(true);
    try {
      const { url } = await blogsApi.uploadMedia(file);
      onChange(url);
      if (!alt && suggestedAlt) {
        onAltChange(suggestedAlt);
      }
      toast.success('Image uploaded and optimized!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (editable) setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (!editable) return;
    
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const resetImage = () => {
    onChange('');
    onAltChange('');
    setRotation(0);
    setFilters({ brightness: 100, contrast: 100, saturate: 100 });
  };

  const filterStyle = {
    filter: `brightness(${filters.brightness}%) contrast(${filters.contrast}%) saturate(${filters.saturate}%)`,
    transform: `rotate(${rotation}deg)`,
    transition: 'all 0.3s ease'
  };

  return (
    <div className="space-y-4">
      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={`relative aspect-video rounded-xl border-2 border-dashed transition-all overflow-hidden flex flex-col items-center justify-center gap-3
          ${isDragging ? 'border-primary bg-primary/5 scale-[1.02]' : 'border-white/10 bg-white/5'}
          ${!value ? 'p-8' : ''}
        `}
      >
        {value ? (
          <>
            <img 
              src={value} 
              alt={alt} 
              style={filterStyle}
              className="w-full h-full object-cover" 
            />
            {editable && (
              <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button 
                  onClick={() => setShowEditor(!showEditor)}
                  className="p-2 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white/40 transition-colors"
                  title="Edit Image"
                >
                  <Sliders size={18} />
                </button>
                <button 
                  onClick={resetImage}
                  className="p-2 rounded-full bg-red-500/80 backdrop-blur-md text-white hover:bg-red-600 transition-colors"
                  title="Remove Image"
                >
                  <X size={18} />
                </button>
              </div>
            )}
          </>
        ) : (
          <>
            <div className={`p-4 rounded-full ${uploading ? 'bg-primary/20 animate-pulse' : 'bg-white/10'}`}>
              <Upload size={24} className={uploading ? 'text-primary' : 'text-text-secondary'} />
            </div>
            <div className="text-center">
              <p className="text-sm font-bold text-(--color-text-primary)">
                {uploading ? 'Optimizing Image...' : 'Drop header image here'}
              </p>
              <p className="text-xs text-text-secondary mt-1">or click to browse</p>
            </div>
            <input 
              type="file" 
              ref={fileInputRef}
              className="absolute inset-0 opacity-0 cursor-pointer" 
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
              disabled={!editable || uploading}
            />
          </>
        )}
      </div>

      {/* Image Editor Controls */}
      <AnimatePresence>
        {showEditor && value && editable && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-4"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-text-secondary uppercase tracking-wider">Image Tuning</span>
              <button 
                onClick={() => setRotation(r => (r + 90) % 360)}
                className="flex items-center gap-2 text-xs text-primary hover:underline"
              >
                <RotateCw size={12} /> Rotate 90°
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.entries(filters).map(([key, val]) => (
                <div key={key}>
                  <div className="flex justify-between mb-1">
                    <label className="text-[10px] text-text-secondary uppercase">{key}</label>
                    <span className="text-[10px] text-primary">{val}%</span>
                  </div>
                  <input 
                    type="range" 
                    min="50" max="150" value={val}
                    onChange={(e) => setFilters(f => ({ ...f, [key]: parseInt(e.target.value) }))}
                    className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Alt Text Section */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-text-secondary uppercase tracking-wider block">Accessibility (Alt Text)</label>
        <div className="relative">
          <input
            type="text"
            value={alt}
            onChange={(e) => onAltChange(e.target.value)}
            disabled={!editable}
            placeholder="Describe the image for screen readers..."
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm focus:ring-2 focus:ring-primary outline-none transition-all pr-24"
          />
          {suggestedAlt && !alt && (
            <button
              onClick={() => onAltChange(suggestedAlt)}
              className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 rounded-lg bg-primary/20 text-primary text-[10px] font-bold hover:bg-primary/30 transition-all flex items-center gap-1"
            >
              <Check size={10} /> Suggestion
            </button>
          )}
        </div>
        {suggestedAlt && !alt && (
          <div className="flex items-start gap-2 p-2 rounded-lg bg-sapphire/10 border border-sapphire/20">
            <AlertCircle size={12} className="text-sapphire mt-0.5 shrink-0" />
            <p className="text-[10px] text-text-secondary">
              Pro-tip: Use "<span className="text-sapphire italic">{suggestedAlt}</span>" to improve accessibility.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
