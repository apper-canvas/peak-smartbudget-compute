import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'medium',
  icon,
  iconPosition = 'left',
  loading = false,
  disabled = false,
  onClick,
  className = '',
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium transition-all duration-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'
  
  const variants = {
    primary: 'bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:from-primary-600 hover:to-primary-700 focus:ring-primary-500 hover:scale-105 active:scale-95',
    secondary: 'bg-gradient-to-r from-secondary-500 to-secondary-600 text-white hover:from-secondary-600 hover:to-secondary-700 focus:ring-secondary-500 hover:scale-105 active:scale-95',
    success: 'bg-gradient-to-r from-success-500 to-success-600 text-white hover:from-success-600 hover:to-success-700 focus:ring-success-500 hover:scale-105 active:scale-95',
    outline: 'border-2 border-primary-500 text-primary-600 bg-white hover:bg-primary-50 focus:ring-primary-500 hover:scale-105 active:scale-95',
    ghost: 'text-gray-600 bg-transparent hover:bg-gray-100 focus:ring-gray-500'
  }
  
  const sizes = {
    small: 'px-3 py-2 text-sm',
    medium: 'px-6 py-3 text-base',
    large: 'px-8 py-4 text-lg'
  }
  
  const IconComponent = icon ? <ApperIcon name={icon} className="w-4 h-4" /> : null
  
  return (
    <motion.button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      onClick={onClick}
      disabled={disabled || loading}
      whileHover={!disabled ? { scale: variant === 'ghost' ? 1 : 1.05 } : {}}
      whileTap={!disabled ? { scale: variant === 'ghost' ? 1 : 0.95 } : {}}
      {...props}
    >
      {loading ? (
        <ApperIcon name="Loader2" className="w-4 h-4 animate-spin mr-2" />
      ) : (
        IconComponent && iconPosition === 'left' && <span className="mr-2">{IconComponent}</span>
      )}
      {children}
      {!loading && IconComponent && iconPosition === 'right' && <span className="ml-2">{IconComponent}</span>}
    </motion.button>
  )
}

export default Button