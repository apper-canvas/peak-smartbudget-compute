import { motion } from 'framer-motion'

const Loading = ({ type = 'default' }) => {
  if (type === 'dashboard') {
    return (
      <div className="space-y-6">
        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              className="card animate-pulse"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-1/2 mb-4"></div>
              <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-1/3"></div>
            </motion.div>
          ))}
        </div>
        
        {/* Charts Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card animate-pulse">
            <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-1/3 mb-6"></div>
            <div className="h-64 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg"></div>
          </div>
          <div className="card animate-pulse">
            <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-1/3 mb-6"></div>
            <div className="h-64 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    )
  }

  if (type === 'list') {
    return (
      <div className="space-y-4">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="card animate-pulse"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-1/4"></div>
              </div>
              <div className="text-right">
                <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-16 mb-2"></div>
                <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-12"></div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center p-8">
      <motion.div
        className="w-8 h-8 border-4 border-primary-200 border-t-primary-500 rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
    </div>
  )
}

export default Loading