import { forwardRef } from 'react'

const Input = forwardRef(({ 
  label, 
  error, 
  type = 'text',
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
      <input
        ref={ref}
        type={type}
        className={`input-field ${error ? 'border-error-500 focus:ring-error-500' : ''} ${className}`}
        {...props}
      />
      {error && (
        <p className="mt-2 text-sm text-error-600">{error}</p>
      )}
    </div>
  )
})

Input.displayName = 'Input'

export default Input