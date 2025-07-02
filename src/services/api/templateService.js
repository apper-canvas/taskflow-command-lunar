const { ApperClient } = window.ApperSDK;

const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

export const templateService = {
  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" }, referenceField: { field: { Name: "Name" } } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "CreatedBy" }, referenceField: { field: { Name: "Name" } } },
          { field: { Name: "ModifiedOn" } },
          { field: { Name: "ModifiedBy" }, referenceField: { field: { Name: "Name" } } },
          { field: { Name: "title" } },
          { field: { Name: "description" } },
          { field: { Name: "categoryId" }, referenceField: { field: { Name: "Name" } } },
          { field: { Name: "priority" } },
          { field: { Name: "dueDate" } },
          { field: { Name: "createdAt" } }
        ],
        orderBy: [{ fieldName: "CreatedOn", sorttype: "DESC" }]
      };
      
      const response = await apperClient.fetchRecords('task_template', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching templates:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  },

  async getById(id) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" }, referenceField: { field: { Name: "Name" } } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "CreatedBy" }, referenceField: { field: { Name: "Name" } } },
          { field: { Name: "ModifiedOn" } },
          { field: { Name: "ModifiedBy" }, referenceField: { field: { Name: "Name" } } },
          { field: { Name: "title" } },
          { field: { Name: "description" } },
          { field: { Name: "categoryId" }, referenceField: { field: { Name: "Name" } } },
          { field: { Name: "priority" } },
          { field: { Name: "dueDate" } },
          { field: { Name: "createdAt" } }
        ]
      };
      
      const response = await apperClient.getRecordById('task_template', parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        return null;
      }
      
      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching template with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  },

  async create(templateData) {
    try {
      const params = {
        records: [{
          Name: templateData.Name || templateData.name,
          Tags: templateData.Tags || '',
          Owner: templateData.Owner,
          title: templateData.title,
          description: templateData.description,
          categoryId: parseInt(templateData.categoryId),
          priority: templateData.priority,
          dueDate: templateData.dueDate,
          createdAt: templateData.createdAt || new Date().toISOString()
        }]
      };
      
      const response = await apperClient.createRecord('task_template', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error('Failed to create template');
        }
        
        return successfulRecords[0]?.data;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating template:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  },

  async update(id, templateData) {
    try {
      const params = {
        records: [{
          Id: parseInt(id),
          Name: templateData.Name || templateData.name,
          Tags: templateData.Tags || '',
          Owner: templateData.Owner,
          title: templateData.title,
          description: templateData.description,
          categoryId: parseInt(templateData.categoryId),
          priority: templateData.priority,
          dueDate: templateData.dueDate,
          createdAt: templateData.createdAt
        }]
      };
      
      const response = await apperClient.updateRecord('task_template', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          throw new Error('Failed to update template');
        }
        
        return successfulUpdates[0]?.data;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating template:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  },

  async delete(id) {
    try {
      const params = {
        RecordIds: [parseInt(id)]
      };
      
      const response = await apperClient.deleteRecord('task_template', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          throw new Error('Failed to delete template');
        }
        
        return true;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting template:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  }
};