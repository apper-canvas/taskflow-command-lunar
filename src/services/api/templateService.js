import templatesData from '@/services/mockData/taskTemplates.json'

let templates = [...templatesData]

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const templateService = {
  async getAll() {
    await delay(200)
    return [...templates]
  },

  async getById(id) {
    await delay(200)
    const template = templates.find(template => template.Id === parseInt(id))
    if (!template) {
      throw new Error('Template not found')
    }
    return { ...template }
  },

  async create(templateData) {
    await delay(250)
    const newTemplate = {
      Id: Math.max(...templates.map(t => t.Id), 0) + 1,
      ...templateData,
      createdAt: new Date().toISOString()
    }
    templates.unshift(newTemplate)
    return { ...newTemplate }
  },

  async update(id, templateData) {
    await delay(200)
    const index = templates.findIndex(template => template.Id === parseInt(id))
    if (index === -1) {
      throw new Error('Template not found')
    }
    
    templates[index] = { 
      ...templates[index], 
      ...templateData
    }
    return { ...templates[index] }
  },

  async delete(id) {
    await delay(200)
    const index = templates.findIndex(template => template.Id === parseInt(id))
    if (index === -1) {
      throw new Error('Template not found')
    }
    
    const deletedTemplate = templates[index]
    templates.splice(index, 1)
    return { ...deletedTemplate }
  }
}