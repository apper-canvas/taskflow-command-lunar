import React from 'react'
import { motion } from 'framer-motion'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'

const Empty = ({ onAddTask }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 px-4"
    >
      <div className="text-center max-w-md">
        <div className="w-24 h-24 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-8">
          <ApperIcon name="CheckSquare" size={40} className="text-white" />
        </div>
        
        <h3 className="text-2xl font-bold text-gray-900 mb-4">
          No tasks yet
        </h3>
        
        <p className="text-gray-600 mb-8 leading-relaxed">
          Start organizing your work by creating your first task. 
          Break down your goals into actionable items and stay productive!
        </p>
        
        <div className="space-y-4">
          {onAddTask && (
            <Button
              variant="primary"
              size="large"
              onClick={onAddTask}
              icon="Plus"
              className="shadow-lg hover:shadow-xl"
            >
              Create Your First Task
            </Button>
          )}
          
          <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <ApperIcon name="Zap" size={16} className="text-primary" />
              <span>Quick to add</span>
            </div>
            <div className="flex items-center gap-2">
              <ApperIcon name="Target" size={16} className="text-secondary" />
              <span>Easy to organize</span>
            </div>
            <div className="flex items-center gap-2">
              <ApperIcon name="Check" size={16} className="text-success" />
              <span>Satisfying to complete</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default Empty