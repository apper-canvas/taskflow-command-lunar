import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import Select from '@/components/atoms/Select'
import { templateService } from '@/services/api/templateService'

const TaskTemplateModal = ({ isOpen, onClose, onApplyTemplate, categories }) => {
  const [templates, setTemplates] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [view, setView] = useState('gallery') // 'gallery', 'create', 'edit'
  const [editingTemplate, setEditingTemplate] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    description: '',
    categoryId: '',
    priority: 'medium',
    dueDate: ''
  })

  const priorityOptions = [
    { value: 'high', label: 'High Priority' },
    { value: 'medium', label: 'Medium Priority' },
    { value: 'low', label: 'Low Priority' }
  ]

  const categoryOptions = [
    { value: '', label: 'Select a category' },
    ...categories.map(cat => ({ value: cat.Id, label: cat.name }))
  ]

  useEffect(() => {
    if (isOpen) {
      loadTemplates()
      setView('gallery')
      setEditingTemplate(null)
      resetForm()
    }
  }, [isOpen])

  const loadTemplates = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await templateService.getAll()
      setTemplates(data)
    } catch (err) {
      setError(err.message)
      toast.error('Failed to load templates')
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      title: '',
      description: '',
      categoryId: '',
      priority: 'medium',
      dueDate: ''
    })
  }

  const handleCreateTemplate = async (e) => {
    e.preventDefault()
    if (!formData.name.trim()) {
      toast.error('Template name is required')
      return
    }

    try {
      const templateData = {
        ...formData,
        categoryId: formData.categoryId ? parseInt(formData.categoryId) : null
      }
      const newTemplate = await templateService.create(templateData)
      setTemplates(prev => [newTemplate, ...prev])
      setView('gallery')
      resetForm()
      toast.success('Template created successfully!')
    } catch (error) {
      toast.error('Failed to create template')
    }
  }

  const handleUpdateTemplate = async (e) => {
    e.preventDefault()
    if (!formData.name.trim()) {
      toast.error('Template name is required')
      return
    }

    try {
      const templateData = {
        ...formData,
        categoryId: formData.categoryId ? parseInt(formData.categoryId) : null
      }
      const updatedTemplate = await templateService.update(editingTemplate.Id, templateData)
      setTemplates(prev => prev.map(t => t.Id === editingTemplate.Id ? updatedTemplate : t))
      setView('gallery')
      setEditingTemplate(null)
      resetForm()
      toast.success('Template updated successfully!')
    } catch (error) {
      toast.error('Failed to update template')
    }
  }

  const handleDeleteTemplate = async (template) => {
    if (!window.confirm(`Are you sure you want to delete "${template.name}" template?`)) {
      return
    }

    try {
      await templateService.delete(template.Id)
      setTemplates(prev => prev.filter(t => t.Id !== template.Id))
      toast.success('Template deleted successfully!')
    } catch (error) {
      toast.error('Failed to delete template')
    }
  }

  const handleEditTemplate = (template) => {
    setEditingTemplate(template)
    setFormData({
      name: template.name,
      title: template.title || '',
      description: template.description || '',
      categoryId: template.categoryId || '',
      priority: template.priority || 'medium',
      dueDate: template.dueDate ? new Date(template.dueDate).toISOString().split('T')[0] : ''
    })
    setView('edit')
  }

  const handleApplyTemplate = (template) => {
    onApplyTemplate(template)
    onClose()
  }

  if (!isOpen) return null

  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => cat.Id === categoryId)
    return category ? category.name : 'No Category'
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold font-display text-gray-900">
                  {view === 'gallery' ? 'Task Templates' : view === 'create' ? 'Create Template' : 'Edit Template'}
                </h2>
                <div className="flex items-center gap-2">
                  {view === 'gallery' && (
                    <button
                      onClick={() => setView('create')}
                      className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-primary bg-primary/10 hover:bg-primary/20 rounded-lg transition-colors"
                    >
                      <ApperIcon name="Plus" size={16} />
                      New Template
                    </button>
                  )}
                  {view !== 'gallery' && (
                    <button
                      onClick={() => {
                        setView('gallery')
                        setEditingTemplate(null)
                        resetForm()
                      }}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <ApperIcon name="ArrowLeft" size={20} className="text-gray-500" />
                    </button>
                  )}
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <ApperIcon name="X" size={20} className="text-gray-500" />
                  </button>
                </div>
              </div>

              <div className="max-h-96 overflow-y-auto">
                {view === 'gallery' && (
                  <div className="space-y-3">
                    {loading ? (
                      <div className="text-center py-8">
                        <ApperIcon name="Loader2" size={24} className="animate-spin text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-500">Loading templates...</p>
                      </div>
                    ) : error ? (
                      <div className="text-center py-8">
                        <ApperIcon name="AlertCircle" size={24} className="text-error mx-auto mb-2" />
                        <p className="text-error">{error}</p>
                      </div>
                    ) : templates.length === 0 ? (
                      <div className="text-center py-8">
                        <ApperIcon name="BookTemplate" size={48} className="text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 mb-4">No templates found</p>
                        <button
                          onClick={() => setView('create')}
                          className="text-primary hover:text-primary/80 font-medium"
                        >
                          Create your first template
                        </button>
                      </div>
                    ) : (
                      templates.map(template => (
                        <div key={template.Id} className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900 mb-1">{template.name}</h3>
                              <p className="text-sm text-gray-600 mb-2">{template.title}</p>
                              <div className="flex items-center gap-4 text-xs text-gray-500">
                                <span className="flex items-center gap-1">
                                  <ApperIcon name="Tag" size={12} />
                                  {getCategoryName(template.categoryId)}
                                </span>
                                <span className="flex items-center gap-1">
                                  <ApperIcon name="Flag" size={12} />
                                  {template.priority}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-1 ml-4">
                              <button
                                onClick={() => handleApplyTemplate(template)}
                                className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                                title="Apply template"
                              >
                                <ApperIcon name="Download" size={16} />
                              </button>
                              <button
                                onClick={() => handleEditTemplate(template)}
                                className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                                title="Edit template"
                              >
                                <ApperIcon name="Edit3" size={16} />
                              </button>
                              <button
                                onClick={() => handleDeleteTemplate(template)}
                                className="p-2 text-error hover:bg-error/10 rounded-lg transition-colors"
                                title="Delete template"
                              >
                                <ApperIcon name="Trash2" size={16} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {(view === 'create' || view === 'edit') && (
                  <form onSubmit={view === 'create' ? handleCreateTemplate : handleUpdateTemplate} className="space-y-4">
                    <Input
                      label="Template Name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g., Weekly Report, Daily Checklist"
                      icon="BookTemplate"
                      required
                    />

                    <Input
                      label="Task Title"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Enter default task title..."
                      icon="Edit3"
                    />

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Description
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Enter default task description..."
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:ring-opacity-50 focus:border-primary transition-all duration-200 font-body hover:border-gray-300 focus:outline-none resize-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Select
                        label="Default Category"
                        value={formData.categoryId}
                        onChange={(e) => setFormData(prev => ({ ...prev, categoryId: e.target.value }))}
                        options={categoryOptions}
                      />

                      <Select
                        label="Default Priority"
                        value={formData.priority}
                        onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value }))}
                        options={priorityOptions}
                      />
                    </div>

                    <Input
                      label="Default Due Date (Optional)"
                      type="date"
                      value={formData.dueDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                      icon="Calendar"
                    />

                    <div className="flex gap-3 pt-4">
                      <Button
                        type="submit"
                        variant="primary"
                        className="flex-1"
                        icon="Save"
                      >
                        {view === 'create' ? 'Create Template' : 'Update Template'}
                      </Button>
                      
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => {
                          setView('gallery')
                          setEditingTemplate(null)
                          resetForm()
                        }}
                        icon="X"
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default TaskTemplateModal