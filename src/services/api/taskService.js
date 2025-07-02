const { ApperClient } = window.ApperSDK;

const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});
// Helper function to format DateTime for Apper backend
const formatDateTime = (date) => {
  if (!date) return null;
  const d = new Date(date);
  // Check if date is valid
  if (isNaN(d.getTime())) return null;
  // Return ISO 8601 format with timezone
  return d.toISOString();
};

export const taskService = {
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
          { field: { Name: "priority" } },
          { field: { Name: "dueDate" } },
          { field: { Name: "completed" } },
          { field: { Name: "createdAt" } },
          { field: { Name: "completedAt" } },
          { field: { Name: "categoryId" }, referenceField: { field: { Name: "Name" } } }
        ],
        orderBy: [{ fieldName: "CreatedOn", sorttype: "DESC" }]
      };
      
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
          dueDate: taskData.dueDate,
          completed: taskData.completed || 'false',
          createdAt: formatDateTime(taskData.createdAt || new Date()),
          completedAt: taskData.completedAt,
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
          dueDate: taskData.dueDate,
          completed: taskData.completed,
          createdAt: formatDateTime(taskData.createdAt),
          completedAt: taskData.completedAt,
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