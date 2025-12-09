'use client';

import { useState, useRef } from 'react';
import { uploadDocument } from '@/app/actions/documents';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Upload, X, File as FileIcon } from 'lucide-react';

export default function FileUploader({ onUploadComplete }: { onUploadComplete: () => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [category, setCategory] = useState('OTHER');
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files?.[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('category', category);
    
    await uploadDocument(formData);
    setUploading(false);
    setFile(null);
    onUploadComplete();
  };

  return (
    <div className="space-y-4">
      {!file ? (
        <div 
          className="border-2 border-dashed border-white/10 rounded-xl p-8 text-center hover:bg-white/5 transition-colors cursor-pointer"
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
        >
          <Upload className="w-8 h-8 text-white/30 mx-auto mb-4" />
          <p className="text-sm text-white/70">Drag and drop files here, or click to browse</p>
          <p className="text-xs text-white/30 mt-2">PDF, DOCX, XLSX up to 50MB</p>
          <input 
            type="file" 
            ref={inputRef} 
            className="hidden" 
            onChange={(e) => setFile(e.target.files?.[0] || null)} 
          />
        </div>
      ) : (
        <div className="bg-white/5 border border-white/10 rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FileIcon className="w-5 h-5 text-blue-400" />
            <div>
              <p className="text-sm font-medium text-white">{file.name}</p>
              <p className="text-xs text-white/40">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setFile(null)}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}

      {file && (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Category</Label>
            <select 
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="flex h-10 w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/20"
            >
              <option value="OTHER">Other</option>
              <option value="FINANCIAL">Financials</option>
              <option value="LEGAL">Legal</option>
              <option value="FILING">Filing</option>
              <option value="MARKETING">Marketing</option>
            </select>
          </div>
          <Button className="w-full" onClick={handleUpload} disabled={uploading}>
            {uploading ? 'Uploading...' : 'Upload Document'}
          </Button>
        </div>
      )}
    </div>
  );
}
