import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const Empty = ({ 
  title = "No data found",
  description = "Get started by adding your first item",
  actionLabel = "Add Item",
  onAction,
  icon = "PlusCircle"
}) => {
  return (
    <motion.div
      className="flex flex-col items-center justify-center p-12 text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-6">
        <ApperIcon name={icon} className="w-10 h-10 text-gray-400" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-8 max-w-md">{description}</p>
      {onAction && (
        <motion.button
          onClick={onAction}
          className="btn-primary"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
          {actionLabel}
        </motion.button>
      )}
    </motion.div>
  )
}

export default Empty