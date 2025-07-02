import React from 'react'
import { motion } from 'framer-motion'

const Loading = () => {
  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <div className="animate-pulse">
        <div className="flex items-center justify-between mb-6">
          <div className="h-8 bg-gray-200 rounded w-48"></div>
          <div className="h-6 bg-gray-200 rounded w-24"></div>
        </div>
      </div>

      {/* Task cards skeleton */}
      <div className="space-y-4">
        {[...Array(5)].map((_, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl border border-gray-100 p-6 animate-pulse"
          >
            <div className="flex items-start gap-4">
              <div className="w-5 h-5 bg-gray-200 rounded border-2 border-gray-300 flex-shrink-0 mt-1"></div>
              
              <div className="flex-1 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                  <div className="w-3 h-3 bg-gray-200 rounded-full"></div>
                </div>
                
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="h-6 bg-gray-200 rounded-full w-16"></div>
                  <div className="h-6 bg-gray-200 rounded-full w-20"></div>
                  <div className="h-6 bg-gray-200 rounded-full w-24"></div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default Loading