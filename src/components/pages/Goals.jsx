import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import GoalCard from "@/components/molecules/GoalCard";
import GoalModal from "@/components/organisms/GoalModal";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { goalService } from "@/services/api/goalService";
import { toast } from "react-toastify";

const Goals = () => {
  const [goals, setGoals] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingGoal, setEditingGoal] = useState(null)
  
  const loadGoals = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await goalService.getAll()
      setGoals(data)
    } catch (err) {
      setError('Failed to load goals. Please try again.')
      console.error('Goals load error:', err)
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    loadGoals()
  }, [])
  
  const handleAddGoal = () => {
    setEditingGoal(null)
    setShowModal(true)
  }
  
  const handleEditGoal = (goal) => {
    setEditingGoal(goal)
    setShowModal(true)
  }
  
  const handleSaveGoal = async (goalData) => {
    try {
      if (editingGoal) {
        await goalService.update(editingGoal.Id, goalData)
        toast.success('Goal updated successfully!')
      } else {
        await goalService.create(goalData)
        toast.success('Goal created successfully!')
      }
      
      await loadGoals()
    } catch (error) {
      toast.error('Failed to save goal')
      throw error
    }
  }
  
  const handleDeleteGoal = async (id) => {
    if (window.confirm('Are you sure you want to delete this goal?')) {
      try {
        await goalService.delete(id)
        toast.success('Goal deleted successfully!')
        await loadGoals()
      } catch (error) {
        toast.error('Failed to delete goal')
      }
    }
  }
  
  // Calculate summary stats
  const totalTargetAmount = goals.reduce((sum, goal) => sum + goal.targetAmount, 0)
  const totalCurrentAmount = goals.reduce((sum, goal) => sum + goal.currentAmount, 0)
  const totalRemaining = totalTargetAmount - totalCurrentAmount
  const completedGoals = goals.filter(goal => goal.currentAmount >= goal.targetAmount).length
  const averageProgress = goals.length > 0 
    ? (totalCurrentAmount / totalTargetAmount) * 100 
    : 0
  
  if (loading) {
    return <Loading type="list" />
  }
  
  if (error) {
    return <Error message={error} onRetry={loadGoals} />
  }
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Savings Goals</h1>
          <p className="text-gray-600">Track your progress towards financial goals</p>
        </div>
        <Button onClick={handleAddGoal} icon="Plus">
          Create Goal
        </Button>
      </div>
      
      {/* Summary Cards */}
      {goals.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <motion.div
            className="card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-lg flex items-center justify-center">
                <ApperIcon name="Target" className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Target Amount</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${totalTargetAmount.toLocaleString()}
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
              <div className="w-10 h-10 bg-gradient-to-br from-success-500 to-success-600 rounded-lg flex items-center justify-center">
                <ApperIcon name="DollarSign" className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Current Amount</p>
                <p className="text-2xl font-bold text-success-600">
                  ${totalCurrentAmount.toLocaleString()}
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
              <div className="w-10 h-10 bg-gradient-to-br from-warning-500 to-warning-600 rounded-lg flex items-center justify-center">
                <ApperIcon name="Clock" className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Remaining</p>
                <p className="text-2xl font-bold text-warning-600">
                  ${totalRemaining.toLocaleString()}
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
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                <ApperIcon name="TrendingUp" className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Avg Progress</p>
                <p className="text-2xl font-bold text-primary-600">
                  {averageProgress.toFixed(1)}%
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
      
      {/* Goals Grid */}
      {goals.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {goals.map((goal, index) => (
            <GoalCard
              key={goal.Id}
              goal={goal}
              onEdit={handleEditGoal}
              onDelete={handleDeleteGoal}
              delay={index * 0.1}
            />
          ))}
        </div>
      ) : (
        <Empty
          title="No savings goals yet"
          description="Create your first savings goal to start tracking your financial progress"
          actionLabel="Create Goal"
          onAction={handleAddGoal}
          icon="Target"
        />
      )}
      
      {/* Achievements Section */}
      {completedGoals > 0 && (
        <motion.div
          className="card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center">
              <ApperIcon name="Trophy" className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Congratulations! 🎉</h3>
              <p className="text-gray-600">
                You've completed {completedGoals} goal{completedGoals !== 1 ? 's' : ''}! Keep up the great work.
              </p>
            </div>
          </div>
        </motion.div>
      )}
      
      {/* Goal Modal */}
      <GoalModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSaveGoal}
        goal={editingGoal}
      />
    </div>
  )
}

export default Goals