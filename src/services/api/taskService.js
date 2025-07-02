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
  },

  async getTodaysProgress() {
    await delay(200)
    const today = new Date()
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate())
    const todayEnd = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000)
    
    const todaysTasks = tasks.filter(task => {
      const createdAt = new Date(task.createdAt)
      return createdAt >= todayStart && createdAt < todayEnd
    })
    
    const completed = todaysTasks.filter(task => task.completed).length
    
    return {
      completed,
      total: todaysTasks.length
    }
  },

  async getWeeklyCompletionRate() {
    await delay(200)
    const now = new Date()
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    
    const weeklyTasks = tasks.filter(task => {
      const createdAt = new Date(task.createdAt)
      return createdAt >= weekAgo && createdAt <= now
    })
    
    if (weeklyTasks.length === 0) return 0
    
    const completedTasks = weeklyTasks.filter(task => task.completed).length
    return Math.round((completedTasks / weeklyTasks.length) * 100)
  },

  async getOverdueTasks() {
    await delay(200)
    const now = new Date()
    return tasks.filter(task => {
      if (task.completed || !task.dueDate) return false
      const dueDate = new Date(task.dueDate)
      return dueDate < now
    })
  }
}