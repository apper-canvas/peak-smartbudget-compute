import { forwardRef } from 'react'
import ApperIcon from '@/components/ApperIcon'

const Select = forwardRef(({ 
  label, 
  error, 
  options = [], 
  placeholder = 'Select an option',
  className = '',
  ...props 
}, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          ref={ref}
          className={`input-field appearance-none pr-10 ${error ? 'border-error-500 focus:ring-error-500' : ''} ${className}`}
          {...props}
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ApperIcon 
          name="ChevronDown" 
          className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" 
        />
      </div>
      {error && (
        <p className="mt-2 text-sm text-error-600">{error}</p>
      )}
    </div>
  )
})

Select.displayName = 'Select'

export default Select