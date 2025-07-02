import { motion } from 'framer-motion'
import { format } from 'date-fns'
import ApperIcon from '@/components/ApperIcon'
import { getCategoryIcon, getCategoryColor } from '@/utils/categories'

const TransactionItem = ({ transaction, onEdit, onDelete, delay = 0 }) => {
  const { Id, type, amount, category, description, date } = transaction
  
  const formatAmount = (amount, type) => {
    const formatted = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(Math.abs(amount))
    
    return type === 'expense' ? `-${formatted}` : `+${formatted}`
  }
  
  return (
    <motion.div
      className="card card-hover"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div 
            className={`w-12 h-12 rounded-full flex items-center justify-center ${getCategoryColor(category)}`}
          >
            <ApperIcon name={getCategoryIcon(category)} className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{description || category}</h3>
            <p className="text-sm text-gray-500">{format(new Date(date), 'MMM dd, yyyy')}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <p 
              className={`font-bold text-lg ${
                type === 'income' ? 'text-success-600' : 'text-error-600'
              }`}
            >
              {formatAmount(amount, type)}
            </p>
            <p className="text-sm text-gray-500 capitalize">{category}</p>
          </div>
          
          <div className="flex items-center space-x-2">
            <motion.button
              onClick={() => onEdit(transaction)}
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
    </motion.div>
  )
}

export default TransactionItem