import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import Select from '@/components/atoms/Select'
import { getExpenseCategories } from '@/utils/categories'

const BudgetModal = ({ isOpen, onClose, onSave, budget = null }) => {
  const [formData, setFormData] = useState({
    category: '',
    limit: ''
  })
  
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  
  useEffect(() => {
    if (budget) {
      setFormData({
        category: budget.category,
        limit: budget.limit.toString()
      })
    } else {
      setFormData({
        category: '',
        limit: ''
      })
    }
    setErrors({})
  }, [budget, isOpen])
  
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }
  
  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.category) {
      newErrors.category = 'Category is required'
    }
    
    if (!formData.limit || parseFloat(formData.limit) <= 0) {
      newErrors.limit = 'Budget limit must be greater than 0'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setLoading(true)
    
    try {
      const budgetData = {
        ...formData,
        limit: parseFloat(formData.limit),
        period: 'monthly',
        spent: budget ? budget.spent : 0
      }
      
      if (budget) {
        budgetData.Id = budget.Id
      }
      
      await onSave(budgetData)
      onClose()
    } catch (error) {
      console.error('Error saving budget:', error)
    } finally {
      setLoading(false)
    }
  }
  
  const categoryOptions = getExpenseCategories()
  
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
                  {budget ? 'Edit Budget' : 'Create Budget'}
                </h3>
                <p className="text-sm text-gray-500">
                  {budget ? 'Update your budget limits' : 'Set monthly spending limits for categories'}
                </p>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <Select
                  label="Category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  options={categoryOptions}
                  error={errors.category}
                  placeholder="Select a category"
                />
                
                <Input
                  label="Monthly Budget Limit"
                  name="limit"
                  type="number"
                  step="0.01"
                  value={formData.limit}
                  onChange={handleChange}
                  error={errors.limit}
                  placeholder="Enter budget amount"
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
                    {budget ? 'Update' : 'Create'} Budget
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

export default BudgetModal