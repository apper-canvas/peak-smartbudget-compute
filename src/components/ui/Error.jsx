import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const Error = ({ message = "Something went wrong", onRetry, showRetry = true }) => {
  return (
    <motion.div
      className="flex flex-col items-center justify-center p-8 text-center"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="w-16 h-16 bg-gradient-to-br from-error-100 to-error-200 rounded-full flex items-center justify-center mb-4">
        <ApperIcon name="AlertCircle" className="w-8 h-8 text-error-500" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">Oops! Something went wrong</h3>
      <p className="text-gray-600 mb-6 max-w-md">{message}</p>
      {showRetry && onRetry && (
        <motion.button
          onClick={onRetry}
          className="btn-primary"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ApperIcon name="RefreshCw" className="w-4 h-4 mr-2" />
          Try Again
        </motion.button>
      )}
    </motion.div>
  )
}

export default Error