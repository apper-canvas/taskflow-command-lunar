import React from 'react'

const PriorityDot = ({ priority, className = '' }) => {
  const priorityColors = {
    high: 'bg-error',
    medium: 'bg-warning',
    low: 'bg-success'
  }

  const priorityClass = priorityColors[priority] || 'bg-gray-400'
  const shouldPulse = priority === 'high'

  return (
    <div
      className={`
        w-3 h-3 rounded-full ${priorityClass} ${className}
        ${shouldPulse ? 'priority-pulse' : ''}
      `}
      title={`${priority} priority`}
    />
  )
}

export default PriorityDot