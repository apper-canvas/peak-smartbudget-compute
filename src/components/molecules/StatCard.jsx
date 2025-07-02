import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const StatCard = ({ 
  title, 
  value, 
  change, 
  changeType = 'neutral',
  icon,
  gradient = 'primary',
  delay = 0
}) => {
  const gradients = {
    primary: 'from-primary-500 to-primary-600',
    secondary: 'from-secondary-500 to-secondary-600',
    success: 'from-success-500 to-success-600',
    warning: 'from-warning-500 to-warning-600',
    error: 'from-error-500 to-error-600'
  }
  
  const changeColors = {
    positive: 'text-success-600 bg-success-50',
    negative: 'text-error-600 bg-error-50',
    neutral: 'text-gray-600 bg-gray-50'
  }
  
  const formatValue = (val) => {
    if (typeof val === 'number') {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(val)
    }
    return val
  }
  
  return (
    <motion.div
      className="card card-hover"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-2">{title}</p>
          <div className="flex items-end gap-2 mb-3">
            <motion.p
              className="text-3xl font-bold text-gray-900"
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, delay: delay + 0.2 }}
            >
              {formatValue(value)}
            </motion.p>
          </div>
          {change && (
            <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${changeColors[changeType]}`}>
              <ApperIcon 
                name={changeType === 'positive' ? 'TrendingUp' : changeType === 'negative' ? 'TrendingDown' : 'Minus'} 
                className="w-3 h-3 mr-1" 
              />
              {change}
            </div>
          )}
        </div>
        {icon && (
          <div className={`w-12 h-12 bg-gradient-to-br ${gradients[gradient]} rounded-lg flex items-center justify-center`}>
            <ApperIcon name={icon} className="w-6 h-6 text-white" />
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default StatCard