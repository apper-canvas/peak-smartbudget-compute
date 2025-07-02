import { toast } from 'react-toastify'

class NotificationService {
  constructor() {
    // Alert thresholds as percentages
    this.alertThresholds = {
      warning: 75,    // 75% of budget used
      critical: 90,   // 90% of budget used
      overBudget: 100 // Over budget
    }
  }

  // Check budget alerts for all budgets
  async checkBudgetAlerts(budgets) {
    budgets.forEach(budget => {
      const spentPercentage = (budget.spent / budget.limit) * 100
      
      if (spentPercentage >= this.alertThresholds.overBudget) {
        this.sendOverBudgetAlert(budget, spentPercentage)
      } else if (spentPercentage >= this.alertThresholds.critical) {
        this.sendCriticalAlert(budget, spentPercentage)
      } else if (spentPercentage >= this.alertThresholds.warning) {
        this.sendWarningAlert(budget, spentPercentage)
      }
    })
  }

  // Send warning alert (75% threshold)
  sendWarningAlert(budget, percentage) {
    const remaining = budget.limit - budget.spent
    toast.warn(
      `Budget Alert: You've used ${percentage.toFixed(1)}% of your ${budget.category} budget. $${remaining.toLocaleString()} remaining.`,
      {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      }
    )
  }

  // Send critical alert (90% threshold)
  sendCriticalAlert(budget, percentage) {
    const remaining = budget.limit - budget.spent
    toast.error(
      `Critical Budget Alert: You've used ${percentage.toFixed(1)}% of your ${budget.category} budget! Only $${remaining.toLocaleString()} remaining.`,
      {
        position: "top-right",
        autoClose: 7000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      }
    )
  }

  // Send over budget alert (100% threshold)
  sendOverBudgetAlert(budget, percentage) {
    const overspent = budget.spent - budget.limit
    toast.error(
      `Budget Exceeded: You've exceeded your ${budget.category} budget by $${overspent.toLocaleString()} (${percentage.toFixed(1)}% used)!`,
      {
        position: "top-right",
        autoClose: 8000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      }
    )
  }

  // Get alert threshold configuration
  getAlertThresholds() {
    return { ...this.alertThresholds }
  }

  // Update alert thresholds (for future customization)
  updateAlertThresholds(newThresholds) {
    this.alertThresholds = { ...this.alertThresholds, ...newThresholds }
  }
}

export const notificationService = new NotificationService()