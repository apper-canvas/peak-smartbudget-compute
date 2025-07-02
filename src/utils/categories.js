export const getExpenseCategories = () => [
  { value: 'housing', label: 'Housing' },
  { value: 'food', label: 'Food & Dining' },
  { value: 'transportation', label: 'Transportation' },
  { value: 'utilities', label: 'Utilities' },
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'entertainment', label: 'Entertainment' },
  { value: 'shopping', label: 'Shopping' },
  { value: 'education', label: 'Education' },
  { value: 'insurance', label: 'Insurance' },
  { value: 'debt', label: 'Debt Payment' },
  { value: 'savings', label: 'Savings' },
  { value: 'other', label: 'Other' }
]

export const getIncomeCategories = () => [
  { value: 'salary', label: 'Salary' },
  { value: 'freelance', label: 'Freelance' },
  { value: 'business', label: 'Business' },
  { value: 'investment', label: 'Investment' },
  { value: 'rental', label: 'Rental Income' },
  { value: 'bonus', label: 'Bonus' },
  { value: 'gift', label: 'Gift' },
  { value: 'other', label: 'Other' }
]

export const getCategoryIcon = (category) => {
  const iconMap = {
    // Expense categories
    housing: 'Home',
    food: 'UtensilsCrossed',
    transportation: 'Car',
    utilities: 'Zap',
    healthcare: 'Heart',
    entertainment: 'Gamepad2',
    shopping: 'ShoppingBag',
    education: 'BookOpen',
    insurance: 'Shield',
    debt: 'CreditCard',
    savings: 'PiggyBank',
    // Income categories
    salary: 'Briefcase',
    freelance: 'Laptop',
    business: 'Building',
    investment: 'TrendingUp',
    rental: 'Home',
    bonus: 'Star',
    gift: 'Gift',
    other: 'MoreHorizontal'
  }
  
  return iconMap[category] || 'Circle'
}

export const getCategoryColor = (category) => {
  const colorMap = {
    // Expense categories
    housing: 'bg-blue-500',
    food: 'bg-green-500',
    transportation: 'bg-purple-500',
    utilities: 'bg-yellow-500',
    healthcare: 'bg-red-500',
    entertainment: 'bg-pink-500',
    shopping: 'bg-indigo-500',
    education: 'bg-orange-500',
    insurance: 'bg-teal-500',
    debt: 'bg-gray-500',
    savings: 'bg-emerald-500',
    // Income categories
    salary: 'bg-blue-600',
    freelance: 'bg-purple-600',
    business: 'bg-green-600',
    investment: 'bg-teal-600',
    rental: 'bg-orange-600',
    bonus: 'bg-yellow-600',
    gift: 'bg-pink-600',
    other: 'bg-gray-600'
  }
  
  return colorMap[category] || 'bg-gray-500'
}