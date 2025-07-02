import React from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'medium', 
  icon,
  iconPosition = 'left',
  disabled = false,
  className = '',
  onClick,
  ...props 
}) => {
  const baseClasses = 'font-medium rounded-lg transition-all duration-200 focus-ring flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed'
  
  const variantClasses = {
    primary: 'bg-gradient-to-r from-primary to-secondary text-white hover:shadow-lg hover:shadow-primary/25 hover:scale-[1.02] active:scale-[0.98]',
    secondary: 'bg-white border border-gray-200 text-gray-700 hover:bg-surface hover:border-gray-300 hover:shadow-md hover:scale-[1.02] active:scale-[0.98]',
    outline: 'border border-primary text-primary bg-transparent hover:bg-primary hover:text-white hover:shadow-lg hover:shadow-primary/25 hover:scale-[1.02] active:scale-[0.98]',
    ghost: 'text-gray-600 hover:text-primary hover:bg-surface hover:scale-[1.02] active:scale-[0.98]',
    danger: 'bg-gradient-to-r from-error to-red-600 text-white hover:shadow-lg hover:shadow-error/25 hover:scale-[1.02] active:scale-[0.98]'
  }
  
  const sizeClasses = {
    small: 'px-3 py-1.5 text-sm',
    medium: 'px-4 py-2 text-sm',
    large: 'px-6 py-3 text-base'
  }

  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {icon && iconPosition === 'left' && (
        <ApperIcon name={icon} size={size === 'small' ? 14 : size === 'large' ? 18 : 16} />
      )}
      {children}
      {icon && iconPosition === 'right' && (
        <ApperIcon name={icon} size={size === 'small' ? 14 : size === 'large' ? 18 : 16} />
      )}
    </motion.button>
  )
}

export default Button