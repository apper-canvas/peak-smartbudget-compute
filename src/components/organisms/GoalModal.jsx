import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { format, addMonths } from 'date-fns'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'

const GoalModal = ({ isOpen, onClose, onSave, goal = null }) => {
  const [formData, setFormData] = useState({
    name: '',
    targetAmount: '',
    currentAmount: '',
    targetDate: format(addMonths(new Date(), 6), 'yyyy-MM-dd')
  })
  
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  
  useEffect(() => {
    if (goal) {
      setFormData({
        name: goal.name,
        targetAmount: goal.targetAmount.toString(),
        currentAmount: goal.currentAmount.toString(),
        targetDate: format(new Date(goal.targetDate), 'yyyy-MM-dd')
      })
    } else {
      setFormData({
        name: '',
        targetAmount: '',
        currentAmount: '0',
        targetDate: format(addMonths(new Date(), 6), 'yyyy-MM-dd')
      })
    }
    setErrors({})
  }, [goal, isOpen])
  
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }
  
  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.name.trim()) {
      newErrors.name = 'Goal name is required'
    }
    
    if (!formData.targetAmount || parseFloat(formData.targetAmount) <= 0) {
      newErrors.targetAmount = 'Target amount must be greater than 0'
    }
    
    if (parseFloat(formData.currentAmount) < 0) {
      newErrors.currentAmount = 'Current amount cannot be negative'
    }
    
    if (!formData.targetDate) {
      newErrors.targetDate = 'Target date is required'
    } else if (new Date(formData.targetDate) <= new Date()) {
      newErrors.targetDate = 'Target date must be in the future'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setLoading(true)
    
    try {
      const goalData = {
        ...formData,
        targetAmount: parseFloat(formData.targetAmount),
        currentAmount: parseFloat(formData.currentAmount) || 0,
        targetDate: new Date(formData.targetDate).toISOString()
      }
      
      if (goal) {
        goalData.Id = goal.Id
      }
      
      await onSave(goalData)
      onClose()
    } catch (error) {
      console.error('Error saving goal:', error)
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <motion.div
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
            />
            
            <motion.div
              className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
            >
              <div className="absolute right-4 top-4">
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <ApperIcon name="X" className="w-6 h-6" />
                </button>
              </div>
              
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  {goal ? 'Edit Goal' : 'Create Savings Goal'}
                </h3>
                <p className="text-sm text-gray-500">
                  {goal ? 'Update your savings goal' : 'Set a target amount and date for your savings goal'}
                </p>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <Input
                  label="Goal Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  error={errors.name}
                  placeholder="e.g., Emergency Fund, Vacation, New Car"
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Target Amount"
                    name="targetAmount"
                    type="number"
                    step="0.01"
                    value={formData.targetAmount}
                    onChange={handleChange}
                    error={errors.targetAmount}
                    placeholder="10000.00"
                  />
                  
                  <Input
                    label="Current Amount"
                    name="currentAmount"
                    type="number"
                    step="0.01"
                    value={formData.currentAmount}
                    onChange={handleChange}
                    error={errors.currentAmount}
                    placeholder="0.00"
                  />
                </div>
                
                <Input
                  label="Target Date"
                  name="targetDate"
                  type="date"
                  value={formData.targetDate}
                  onChange={handleChange}
                  error={errors.targetDate}
                />
                
                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    loading={loading}
                    className="flex-1"
                  >
                    {goal ? 'Update' : 'Create'} Goal
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default GoalModal