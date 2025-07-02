import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { getExpenseCategories, getIncomeCategories } from "@/utils/categories";
import ApperIcon from "@/components/ApperIcon";
import TransactionModal from "@/components/organisms/TransactionModal";
import Select from "@/components/atoms/Select";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import TransactionItem from "@/components/molecules/TransactionItem";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Loading from "@/components/ui/Loading";
import { transactionService } from "@/services/api/transactionService";

const Transactions = () => {
  const [transactions, setTransactions] = useState([])
  const [filteredTransactions, setFilteredTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState(null)
  
  // Filters
  const [filters, setFilters] = useState({
    type: '',
    category: '',
    search: ''
  })
  
  const loadTransactions = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await transactionService.getAll()
      setTransactions(data)
      setFilteredTransactions(data)
    } catch (err) {
      setError('Failed to load transactions. Please try again.')
      console.error('Transactions load error:', err)
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    loadTransactions()
  }, [])
  
  // Apply filters
  useEffect(() => {
    let filtered = [...transactions]
    
    if (filters.type) {
      filtered = filtered.filter(t => t.type === filters.type)
    }
    
    if (filters.category) {
      filtered = filtered.filter(t => t.category === filters.category)
    }
    
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      filtered = filtered.filter(t => 
        t.description?.toLowerCase().includes(searchLower) ||
        t.category.toLowerCase().includes(searchLower)
      )
    }
    
    // Sort by date (newest first)
    filtered.sort((a, b) => new Date(b.date) - new Date(a.date))
    
    setFilteredTransactions(filtered)
  }, [transactions, filters])
  
  const handleAddTransaction = () => {
    setEditingTransaction(null)
    setShowModal(true)
  }
  
  const handleEditTransaction = (transaction) => {
    setEditingTransaction(transaction)
    setShowModal(true)
  }
  
  const handleSaveTransaction = async (transactionData) => {
    try {
      if (editingTransaction) {
        await transactionService.update(editingTransaction.Id, transactionData)
        toast.success('Transaction updated successfully!')
      } else {
        await transactionService.create(transactionData)
        toast.success('Transaction added successfully!')
      }
      
      await loadTransactions()
    } catch (error) {
      toast.error('Failed to save transaction')
      throw error
    }
  }
  
  const handleDeleteTransaction = async (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        await transactionService.delete(id)
        toast.success('Transaction deleted successfully!')
        await loadTransactions()
      } catch (error) {
        toast.error('Failed to delete transaction')
      }
    }
  }
  
  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }))
  }
  
  const clearFilters = () => {
    setFilters({ type: '', category: '', search: '' })
  }
  
  const totalIncome = filteredTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)
  
  const totalExpenses = filteredTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)
  
  const allCategories = [
    ...getIncomeCategories(),
    ...getExpenseCategories()
  ].sort((a, b) => a.label.localeCompare(b.label))
  
  const hasActiveFilters = filters.type || filters.category || filters.search
  
  if (loading) {
    return <Loading type="list" />
  }
  
  if (error) {
    return <Error message={error} onRetry={loadTransactions} />
  }
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Transactions</h1>
          <p className="text-gray-600">Manage your income and expenses</p>
        </div>
        <Button onClick={handleAddTransaction} icon="Plus">
          Add Transaction
        </Button>
      </div>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          className="card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-success-500 to-success-600 rounded-lg flex items-center justify-center">
              <ApperIcon name="TrendingUp" className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Income</p>
              <p className="text-2xl font-bold text-success-600">
                ${totalIncome.toLocaleString()}
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
              <ApperIcon name="TrendingDown" className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Expenses</p>
              <p className="text-2xl font-bold text-error-600">
                ${totalExpenses.toLocaleString()}
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
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
              <ApperIcon name="Calculator" className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Net Balance</p>
              <p className={`text-2xl font-bold ${
                totalIncome - totalExpenses >= 0 ? 'text-success-600' : 'text-error-600'
              }`}>
                ${(totalIncome - totalExpenses).toLocaleString()}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Filters */}
      <motion.div
        className="card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Input
            placeholder="Search transactions..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
          />
          
          <Select
            value={filters.type}
            onChange={(e) => handleFilterChange('type', e.target.value)}
            options={[
              { value: 'income', label: 'Income' },
              { value: 'expense', label: 'Expense' }
            ]}
            placeholder="All Types"
          />
          
          <Select
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            options={allCategories}
            placeholder="All Categories"
          />
          
          <div className="flex gap-2">
            {hasActiveFilters && (
              <Button
                variant="outline"
                onClick={clearFilters}
                size="medium"
                className="flex-1"
              >
                Clear Filters
              </Button>
            )}
            <div className="text-sm text-gray-500 flex items-center">
              {filteredTransactions.length} result{filteredTransactions.length !== 1 ? 's' : ''}
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* Transactions List */}
      {filteredTransactions.length > 0 ? (
        <div className="space-y-4">
          {filteredTransactions.map((transaction, index) => (
            <TransactionItem
              key={transaction.Id}
              transaction={transaction}
              onEdit={handleEditTransaction}
              onDelete={handleDeleteTransaction}
              delay={index * 0.05}
            />
          ))}
        </div>
      ) : (
        <Empty
          title={hasActiveFilters ? "No matching transactions" : "No transactions yet"}
          description={hasActiveFilters ? "Try adjusting your filters to see more results" : "Start by adding your first income or expense transaction"}
          actionLabel={hasActiveFilters ? "Clear Filters" : "Add Transaction"}
          onAction={hasActiveFilters ? clearFilters : handleAddTransaction}
          icon={hasActiveFilters ? "Search" : "Receipt"}
        />
      )}
)}
      
      {/* Transaction Modal */}
      <TransactionModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSaveTransaction}
        transaction={editingTransaction}
      />
    </div>
  )

export default Transactions