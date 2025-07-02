import React from 'react'
import { motion } from 'framer-motion'
import Button from '@/components/atoms/Button'
import SearchBar from '@/components/molecules/SearchBar'
import ApperIcon from '@/components/ApperIcon'

const Header = ({ onAddTask, onSearch, totalTasks, completedTasks }) => {
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border-b border-gray-100 sticky top-0 z-40 backdrop-blur-sm bg-white/95"
    >
      <div className="px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-xl flex items-center justify-center">
                <ApperIcon name="CheckSquare" size={20} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold font-display bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  TaskFlow
                </h1>
                <p className="text-sm text-gray-500">
                  {totalTasks} total tasks • {completedTasks} completed
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {totalTasks > 0 && (
              <div className="hidden md:flex items-center gap-2 px-3 py-2 bg-surface rounded-lg">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-success to-emerald-500 flex items-center justify-center">
                  <span className="text-xs font-bold text-white">{completionRate}%</span>
                </div>
                <span className="text-sm font-medium text-gray-600">Progress</span>
              </div>
            )}
            
            <Button
              variant="primary"
              icon="Plus"
              onClick={onAddTask}
              className="shadow-lg hover:shadow-xl"
            >
              Add Task
            </Button>
          </div>
        </div>
        
        <div className="max-w-md">
          <SearchBar
            onSearch={onSearch}
            placeholder="Search tasks..."
          />
        </div>
      </div>
    </motion.header>
  )
}

export default Header