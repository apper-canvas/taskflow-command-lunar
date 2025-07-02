import React from 'react'
import ApperIcon from '@/components/ApperIcon'

const Select = ({ 
  label,
  options = [],
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
        <select
          className={`
            w-full px-4 py-3 border border-gray-200 rounded-lg appearance-none bg-white
            focus:ring-2 focus:ring-primary focus:ring-opacity-50 focus:border-primary
            transition-all duration-200 font-body cursor-pointer
            ${error ? 'border-error focus:ring-error focus:border-error' : ''}
            hover:border-gray-300 focus:outline-none
          `}
          {...props}
        >
          {options.map((option, index) => (
            <option key={index} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
          <ApperIcon name="ChevronDown" size={18} className="text-gray-400" />
        </div>
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

export default Select