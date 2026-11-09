import React, { useRef, useState } from 'react';
import { UploadCloud, FileText, AlertCircle } from 'lucide-react';
import { cn } from '../../utils';

export interface FileDropzoneProps {
  onFilesSelected: (files: File[]) => void;
  maxSizeMB?: number;
  acceptedFormats?: string[];
  disabled?: boolean;
  className?: string;
}

export const FileDropzone: React.FC<FileDropzoneProps> = ({
  onFilesSelected,
  maxSizeMB = 50,
  acceptedFormats = ['.pdf', '.docx'],
  disabled = false,
  className,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFiles = (fileList: FileList | File[]): File[] => {
    setErrorMessage(null);
    const valid: File[] = [];
    const maxSizeBytes = maxSizeMB * 1024 * 1024;

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      const ext = '.' + file.name.split('.').pop()?.toLowerCase();

      if (!acceptedFormats.includes(ext)) {
        setErrorMessage(`Only ${acceptedFormats.join(', ').toUpperCase()} files are accepted. "${file.name}" was skipped.`);
        continue;
      }

      if (file.size > maxSizeBytes) {
        setErrorMessage(`File "${file.name}" exceeds the maximum limit of ${maxSizeMB}MB.`);
        continue;
      }

      valid.push(file);
    }

    return valid;
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (disabled) return;
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (disabled) return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const valid = validateFiles(e.dataTransfer.files);
      if (valid.length > 0) {
        onFilesSelected(valid);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const valid = validateFiles(e.target.files);
      if (valid.length > 0) {
        onFilesSelected(valid);
      }
      e.target.value = ''; // Reset input
    }
  };

  return (
    <div className={cn('w-full space-y-3', className)}>
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !disabled && fileInputRef.current?.click()}
        className={cn(
          'relative border-2 border-dashed rounded-3xl p-8 sm:p-10 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-4 select-none focus:outline-none focus:ring-2 focus:ring-[#218653] focus:ring-offset-2',
          isDragOver
            ? 'border-[#218653] bg-[#EBF7F0]/60 scale-[1.01]'
            : 'border-[#CBD5E1] bg-white hover:border-[#218653] hover:bg-[#F5F7F6]',
          disabled && 'opacity-50 cursor-not-allowed pointer-events-none'
        )}
        role="button"
        tabIndex={disabled ? -1 : 0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            fileInputRef.current?.click();
          }
        }}
        aria-label="Upload files: Drag and drop PDF or DOCX files here or click to browse"
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          onChange={handleInputChange}
          className="hidden"
          disabled={disabled}
        />

        <div
          className={cn(
            'w-14 h-14 rounded-2xl flex items-center justify-center transition-transform',
            isDragOver ? 'bg-[#218653] text-white scale-110' : 'bg-[#EBF7F0] text-[#218653]'
          )}
        >
          <UploadCloud className="w-7 h-7" />
        </div>

        <div className="space-y-1 max-w-sm">
          <p className="text-sm font-bold text-[#142640]">
            <span className="text-[#218653] hover:underline">Click to browse</span> or drag and drop files here
          </p>
          <p className="text-xs text-[#687570]">
            Supports PDF and DOCX documents up to {maxSizeMB}MB
          </p>
        </div>

        <div className="flex items-center gap-2 text-[11px] text-[#687570] bg-[#F1F5F3] px-3 py-1 rounded-full border border-[#E5EAE6]">
          <FileText className="w-3.5 h-3.5 text-[#218653]" />
          <span>Technical runbooks, architecture specs, ADRs & postmortems</span>
        </div>
      </div>

      {errorMessage && (
        <div
          className="p-3 rounded-xl bg-[#FDF2F2] border border-[#F8B4B4] text-[#B54747] text-xs flex items-center gap-2 animate-in fade-in"
          role="alert"
        >
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
};
