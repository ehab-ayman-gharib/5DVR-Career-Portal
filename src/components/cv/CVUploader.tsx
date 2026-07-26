'use client';

import { useState } from 'react';
import { UploadCloud, FileText, X, Loader2, Sparkles, AlertCircle } from 'lucide-react';

interface CVUploaderProps {
  onAnalyze: (file: File) => Promise<void>;
  loading?: boolean;
}

export function CVUploader({ onAnalyze, loading = false }: CVUploaderProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState('');

  const handleFileSelected = (file: File) => {
    setError('');
    if (file.size > 5 * 1024 * 1024) {
      setError('File size exceeds 5MB limit.');
      return;
    }
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (ext !== 'pdf' && ext !== 'docx') {
      setError('Please upload a PDF or DOCX document.');
      return;
    }
    setSelectedFile(file);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelected(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelected(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
  };

  const handleStartAnalysis = async () => {
    if (!selectedFile) return;
    await onAnalyze(selectedFile);
  };

  return (
    <div className="w-full font-sans space-y-5">
      {error && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center space-x-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {!selectedFile ? (
        <label
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className="block border-2 border-dashed border-[#E4E0FF] hover:border-[#6C5CE7] rounded-3xl p-12 text-center transition-all bg-[#EFEFF6] hover:bg-[#E7E7F2] cursor-pointer group"
        >
          <input
            type="file"
            accept=".pdf,.docx"
            onChange={handleInputChange}
            className="hidden"
          />
          <div className="flex flex-col items-center justify-center space-y-3">
            <div className="h-14 w-14 rounded-full bg-white flex items-center justify-center text-[#1E1B4B] shadow-sm group-hover:scale-110 transition-transform">
              <UploadCloud className="h-7 w-7 text-[#1E1B4B]" />
            </div>
            <p className="text-base font-extrabold text-[#1E1B4B]">
              Drop your CV here, or click to browse
            </p>
            <p className="text-xs text-[#52528C] font-medium">Supports PDF or DOCX up to 5MB</p>
          </div>
        </label>
      ) : (
        <div className="p-6 rounded-3xl bg-[#F8F9FE] border border-[#E4E0FF] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3.5 w-full sm:w-auto">
            <div className="h-12 w-12 rounded-2xl bg-[#E8E5FF] border border-[#D8D2FF] flex items-center justify-center text-[#6C5CE7] shrink-0">
              <FileText className="h-6 w-6 text-[#6C5CE7]" />
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-extrabold text-[#1E1B4B] truncate max-w-xs">
                {selectedFile.name}
              </p>
              <p className="text-xs text-[#52528C] font-medium mt-0.5">
                {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • {selectedFile.name.split('.').pop()?.toUpperCase()}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setSelectedFile(null)}
              disabled={loading}
              className="p-3 rounded-2xl bg-white border border-[#E4E0FF] hover:bg-red-50 hover:text-red-600 text-[#52528C] transition-colors"
              aria-label="Remove selected file"
            >
              <X className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={handleStartAnalysis}
              disabled={loading}
              className="flex-1 sm:flex-initial px-6 py-3 rounded-2xl bg-[#6C5CE7] hover:bg-[#5849E0] disabled:opacity-50 text-white font-extrabold text-xs flex items-center justify-center space-x-2 transition-colors shadow-md shadow-[#6C5CE7]/30"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Analyzing ATS Score...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  <span>Analyze Resume for ATS</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
