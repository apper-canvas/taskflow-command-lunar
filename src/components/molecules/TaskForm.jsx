import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Select from "@/components/atoms/Select";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";

const TaskForm = ({ onSubmit, onCancel, categories, initialData = null, onApplyTemplate }) => {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    categoryId: initialData?.categoryId || '',
    priority: initialData?.priority || 'medium',
    dueDate: initialData?.dueDate ? new Date(initialData.dueDate).toISOString().split('T')[0] : ''
  })
  
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const applyTemplate = (template) => {
    setFormData({
      title: template.title || '',
      description: template.description || '',
      categoryId: template.categoryId || '',
      priority: template.priority || 'medium',
      dueDate: template.dueDate ? new Date(template.dueDate).toISOString().split('T')[0] : ''
    })
    setErrors({})
  }

  // Expose applyTemplate to parent component
  React.useImperativeHandle(onApplyTemplate, () => ({
    applyTemplate
  }), [])
  const priorityOptions = [
    { value: 'high', label: 'High Priority' },
    { value: 'medium', label: 'Medium Priority' },
    { value: 'low', label: 'Low Priority' }
  ]

  const categoryOptions = [
    { value: '', label: 'Select a category' },
    ...categories.map(cat => ({ value: cat.Id, label: cat.name }))
  ]

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.title.trim()) {
      newErrors.title = 'Task title is required'
    }
    
    if (!formData.categoryId) {
      newErrors.categoryId = 'Please select a category'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
}

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    // Prevent double submission from keyboard shortcut
    if (isSubmitting) return
    
setIsSubmitting(true)
    try {
      const submitData = {
        ...formData,
        categoryId: parseInt(formData.categoryId),
        dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : null
      }
      
      await onSubmit(submitData)
    } catch (error) {
      console.error('Error submitting task:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Keyboard shortcut for saving forms
  useEffect(() => {
    const handleKeyboard = (e) => {
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault()
        // Don't submit if already submitting or if there are validation errors
        if (!isSubmitting && validateForm()) {
          const form = document.querySelector('form')
          if (form) {
            form.requestSubmit()
          }
        }
      }
    }

    document.addEventListener('keydown', handleKeyboard)
    return () => document.removeEventListener('keydown', handleKeyboard)
  }, [isSubmitting])
  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }))
    }
  }
return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      <Input
        label="Task Title"
        value={formData.title}
        onChange={(e) => handleChange('title', e.target.value)}
        placeholder="Enter task title..."
        error={errors.title}
        icon="Edit3"
      />

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          placeholder="Add task description (optional)..."
          rows={3}
          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:ring-opacity-50 focus:border-primary transition-all duration-200 font-body hover:border-gray-300 focus:outline-none resize-none"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
          label="Category"
          value={formData.categoryId}
          onChange={(e) => handleChange('categoryId', e.target.value)}
          options={categoryOptions}
          error={errors.categoryId}
        />

        <Select
          label="Priority"
          value={formData.priority}
          onChange={(e) => handleChange('priority', e.target.value)}
          options={priorityOptions}
        />
      </div>

      <Input
        label="Due Date (Optional)"
        type="date"
        value={formData.dueDate}
        onChange={(e) => handleChange('dueDate', e.target.value)}
        icon="Calendar"
      />

      <div className="flex gap-3 pt-4">
        <Button
          type="submit"
          variant="primary"
          disabled={isSubmitting}
          className="flex-1"
          icon={isSubmitting ? "Loader2" : "Plus"}
        >
          {isSubmitting ? 'Creating...' : (initialData ? 'Update Task' : 'Create Task')}
        </Button>
        
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={isSubmitting}
          icon="X"
        >
          Cancel
        </Button>
      </div>
    </motion.form>
  )
}

export default TaskForm