import React from 'react'
import { motion } from 'framer-motion'
import { useNavigate, useLocation } from 'react-router-dom'
import PriorityDot from '@/components/atoms/PriorityDot'

const PriorityFilter = () => {
  const navigate = useNavigate()
  const location = useLocation()
  
  const currentPriority = location.pathname.includes('/priority/') 
    ? location.pathname.split('/priority/')[1]
    : null

  const priorities = [
    { key: 'high', label: 'High Priority', color: 'error' },
    { key: 'medium', label: 'Medium Priority', color: 'warning' },
    { key: 'low', label: 'Low Priority', color: 'success' }
  ]

  const handlePriorityClick = (priority) => {
    if (currentPriority === priority) {
      navigate('/')
    } else {
      navigate(`/priority/${priority}`)
    }
  }

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
        Priority Filter
      </h3>
      
      {priorities.map((priority) => (
        <motion.button
          key={priority.key}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handlePriorityClick(priority.key)}
          className={`
            w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200
            ${currentPriority === priority.key
              ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg'
              : 'text-gray-600 hover:bg-surface hover:text-primary'
            }
          `}
        >
          <PriorityDot priority={priority.key} />
          <span className="font-medium">{priority.label}</span>
        </motion.button>
      ))}
    </div>
  )
}

export default PriorityFilter