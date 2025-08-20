import React, { useState, useEffect } from 'react';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Badge from '@/components/atoms/Badge';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import ApperIcon from '@/components/ApperIcon';
import DocumentCard from '@/components/molecules/DocumentCard';
import FileUpload from '@/components/atoms/FileUpload';
import { customerDocumentService } from '@/services/api/customerDocumentService';
import { dealService } from '@/services/api/dealService';
import { toast } from 'react-toastify';
import { format } from 'date-fns';

function CustomerPortal() {
  const [documents, setDocuments] = useState([]);
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [showUpload, setShowUpload] = useState(false);
  const [uploadDealId, setUploadDealId] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      setError(null);
      
      const [documentsData, dealsData] = await Promise.all([
        customerDocumentService.getAll(),
        dealService.getAll()
      ]);
      
      setDocuments(documentsData);
      setDeals(dealsData);
    } catch (err) {
      setError('Failed to load customer documents');
      toast.error('Failed to load customer documents');
    } finally {
      setLoading(false);
    }
  }

  const customers = [...new Set(deals.map(deal => deal.customerName))].sort();

  const filteredDocuments = documents.filter(doc => {
    const matchesCustomer = !selectedCustomer || doc.customerName === selectedCustomer;
    const matchesSearch = !searchTerm || 
      doc.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || doc.category === filterCategory;
    
    return matchesCustomer && matchesSearch && matchesCategory;
  });

  const categories = [...new Set(documents.map(doc => doc.category))].sort();

  async function handleFileUpload(files) {
    if (!uploadDealId) {
      toast.error('Please select a deal for document upload');
      return;
    }

    const deal = deals.find(d => d.Id === parseInt(uploadDealId));
    if (!deal) {
      toast.error('Selected deal not found');
      return;
    }

    try {
      for (const file of files) {
        const documentData = {
          fileName: file.name,
          fileSize: file.size,
          fileType: file.type,
          dealId: parseInt(uploadDealId),
          customerName: deal.customerName,
          category: getCategoryFromFileName(file.name),
          status: 'Uploaded'
        };

        await customerDocumentService.create(documentData);
      }

      toast.success(`Successfully uploaded ${files.length} document(s)`);
      setShowUpload(false);
      setUploadDealId('');
      loadData();
    } catch (err) {
      toast.error('Failed to upload documents');
    }
  }

  function getCategoryFromFileName(fileName) {
    const name = fileName.toLowerCase();
    if (name.includes('contract') || name.includes('agreement')) return 'Contract';
    if (name.includes('finance') || name.includes('loan')) return 'Financing';
    if (name.includes('insurance')) return 'Insurance';
    if (name.includes('trade')) return 'Trade-in';
    if (name.includes('title') || name.includes('registration')) return 'Title/Registration';
    return 'Other';
  }

  async function handleDownload(document) {
    try {
      // Simulate download - in real app would download actual file
      toast.success(`Downloading ${document.fileName}`);
    } catch (err) {
      toast.error('Failed to download document');
    }
  }

  async function handleDelete(documentId) {
    if (!window.confirm('Are you sure you want to delete this document?')) {
      return;
    }

    try {
      await customerDocumentService.delete(documentId);
      toast.success('Document deleted successfully');
      loadData();
    } catch (err) {
      toast.error('Failed to delete document');
    }
  }

  function getStatusVariant(status) {
    switch (status.toLowerCase()) {
      case 'uploaded': return 'success';
      case 'processing': return 'warning';
      case 'approved': return 'primary';
      case 'rejected': return 'danger';
      default: return 'default';
    }
  }

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Customer Portal</h1>
          <p className="text-slate-600">Upload and track documents related to customer purchases</p>
        </div>
        <Button
          onClick={() => setShowUpload(true)}
          icon="Upload"
          className="w-full sm:w-auto"
        >
          Upload Documents
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <ApperIcon name="FileText" className="text-blue-600" size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-slate-600">Total Documents</p>
              <p className="text-2xl font-bold text-slate-900">{documents.length}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <ApperIcon name="CheckCircle" className="text-green-600" size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-slate-600">Approved</p>
              <p className="text-2xl font-bold text-slate-900">
                {documents.filter(d => d.status === 'Approved').length}
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="p-2 bg-amber-100 rounded-lg">
              <ApperIcon name="Clock" className="text-amber-600" size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-slate-600">Processing</p>
              <p className="text-2xl font-bold text-slate-900">
                {documents.filter(d => d.status === 'Processing').length}
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <ApperIcon name="Users" className="text-purple-600" size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-slate-600">Customers</p>
              <p className="text-2xl font-bold text-slate-900">{customers.length}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Customer
            </label>
            <select
              value={selectedCustomer}
              onChange={(e) => setSelectedCustomer(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">All Customers</option>
              {customers.map(customer => (
                <option key={customer} value={customer}>{customer}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Category
            </label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          <Input
            label="Search Documents"
            placeholder="Search by filename or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon="Search"
          />
        </div>
      </Card>

      {/* Documents Grid */}
      {filteredDocuments.length === 0 ? (
        <Empty
          icon="FileText"
          title="No Documents Found"
          description="No documents match your current filters. Upload documents to get started."
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredDocuments.map(document => (
            <DocumentCard
              key={document.Id}
              document={document}
              onDownload={handleDownload}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Upload Modal */}
      {showUpload && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900">Upload Documents</h2>
              <Button
                variant="ghost"
                onClick={() => setShowUpload(false)}
                icon="X"
              />
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Select Deal
                </label>
                <select
                  value={uploadDealId}
                  onChange={(e) => setUploadDealId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  required
                >
                  <option value="">Choose a deal...</option>
                  {deals.map(deal => (
                    <option key={deal.Id} value={deal.Id}>
                      {deal.customerName} - Deal #{deal.Id} ({format(new Date(deal.dealDate), 'MMM dd, yyyy')})
                    </option>
                  ))}
                </select>
              </div>

              <FileUpload
                onFilesSelected={handleFileUpload}
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif"
                maxSize={10 * 1024 * 1024} // 10MB
                multiple
              />
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

export default CustomerPortal;