import React from 'react'
import ApperIcon from '@/components/ApperIcon'

const Input = ({ 
  label,
  icon,
  error,
  className = '',
  ...props 
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
            <ApperIcon name={icon} size={18} className="text-gray-400" />
          </div>
        )}
        <input
          className={`
            w-full px-4 py-3 border border-gray-200 rounded-lg
            focus:ring-2 focus:ring-primary focus:ring-opacity-50 focus:border-primary
            transition-all duration-200 font-body
            ${icon ? 'pl-11' : ''}
            ${error ? 'border-error focus:ring-error focus:border-error' : ''}
            hover:border-gray-300 focus:outline-none
          `}
          {...props}
        />
      </div>
      {error && (
        <p className="text-sm text-error flex items-center gap-1">
          <ApperIcon name="AlertCircle" size={14} />
          {error}
        </p>
      )}
    </div>
  )
}

export default Input