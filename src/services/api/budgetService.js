import mockBudgets from '@/services/mockData/budgets.json'

class BudgetService {
  constructor() {
    this.data = [...mockBudgets]
  }
  
  async getAll() {
    await this.delay(250)
    return [...this.data]
  }
  
  async getById(id) {
    await this.delay(200)
    const budget = this.data.find(item => item.Id === parseInt(id))
    if (!budget) {
      throw new Error('Budget not found')
    }
    return { ...budget }
  }
  
  async create(budgetData) {
    await this.delay(300)
    const newId = Math.max(...this.data.map(item => item.Id), 0) + 1
    const newBudget = {
      ...budgetData,
      Id: newId
    }
    this.data.push(newBudget)
    return { ...newBudget }
  }
  
  async update(id, budgetData) {
    await this.delay(250)
    const index = this.data.findIndex(item => item.Id === parseInt(id))
    if (index === -1) {
      throw new Error('Budget not found')
    }
    this.data[index] = { ...this.data[index], ...budgetData }
    return { ...this.data[index] }
  }
  
  async delete(id) {
    await this.delay(200)
    const index = this.data.findIndex(item => item.Id === parseInt(id))
    if (index === -1) {
      throw new Error('Budget not found')
    }
    this.data.splice(index, 1)
    return true
  }
  
delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  // Check budget alerts using notification service
  async checkBudgetAlerts(budgets) {
    const { notificationService } = await import('./notificationService')
    return notificationService.checkBudgetAlerts(budgets)
  }
}

export const budgetService = new BudgetService()