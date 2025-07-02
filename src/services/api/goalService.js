import mockGoals from '@/services/mockData/goals.json'

class GoalService {
  constructor() {
    this.data = [...mockGoals]
  }
  
  async getAll() {
    await this.delay(250)
    return [...this.data]
  }
  
  async getById(id) {
    await this.delay(200)
    const goal = this.data.find(item => item.Id === parseInt(id))
    if (!goal) {
      throw new Error('Goal not found')
    }
    return { ...goal }
  }
  
  async create(goalData) {
    await this.delay(300)
    const newId = Math.max(...this.data.map(item => item.Id), 0) + 1
    const newGoal = {
      ...goalData,
      Id: newId
    }
    this.data.push(newGoal)
    return { ...newGoal }
  }
  
  async update(id, goalData) {
    await this.delay(250)
    const index = this.data.findIndex(item => item.Id === parseInt(id))
    if (index === -1) {
      throw new Error('Goal not found')
    }
    this.data[index] = { ...this.data[index], ...goalData }
    return { ...this.data[index] }
  }
  
  async delete(id) {
    await this.delay(200)
    const index = this.data.findIndex(item => item.Id === parseInt(id))
    if (index === -1) {
      throw new Error('Goal not found')
    }
    this.data.splice(index, 1)
    return true
  }
  
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

export const goalService = new GoalService()