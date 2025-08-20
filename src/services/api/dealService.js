const { ApperClient } = window.ApperSDK;

const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
})

export const dealService = {
  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "customerId_c" } },
          { field: { Name: "customerName_c" } },
          { field: { Name: "vehicleId_c" } },
          { field: { Name: "salePrice_c" } },
          { field: { Name: "tradeInValue_c" } },
          { field: { Name: "netPrice_c" } },
          { field: { Name: "margin_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "dealDate_c" } },
          { field: { Name: "deliveryDate_c" } },
          { field: { Name: "salesperson_c" } },
          { field: { Name: "financeManager_c" } },
          { field: { Name: "financing_c" } },
          { field: { Name: "documents_c" } }
        ],
        orderBy: [
          { fieldName: "Id", sorttype: "DESC" }
        ]
      }
      
      const response = await apperClient.fetchRecords('deal_c', params)
      
      if (!response.success) {
        console.error(response.message)
        return []
      }
      
      return response.data.map(deal => ({
        Id: deal.Id,
        customerId: deal.customerId_c,
        customerName: deal.customerName_c,
        vehicleId: deal.vehicleId_c,
        salePrice: deal.salePrice_c,
        tradeInValue: deal.tradeInValue_c,
        netPrice: deal.netPrice_c,
        margin: deal.margin_c,
        status: deal.status_c,
        dealDate: deal.dealDate_c,
        deliveryDate: deal.deliveryDate_c,
        salesperson: deal.salesperson_c,
        financeManager: deal.financeManager_c,
        financing: deal.financing_c ? JSON.parse(deal.financing_c) : {},
        documents: deal.documents_c ? JSON.parse(deal.documents_c) : []
      }))
    } catch (error) {
      console.error("Error fetching deals:", error?.response?.data?.message || error.message)
      return []
    }
  },

  async getById(id) {
    try {
      const params = {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "customerId_c" } },
          { field: { Name: "customerName_c" } },
          { field: { Name: "vehicleId_c" } },
          { field: { Name: "salePrice_c" } },
          { field: { Name: "tradeInValue_c" } },
          { field: { Name: "netPrice_c" } },
          { field: { Name: "margin_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "dealDate_c" } },
          { field: { Name: "deliveryDate_c" } },
          { field: { Name: "salesperson_c" } },
          { field: { Name: "financeManager_c" } },
          { field: { Name: "financing_c" } },
          { field: { Name: "documents_c" } }
        ]
      }
      
      const response = await apperClient.getRecordById('deal_c', parseInt(id), params)
      
      if (!response.success) {
        console.error(response.message)
        return null
      }
      
      if (!response.data) return null
      
      const deal = response.data
      return {
        Id: deal.Id,
        customerId: deal.customerId_c,
        customerName: deal.customerName_c,
        vehicleId: deal.vehicleId_c,
        salePrice: deal.salePrice_c,
        tradeInValue: deal.tradeInValue_c,
        netPrice: deal.netPrice_c,
        margin: deal.margin_c,
        status: deal.status_c,
        dealDate: deal.dealDate_c,
        deliveryDate: deal.deliveryDate_c,
        salesperson: deal.salesperson_c,
        financeManager: deal.financeManager_c,
        financing: deal.financing_c ? JSON.parse(deal.financing_c) : {},
        documents: deal.documents_c ? JSON.parse(deal.documents_c) : []
      }
    } catch (error) {
      console.error(`Error fetching deal with ID ${id}:`, error?.response?.data?.message || error.message)
      return null
    }
  },

  async create(dealData) {
    try {
      const params = {
        records: [
          {
            customerId_c: dealData.customerId,
            customerName_c: dealData.customerName,
            vehicleId_c: dealData.vehicleId,
            salePrice_c: dealData.salePrice,
            tradeInValue_c: dealData.tradeInValue,
            netPrice_c: dealData.netPrice,
            margin_c: dealData.margin,
            status_c: dealData.status || 'Draft',
            dealDate_c: new Date().toISOString(),
            salesperson_c: dealData.salesperson,
            financeManager_c: dealData.financeManager,
            financing_c: dealData.financing ? JSON.stringify(dealData.financing) : '{}',
            documents_c: JSON.stringify([])
          }
        ]
      }
      
      const response = await apperClient.createRecord('deal_c', params)
      
      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success)
        const failedRecords = response.results.filter(result => !result.success)
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create deal ${failedRecords.length} records:${JSON.stringify(failedRecords)}`)
          
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
      console.error("Error creating deal:", error?.response?.data?.message || error.message)
      throw error
    }
  },

  async update(id, dealData) {
    try {
      const updateData = {}
      
      if (dealData.customerId) updateData.customerId_c = dealData.customerId
      if (dealData.customerName) updateData.customerName_c = dealData.customerName
      if (dealData.vehicleId) updateData.vehicleId_c = dealData.vehicleId
      if (dealData.salePrice !== undefined) updateData.salePrice_c = dealData.salePrice
      if (dealData.tradeInValue !== undefined) updateData.tradeInValue_c = dealData.tradeInValue
      if (dealData.netPrice !== undefined) updateData.netPrice_c = dealData.netPrice
      if (dealData.margin !== undefined) updateData.margin_c = dealData.margin
      if (dealData.status) updateData.status_c = dealData.status
      if (dealData.dealDate) updateData.dealDate_c = dealData.dealDate
      if (dealData.deliveryDate) updateData.deliveryDate_c = dealData.deliveryDate
      if (dealData.salesperson) updateData.salesperson_c = dealData.salesperson
      if (dealData.financeManager) updateData.financeManager_c = dealData.financeManager
      if (dealData.financing) updateData.financing_c = JSON.stringify(dealData.financing)
      if (dealData.documents) updateData.documents_c = JSON.stringify(dealData.documents)
      
      const params = {
        records: [
          {
            Id: parseInt(id),
            ...updateData
          }
        ]
      }
      
      const response = await apperClient.updateRecord('deal_c', params)
      
      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }
      
      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success)
        const failedUpdates = response.results.filter(result => !result.success)
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update deal ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`)
          
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
      console.error("Error updating deal:", error?.response?.data?.message || error.message)
      throw error
    }
  },

  async delete(id) {
    try {
      const params = {
        RecordIds: [parseInt(id)]
      }
      
      const response = await apperClient.deleteRecord('deal_c', params)
      
      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }
      
      if (response.results) {
        const failedDeletions = response.results.filter(result => !result.success)
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete deal ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`)
          
          failedDeletions.forEach(record => {
            if (record.message) throw new Error(record.message)
          })
        }
        
        return true
      }
    } catch (error) {
      console.error("Error deleting deal:", error?.response?.data?.message || error.message)
      throw error
    }
  },

  async addDocument(dealId, document) {
    try {
      // First get the current deal
      const deal = await this.getById(dealId)
      if (!deal) return null
      
      const newDocument = {
        ...document,
        id: Date.now(),
        uploadDate: new Date().toISOString()
      }
      
      const updatedDocuments = [...(deal.documents || []), newDocument]
      
      const updateData = {
        documents: updatedDocuments
      }
      
      await this.update(dealId, updateData)
      
      return newDocument
    } catch (error) {
      console.error("Error adding document:", error?.response?.data?.message || error.message)
      throw error
    }
  },

  async removeDocument(dealId, documentId) {
    try {
      // First get the current deal
      const deal = await this.getById(dealId)
      if (!deal) return null
      
      const documentIndex = deal.documents?.findIndex(doc => doc.id === documentId)
      if (documentIndex === -1) return null
      
      const removedDocument = deal.documents[documentIndex]
      const updatedDocuments = deal.documents.filter(doc => doc.id !== documentId)
      
      const updateData = {
        documents: updatedDocuments
      }
      
      await this.update(dealId, updateData)
      
      return removedDocument
    } catch (error) {
      console.error("Error removing document:", error?.response?.data?.message || error.message)
      throw error
    }
  },

  async calculateFinancing(principal, downPayment, interestRate, termMonths) {
    // This is a utility function, no need to delay for calculations
    const loanAmount = principal - downPayment
    if (loanAmount <= 0) {
      return {
        loanAmount: 0,
        monthlyPayment: 0,
        totalInterest: 0,
        totalPayment: downPayment
      }
    }

    const monthlyRate = interestRate / 100 / 12
    const monthlyPayment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, termMonths)) / (Math.pow(1 + monthlyRate, termMonths) - 1)
    const totalPayment = monthlyPayment * termMonths + downPayment
    const totalInterest = totalPayment - principal

    return {
      loanAmount,
      monthlyPayment: Math.round(monthlyPayment * 100) / 100,
      totalInterest: Math.round(totalInterest * 100) / 100,
      totalPayment: Math.round(totalPayment * 100) / 100
    }
  }
}