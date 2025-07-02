import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import { getCategoryIcon, getCategoryColor } from '@/utils/categories'

const BudgetCard = ({ budget, onEdit, onDelete, delay = 0 }) => {
  const { Id, category, limit, spent } = budget
  const remaining = limit - spent
  const percentage = (spent / limit) * 100
  
  const getProgressColor = (percentage) => {
    if (percentage >= 100) return 'bg-error-500'
    if (percentage >= 80) return 'bg-warning-500'
    return 'bg-success-500'
  }
  
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }
  
  return (
    <motion.div
      className="card card-hover"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getCategoryColor(category)}`}>
            <ApperIcon name={getCategoryIcon(category)} className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 capitalize">{category}</h3>
            <p className="text-sm text-gray-500">Monthly Budget</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <motion.button
            onClick={() => onEdit(budget)}
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
      
      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Spent</span>
          <span className="font-medium">{formatCurrency(spent)}</span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2">
          <motion.div
            className={`h-2 rounded-full ${getProgressColor(percentage)}`}
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(percentage, 100)}%` }}
            transition={{ duration: 1, delay: delay + 0.3 }}
          />
        </div>
        
        <div className="flex justify-between items-center">
          <div className="text-sm">
            <span className="text-gray-600">Remaining: </span>
            <span className={`font-medium ${remaining >= 0 ? 'text-success-600' : 'text-error-600'}`}>
              {formatCurrency(remaining)}
            </span>
          </div>
          <div className="text-sm text-gray-600">
            {percentage.toFixed(0)}% used
          </div>
        </div>
        
        <div className="text-right">
          <p className="text-sm text-gray-500">
            Budget: {formatCurrency(limit)}
          </p>
        </div>
      </div>
    </motion.div>
  )
}

export default BudgetCard