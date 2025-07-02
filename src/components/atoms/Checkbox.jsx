import React from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const Checkbox = ({ 
  checked = false, 
  onChange, 
  label,
  disabled = false,
  className = '',
  ...props 
}) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <motion.div
        whileTap={{ scale: 0.95 }}
        className="relative"
      >
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className="sr-only"
          {...props}
        />
        <div
          className={`
            w-5 h-5 rounded border-2 cursor-pointer transition-all duration-200
            flex items-center justify-center
            ${checked 
              ? 'bg-gradient-to-r from-primary to-secondary border-primary' 
              : 'border-gray-300 hover:border-primary'
            }
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
          onClick={() => !disabled && onChange?.({ target: { checked: !checked } })}
        >
          {checked && (
            <motion.div
              initial={{ scale: 0, rotate: 45 }}
              animate={{ scale: 1, rotate: 45 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="checkmark-animation"
            >
              <ApperIcon name="Check" size={12} className="text-white" />
            </motion.div>
          )}
        </div>
      </motion.div>
      
      {label && (
        <label 
          className={`text-sm font-medium cursor-pointer ${disabled ? 'opacity-50' : 'text-gray-700'}`}
          onClick={() => !disabled && onChange?.({ target: { checked: !checked } })}
        >
          {label}
        </label>
      )}
    </div>
  )
}

export default Checkbox