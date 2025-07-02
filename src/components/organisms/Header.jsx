import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const Header = ({ onMenuClick }) => {
  return (
    <motion.header
      className="bg-white shadow-sm border-b border-gray-200"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <button
              type="button"
              className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
              onClick={onMenuClick}
            >
              <ApperIcon name="Menu" className="w-6 h-6" />
            </button>
            <div className="hidden lg:block">
              <h1 className="text-2xl font-bold text-gray-900">Personal Finance</h1>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm text-gray-500">Welcome back!</p>
              <p className="text-sm font-medium text-gray-900">Track your finances</p>
            </div>
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-600 rounded-full flex items-center justify-center">
              <ApperIcon name="User" className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>
      </div>
    </motion.header>
  )
}

export default Header