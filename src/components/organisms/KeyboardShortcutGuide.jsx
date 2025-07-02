import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const KeyboardShortcutGuide = ({ isOpen, onClose }) => {
  if (!isOpen) return null

  const shortcuts = [
    {
      key: 'Ctrl + N',
      description: 'Create a new task',
      icon: 'Plus'
    },
    {
      key: 'Ctrl + S',
      description: 'Save current template (when in template modal)',
      icon: 'Save'
    },
    {
      key: 'Ctrl + D',
      description: 'Delete selected task',
      icon: 'Trash2'
    },
    {
      key: 'Ctrl + ?',
      description: 'Show this keyboard shortcuts guide',
      icon: 'HelpCircle'
    },
    {
      key: 'Escape',
      description: 'Close current modal or dialog',
      icon: 'X'
    }
  ]

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={handleBackdropClick}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold font-display text-gray-900 flex items-center gap-2">
                  <ApperIcon name="Keyboard" size={24} className="text-primary" />
                  Keyboard Shortcuts
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ApperIcon name="X" size={20} className="text-gray-500" />
                </button>
              </div>

              <div className="space-y-4">
                <p className="text-sm text-gray-600 mb-4">
                  Use these keyboard shortcuts to work faster with TaskFlow:
                </p>
                
                {shortcuts.map((shortcut, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center justify-center w-8 h-8 bg-white rounded-lg shadow-sm">
                      <ApperIcon name={shortcut.icon} size={16} className="text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-sm font-semibold bg-white px-2 py-1 rounded border text-gray-700">
                          {shortcut.key}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{shortcut.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-start gap-2">
                  <ApperIcon name="Info" size={16} className="text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-blue-900 mb-1">Pro Tip</p>
                    <p className="text-sm text-blue-700">
                      Most shortcuts work globally, but some (like Save) are context-specific and only work when the relevant modal is open.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium"
                >
                  Got it!
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default KeyboardShortcutGuide