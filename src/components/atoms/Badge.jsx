import React from 'react'

const Badge = ({ 
  children, 
  variant = 'default', 
  color,
  size = 'medium',
  className = '' 
}) => {
  const baseClasses = 'inline-flex items-center font-medium rounded-full'
  
  const sizeClasses = {
    small: 'px-2 py-0.5 text-xs',
    medium: 'px-3 py-1 text-sm',
    large: 'px-4 py-1.5 text-base'
  }
  
  const variantClasses = {
    default: 'bg-gray-100 text-gray-800',
    primary: 'bg-primary bg-opacity-10 text-primary',
    secondary: 'bg-secondary bg-opacity-10 text-secondary',
    success: 'bg-success bg-opacity-10 text-success',
    warning: 'bg-warning bg-opacity-10 text-warning',
    error: 'bg-error bg-opacity-10 text-error',
    info: 'bg-info bg-opacity-10 text-info'
  }

  // If a custom color is provided, use it
  const customStyle = color ? {
    backgroundColor: `${color}15`,
    color: color
  } : {}

  return (
    <span 
      className={`${baseClasses} ${sizeClasses[size]} ${!color ? variantClasses[variant] : ''} ${className}`}
      style={customStyle}
    >
      {children}
    </span>
  )
}

export default Badge