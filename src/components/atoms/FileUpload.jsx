import React, { useRef, useState } from 'react';
import { cn } from '@/utils/cn';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

function FileUpload({ 
  onFilesSelected,
  accept = "*/*",
  maxSize = 5 * 1024 * 1024, // 5MB default
  multiple = false,
  className = "",
  disabled = false
}) {
  const fileInputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);

  function handleDrag(e) {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }

  function handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (disabled) return;

    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  }

  function handleFileSelect(e) {
    const files = Array.from(e.target.files);
    handleFiles(files);
  }

  function handleFiles(files) {
    // Validate files
    const validFiles = files.filter(file => {
      // Check file size
      if (file.size > maxSize) {
        alert(`File "${file.name}" is too large. Maximum size is ${formatFileSize(maxSize)}.`);
        return false;
      }

      // Check file type if accept is specified and not wildcard
      if (accept !== "*/*" && accept) {
        const acceptedTypes = accept.split(',').map(type => type.trim());
        const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
        const isValidType = acceptedTypes.some(type => {
          if (type.startsWith('.')) {
            return type === fileExtension;
          }
          return file.type.includes(type.replace('*', ''));
        });
        
        if (!isValidType) {
          alert(`File "${file.name}" is not a supported file type.`);
          return false;
        }
      }

      return true;
    });

    if (validFiles.length > 0) {
      setSelectedFiles(validFiles);
      onFilesSelected(validFiles);
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }

  function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  function removeFile(index) {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
    if (newFiles.length === 0) {
      onFilesSelected([]);
    }
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Drop Zone */}
      <div
        className={cn(
          "relative border-2 border-dashed rounded-lg p-6 text-center transition-colors",
          dragActive 
            ? "border-primary-400 bg-primary-50" 
            : "border-slate-300 hover:border-slate-400",
          disabled && "opacity-50 cursor-not-allowed"
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileSelect}
          disabled={disabled}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />

        <div className="flex flex-col items-center space-y-2">
          <div className="p-3 bg-slate-100 rounded-full">
            <ApperIcon name="Upload" className="text-slate-600" size={24} />
          </div>
          
          <div>
            <p className="text-slate-600">
              <span className="font-medium text-primary-600">Click to upload</span> or drag and drop
            </p>
            <p className="text-sm text-slate-500 mt-1">
              {accept !== "*/*" && `Accepted files: ${accept}`}
              {maxSize && ` • Max size: ${formatFileSize(maxSize)}`}
            </p>
          </div>
        </div>
      </div>

      {/* Selected Files */}
      {selectedFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-slate-700">Selected Files:</h4>
          <div className="space-y-2">
            {selectedFiles.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <ApperIcon name="File" className="text-slate-400" size={16} />
                  <div>
                    <p className="text-sm font-medium text-slate-900">{file.name}</p>
                    <p className="text-xs text-slate-500">{formatFileSize(file.size)}</p>
                  </div>
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(index)}
                  icon="X"
                  className="text-slate-400 hover:text-slate-600"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default FileUpload;