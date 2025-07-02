import React from 'react'
import { motion } from 'framer-motion'
import CategoryFilter from '@/components/molecules/CategoryFilter'
import PriorityFilter from '@/components/molecules/PriorityFilter'

const Sidebar = ({ categories, categoriesLoading, className = '' }) => {
  return (
    <motion.aside
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className={`bg-white border-r border-gray-100 ${className}`}
    >
      <div className="p-6 space-y-8">
        <div>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
            Categories
          </h2>
          <CategoryFilter 
            categories={categories} 
            loading={categoriesLoading}
          />
        </div>
        
        <div>
          <PriorityFilter />
        </div>
        
        <div className="pt-8 border-t border-gray-100">
          <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl p-4">
            <h3 className="font-semibold text-gray-900 mb-2">
              🎯 Stay Focused
            </h3>
            <p className="text-sm text-gray-600">
              Break down large tasks into smaller, manageable steps to maintain momentum.
            </p>
          </div>
        </div>
      </div>
    </motion.aside>
  )
}

export default Sidebar