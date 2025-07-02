import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { startOfMonth, endOfMonth, format } from 'date-fns'
import StatCard from '@/components/molecules/StatCard'
import TransactionItem from '@/components/molecules/TransactionItem'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import Button from '@/components/atoms/Button'
import TransactionModal from '@/components/organisms/TransactionModal'
import Chart from 'react-apexcharts'
import ApperIcon from '@/components/ApperIcon'
import { transactionService } from '@/services/api/transactionService'
import { budgetService } from '@/services/api/budgetService'
import { goalService } from '@/services/api/goalService'
import { toast } from 'react-toastify'

const Dashboard = () => {
  const [transactions, setTransactions] = useState([])
  const [budgets, setBudgets] = useState([])
  const [goals, setGoals] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showTransactionModal, setShowTransactionModal] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState(null)
  
  const loadData = async () => {
    try {
      setLoading(true)
      setError('')
      
      const [transactionsData, budgetsData, goalsData] = await Promise.all([
        transactionService.getAll(),
        budgetService.getAll(),
        goalService.getAll()
      ])
      
setTransactions(transactionsData)
      setBudgets(budgetsData)
      setGoals(goalsData)

      // Calculate spent amounts and check for budget alerts
      const budgetsWithSpent = budgetsData.map(budget => {
        const spent = transactionsData
          .filter(t => t.type === 'expense' && t.category === budget.category)
          .reduce((sum, t) => sum + t.amount, 0)
        return { ...budget, spent }
      })
      
      // Check for budget alerts
      await budgetService.checkBudgetAlerts(budgetsWithSpent)
    } catch (err) {
      setError('Failed to load dashboard data. Please try again.')
      console.error('Dashboard load error:', err)
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    loadData()
  }, [])
  
  const handleAddTransaction = () => {
    setEditingTransaction(null)
    setShowTransactionModal(true)
  }
  
  const handleEditTransaction = (transaction) => {
    setEditingTransaction(transaction)
    setShowTransactionModal(true)
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
      
      await loadData()
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
        await loadData()
      } catch (error) {
        toast.error('Failed to delete transaction')
      }
    }
  }
  
  // Calculate stats
  const currentMonth = new Date()
  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  
  const currentMonthTransactions = transactions.filter(transaction => {
    const date = new Date(transaction.date)
    return date >= monthStart && date <= monthEnd
  })
  
  const totalIncome = currentMonthTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)
  
  const totalExpenses = currentMonthTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)
  
  const totalBudget = budgets.reduce((sum, b) => sum + b.limit, 0)
  const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0)
  const remainingBudget = totalBudget - totalSpent
  
  const totalGoals = goals.reduce((sum, g) => sum + g.targetAmount, 0)
  const totalSaved = goals.reduce((sum, g) => sum + g.currentAmount, 0)
  
  const recentTransactions = transactions
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5)
  
  // Expense breakdown chart data
  const expenseCategories = currentMonthTransactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount
      return acc
    }, {})
  
  const pieChartData = {
    series: Object.values(expenseCategories),
    options: {
      chart: { type: 'pie' },
      labels: Object.keys(expenseCategories),
      colors: ['#2563eb', '#7c3aed', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#84cc16'],
      legend: { position: 'bottom' },
      dataLabels: {
        enabled: true,
        formatter: function (val) {
          return val.toFixed(1) + '%'
        }
      }
    }
}
  
  // Budget vs Actual Comparison Chart
  const getBudgetComparisonData = () => {
    // Calculate actual spending by category for current month
    const categorySpending = currentMonthTransactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount
        return acc
      }, {})
    
    // Combine budget and actual data
    const comparisonData = budgets.map(budget => ({
      category: budget.category,
      budget: budget.limit,
      actual: categorySpending[budget.category] || 0
    }))
    
    // Sort by budget amount descending
    comparisonData.sort((a, b) => b.budget - a.budget)
    
    return {
      series: [
        {
          name: 'Budget',
          data: comparisonData.map(d => d.budget),
          color: '#3b82f6'
        },
        {
          name: 'Actual',
          data: comparisonData.map(d => d.actual),
          color: '#ef4444'
        }
      ],
      options: {
        chart: {
          type: 'bar',
          height: 350,
          toolbar: { show: false }
        },
        xaxis: {
          categories: comparisonData.map(d => d.category.charAt(0).toUpperCase() + d.category.slice(1)),
          title: { text: 'Categories' }
        },
        yaxis: {
          title: { text: 'Amount ($)' },
          labels: {
            formatter: function (val) {
              return '$' + val.toLocaleString()
            }
          }
        },
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: '60%',
            borderRadius: 4,
            dataLabels: { position: 'top' }
          }
        },
        dataLabels: {
          enabled: true,
          formatter: function (val) {
            return '$' + val.toLocaleString()
          },
          offsetY: -20,
          style: {
            fontSize: '10px',
            colors: ['#304758']
          }
        },
        legend: {
          position: 'top',
          horizontalAlign: 'right'
        },
        tooltip: {
          y: {
            formatter: function (val) {
              return '$' + val.toLocaleString()
            }
          }
        },
        grid: {
          borderColor: '#f1f5f9',
          strokeDashArray: 5
        }
      }
    }
  }
  
  if (loading) {
    return <Loading type="dashboard" />
  }
  
  if (error) {
    return <Error message={error} onRetry={loadData} />
  }
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Overview of your financial health</p>
        </div>
        <Button onClick={handleAddTransaction} icon="Plus">
          Add Transaction
        </Button>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Monthly Income"
          value={totalIncome}
          icon="TrendingUp"
          gradient="success"
          delay={0}
        />
        <StatCard
          title="Monthly Expenses"
          value={totalExpenses}
          icon="TrendingDown"
          gradient="error"
          delay={0.1}
        />
        <StatCard
          title="Budget Remaining"
          value={remainingBudget}
          icon="PiggyBank"
          gradient="warning"
          delay={0.2}
        />
        <StatCard
          title="Savings Progress"
          value={totalSaved}
          change={totalGoals > 0 ? `${((totalSaved / totalGoals) * 100).toFixed(1)}% of goals` : null}
          changeType="positive"
          icon="Target"
          gradient="secondary"
          delay={0.3}
        />
      </div>
{/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Expense Breakdown */}
        <motion.div
          className="card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Expense Breakdown</h3>
            <div className="text-sm text-gray-500">
              {format(currentMonth, 'MMMM yyyy')}
            </div>
          </div>
          
          {Object.keys(expenseCategories).length > 0 ? (
            <Chart
              options={pieChartData.options}
              series={pieChartData.series}
              type="pie"
              height={300}
            />
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-500">
              <div className="text-center">
                <ApperIcon name="PieChart" className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>No expenses this month</p>
              </div>
            </div>
          )}
        </motion.div>
        
        {/* Budget vs Actual Comparison */}
        <motion.div
          className="card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Budget vs Actual</h3>
            <div className="text-sm text-gray-500">
              {format(currentMonth, 'MMMM yyyy')}
            </div>
          </div>
          
          {budgets.length > 0 ? (
            <Chart
              options={getBudgetComparisonData().options}
              series={getBudgetComparisonData().series}
              type="bar"
              height={300}
            />
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-500">
              <div className="text-center">
                <ApperIcon name="BarChart3" className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>No budgets to compare</p>
              </div>
            </div>
          )}
        </motion.div>
        
        {/* Budget Status */}
        <motion.div
          className="card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Budget Status</h3>
          
          {budgets.length > 0 ? (
            <div className="space-y-4">
              {budgets.slice(0, 4).map((budget, index) => {
                const percentage = (budget.spent / budget.limit) * 100
                const isOverBudget = percentage > 100
                
                return (
                  <div key={budget.Id} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium capitalize">{budget.category}</span>
                      <span className={isOverBudget ? 'text-error-600' : 'text-gray-600'}>
                        ${budget.spent.toLocaleString()} / ${budget.limit.toLocaleString()}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <motion.div
                        className={`h-2 rounded-full ${
                          isOverBudget ? 'bg-error-500' : percentage > 80 ? 'bg-warning-500' : 'bg-success-500'
                        }`}
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(percentage, 100)}%` }}
                        transition={{ duration: 1, delay: index * 0.1 + 0.5 }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="flex items-center justify-center h-48 text-gray-500">
              <div className="text-center">
                <ApperIcon name="PiggyBank" className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>No budgets set up yet</p>
              </div>
            </div>
          )}
        </motion.div>
      </div>
      
      {/* Recent Transactions */}
      <motion.div
        className="card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
          <Button variant="outline" size="small" onClick={() => window.location.href = '/transactions'}>
            View All
          </Button>
        </div>
        
        {recentTransactions.length > 0 ? (
          <div className="space-y-4">
            {recentTransactions.map((transaction, index) => (
              <TransactionItem
                key={transaction.Id}
                transaction={transaction}
                onEdit={handleEditTransaction}
                onDelete={handleDeleteTransaction}
                delay={index * 0.1}
              />
            ))}
          </div>
        ) : (
          <Empty
            title="No transactions yet"
            description="Start by adding your first income or expense transaction"
            actionLabel="Add Transaction"
            onAction={handleAddTransaction}
            icon="Receipt"
          />
        )}
      </motion.div>
      
      {/* Transaction Modal */}
      <TransactionModal
        isOpen={showTransactionModal}
        onClose={() => setShowTransactionModal(false)}
        onSave={handleSaveTransaction}
        transaction={editingTransaction}
      />
    </div>
  )
}

export default Dashboard