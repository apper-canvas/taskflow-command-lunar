import tasksData from '@/services/mockData/tasks.json'

let tasks = [...tasksData]

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const taskService = {
  async getAll() {
    await delay(300)
    return [...tasks]
  },

  async getById(id) {
    await delay(200)
    const task = tasks.find(task => task.Id === parseInt(id))
    if (!task) {
      throw new Error('Task not found')
    }
    return { ...task }
  },

  async create(taskData) {
    await delay(250)
    const newTask = {
      Id: Math.max(...tasks.map(t => t.Id), 0) + 1,
      ...taskData,
      completed: false,
      createdAt: new Date().toISOString(),
      completedAt: null
    }
    tasks.push(newTask)
    return { ...newTask }
  },

  async update(id, taskData) {
    await delay(200)
    const index = tasks.findIndex(task => task.Id === parseInt(id))
    if (index === -1) {
      throw new Error('Task not found')
    }
    
    tasks[index] = { 
      ...tasks[index], 
      ...taskData,
      completedAt: taskData.completed && !tasks[index].completed 
        ? new Date().toISOString() 
        : (!taskData.completed ? null : tasks[index].completedAt)
    }
    return { ...tasks[index] }
  },

  async delete(id) {
    await delay(200)
    const index = tasks.findIndex(task => task.Id === parseInt(id))
    if (index === -1) {
      throw new Error('Task not found')
    }
    
    const deletedTask = tasks[index]
    tasks.splice(index, 1)
    return { ...deletedTask }
  },

  async getByCategory(categoryId) {
    await delay(250)
    return tasks.filter(task => task.categoryId === parseInt(categoryId))
  },

  async getByPriority(priority) {
    await delay(250)
    return tasks.filter(task => task.priority === priority)
  },

  async searchTasks(query) {
    await delay(200)
    const searchTerm = query.toLowerCase()
    return tasks.filter(task => 
      task.title.toLowerCase().includes(searchTerm) ||
      task.description.toLowerCase().includes(searchTerm)
    )
  },

  async toggleComplete(id) {
    await delay(200)
    const index = tasks.findIndex(task => task.Id === parseInt(id))
    if (index === -1) {
      throw new Error('Task not found')
    }
    
    const currentTask = tasks[index]
    const updatedTask = {
      ...currentTask,
      completed: !currentTask.completed,
      completedAt: !currentTask.completed ? new Date().toISOString() : null
    }
    
    tasks[index] = updatedTask
    return { ...updatedTask }
  }
}