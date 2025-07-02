import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const Sidebar = ({ onClose }) => {
  const navigation = [
    { name: 'Dashboard', href: '/', icon: 'LayoutDashboard' },
    { name: 'Transactions', href: '/transactions', icon: 'Receipt' },
    { name: 'Budgets', href: '/budgets', icon: 'PiggyBank' },
    { name: 'Goals', href: '/goals', icon: 'Target' },
    { name: 'Charts', href: '/charts', icon: 'BarChart3' },
  ]

  return (
    <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-4 shadow-lg">
      <div className="flex h-16 shrink-0 items-center">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-600 rounded-lg flex items-center justify-center">
            <ApperIcon name="Wallet" className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-bold gradient-text">SmartBudget</h1>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="ml-auto lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
          >
            <ApperIcon name="X" className="w-5 h-5" />
          </button>
        )}
      </div>
      
      <nav className="flex flex-1 flex-col">
        <ul role="list" className="flex flex-1 flex-col gap-y-2">
          {navigation.map((item, index) => (
            <li key={item.name}>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <NavLink
                  to={item.href}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `sidebar-item ${isActive ? 'active' : ''}`
                  }
                >
                  <ApperIcon name={item.icon} className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                </NavLink>
              </motion.div>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}

export default Sidebar