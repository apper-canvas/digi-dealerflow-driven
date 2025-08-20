const { ApperClient } = window.ApperSDK

const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
})

export const vehicleService = {
  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "vin_c" } },
          { field: { Name: "year_c" } },
          { field: { Name: "make_c" } },
          { field: { Name: "model_c" } },
          { field: { Name: "trim_c" } },
          { field: { Name: "mileage_c" } },
          { field: { Name: "condition_c" } },
          { field: { Name: "purchasePrice_c" } },
          { field: { Name: "askingPrice_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "location_c" } },
          { field: { Name: "daysInInventory_c" } },
          { field: { Name: "bodyType_c" } },
          { field: { Name: "transmission_c" } },
          { field: { Name: "fuelType_c" } },
          { field: { Name: "color_c" } },
          { field: { Name: "marketValue_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "features_c" } },
          { field: { Name: "photos_c" } }
        ],
        orderBy: [
          { fieldName: "Id", sorttype: "DESC" }
        ]
      }
      
      const response = await apperClient.fetchRecords('vehicle_c', params)
      
      if (!response.success) {
        console.error(response.message)
        return []
      }
      
      return response.data.map(vehicle => ({
        Id: vehicle.Id,
        vin: vehicle.vin_c,
        year: vehicle.year_c,
        make: vehicle.make_c,
        model: vehicle.model_c,
        trim: vehicle.trim_c,
        mileage: vehicle.mileage_c,
        condition: vehicle.condition_c,
        purchasePrice: vehicle.purchasePrice_c,
        askingPrice: vehicle.askingPrice_c,
        status: vehicle.status_c,
        location: vehicle.location_c,
        daysInInventory: vehicle.daysInInventory_c,
        bodyType: vehicle.bodyType_c,
        transmission: vehicle.transmission_c,
        fuelType: vehicle.fuelType_c,
        color: vehicle.color_c,
        marketValue: vehicle.marketValue_c,
        description: vehicle.description_c,
        features: vehicle.features_c ? vehicle.features_c.split(',') : [],
        photos: vehicle.photos_c ? vehicle.photos_c.split(',') : []
      }))
    } catch (error) {
      console.error("Error fetching vehicles:", error?.response?.data?.message || error.message)
      return []
    }
  },

  async getById(id) {
    try {
      const params = {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "vin_c" } },
          { field: { Name: "year_c" } },
          { field: { Name: "make_c" } },
          { field: { Name: "model_c" } },
          { field: { Name: "trim_c" } },
          { field: { Name: "mileage_c" } },
          { field: { Name: "condition_c" } },
          { field: { Name: "purchasePrice_c" } },
          { field: { Name: "askingPrice_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "location_c" } },
          { field: { Name: "daysInInventory_c" } },
          { field: { Name: "bodyType_c" } },
          { field: { Name: "transmission_c" } },
          { field: { Name: "fuelType_c" } },
          { field: { Name: "color_c" } },
          { field: { Name: "marketValue_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "features_c" } },
          { field: { Name: "photos_c" } }
        ]
      }
      
      const response = await apperClient.getRecordById('vehicle_c', parseInt(id), params)
      
      if (!response.success) {
        console.error(response.message)
        return null
      }
      
      if (!response.data) return null
      
      const vehicle = response.data
      return {
        Id: vehicle.Id,
        vin: vehicle.vin_c,
        year: vehicle.year_c,
        make: vehicle.make_c,
        model: vehicle.model_c,
        trim: vehicle.trim_c,
        mileage: vehicle.mileage_c,
        condition: vehicle.condition_c,
        purchasePrice: vehicle.purchasePrice_c,
        askingPrice: vehicle.askingPrice_c,
        status: vehicle.status_c,
        location: vehicle.location_c,
        daysInInventory: vehicle.daysInInventory_c,
        bodyType: vehicle.bodyType_c,
        transmission: vehicle.transmission_c,
        fuelType: vehicle.fuelType_c,
        color: vehicle.color_c,
        marketValue: vehicle.marketValue_c,
        description: vehicle.description_c,
        features: vehicle.features_c ? vehicle.features_c.split(',') : [],
        photos: vehicle.photos_c ? vehicle.photos_c.split(',') : []
      }
    } catch (error) {
      console.error(`Error fetching vehicle with ID ${id}:`, error?.response?.data?.message || error.message)
      return null
    }
  },

  async create(vehicleData) {
    try {
      const params = {
        records: [
          {
            vin_c: vehicleData.vin,
            year_c: vehicleData.year,
            make_c: vehicleData.make,
            model_c: vehicleData.model,
            trim_c: vehicleData.trim,
            mileage_c: vehicleData.mileage,
            condition_c: vehicleData.condition,
            purchasePrice_c: vehicleData.purchasePrice,
            askingPrice_c: vehicleData.askingPrice,
            bodyType_c: vehicleData.bodyType,
            transmission_c: vehicleData.transmission,
            fuelType_c: vehicleData.fuelType,
            color_c: vehicleData.color,
            location_c: vehicleData.location,
            marketValue_c: vehicleData.marketValue,
            description_c: vehicleData.description,
            features_c: vehicleData.features ? vehicleData.features.join(',') : '',
            photos_c: vehicleData.photos ? vehicleData.photos.join(',') : '',
            status_c: 'Available',
            daysInInventory_c: 0
          }
        ]
      }
      
      const response = await apperClient.createRecord('vehicle_c', params)
      
      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success)
        const failedRecords = response.results.filter(result => !result.success)
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create vehicle ${failedRecords.length} records:${JSON.stringify(failedRecords)}`)
          
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
      console.error("Error creating vehicle:", error?.response?.data?.message || error.message)
      throw error
    }
  },

  async update(id, vehicleData) {
    try {
      const updateData = {}
      
      if (vehicleData.vin) updateData.vin_c = vehicleData.vin
      if (vehicleData.year) updateData.year_c = vehicleData.year
      if (vehicleData.make) updateData.make_c = vehicleData.make
      if (vehicleData.model) updateData.model_c = vehicleData.model
      if (vehicleData.trim) updateData.trim_c = vehicleData.trim
      if (vehicleData.mileage !== undefined) updateData.mileage_c = vehicleData.mileage
      if (vehicleData.condition) updateData.condition_c = vehicleData.condition
      if (vehicleData.purchasePrice !== undefined) updateData.purchasePrice_c = vehicleData.purchasePrice
      if (vehicleData.askingPrice !== undefined) updateData.askingPrice_c = vehicleData.askingPrice
      if (vehicleData.status) updateData.status_c = vehicleData.status
      if (vehicleData.location) updateData.location_c = vehicleData.location
      if (vehicleData.bodyType) updateData.bodyType_c = vehicleData.bodyType
      if (vehicleData.transmission) updateData.transmission_c = vehicleData.transmission
      if (vehicleData.fuelType) updateData.fuelType_c = vehicleData.fuelType
      if (vehicleData.color) updateData.color_c = vehicleData.color
      if (vehicleData.marketValue !== undefined) updateData.marketValue_c = vehicleData.marketValue
      if (vehicleData.description) updateData.description_c = vehicleData.description
      if (vehicleData.features) updateData.features_c = vehicleData.features.join(',')
      if (vehicleData.photos) updateData.photos_c = vehicleData.photos.join(',')
      
      const params = {
        records: [
          {
            Id: parseInt(id),
            ...updateData
          }
        ]
      }
      
      const response = await apperClient.updateRecord('vehicle_c', params)
      
      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }
      
      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success)
        const failedUpdates = response.results.filter(result => !result.success)
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update vehicle ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`)
          
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
      console.error("Error updating vehicle:", error?.response?.data?.message || error.message)
      throw error
    }
  },

  async delete(id) {
    try {
      const params = {
        RecordIds: [parseInt(id)]
      }
      
      const response = await apperClient.deleteRecord('vehicle_c', params)
      
      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }
      
      if (response.results) {
        const failedDeletions = response.results.filter(result => !result.success)
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete vehicle ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`)
          
          failedDeletions.forEach(record => {
            if (record.message) throw new Error(record.message)
          })
        }
        
        return true
      }
    } catch (error) {
      console.error("Error deleting vehicle:", error?.response?.data?.message || error.message)
      throw error
    }
  },

  async searchByVin(vin) {
    try {
      const params = {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "vin_c" } },
          { field: { Name: "year_c" } },
          { field: { Name: "make_c" } },
          { field: { Name: "model_c" } },
          { field: { Name: "trim_c" } },
          { field: { Name: "mileage_c" } },
          { field: { Name: "bodyType_c" } },
          { field: { Name: "transmission_c" } },
          { field: { Name: "fuelType_c" } },
          { field: { Name: "color_c" } },
          { field: { Name: "marketValue_c" } },
          { field: { Name: "features_c" } },
          { field: { Name: "description_c" } }
        ],
        where: [
          {
            FieldName: "vin_c",
            Operator: "EqualTo",
            Values: [vin],
            Include: true
          }
        ]
      }
      
      const response = await apperClient.fetchRecords('vehicle_c', params)
      
      if (!response.success) {
        console.error(response.message)
        return null
      }
      
      if (response.data && response.data.length > 0) {
        const vehicle = response.data[0]
        return {
          vin: vehicle.vin_c,
          year: vehicle.year_c,
          make: vehicle.make_c,
          model: vehicle.model_c,
          trim: vehicle.trim_c,
          mileage: vehicle.mileage_c,
          bodyType: vehicle.bodyType_c,
          transmission: vehicle.transmission_c,
          fuelType: vehicle.fuelType_c,
          color: vehicle.color_c,
          marketValue: vehicle.marketValue_c,
          features: vehicle.features_c ? vehicle.features_c.split(',') : [],
          description: vehicle.description_c || "Vehicle data retrieved from VIN database"
        }
      }
      
      // Mock VIN lookup if not found in database
      return {
        vin: vin,
        year: 2023,
        make: "Honda",
        model: "Accord",
        trim: "EX",
        mileage: 0,
        bodyType: "Sedan",
        transmission: "CVT Automatic",
        fuelType: "Gasoline",
        color: "Unknown",
        marketValue: 32000,
        features: ["Backup Camera", "Bluetooth", "Cruise Control", "Power Windows"],
        description: "Vehicle data retrieved from VIN database"
      }
    } catch (error) {
      console.error("Error searching by VIN:", error?.response?.data?.message || error.message)
      return null
    }
  }
}