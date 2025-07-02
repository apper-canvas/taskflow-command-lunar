const { ApperClient } = window.ApperSDK;

const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

export const categoryService = {
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
          { field: { Name: "color" } },
          { field: { Name: "taskCount" } }
        ],
        orderBy: [{ fieldName: "Name", sorttype: "ASC" }]
      };
      
      const response = await apperClient.fetchRecords('category', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching categories:", error?.response?.data?.message);
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
          { field: { Name: "color" } },
          { field: { Name: "taskCount" } }
        ]
      };
      
      const response = await apperClient.getRecordById('category', parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        return null;
      }
      
      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching category with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  },

  async create(categoryData) {
    try {
      const params = {
        records: [{
          Name: categoryData.Name || categoryData.name,
          Tags: categoryData.Tags || '',
          Owner: categoryData.Owner,
          color: categoryData.color,
          taskCount: categoryData.taskCount || 0
        }]
      };
      
      const response = await apperClient.createRecord('category', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error('Failed to create category');
        }
        
        return successfulRecords[0]?.data;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating category:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  },

  async update(id, categoryData) {
    try {
      const params = {
        records: [{
          Id: parseInt(id),
          Name: categoryData.Name || categoryData.name,
          Tags: categoryData.Tags || '',
          Owner: categoryData.Owner,
          color: categoryData.color,
          taskCount: categoryData.taskCount
        }]
      };
      
      const response = await apperClient.updateRecord('category', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          throw new Error('Failed to update category');
        }
        
        return successfulUpdates[0]?.data;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating category:", error?.response?.data?.message);
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
      
      const response = await apperClient.deleteRecord('category', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          throw new Error('Failed to delete category');
        }
        
        return true;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting category:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  },

  async updateTaskCount(categoryId, count) {
    try {
      const params = {
        records: [{
          Id: parseInt(categoryId),
          taskCount: count
        }]
      };
      
      const response = await apperClient.updateRecord('category', params);
      
      if (!response.success) {
        console.error(response.message);
        return null;
      }
      
      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        return successfulUpdates[0]?.data || null;
      }
      
      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating task count:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  }
};