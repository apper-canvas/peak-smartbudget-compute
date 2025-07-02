import { motion } from 'framer-motion'
import { format } from 'date-fns'
import ApperIcon from '@/components/ApperIcon'

const GoalCard = ({ goal, onEdit, onDelete, delay = 0 }) => {
  const { Id, name, targetAmount, currentAmount, targetDate, priority = 'Medium' } = goal
  const percentage = (currentAmount / targetAmount) * 100
  const remaining = targetAmount - currentAmount
  
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
}
  
  const getPriorityColor = (priority) => {
    const colors = {
      'High': 'bg-error-100 text-error-800 border-error-200',
      'Medium': 'bg-warning-100 text-warning-800 border-warning-200',
      'Low': 'bg-success-100 text-success-800 border-success-200'
    }
    return colors[priority] || colors['Medium']
  }
  
  return (
    <motion.div
      className="card card-hover"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
<div className="relative">
        {/* Priority Badge */}
        <div className="absolute -top-2 -right-2 z-10">
          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(priority)}`}>
            {priority}
          </span>
        </div>
        
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-lg flex items-center justify-center">
              <ApperIcon name="Target" className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{name}</h3>
              <p className="text-sm text-gray-500">
                Target: {format(new Date(targetDate), 'MMM dd, yyyy')}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <motion.button
              onClick={() => onEdit(goal)}
              className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ApperIcon name="Edit" className="w-4 h-4" />
            </motion.button>
            <motion.button
              onClick={() => onDelete(Id)}
              className="p-2 text-gray-400 hover:text-error-600 hover:bg-error-50 rounded-lg transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ApperIcon name="Trash2" className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="relative">
          <div className="w-full bg-gray-200 rounded-full h-3">
            <motion.div
              className="bg-gradient-to-r from-secondary-500 to-secondary-600 h-3 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(percentage, 100)}%` }}
              transition={{ duration: 1, delay: delay + 0.3 }}
            />
          </div>
          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
            <div className="bg-white px-2 py-1 rounded border shadow-sm">
              <span className="text-xs font-medium text-gray-700">
                {percentage.toFixed(0)}%
              </span>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-600">Current</p>
            <p className="font-semibold text-secondary-600">{formatCurrency(currentAmount)}</p>
          </div>
          <div className="text-right">
            <p className="text-gray-600">Target</p>
            <p className="font-semibold text-gray-900">{formatCurrency(targetAmount)}</p>
          </div>
        </div>
        
        <div className="pt-3 border-t border-gray-100">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Remaining</span>
            <span className="font-medium text-gray-900">{formatCurrency(remaining)}</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default GoalCard