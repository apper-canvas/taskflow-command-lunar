import React from 'react'
import { motion } from 'framer-motion'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'

const Error = ({ error, onRetry }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 px-4"
    >
      <div className="text-center max-w-md">
        <div className="w-16 h-16 bg-gradient-to-r from-error to-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <ApperIcon name="AlertTriangle" size={32} className="text-white" />
        </div>
        
        <h3 className="text-xl font-bold text-gray-900 mb-3">
          Something went wrong
        </h3>
        
        <p className="text-gray-600 mb-2">
          {error || "We couldn't load your tasks right now. Please try again."}
        </p>
        
        <p className="text-sm text-gray-500 mb-8">
          If the problem persists, please refresh the page or check your connection.
        </p>
        
        <div className="flex gap-3 justify-center">
          <Button
            variant="primary"
            onClick={onRetry}
            icon="RefreshCw"
            className="shadow-lg hover:shadow-xl"
          >
            Try Again
          </Button>
          
          <Button
            variant="secondary"
            onClick={() => window.location.reload()}
            icon="RotateCcw"
          >
            Refresh Page
          </Button>
        </div>
      </div>
    </motion.div>
  )
}

export default Error