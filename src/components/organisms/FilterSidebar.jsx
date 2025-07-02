import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import DatePicker from 'react-datepicker'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import Select from '@/components/atoms/Select'
import ApperIcon from '@/components/ApperIcon'
import { getExpenseCategories, getIncomeCategories } from '@/utils/categories'
import 'react-datepicker/dist/react-datepicker.css'

const FilterSidebar = ({ 
  isOpen, 
  onClose, 
  filters, 
  onFiltersChange, 
  onClearFilters,
  transactions 
}) => {
  const [localFilters, setLocalFilters] = useState(filters)
  const [expandedSections, setExpandedSections] = useState({
    dateRange: true,
    amountRange: true,
    categories: false,
    advanced: false
  })

  // Update local filters when parent filters change
  useEffect(() => {
    setLocalFilters(filters)
  }, [filters])

  const handleLocalFilterChange = (field, value) => {
    const newFilters = { ...localFilters, [field]: value }
    setLocalFilters(newFilters)
    onFiltersChange(newFilters)
  }

  const handleDateRangeChange = (field, value) => {
    const newDateRange = { ...localFilters.dateRange, [field]: value }
    handleLocalFilterChange('dateRange', newDateRange)
  }

  const handleAmountRangeChange = (field, value) => {
    const newAmountRange = { ...localFilters.amountRange, [field]: value }
    handleLocalFilterChange('amountRange', newAmountRange)
  }

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  const getAmountStats = () => {
    if (transactions.length === 0) return { min: 0, max: 1000 }
    
    const amounts = transactions.map(t => t.amount)
    return {
      min: Math.min(...amounts),
      max: Math.max(...amounts)
    }
  }

  const amountStats = getAmountStats()
  const allCategories = [
    ...getIncomeCategories(),
    ...getExpenseCategories()
  ].sort((a, b) => a.label.localeCompare(b.label))

  const incomeCategories = getIncomeCategories()
  const expenseCategories = getExpenseCategories()

  const hasActiveFilters = localFilters.type || localFilters.category || localFilters.search || 
    localFilters.dateRange.start || localFilters.dateRange.end || 
    localFilters.amountRange.min || localFilters.amountRange.max

  const sidebarVariants = {
    closed: { x: '100%' },
    open: { x: 0 }
  }

  const overlayVariants = {
    closed: { opacity: 0 },
    open: { opacity: 1 }
  }

  const SectionHeader = ({ title, icon, isExpanded, onToggle }) => (
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
    >
      <div className="flex items-center space-x-3">
        <ApperIcon name={icon} size={18} className="text-gray-600" />
        <span className="font-medium text-gray-900">{title}</span>
      </div>
      <ApperIcon 
        name={isExpanded ? "ChevronUp" : "ChevronDown"} 
        size={16} 
        className="text-gray-400"
      />
    </button>
  )

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            variants={overlayVariants}
            initial="closed"
            animate="open"
            exit="closed"
            onClick={onClose}
          />
          
          {/* Sidebar */}
          <motion.div
            className="fixed right-0 top-0 h-full w-full sm:w-96 bg-white shadow-2xl z-50 flex flex-col"
            variants={sidebarVariants}
            initial="closed"
            animate="open"
            exit="closed"
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <ApperIcon name="SlidersHorizontal" size={20} className="text-primary-600" />
                <h2 className="text-xl font-semibold text-gray-900">Advanced Filters</h2>
              </div>
              <Button
                variant="ghost"
                size="small"
                onClick={onClose}
                icon="X"
              />
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Date Range */}
              <div className="space-y-3">
                <SectionHeader
                  title="Date Range"
                  icon="Calendar"
                  isExpanded={expandedSections.dateRange}
                  onToggle={() => toggleSection('dateRange')}
                />
                
                <AnimatePresence>
                  {expandedSections.dateRange && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="pl-6 space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Start Date
                          </label>
                          <DatePicker
                            selected={localFilters.dateRange.start}
                            onChange={(date) => handleDateRangeChange('start', date)}
                            selectsStart
                            startDate={localFilters.dateRange.start}
                            endDate={localFilters.dateRange.end}
                            placeholderText="Select start date"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            dateFormat="MMM d, yyyy"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            End Date
                          </label>
                          <DatePicker
                            selected={localFilters.dateRange.end}
                            onChange={(date) => handleDateRangeChange('end', date)}
                            selectsEnd
                            startDate={localFilters.dateRange.start}
                            endDate={localFilters.dateRange.end}
                            minDate={localFilters.dateRange.start}
                            placeholderText="Select end date"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            dateFormat="MMM d, yyyy"
                          />
                        </div>
                        
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="small"
                            onClick={() => {
                              const today = new Date()
                              const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)
                              handleDateRangeChange('start', thirtyDaysAgo)
                              handleDateRangeChange('end', today)
                            }}
                          >
                            Last 30 Days
                          </Button>
                          <Button
                            variant="outline"
                            size="small"
                            onClick={() => {
                              const today = new Date()
                              const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
                              handleDateRangeChange('start', firstDayOfMonth)
                              handleDateRangeChange('end', today)
                            }}
                          >
                            This Month
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Amount Range */}
              <div className="space-y-3">
                <SectionHeader
                  title="Amount Range"
                  icon="DollarSign"
                  isExpanded={expandedSections.amountRange}
                  onToggle={() => toggleSection('amountRange')}
                />
                
                <AnimatePresence>
                  {expandedSections.amountRange && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="pl-6 space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Min Amount
                            </label>
                            <Input
                              type="number"
                              placeholder="0"
                              value={localFilters.amountRange.min}
                              onChange={(e) => handleAmountRangeChange('min', e.target.value)}
                              min="0"
                              step="0.01"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Max Amount
                            </label>
                            <Input
                              type="number"
                              placeholder="∞"
                              value={localFilters.amountRange.max}
                              onChange={(e) => handleAmountRangeChange('max', e.target.value)}
                              min="0"
                              step="0.01"
                            />
                          </div>
                        </div>
                        
                        <div className="text-xs text-gray-500">
                          Range: ${amountStats.min.toFixed(2)} - ${amountStats.max.toFixed(2)}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Categories */}
              <div className="space-y-3">
                <SectionHeader
                  title="Categories"
                  icon="Tag"
                  isExpanded={expandedSections.categories}
                  onToggle={() => toggleSection('categories')}
                />
                
                <AnimatePresence>
                  {expandedSections.categories && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="pl-6 space-y-4">
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Income Categories</h4>
                          <div className="space-y-2">
                            {incomeCategories.map(category => (
                              <label key={category.value} className="flex items-center space-x-3">
                                <input
                                  type="radio"
                                  name="category"
                                  value={category.value}
                                  checked={localFilters.category === category.value}
                                  onChange={(e) => handleLocalFilterChange('category', e.target.value)}
                                  className="text-primary-600 focus:ring-primary-500"
                                />
                                <span className="text-sm text-gray-700">{category.label}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Expense Categories</h4>
                          <div className="space-y-2">
                            {expenseCategories.map(category => (
                              <label key={category.value} className="flex items-center space-x-3">
                                <input
                                  type="radio"
                                  name="category"
                                  value={category.value}
                                  checked={localFilters.category === category.value}
                                  onChange={(e) => handleLocalFilterChange('category', e.target.value)}
                                  className="text-primary-600 focus:ring-primary-500"
                                />
                                <span className="text-sm text-gray-700">{category.label}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                        
                        <Button
                          variant="outline"
                          size="small"
                          onClick={() => handleLocalFilterChange('category', '')}
                          className="w-full"
                        >
                          Clear Category Selection
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 p-6">
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={onClearFilters}
                  className="flex-1"
                  disabled={!hasActiveFilters}
                >
                  Clear All
                </Button>
                <Button
                  onClick={onClose}
                  className="flex-1"
                >
                  Apply Filters
                </Button>
              </div>
              
              {hasActiveFilters && (
                <div className="mt-3 text-center text-sm text-gray-600">
                  <ApperIcon name="Filter" size={14} className="inline mr-1" />
                  Filters applied
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default FilterSidebar