import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import BudgetCard from '@/components/molecules/BudgetCard'
import BudgetModal from '@/components/organisms/BudgetModal'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'
import { budgetService } from '@/services/api/budgetService'
import { transactionService } from '@/services/api/transactionService'
import { toast } from 'react-toastify'

const Budgets = () => {
  const [budgets, setBudgets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingBudget, setEditingBudget] = useState(null)
  
  const loadBudgets = async () => {
    try {
      setLoading(true)
      setError('')
      
      // Load budgets and transactions to calculate spent amounts
      const [budgetsData, transactionsData] = await Promise.all([
        budgetService.getAll(),
        transactionService.getAll()
      ])
      
      // Calculate spent amounts for each budget
      const updatedBudgets = budgetsData.map(budget => {
        const spent = transactionsData
          .filter(t => t.type === 'expense' && t.category === budget.category)
          .reduce((sum, t) => sum + t.amount, 0)
        
        return { ...budget, spent }
      })
      
      setBudgets(updatedBudgets)
    } catch (err) {
      setError('Failed to load budgets. Please try again.')
      console.error('Budgets load error:', err)
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    loadBudgets()
  }, [])
  
  const handleAddBudget = () => {
    setEditingBudget(null)
    setShowModal(true)
  }
  
  const handleEditBudget = (budget) => {
    setEditingBudget(budget)
    setShowModal(true)
  }
  
  const handleSaveBudget = async (budgetData) => {
    try {
      if (editingBudget) {
        await budgetService.update(editingBudget.Id, budgetData)
        toast.success('Budget updated successfully!')
      } else {
        // Check if budget already exists for this category
        const existingBudget = budgets.find(b => b.category === budgetData.category)
        if (existingBudget) {
          toast.error('Budget already exists for this category')
          throw new Error('Budget already exists')
        }
        
        await budgetService.create(budgetData)
        toast.success('Budget created successfully!')
      }
      
      await loadBudgets()
    } catch (error) {
      if (error.message !== 'Budget already exists') {
        toast.error('Failed to save budget')
      }
      throw error
    }
  }
  
  const handleDeleteBudget = async (id) => {
    if (window.confirm('Are you sure you want to delete this budget?')) {
      try {
        await budgetService.delete(id)
        toast.success('Budget deleted successfully!')
        await loadBudgets()
      } catch (error) {
        toast.error('Failed to delete budget')
      }
    }
  }
  
  // Calculate summary stats
  const totalBudget = budgets.reduce((sum, budget) => sum + budget.limit, 0)
  const totalSpent = budgets.reduce((sum, budget) => sum + budget.spent, 0)
  const totalRemaining = totalBudget - totalSpent
  const overBudgetCount = budgets.filter(budget => budget.spent > budget.limit).length
  
  if (loading) {
    return <Loading type="list" />
  }
  
  if (error) {
    return <Error message={error} onRetry={loadBudgets} />
  }
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Budgets</h1>
          <p className="text-gray-600">Set and track your spending limits</p>
        </div>
        <Button onClick={handleAddBudget} icon="Plus">
          Create Budget
        </Button>
      </div>
      
      {/* Summary Cards */}
      {budgets.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <motion.div
            className="card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                <ApperIcon name="DollarSign" className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Budget</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${totalBudget.toLocaleString()}
                </p>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            className="card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-error-500 to-error-600 rounded-lg flex items-center justify-center">
                <ApperIcon name="CreditCard" className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Spent</p>
                <p className="text-2xl font-bold text-error-600">
                  ${totalSpent.toLocaleString()}
                </p>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            className="card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 bg-gradient-to-br ${
                totalRemaining >= 0 ? 'from-success-500 to-success-600' : 'from-error-500 to-error-600'
              } rounded-lg flex items-center justify-center`}>
                <ApperIcon name="PiggyBank" className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Remaining</p>
                <p className={`text-2xl font-bold ${
                  totalRemaining >= 0 ? 'text-success-600' : 'text-error-600'
                }`}>
                  ${Math.abs(totalRemaining).toLocaleString()}
                </p>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            className="card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 bg-gradient-to-br ${
                overBudgetCount > 0 ? 'from-warning-500 to-warning-600' : 'from-success-500 to-success-600'
              } rounded-lg flex items-center justify-center`}>
                <ApperIcon name="AlertTriangle" className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Over Budget</p>
                <p className={`text-2xl font-bold ${
                  overBudgetCount > 0 ? 'text-warning-600' : 'text-success-600'
                }`}>
                  {overBudgetCount}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
      
      {/* Budgets Grid */}
      {budgets.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {budgets.map((budget, index) => (
            <BudgetCard
              key={budget.Id}
              budget={budget}
              onEdit={handleEditBudget}
              onDelete={handleDeleteBudget}
              delay={index * 0.1}
            />
          ))}
        </div>
      ) : (
        <Empty
          title="No budgets created yet"
          description="Create your first budget to start tracking your spending limits"
          actionLabel="Create Budget"
          onAction={handleAddBudget}
          icon="PiggyBank"
        />
      )}
      
      {/* Budget Modal */}
      <BudgetModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSaveBudget}
        budget={editingBudget}
      />
    </div>
  )
}

export default Budgets