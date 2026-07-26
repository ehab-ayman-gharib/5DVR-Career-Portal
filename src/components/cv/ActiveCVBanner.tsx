'use client';

import { useState } from 'react';
import { FileText, UploadCloud, RefreshCw, CheckCircle2, Loader2 } from 'lucide-react';

export interface ResumeData {
  id: string;
  fileName: string;
  fileSizeBytes: number;
  uploadedAt: string;
  parsedText: string;
}

interface ActiveCVBannerProps {
  activeResume: ResumeData | null;
  onResumeUpdated: (resume: ResumeData) => void;
}

export function ActiveCVBanner({ activeResume, onResumeUpdated }: ActiveCVBannerProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFileUpload = async (file: File) => {
    setError('');
    if (file.size > 5 * 1024 * 1024) {
      setError('File size exceeds 5MB limit.');
      return;
    }
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (ext !== 'pdf' && ext !== 'docx') {
      setError('Please upload a PDF or DOCX file.');
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/cv/resume', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to upload CV');

      onResumeUpdated(data.resume);
    } catch (err: any) {
      setError(err.message || 'Error uploading file');
    } finally {
      setIsUploading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  return (
    <div className="bg-white border border-[#E4E0FF] rounded-3xl p-6 sm:p-7 shadow-sm font-sans">
      {activeResume ? (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="h-12 w-12 rounded-2xl bg-[#F5F4FE] border border-[#E4E0FF] flex items-center justify-center text-[#6C5CE7] shrink-0">
              <FileText className="h-6 w-6 text-[#6C5CE7]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-black text-[#1E1B4B]">Active Resume:</span>
                <span className="text-xs font-extrabold text-[#6C5CE7] truncate max-w-xs">{activeResume.fileName}</span>
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              </div>
              <p className="text-[11px] text-[#52528C] mt-0.5 font-medium">
                {(activeResume.fileSizeBytes / (1024 * 1024)).toFixed(2)} MB • Saved in Database
              </p>
            </div>
          </div>

          <label className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-2xl bg-[#F8F9FE] hover:bg-[#E4E0FF] text-[#1E1B4B] text-xs font-extrabold cursor-pointer border border-[#E4E0FF] transition-colors shrink-0">
            {isUploading ? (
              <Loader2 className="h-4 w-4 animate-spin text-[#6C5CE7]" />
            ) : (
              <RefreshCw className="h-4 w-4 text-[#6C5CE7]" />
            )}
            <span>{isUploading ? 'Uploading...' : 'Replace / Update CV'}</span>
            <input
              type="file"
              accept=".pdf,.docx"
              onChange={handleInputChange}
              disabled={isUploading}
              className="hidden"
            />
          </label>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-base font-extrabold text-[#1E1B4B]">No Active CV Uploaded Yet</h3>
            <p className="text-xs text-[#52528C] font-medium leading-relaxed">
              Upload your CV once to run ATS analysis and Job Description matching across the platform.
            </p>
            {error && <p className="text-xs font-semibold text-rose-600 pt-1">{error}</p>}
          </div>

          <label className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-[#6C5CE7] hover:bg-[#5849E0] text-white font-extrabold text-xs flex items-center justify-center space-x-2 cursor-pointer shadow-md shadow-[#6C5CE7]/30 transition-colors shrink-0">
            {isUploading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <UploadCloud className="h-4 w-4" />
            )}
            <span>{isUploading ? 'Uploading Resume...' : 'Upload Active CV'}</span>
            <input
              type="file"
              accept=".pdf,.docx"
              onChange={handleInputChange}
              disabled={isUploading}
              className="hidden"
            />
          </label>
        </div>
      )}
    </div>
  );
}
