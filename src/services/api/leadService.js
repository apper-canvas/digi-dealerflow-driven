const { ApperClient } = window.ApperSDK;

const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
})

export const leadService = {
  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "customerName_c" } },
          { field: { Name: "phone_c" } },
          { field: { Name: "email_c" } },
          { field: { Name: "interestedVehicles_c" } },
          { field: { Name: "source_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "assignedTo_c" } },
          { field: { Name: "lastContact_c" } },
          { field: { Name: "leadScore_c" } },
          { field: { Name: "notes_c" } },
          { field: { Name: "appointments_c" } },
          { field: { Name: "contactHistory_c" } },
          { field: { Name: "budget_c" } },
          { field: { Name: "tradeIn_c" } },
          { field: { Name: "tradeInVehicle_c" } }
        ],
        orderBy: [
          { fieldName: "Id", sorttype: "DESC" }
        ]
      }
      
      const response = await apperClient.fetchRecords('lead_c', params)
      
      if (!response.success) {
        console.error(response.message)
        return []
      }
      
      return response.data.map(lead => ({
        Id: lead.Id,
        customerName: lead.customerName_c,
        phone: lead.phone_c,
        email: lead.email_c,
        interestedVehicles: lead.interestedVehicles_c ? 
          lead.interestedVehicles_c.split(',').map(id => parseInt(id.trim())) : [],
        source: lead.source_c,
        status: lead.status_c,
        assignedTo: lead.assignedTo_c,
        lastContact: lead.lastContact_c,
        leadScore: lead.leadScore_c,
        notes: lead.notes_c,
        appointments: lead.appointments_c ? JSON.parse(lead.appointments_c) : [],
        contactHistory: lead.contactHistory_c ? JSON.parse(lead.contactHistory_c) : [],
        budget: lead.budget_c,
        tradeIn: lead.tradeIn_c === true || lead.tradeIn_c === 'true',
        tradeInVehicle: lead.tradeInVehicle_c
      }))
    } catch (error) {
      console.error("Error fetching leads:", error?.response?.data?.message || error.message)
      return []
    }
  },

  async getById(id) {
    try {
      const params = {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "customerName_c" } },
          { field: { Name: "phone_c" } },
          { field: { Name: "email_c" } },
          { field: { Name: "interestedVehicles_c" } },
          { field: { Name: "source_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "assignedTo_c" } },
          { field: { Name: "lastContact_c" } },
          { field: { Name: "leadScore_c" } },
          { field: { Name: "notes_c" } },
          { field: { Name: "appointments_c" } },
          { field: { Name: "contactHistory_c" } },
          { field: { Name: "budget_c" } },
          { field: { Name: "tradeIn_c" } },
          { field: { Name: "tradeInVehicle_c" } }
        ]
      }
      
      const response = await apperClient.getRecordById('lead_c', parseInt(id), params)
      
      if (!response.success) {
        console.error(response.message)
        return null
      }
      
      if (!response.data) return null
      
      const lead = response.data
      return {
        Id: lead.Id,
        customerName: lead.customerName_c,
        phone: lead.phone_c,
        email: lead.email_c,
        interestedVehicles: lead.interestedVehicles_c ? 
          lead.interestedVehicles_c.split(',').map(id => parseInt(id.trim())) : [],
        source: lead.source_c,
        status: lead.status_c,
        assignedTo: lead.assignedTo_c,
        lastContact: lead.lastContact_c,
        leadScore: lead.leadScore_c,
        notes: lead.notes_c,
        appointments: lead.appointments_c ? JSON.parse(lead.appointments_c) : [],
        contactHistory: lead.contactHistory_c ? JSON.parse(lead.contactHistory_c) : [],
        budget: lead.budget_c,
        tradeIn: lead.tradeIn_c === true || lead.tradeIn_c === 'true',
        tradeInVehicle: lead.tradeInVehicle_c
      }
    } catch (error) {
      console.error(`Error fetching lead with ID ${id}:`, error?.response?.data?.message || error.message)
      return null
    }
  },

  async create(leadData) {
    try {
      const params = {
        records: [
          {
            customerName_c: leadData.customerName,
            phone_c: leadData.phone,
            email_c: leadData.email,
            source_c: leadData.source,
            status_c: leadData.status || 'New',
            assignedTo_c: leadData.assignedTo,
            leadScore_c: leadData.leadScore || 50,
            notes_c: leadData.notes,
            budget_c: leadData.budget,
            tradeIn_c: leadData.tradeIn || false,
            tradeInVehicle_c: leadData.tradeInVehicle,
            lastContact_c: new Date().toISOString(),
            contactHistory_c: JSON.stringify([]),
            appointments_c: JSON.stringify([])
          }
        ]
      }
      
      const response = await apperClient.createRecord('lead_c', params)
      
      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success)
        const failedRecords = response.results.filter(result => !result.success)
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create lead ${failedRecords.length} records:${JSON.stringify(failedRecords)}`)
          
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
      console.error("Error creating lead:", error?.response?.data?.message || error.message)
      throw error
    }
  },

  async update(id, leadData) {
    try {
      const updateData = {}
      
      if (leadData.customerName) updateData.customerName_c = leadData.customerName
      if (leadData.phone) updateData.phone_c = leadData.phone
      if (leadData.email) updateData.email_c = leadData.email
      if (leadData.source) updateData.source_c = leadData.source
      if (leadData.status) updateData.status_c = leadData.status
      if (leadData.assignedTo) updateData.assignedTo_c = leadData.assignedTo
      if (leadData.leadScore !== undefined) updateData.leadScore_c = leadData.leadScore
      if (leadData.notes) updateData.notes_c = leadData.notes
      if (leadData.budget !== undefined) updateData.budget_c = leadData.budget
      if (leadData.tradeIn !== undefined) updateData.tradeIn_c = leadData.tradeIn
      if (leadData.tradeInVehicle) updateData.tradeInVehicle_c = leadData.tradeInVehicle
      if (leadData.lastContact) updateData.lastContact_c = leadData.lastContact
      if (leadData.contactHistory) updateData.contactHistory_c = JSON.stringify(leadData.contactHistory)
      if (leadData.appointments) updateData.appointments_c = JSON.stringify(leadData.appointments)
      
      const params = {
        records: [
          {
            Id: parseInt(id),
            ...updateData
          }
        ]
      }
      
      const response = await apperClient.updateRecord('lead_c', params)
      
      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }
      
      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success)
        const failedUpdates = response.results.filter(result => !result.success)
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update lead ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`)
          
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
      console.error("Error updating lead:", error?.response?.data?.message || error.message)
      throw error
    }
  },

  async delete(id) {
    try {
      const params = {
        RecordIds: [parseInt(id)]
      }
      
      const response = await apperClient.deleteRecord('lead_c', params)
      
      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }
      
      if (response.results) {
        const failedDeletions = response.results.filter(result => !result.success)
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete lead ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`)
          
          failedDeletions.forEach(record => {
            if (record.message) throw new Error(record.message)
          })
        }
        
        return true
      }
    } catch (error) {
      console.error("Error deleting lead:", error?.response?.data?.message || error.message)
      throw error
    }
  },

  async addContactHistory(id, contact) {
    try {
      // First get the current lead
      const lead = await this.getById(id)
      if (!lead) return null
      
      const newContact = {
        ...contact,
        date: new Date().toISOString()
      }
      
      const updatedContactHistory = [newContact, ...(lead.contactHistory || [])]
      
      const updateData = {
        contactHistory: updatedContactHistory,
        lastContact: new Date().toISOString()
      }
      
      await this.update(id, updateData)
      
      // Return updated lead
      return await this.getById(id)
    } catch (error) {
      console.error("Error adding contact history:", error?.response?.data?.message || error.message)
      throw error
    }
  },

  async scheduleAppointment(id, appointment) {
    try {
      // First get the current lead
      const lead = await this.getById(id)
      if (!lead) return null
      
      const newAppointment = {
        ...appointment,
        status: "Scheduled"
      }
      
      const updatedAppointments = [...(lead.appointments || []), newAppointment]
      
      const updateData = {
        appointments: updatedAppointments
      }
      
      await this.update(id, updateData)
      
      // Return updated lead
      return await this.getById(id)
    } catch (error) {
      console.error("Error scheduling appointment:", error?.response?.data?.message || error.message)
      throw error
    }
}
};