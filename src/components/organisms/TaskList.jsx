import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import TaskCard from '@/components/molecules/TaskCard'
import Button from '@/components/atoms/Button'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'

const TaskList = ({ 
  tasks, 
  categories, 
  loading, 
  error, 
  onToggleComplete, 
  onEditTask, 
  onDeleteTask,
  onRetry 
}) => {
  const [completingTasks, setCompletingTasks] = useState(new Set())

  const handleToggleComplete = async (taskId) => {
    setCompletingTasks(prev => new Set([...prev, taskId]))
    
    try {
      await onToggleComplete(taskId)
    } finally {
      // Remove from completing set after animation
      setTimeout(() => {
        setCompletingTasks(prev => {
          const newSet = new Set(prev)
          newSet.delete(taskId)
          return newSet
        })
      }, 500)
    }
  }

  const getCategoryById = (categoryId) => {
    return categories.find(cat => cat.Id === categoryId)
  }

  const activeTasks = tasks.filter(task => !task.completed)
  const completedTasks = tasks.filter(task => task.completed)

  if (loading) {
    return <Loading />
  }

  if (error) {
    return <Error error={error} onRetry={onRetry} />
  }

  if (tasks.length === 0) {
    return <Empty />
  }

  return (
    <div className="space-y-8">
      {/* Active Tasks */}
      {activeTasks.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              Active Tasks ({activeTasks.length})
            </h2>
          </div>
          
          <div className="space-y-4">
            <AnimatePresence>
              {activeTasks.map((task) => (
                <TaskCard
                  key={task.Id}
                  task={task}
                  category={getCategoryById(task.categoryId)}
                  onToggleComplete={handleToggleComplete}
                  onEdit={onEditTask}
                  onDelete={onDeleteTask}
                  isCompleting={completingTasks.has(task.Id)}
                />
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Completed Tasks */}
      {completedTasks.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              Completed Tasks ({completedTasks.length})
            </h2>
            <Button
              variant="ghost"
              size="small"
              icon="Archive"
              className="text-gray-500"
            >
              Archive All
            </Button>
          </div>
          
          <div className="space-y-4">
            <AnimatePresence>
              {completedTasks.map((task) => (
                <TaskCard
                  key={task.Id}
                  task={task}
                  category={getCategoryById(task.categoryId)}
                  onToggleComplete={handleToggleComplete}
                  onEdit={onEditTask}
                  onDelete={onDeleteTask}
                  isCompleting={completingTasks.has(task.Id)}
                />
              ))}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default TaskList