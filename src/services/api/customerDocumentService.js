import customerDocuments from '@/services/mockData/customerDocuments.json';

// Simulate API delay
function delay() {
  return new Promise(resolve => setTimeout(resolve, Math.random() * 500 + 200));
}

export const customerDocumentService = {
  async getAll() {
    await delay();
    return customerDocuments.map(document => ({ ...document }));
  },

  async getById(id) {
    await delay();
    const document = customerDocuments.find(d => d.Id === parseInt(id));
    return document ? { ...document } : null;
  },

  async getByDealId(dealId) {
    await delay();
    return customerDocuments
      .filter(d => d.dealId === parseInt(dealId))
      .map(document => ({ ...document }));
  },

  async getByCustomer(customerName) {
    await delay();
    return customerDocuments
      .filter(d => d.customerName === customerName)
      .map(document => ({ ...document }));
  },

  async create(documentData) {
    await delay();
    const maxId = Math.max(...customerDocuments.map(d => d.Id), 0);
    const newDocument = {
      ...documentData,
      Id: maxId + 1,
      uploadDate: new Date().toISOString(),
      status: 'Uploaded'
    };
    customerDocuments.push(newDocument);
    return { ...newDocument };
  },

  async update(id, documentData) {
    await delay();
    const index = customerDocuments.findIndex(d => d.Id === parseInt(id));
    if (index !== -1) {
      customerDocuments[index] = { ...customerDocuments[index], ...documentData };
      return { ...customerDocuments[index] };
    }
    return null;
  },

  async delete(id) {
    await delay();
    const index = customerDocuments.findIndex(d => d.Id === parseInt(id));
    if (index !== -1) {
      const deletedDocument = customerDocuments.splice(index, 1)[0];
      return { ...deletedDocument };
    }
    return null;
  },

  async updateStatus(id, status) {
    await delay();
    const index = customerDocuments.findIndex(d => d.Id === parseInt(id));
    if (index !== -1) {
      customerDocuments[index].status = status;
      return { ...customerDocuments[index] };
    }
    return null;
  }
};