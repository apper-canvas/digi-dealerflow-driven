const { ApperClient } = window.ApperSDK

const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
})

export const customerDocumentService = {
  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "dealId_c" } },
          { field: { Name: "customerName_c" } },
          { field: { Name: "fileName_c" } },
          { field: { Name: "fileSize_c" } },
          { field: { Name: "fileType_c" } },
          { field: { Name: "category_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "uploadDate_c" } },
          { field: { Name: "notes_c" } }
        ],
        orderBy: [
          { fieldName: "Id", sorttype: "DESC" }
        ]
      }
      
      const response = await apperClient.fetchRecords('customer_document_c', params)
      
      if (!response.success) {
        console.error(response.message)
        return []
      }
      
      return response.data.map(document => ({
        Id: document.Id,
        dealId: document.dealId_c,
        customerName: document.customerName_c,
        fileName: document.fileName_c,
        fileSize: document.fileSize_c,
        fileType: document.fileType_c,
        category: document.category_c,
        status: document.status_c,
        uploadDate: document.uploadDate_c,
        notes: document.notes_c
      }))
    } catch (error) {
      console.error("Error fetching customer documents:", error?.response?.data?.message || error.message)
      return []
    }
  },

  async getById(id) {
    try {
      const params = {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "dealId_c" } },
          { field: { Name: "customerName_c" } },
          { field: { Name: "fileName_c" } },
          { field: { Name: "fileSize_c" } },
          { field: { Name: "fileType_c" } },
          { field: { Name: "category_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "uploadDate_c" } },
          { field: { Name: "notes_c" } }
        ]
      }
      
      const response = await apperClient.getRecordById('customer_document_c', parseInt(id), params)
      
      if (!response.success) {
        console.error(response.message)
        return null
      }
      
      if (!response.data) return null
      
      const document = response.data
      return {
        Id: document.Id,
        dealId: document.dealId_c,
        customerName: document.customerName_c,
        fileName: document.fileName_c,
        fileSize: document.fileSize_c,
        fileType: document.fileType_c,
        category: document.category_c,
        status: document.status_c,
        uploadDate: document.uploadDate_c,
        notes: document.notes_c
      }
    } catch (error) {
      console.error(`Error fetching customer document with ID ${id}:`, error?.response?.data?.message || error.message)
      return null
    }
  },

  async getByDealId(dealId) {
    try {
      const params = {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "dealId_c" } },
          { field: { Name: "customerName_c" } },
          { field: { Name: "fileName_c" } },
          { field: { Name: "fileSize_c" } },
          { field: { Name: "fileType_c" } },
          { field: { Name: "category_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "uploadDate_c" } },
          { field: { Name: "notes_c" } }
        ],
        where: [
          {
            FieldName: "dealId_c",
            Operator: "EqualTo",
            Values: [parseInt(dealId)],
            Include: true
          }
        ]
      }
      
      const response = await apperClient.fetchRecords('customer_document_c', params)
      
      if (!response.success) {
        console.error(response.message)
        return []
      }
      
      return response.data.map(document => ({
        Id: document.Id,
        dealId: document.dealId_c,
        customerName: document.customerName_c,
        fileName: document.fileName_c,
        fileSize: document.fileSize_c,
        fileType: document.fileType_c,
        category: document.category_c,
        status: document.status_c,
        uploadDate: document.uploadDate_c,
        notes: document.notes_c
      }))
    } catch (error) {
      console.error("Error fetching documents by deal ID:", error?.response?.data?.message || error.message)
      return []
    }
  },

  async getByCustomer(customerName) {
    try {
      const params = {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "dealId_c" } },
          { field: { Name: "customerName_c" } },
          { field: { Name: "fileName_c" } },
          { field: { Name: "fileSize_c" } },
          { field: { Name: "fileType_c" } },
          { field: { Name: "category_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "uploadDate_c" } },
          { field: { Name: "notes_c" } }
        ],
        where: [
          {
            FieldName: "customerName_c",
            Operator: "EqualTo",
            Values: [customerName],
            Include: true
          }
        ]
      }
      
      const response = await apperClient.fetchRecords('customer_document_c', params)
      
      if (!response.success) {
        console.error(response.message)
        return []
      }
      
      return response.data.map(document => ({
        Id: document.Id,
        dealId: document.dealId_c,
        customerName: document.customerName_c,
        fileName: document.fileName_c,
        fileSize: document.fileSize_c,
        fileType: document.fileType_c,
        category: document.category_c,
        status: document.status_c,
        uploadDate: document.uploadDate_c,
        notes: document.notes_c
      }))
    } catch (error) {
      console.error("Error fetching documents by customer:", error?.response?.data?.message || error.message)
      return []
    }
  },

  async create(documentData) {
    try {
      const params = {
        records: [
          {
            dealId_c: documentData.dealId,
            customerName_c: documentData.customerName,
            fileName_c: documentData.fileName,
            fileSize_c: documentData.fileSize,
            fileType_c: documentData.fileType,
            category_c: documentData.category,
            status_c: documentData.status || 'Uploaded',
            uploadDate_c: new Date().toISOString(),
            notes_c: documentData.notes
          }
        ]
      }
      
      const response = await apperClient.createRecord('customer_document_c', params)
      
      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success)
        const failedRecords = response.results.filter(result => !result.success)
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create customer document ${failedRecords.length} records:${JSON.stringify(failedRecords)}`)
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              throw new Error(`${error.fieldLabel}: ${error}`)
            })
            if (record.message) throw new Error(record.message)
          })
        }
        
        return successfulRecords[0]?.data
      }
    } catch (error) {
      console.error("Error creating customer document:", error?.response?.data?.message || error.message)
      throw error
    }
  },

  async update(id, documentData) {
    try {
      const updateData = {}
      
      if (documentData.dealId) updateData.dealId_c = documentData.dealId
      if (documentData.customerName) updateData.customerName_c = documentData.customerName
      if (documentData.fileName) updateData.fileName_c = documentData.fileName
      if (documentData.fileSize !== undefined) updateData.fileSize_c = documentData.fileSize
      if (documentData.fileType) updateData.fileType_c = documentData.fileType
      if (documentData.category) updateData.category_c = documentData.category
      if (documentData.status) updateData.status_c = documentData.status
      if (documentData.uploadDate) updateData.uploadDate_c = documentData.uploadDate
      if (documentData.notes) updateData.notes_c = documentData.notes
      
      const params = {
        records: [
          {
            Id: parseInt(id),
            ...updateData
          }
        ]
      }
      
      const response = await apperClient.updateRecord('customer_document_c', params)
      
      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }
      
      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success)
        const failedUpdates = response.results.filter(result => !result.success)
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update customer document ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`)
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              throw new Error(`${error.fieldLabel}: ${error}`)
            })
            if (record.message) throw new Error(record.message)
          })
        }
        
        return successfulUpdates[0]?.data
      }
    } catch (error) {
      console.error("Error updating customer document:", error?.response?.data?.message || error.message)
      throw error
    }
  },

  async delete(id) {
    try {
      const params = {
        RecordIds: [parseInt(id)]
      }
      
      const response = await apperClient.deleteRecord('customer_document_c', params)
      
      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }
      
      if (response.results) {
        const failedDeletions = response.results.filter(result => !result.success)
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete customer document ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`)
          
          failedDeletions.forEach(record => {
            if (record.message) throw new Error(record.message)
          })
        }
        
        return true
      }
    } catch (error) {
      console.error("Error deleting customer document:", error?.response?.data?.message || error.message)
      throw error
    }
  },

  async updateStatus(id, status) {
    try {
      const updateData = {
        status: status
      }
      
      return await this.update(id, updateData)
    } catch (error) {
      console.error("Error updating document status:", error?.response?.data?.message || error.message)
      throw error
    }
  }
}