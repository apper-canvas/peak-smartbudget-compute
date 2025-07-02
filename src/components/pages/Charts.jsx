import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { eachMonthOfInterval, endOfMonth, format, startOfMonth, subMonths } from "date-fns";
import Chart from "react-apexcharts";
import { getCategoryColor } from "@/utils/categories";
import ApperIcon from "@/components/ApperIcon";
import Select from "@/components/atoms/Select";
import Error from "@/components/ui/Error";
import Loading from "@/components/ui/Loading";
import { transactionService } from "@/services/api/transactionService";
import { budgetService } from "@/services/api/budgetService";

const Charts = () => {
  const [transactions, setTransactions] = useState([])
  const [budgets, setBudgets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [timeRange, setTimeRange] = useState('6')
  
const loadData = async () => {
    try {
      setLoading(true)
      setError('')
      const [transactionsData, budgetsData] = await Promise.all([
        transactionService.getAll(),
        budgetService.getAll()
      ])
      setTransactions(transactionsData)
      setBudgets(budgetsData)
    } catch (err) {
      setError('Failed to load chart data. Please try again.')
      console.error('Charts load error:', err)
    } finally {
      setLoading(false)
    }
  }
  
useEffect(() => {
    loadData()
  }, [])
  
  // Filter transactions by time range
  const getFilteredTransactions = () => {
    const months = parseInt(timeRange)
    const endDate = endOfMonth(new Date())
    const startDate = startOfMonth(subMonths(endDate, months - 1))
    
    return transactions.filter(transaction => {
      const date = new Date(transaction.date)
      return date >= startDate && date <= endDate
    })
  }
  
  const filteredTransactions = getFilteredTransactions()
  
  // Expense Breakdown Pie Chart
  const getExpenseBreakdownData = () => {
    const expenseCategories = filteredTransactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount
        return acc
      }, {})
    
    const categories = Object.keys(expenseCategories)
    const amounts = Object.values(expenseCategories)
    
    return {
      series: amounts,
      options: {
        chart: {
          type: 'pie',
          height: 400
        },
        labels: categories,
        colors: ['#2563eb', '#7c3aed', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#84cc16'],
        legend: {
          position: 'bottom',
          fontSize: '14px'
        },
        dataLabels: {
          enabled: true,
          formatter: function (val, opts) {
            return val.toFixed(1) + '%'
          },
          style: {
            fontSize: '12px',
            fontWeight: 'bold'
          }
        },
        plotOptions: {
          pie: {
            donut: {
              size: '0%'
            }
          }
        },
        tooltip: {
          y: {
            formatter: function (val) {
              return '$' + val.toLocaleString()
            }
          }
        }
      }
    }
  }
  
  // Monthly Spending Trend Line Chart
  const getMonthlyTrendData = () => {
    const months = parseInt(timeRange)
    const endDate = endOfMonth(new Date())
    const startDate = startOfMonth(subMonths(endDate, months - 1))
    
    const monthsArray = eachMonthOfInterval({ start: startDate, end: endDate })
    
    const monthlyData = monthsArray.map(month => {
      const monthStart = startOfMonth(month)
      const monthEnd = endOfMonth(month)
      
      const monthTransactions = transactions.filter(t => {
        const date = new Date(t.date)
        return date >= monthStart && date <= monthEnd
      })
      
      const income = monthTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0)
      
      const expenses = monthTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0)
      
      return {
        month: format(month, 'MMM yyyy'),
        income,
        expenses,
        net: income - expenses
      }
    })
    
    return {
      series: [
        {
          name: 'Income',
          data: monthlyData.map(d => d.income),
          color: '#10b981'
        },
        {
          name: 'Expenses',
          data: monthlyData.map(d => d.expenses),
          color: '#ef4444'
        },
        {
          name: 'Net',
          data: monthlyData.map(d => d.net),
          color: '#2563eb'
        }
      ],
      options: {
        chart: {
          type: 'line',
          height: 400,
          toolbar: {
            show: true
          }
        },
        xaxis: {
          categories: monthlyData.map(d => d.month),
          title: {
            text: 'Month'
          }
        },
        yaxis: {
          title: {
            text: 'Amount ($)'
          },
          labels: {
            formatter: function (val) {
              return '$' + val.toLocaleString()
            }
          }
        },
        stroke: {
          curve: 'smooth',
          width: 3
        },
        markers: {
          size: 6
        },
        legend: {
          position: 'top'
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
  
  // Category Spending Bar Chart
  const getCategorySpendingData = () => {
    const categoryData = filteredTransactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount
        return acc
      }, {})
    
    const sortedCategories = Object.entries(categoryData)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10) // Top 10 categories
    
    return {
      series: [{
        name: 'Amount',
        data: sortedCategories.map(([, amount]) => amount)
      }],
      options: {
        chart: {
          type: 'bar',
          height: 400
        },
        xaxis: {
          categories: sortedCategories.map(([category]) => category),
          title: {
            text: 'Categories'
          }
        },
        yaxis: {
          title: {
            text: 'Amount ($)'
          },
          labels: {
            formatter: function (val) {
              return '$' + val.toLocaleString()
            }
          }
        },
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: '55%',
            borderRadius: 4
          }
        },
        colors: ['#2563eb'],
        dataLabels: {
          enabled: false
        },
        tooltip: {
          y: {
            formatter: function (val) {
              return '$' + val.toLocaleString()
            }
          }
        }
}
    }
  }
  // Budget vs Actual Comparison Chart
  const getBudgetComparisonData = () => {
    const months = parseInt(timeRange)
    const endDate = endOfMonth(new Date())
    const startDate = startOfMonth(subMonths(endDate, months - 1))
    
    // Calculate actual spending by category for the time period
    const categorySpending = filteredTransactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount
        return acc
      }, {})
    
    // Get monthly budget amounts for the time period
    const monthlyBudgetTotal = budgets.reduce((acc, budget) => {
      if (budget.period === 'monthly') {
        acc[budget.category] = budget.limit * months
      } else if (budget.period === 'yearly') {
        acc[budget.category] = (budget.limit / 12) * months
      }
      return acc
    }, {})
    
    // Combine budget and actual data for categories that have budgets
    const comparisonData = budgets.map(budget => {
      const totalBudget = budget.period === 'monthly' 
        ? budget.limit * months 
        : (budget.limit / 12) * months
        
      return {
        category: budget.category,
        budget: totalBudget,
        actual: categorySpending[budget.category] || 0
      }
    })
    
    // Sort by budget amount descending
    comparisonData.sort((a, b) => b.budget - a.budget)
    
    const periodLabel = months === 12 ? 'Year' : `${months} Months`
    
    return {
      series: [
        {
          name: `Budget (${periodLabel})`,
          data: comparisonData.map(d => d.budget),
          color: '#3b82f6'
        },
        {
          name: `Actual (${periodLabel})`,
          data: comparisonData.map(d => d.actual),
          color: '#ef4444'
        }
      ],
      options: {
        chart: {
          type: 'bar',
          height: 400,
          toolbar: { show: true }
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
            columnWidth: '65%',
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
  
const expenseData = getExpenseBreakdownData()
  const trendData = getMonthlyTrendData()
  const categoryData = getCategorySpendingData()
  const budgetComparisonData = getBudgetComparisonData()
  
  const timeRangeOptions = [
    { value: '3', label: 'Last 3 Months' },
    { value: '6', label: 'Last 6 Months' },
    { value: '12', label: 'Last 12 Months' }
  ]
  
  if (loading) {
    return <Loading />
  }
if (error) {
    return <Error message={error} onRetry={loadData} />
  }
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Financial Charts</h1>
          <p className="text-gray-600">Visualize your spending patterns and trends</p>
        </div>
        
        <div className="w-48">
          <Select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            options={timeRangeOptions}
          />
        </div>
      </div>
      
      {filteredTransactions.length === 0 ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <ApperIcon name="BarChart3" className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No data available</h3>
            <p className="text-gray-600">Add some transactions to see your financial charts</p>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Monthly Trend Chart */}
          <motion.div
            className="card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Monthly Spending Trend</h3>
              <ApperIcon name="TrendingUp" className="w-5 h-5 text-gray-400" />
            </div>
            <Chart
              options={trendData.options}
              series={trendData.series}
              type="line"
              height={400}
            />
          </motion.div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Expense Breakdown */}
            <motion.div
              className="card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Expense Breakdown</h3>
                <ApperIcon name="PieChart" className="w-5 h-5 text-gray-400" />
              </div>
              {expenseData.series.length > 0 ? (
                <Chart
                  options={expenseData.options}
                  series={expenseData.series}
                  type="pie"
                  height={400}
                />
              ) : (
                <div className="flex items-center justify-center h-64 text-gray-500">
                  <div className="text-center">
                    <ApperIcon name="PieChart" className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>No expenses in selected period</p>
                  </div>
                </div>
              )}
            </motion.div>
            
            {/* Category Spending */}
            <motion.div
              className="card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Top Categories</h3>
                <ApperIcon name="BarChart3" className="w-5 h-5 text-gray-400" />
              </div>
              {categoryData.series[0].data.length > 0 ? (
                <Chart
                  options={categoryData.options}
                  series={categoryData.series}
                  type="bar"
                  height={400}
                />
              ) : (
                <div className="flex items-center justify-center h-64 text-gray-500">
                  <div className="text-center">
                    <ApperIcon name="BarChart3" className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>No category data available</p>
                  </div>
                </div>
              )}
            </motion.div>
</div>
          
          {/* Budget vs Actual Comparison */}
          <motion.div
            className="card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Budget vs Actual Comparison</h3>
              <ApperIcon name="BarChart2" className="w-5 h-5 text-gray-400" />
            </div>
            {budgets.length > 0 ? (
              <Chart
                options={budgetComparisonData.options}
                series={budgetComparisonData.series}
                type="bar"
                height={400}
              />
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-500">
                <div className="text-center">
                  <ApperIcon name="BarChart2" className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>No budget data available for comparison</p>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default Charts