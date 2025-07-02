import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import TaskForm from '@/components/molecules/TaskForm'
import TaskTemplateModal from '@/components/organisms/TaskTemplateModal'
import ApperIcon from '@/components/ApperIcon'

const TaskModal = ({ isOpen, onClose, onSubmit, categories, task = null, onApplyTemplate }) => {
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false)
  
  if (!isOpen) return null
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={handleBackdropClick}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden"
          >
<div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold font-display text-gray-900">
                  {task ? 'Edit Task' : 'Create New Task'}
                </h2>
                <div className="flex items-center gap-2">
                  {!task && (
                    <button
                      onClick={() => setIsTemplateModalOpen(true)}
                      className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-primary bg-primary/10 hover:bg-primary/20 rounded-lg transition-colors"
                    >
                      <ApperIcon name="BookTemplate" size={16} />
                      Templates
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
<TaskForm
                onSubmit={onSubmit}
                onCancel={onClose}
                categories={categories}
                initialData={task}
                onApplyTemplate={onApplyTemplate}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
      
      <TaskTemplateModal
        isOpen={isTemplateModalOpen}
        onClose={() => setIsTemplateModalOpen(false)}
        onApplyTemplate={(template) => {
          onApplyTemplate(template)
          setIsTemplateModalOpen(false)
        }}
        categories={categories}
      />
    </AnimatePresence>
  )
}

export default TaskModal