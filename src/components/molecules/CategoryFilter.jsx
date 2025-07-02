import React from 'react'
import { motion } from 'framer-motion'
import { useNavigate, useLocation } from 'react-router-dom'
import Badge from '@/components/atoms/Badge'
import ApperIcon from '@/components/ApperIcon'

const CategoryFilter = ({ categories, loading }) => {
  const navigate = useNavigate()
  const location = useLocation()
  
  const currentCategoryId = location.pathname.includes('/category/') 
    ? parseInt(location.pathname.split('/category/')[1])
    : null

  const handleCategoryClick = (categoryId) => {
    if (currentCategoryId === categoryId) {
      navigate('/')
    } else {
      navigate(`/category/${categoryId}`)
    }
  }

  const handleShowAll = () => {
    navigate('/')
  }

  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-gray-100 rounded-lg animate-pulse">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
              <div className="w-16 h-4 bg-gray-300 rounded"></div>
            </div>
            <div className="w-6 h-4 bg-gray-300 rounded"></div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleShowAll}
        className={`
          w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200
          ${!currentCategoryId 
            ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg' 
            : 'text-gray-600 hover:bg-surface hover:text-primary'
          }
        `}
      >
        <ApperIcon name="List" size={16} />
        <span className="font-medium">All Tasks</span>
      </motion.button>

      {categories.map((category) => (
        <motion.button
          key={category.Id}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleCategoryClick(category.Id)}
          className={`
            w-full flex items-center justify-between p-3 rounded-lg transition-all duration-200
            ${currentCategoryId === category.Id
              ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg'
              : 'text-gray-600 hover:bg-surface hover:text-primary'
            }
          `}
        >
          <div className="flex items-center gap-3">
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: category.color }}
            />
            <span className="font-medium">{category.name}</span>
          </div>
          <Badge 
            variant={currentCategoryId === category.Id ? 'default' : 'primary'}
            size="small"
            className={currentCategoryId === category.Id ? 'bg-white bg-opacity-20 text-white' : ''}
          >
            {category.taskCount}
          </Badge>
        </motion.button>
      ))}
    </div>
  )
}

export default CategoryFilter