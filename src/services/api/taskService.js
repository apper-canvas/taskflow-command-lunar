const { ApperClient } = window.ApperSDK;

const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});
// Helper function to format DateTime for Apper backend
const formatDateTime = (date, isRequired = false) => {
  // If no date provided and it's a required field, use current timestamp
  if (!date && isRequired) {
    return new Date().toISOString();
  }
  
  // If no date provided and not required, return null
  if (!date) return null;
  
  let d;
  
  // Handle different input types
  if (date instanceof Date) {
    d = date;
  } else if (typeof date === 'string' || typeof date === 'number') {
    d = new Date(date);
  } else {
    // Invalid input type, use current date if required
    return isRequired ? new Date().toISOString() : null;
  }
  
  // Check if date is valid
  if (isNaN(d.getTime())) {
    // Invalid date, use current date if required
    return isRequired ? new Date().toISOString() : null;
  }
  
  // Return ISO 8601 format with timezone
  return d.toISOString();
};

export const taskService = {
  async getAll(filters = {}) {
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
          { field: { Name: "priority" } },
          { field: { Name: "dueDate" } },
          { field: { Name: "completed" } },
          { field: { Name: "createdAt" } },
          { field: { Name: "completedAt" } },
          { field: { Name: "categoryId" }, referenceField: { field: { Name: "Name" } } }
        ],
        orderBy: [{ fieldName: "CreatedOn", sorttype: "DESC" }]
      };

      // Build where clauses based on filters
      const whereConditions = [];
      
      // Filter by categoryId (Lookup field - use integer)
      if (filters.categoryId !== undefined && filters.categoryId !== null) {
        whereConditions.push({
          FieldName: "categoryId",
          Operator: "EqualTo",
          Values: [parseInt(filters.categoryId)]
        });
      }
      
      // Filter by priority (Picklist field - use string)
      if (filters.priority) {
        whereConditions.push({
          FieldName: "priority",
          Operator: "EqualTo",
          Values: [filters.priority]
        });
      }
      
      // Filter by completed status (Checkbox field - use string)
      if (filters.completed !== undefined) {
        whereConditions.push({
          FieldName: "completed",
          Operator: "EqualTo",
          Values: [filters.completed]
        });
      }
      
      // Filter by due date range (DateTime field - use ISO strings)
      if (filters.dueDate) {
        if (filters.dueDate.before) {
          whereConditions.push({
            FieldName: "dueDate",
            Operator: "LessThan",
            Values: [new Date(filters.dueDate.before).toISOString()]
          });
        }
        if (filters.dueDate.after) {
          whereConditions.push({
            FieldName: "dueDate",
            Operator: "GreaterThan",
            Values: [new Date(filters.dueDate.after).toISOString()]
          });
        }
      }
      
      // Add where conditions to params if any exist
      if (whereConditions.length > 0) {
        params.where = whereConditions;
      }
      
      // Handle search query with whereGroups for OR logic
      if (filters.search) {
        params.whereGroups = [{
          operator: "OR",
          subGroups: [
            {
              operator: "OR",
              conditions: [
                { fieldName: "title", operator: "Contains", values: [filters.search], include: true },
                { fieldName: "description", operator: "Contains", values: [filters.search], include: true }
              ]
            }
          ]
        }];
      }
      
      const response = await apperClient.fetchRecords('task', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching tasks:", error?.response?.data?.message);
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
          { field: { Name: "priority" } },
          { field: { Name: "dueDate" } },
          { field: { Name: "completed" } },
          { field: { Name: "createdAt" } },
          { field: { Name: "completedAt" } },
          { field: { Name: "categoryId" }, referenceField: { field: { Name: "Name" } } }
        ]
      };
      
      const response = await apperClient.getRecordById('task', parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        return null;
      }
      
      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching task with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  },

async create(taskData) {
    try {
      const params = {
records: [{
Name: taskData.Name || taskData.title,
          Tags: taskData.Tags || '',
          Owner: taskData.Owner,
          title: taskData.title,
          description: taskData.description,
          priority: taskData.priority,
          dueDate: taskData.dueDate ? new Date(taskData.dueDate).toISOString() : null,
          completed: taskData.completed || 'false',
          createdAt: new Date(taskData.createdAt || new Date()).toISOString(),
          completedAt: taskData.completedAt ? new Date(taskData.completedAt).toISOString() : null,
          categoryId: parseInt(taskData.categoryId)
        }]
      };
      
      const response = await apperClient.createRecord('task', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error('Failed to create task');
        }
        
        return successfulRecords[0]?.data;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating task:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  },

async update(id, taskData) {
    try {
      const params = {
records: [{
Id: parseInt(id),
          Name: taskData.Name || taskData.title,
          Tags: taskData.Tags || '',
          Owner: taskData.Owner,
          title: taskData.title,
          description: taskData.description,
          priority: taskData.priority,
          dueDate: taskData.dueDate ? new Date(taskData.dueDate).toISOString() : null,
          completed: taskData.completed,
          createdAt: taskData.createdAt ? new Date(taskData.createdAt).toISOString() : null,
          completedAt: taskData.completedAt ? new Date(taskData.completedAt).toISOString() : null,
          categoryId: parseInt(taskData.categoryId)
        }]
      };
      
      const response = await apperClient.updateRecord('task', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          throw new Error('Failed to update task');
        }
        
        return successfulUpdates[0]?.data;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating task:", error?.response?.data?.message);
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
      
      const response = await apperClient.deleteRecord('task', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          throw new Error('Failed to delete task');
        }
        
        return true;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting task:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  },

  async getByCategory(categoryId) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" }, referenceField: { field: { Name: "Name" } } },
          { field: { Name: "title" } },
          { field: { Name: "description" } },
          { field: { Name: "priority" } },
          { field: { Name: "dueDate" } },
          { field: { Name: "completed" } },
          { field: { Name: "createdAt" } },
          { field: { Name: "completedAt" } },
          { field: { Name: "categoryId" }, referenceField: { field: { Name: "Name" } } }
        ],
        where: [{ FieldName: "categoryId", Operator: "EqualTo", Values: [parseInt(categoryId)] }]
      };
      
      const response = await apperClient.fetchRecords('task', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching tasks by category:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  },

  async getByPriority(priority) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" }, referenceField: { field: { Name: "Name" } } },
          { field: { Name: "title" } },
          { field: { Name: "description" } },
          { field: { Name: "priority" } },
          { field: { Name: "dueDate" } },
          { field: { Name: "completed" } },
          { field: { Name: "createdAt" } },
          { field: { Name: "completedAt" } },
          { field: { Name: "categoryId" }, referenceField: { field: { Name: "Name" } } }
        ],
        where: [{ FieldName: "priority", Operator: "EqualTo", Values: [priority] }]
      };
      
      const response = await apperClient.fetchRecords('task', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching tasks by priority:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  },

  async searchTasks(query) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" }, referenceField: { field: { Name: "Name" } } },
          { field: { Name: "title" } },
          { field: { Name: "description" } },
          { field: { Name: "priority" } },
          { field: { Name: "dueDate" } },
          { field: { Name: "completed" } },
          { field: { Name: "createdAt" } },
          { field: { Name: "completedAt" } },
          { field: { Name: "categoryId" }, referenceField: { field: { Name: "Name" } } }
        ],
        whereGroups: [{
          operator: "OR",
          subGroups: [
            {
              operator: "OR",
              conditions: [
                { fieldName: "title", operator: "Contains", values: [query], include: true },
                { fieldName: "description", operator: "Contains", values: [query], include: true }
              ]
            }
          ]
        }]
      };
      
      const response = await apperClient.fetchRecords('task', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error searching tasks:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  },

  async toggleComplete(id) {
    try {
      // First get the current task
      const currentTask = await this.getById(id);
      if (!currentTask) {
        throw new Error('Task not found');
      }
      
      const newCompletedStatus = currentTask.completed === 'true' ? 'false' : 'true';
      const completedAt = newCompletedStatus === 'true' ? new Date().toISOString() : null;
      
      return await this.update(id, {
        ...currentTask,
        completed: newCompletedStatus,
        completedAt: completedAt
      });
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error toggling task completion:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  },

  async getTodaysProgress() {
    try {
      const today = new Date();
      const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      
      const params = {
        fields: [
          { field: { Name: "completed" } },
          { field: { Name: "createdAt" } }
        ],
        where: [{ FieldName: "createdAt", Operator: "RelativeMatch", Values: ["Today"] }]
      };
      
      const response = await apperClient.fetchRecords('task', params);
      
      if (!response.success) {
        console.error(response.message);
        return { completed: 0, total: 0 };
      }
      
      const todaysTasks = response.data || [];
      const completed = todaysTasks.filter(task => task.completed === 'true').length;
      
      return {
        completed,
        total: todaysTasks.length
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error getting today's progress:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return { completed: 0, total: 0 };
    }
  },

  async getWeeklyCompletionRate() {
    try {
      const params = {
        fields: [
          { field: { Name: "completed" } },
          { field: { Name: "createdAt" } }
        ],
        where: [{ FieldName: "createdAt", Operator: "RelativeMatch", Values: ["last 7 days"] }]
      };
      
      const response = await apperClient.fetchRecords('task', params);
      
      if (!response.success) {
        console.error(response.message);
        return 0;
      }
      
      const weeklyTasks = response.data || [];
      if (weeklyTasks.length === 0) return 0;
      
      const completedTasks = weeklyTasks.filter(task => task.completed === 'true').length;
      return Math.round((completedTasks / weeklyTasks.length) * 100);
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error getting weekly completion rate:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return 0;
    }
  },

  async getOverdueTasks() {
    try {
      const now = new Date().toISOString();
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title" } },
          { field: { Name: "dueDate" } },
          { field: { Name: "completed" } }
        ],
        whereGroups: [{
          operator: "AND",
          subGroups: [
            {
              operator: "AND",
              conditions: [
                { fieldName: "completed", operator: "EqualTo", values: ['false'], include: true },
                { fieldName: "dueDate", operator: "LessThan", values: [now], include: true },
                { fieldName: "dueDate", operator: "HasValue", values: [], include: true }
              ]
            }
          ]
        }]
      };
      
      const response = await apperClient.fetchRecords('task', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error getting overdue tasks:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  }
};