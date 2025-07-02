import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { taskService } from '@/services/api/taskService'
import ApperIcon from '@/components/ApperIcon'

const StatisticsCards = () => {
  const [statistics, setStatistics] = useState({
    todaysProgress: { completed: 0, total: 0 },
    weeklyRate: 0,
    overdueTasks: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const [todaysProgress, weeklyRate, overdueTasks] = await Promise.all([
          taskService.getTodaysProgress(),
          taskService.getWeeklyCompletionRate(),
          taskService.getOverdueTasks()
        ])

        setStatistics({
          todaysProgress,
          weeklyRate,
          overdueTasks: overdueTasks.length
        })
      } catch (err) {
        setError('Failed to load statistics')
        console.error('Statistics error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchStatistics()
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="bg-surface rounded-xl p-4 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-error/10 border border-error/20 rounded-xl p-4 mb-6">
        <div className="flex items-center gap-2 text-error">
          <ApperIcon name="AlertCircle" size={16} />
          <span className="text-sm font-medium">{error}</span>
        </div>
      </div>
    )
  }

  const todayProgressRate = statistics.todaysProgress.total > 0 
    ? Math.round((statistics.todaysProgress.completed / statistics.todaysProgress.total) * 100)
    : 0

  const cards = [
    {
      title: "Today's Progress",
      value: `${statistics.todaysProgress.completed}/${statistics.todaysProgress.total}`,
      percentage: todayProgressRate,
      icon: "Calendar",
      gradient: "from-blue-500 to-blue-600",
      bgGradient: "from-blue-50 to-blue-100"
    },
    {
      title: "Weekly Rate",
      value: `${statistics.weeklyRate}%`,
      icon: "TrendingUp",
      gradient: "from-success to-emerald-600",
      bgGradient: "from-green-50 to-green-100"
    },
    {
      title: "Overdue Tasks",
      value: statistics.overdueTasks,
      icon: "Clock",
      gradient: statistics.overdueTasks > 0 ? "from-error to-red-600" : "from-gray-500 to-gray-600",
      bgGradient: statistics.overdueTasks > 0 ? "from-red-50 to-red-100" : "from-gray-50 to-gray-100"
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      {cards.map((card, index) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className={`bg-gradient-to-br ${card.bgGradient} rounded-xl p-4 border border-white/50 shadow-sm hover:shadow-md transition-shadow`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">{card.title}</span>
            <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${card.gradient} flex items-center justify-center shadow-sm`}>
              <ApperIcon name={card.icon} size={16} className="text-white" />
            </div>
          </div>
          <div className="flex items-end gap-2">
            <span className="text-2xl font-bold text-gray-900">{card.value}</span>
            {card.percentage !== undefined && (
              <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                card.percentage >= 75 ? 'bg-success/10 text-success' :
                card.percentage >= 50 ? 'bg-warning/10 text-warning' :
                'bg-gray-100 text-gray-600'
              }`}>
                {card.percentage}%
              </span>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  )
}

export default StatisticsCards