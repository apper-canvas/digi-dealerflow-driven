import React from 'react';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import ApperIcon from '@/components/ApperIcon';
import { format } from 'date-fns';

function DocumentCard({ document, onDownload, onDelete }) {
  function getStatusVariant(status) {
    switch (status.toLowerCase()) {
      case 'uploaded': return 'success';
      case 'processing': return 'warning';
      case 'approved': return 'primary';
      case 'rejected': return 'danger';
      default: return 'default';
    }
  }

  function getFileIcon(fileType) {
    if (fileType.includes('pdf')) return 'FileText';
    if (fileType.includes('image')) return 'Image';
    if (fileType.includes('word') || fileType.includes('document')) return 'FileText';
    return 'File';
  }

  function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  return (
    <Card hover className="transition-all duration-200">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          <div className="p-2 bg-slate-100 rounded-lg">
            <ApperIcon 
              name={getFileIcon(document.fileType)} 
              className="text-slate-600" 
              size={20} 
            />
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-slate-900 truncate">
              {document.fileName}
            </h3>
            <p className="text-sm text-slate-600 mt-1">
              {document.customerName}
            </p>
            <div className="flex items-center space-x-4 mt-2 text-sm text-slate-500">
              <span>{formatFileSize(document.fileSize)}</span>
              <span>•</span>
              <span>{document.category}</span>
              <span>•</span>
              <span>{format(new Date(document.uploadDate), 'MMM dd, yyyy')}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end space-y-2">
          <Badge variant={getStatusVariant(document.status)} size="sm">
            {document.status}
          </Badge>
          
          <div className="flex space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDownload(document)}
              icon="Download"
              title="Download document"
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(document.Id)}
              icon="Trash2"
              title="Delete document"
              className="text-red-600 hover:text-red-700"
            />
          </div>
        </div>
      </div>

      {document.notes && (
        <div className="mt-3 pt-3 border-t border-slate-100">
          <p className="text-sm text-slate-600">{document.notes}</p>
        </div>
      )}
    </Card>
  );
}

export default DocumentCard;