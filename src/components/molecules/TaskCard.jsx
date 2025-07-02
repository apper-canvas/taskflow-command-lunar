import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { format, isToday, isTomorrow, isPast } from 'date-fns'
import Checkbox from '@/components/atoms/Checkbox'
import Badge from '@/components/atoms/Badge'
import PriorityDot from '@/components/atoms/PriorityDot'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'

const TaskCard = ({ 
  task, 
  category, 
  onToggleComplete, 
  onEdit, 
  onDelete,
  isCompleting = false 
}) => {
  const [isHovered, setIsHovered] = useState(false)

  const formatDueDate = (dueDate) => {
    if (!dueDate) return null
    
    const date = new Date(dueDate)
    
    if (isToday(date)) return 'Today'
    if (isTomorrow(date)) return 'Tomorrow'
    
    return format(date, 'MMM d')
  }

  const getDueDateColor = (dueDate) => {
    if (!dueDate) return 'default'
    
    const date = new Date(dueDate)
    
    if (isPast(date) && !isToday(date)) return 'error'
    if (isToday(date)) return 'warning'
    
    return 'info'
  }

  const handleToggleComplete = () => {
    onToggleComplete(task.Id)
  }

  return (
    <AnimatePresence>
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ 
          opacity: isCompleting ? 0.5 : 1, 
          y: 0,
          x: isCompleting ? 20 : 0
        }}
        exit={{ opacity: 0, x: 100, transition: { duration: 0.3 } }}
        whileHover={{ 
          scale: 1.02, 
          y: -2,
          transition: { duration: 0.2 }
        }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        className={`
          bg-white rounded-xl border border-gray-100 p-6 transition-all duration-200
          ${isHovered ? 'shadow-lg shadow-gray-200/50' : 'shadow-sm'}
          ${task.completed ? 'opacity-75' : ''}
          ${isCompleting ? 'task-complete-animation' : ''}
        `}
      >
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 mt-1">
            <Checkbox
              checked={task.completed}
              onChange={handleToggleComplete}
              disabled={isCompleting}
            />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <h3 className={`
                font-semibold text-gray-900 leading-tight
                ${task.completed ? 'line-through text-gray-500' : ''}
              `}>
                {task.title}
              </h3>
              
              <div className="flex items-center gap-2 ml-4">
                <PriorityDot priority={task.priority} />
                
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ 
                    opacity: isHovered ? 1 : 0,
                    scale: isHovered ? 1 : 0.8
                  }}
                  className="flex items-center gap-1"
                >
                  <Button
                    size="small"
                    variant="ghost"
                    icon="Edit3"
                    onClick={() => onEdit(task)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  />
                  <Button
                    size="small"
                    variant="ghost"
                    icon="Trash2"
                    onClick={() => onDelete(task.Id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-error hover:text-error"
                  />
                </motion.div>
              </div>
            </div>
            
            {task.description && (
              <p className={`
                text-sm text-gray-600 mb-3 leading-relaxed
                ${task.completed ? 'line-through' : ''}
              `}>
                {task.description}
              </p>
            )}
            
            <div className="flex items-center gap-3 flex-wrap">
              {category && (
                <Badge color={category.color} size="small">
                  {category.name}
                </Badge>
              )}
              
              {task.dueDate && (
                <Badge variant={getDueDateColor(task.dueDate)} size="small">
                  <ApperIcon name="Calendar" size={12} />
                  {formatDueDate(task.dueDate)}
                </Badge>
              )}
              
              <Badge variant="default" size="small">
                {task.priority} priority
              </Badge>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

export default TaskCard