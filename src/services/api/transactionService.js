import mockTransactions from '@/services/mockData/transactions.json'

class TransactionService {
  constructor() {
    this.data = [...mockTransactions]
  }
  
  async getAll() {
    await this.delay(300)
    return [...this.data]
  }
  
  async getById(id) {
    await this.delay(200)
    const transaction = this.data.find(item => item.Id === parseInt(id))
    if (!transaction) {
      throw new Error('Transaction not found')
    }
    return { ...transaction }
  }
  
  async create(transactionData) {
    await this.delay(400)
    const newId = Math.max(...this.data.map(item => item.Id), 0) + 1
    const newTransaction = {
      ...transactionData,
      Id: newId,
      createdAt: new Date().toISOString()
    }
    this.data.push(newTransaction)
    return { ...newTransaction }
  }
  
  async update(id, transactionData) {
    await this.delay(300)
    const index = this.data.findIndex(item => item.Id === parseInt(id))
    if (index === -1) {
      throw new Error('Transaction not found')
    }
    this.data[index] = { ...this.data[index], ...transactionData }
    return { ...this.data[index] }
  }
  
  async delete(id) {
    await this.delay(200)
    const index = this.data.findIndex(item => item.Id === parseInt(id))
    if (index === -1) {
      throw new Error('Transaction not found')
    }
    this.data.splice(index, 1)
    return true
  }
  
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

export const transactionService = new TransactionService()