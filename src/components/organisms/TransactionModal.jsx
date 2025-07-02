import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { format } from 'date-fns'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import Select from '@/components/atoms/Select'
import { getExpenseCategories, getIncomeCategories } from '@/utils/categories'

const TransactionModal = ({ isOpen, onClose, onSave, transaction = null }) => {
  const [formData, setFormData] = useState({
    type: 'expense',
    amount: '',
    category: '',
    description: '',
    date: format(new Date(), 'yyyy-MM-dd')
  })
  
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  
  useEffect(() => {
    if (transaction) {
      setFormData({
        type: transaction.type,
        amount: transaction.amount.toString(),
        category: transaction.category,
        description: transaction.description || '',
        date: format(new Date(transaction.date), 'yyyy-MM-dd')
      })
    } else {
      setFormData({
        type: 'expense',
        amount: '',
        category: '',
        description: '',
        date: format(new Date(), 'yyyy-MM-dd')
      })
    }
    setErrors({})
  }, [transaction, isOpen])
  
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'type' && { category: '' }) // Reset category when type changes
    }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }
  
  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be greater than 0'
    }
    
    if (!formData.category) {
      newErrors.category = 'Category is required'
    }
    
    if (!formData.date) {
      newErrors.date = 'Date is required'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setLoading(true)
    
    try {
      const transactionData = {
        ...formData,
        amount: parseFloat(formData.amount),
        date: new Date(formData.date).toISOString()
      }
      
      if (transaction) {
        transactionData.Id = transaction.Id
      }
      
      await onSave(transactionData)
      onClose()
    } catch (error) {
      console.error('Error saving transaction:', error)
    } finally {
      setLoading(false)
    }
  }
  
  const categoryOptions = formData.type === 'expense' 
    ? getExpenseCategories() 
    : getIncomeCategories()
  
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
                  {transaction ? 'Edit Transaction' : 'Add Transaction'}
                </h3>
                <p className="text-sm text-gray-500">
                  {transaction ? 'Update your transaction details' : 'Enter your income or expense details'}
                </p>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Type
                    </label>
                    <div className="flex rounded-lg border border-gray-200 p-1">
                      <button
                        type="button"
                        onClick={() => handleChange({ target: { name: 'type', value: 'expense' } })}
                        className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors ${
                          formData.type === 'expense'
                            ? 'bg-error-500 text-white'
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                      >
                        Expense
                      </button>
                      <button
                        type="button"
                        onClick={() => handleChange({ target: { name: 'type', value: 'income' } })}
                        className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors ${
                          formData.type === 'income'
                            ? 'bg-success-500 text-white'
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                      >
                        Income
                      </button>
                    </div>
                  </div>
                  
                  <Input
                    label="Amount"
                    name="amount"
                    type="number"
                    step="0.01"
                    value={formData.amount}
                    onChange={handleChange}
                    error={errors.amount}
                    placeholder="0.00"
                  />
                </div>
                
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
                  label="Description (Optional)"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Add a note about this transaction"
                />
                
                <Input
                  label="Date"
                  name="date"
                  type="date"
                  value={formData.date}
                  onChange={handleChange}
                  error={errors.date}
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
                    {transaction ? 'Update' : 'Add'} Transaction
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

export default TransactionModal