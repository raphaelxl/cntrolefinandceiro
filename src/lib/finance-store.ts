export interface Income {
  id: string;
  category: string;
  subcategory: string;
  value: number;
  date: string;
}

export interface Debt {
  id: string;
  category: string;
  subcategory: string;
  value: number;
  interest: number;
  installments: number;
  dueDate: string;
  paymentMethod: string;
}

export interface Goal {
  id: string;
  category: string;
  subcategory: string;
  value: number;
}

export interface UserData {
  incomes: Income[];
  debts: Debt[];
  goals: Goal[];
}

const STORAGE_KEY = 'finance_data';

function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

function getStorageData(): UserData {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    const initial: UserData = { incomes: [], debts: [], goals: [] };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
    return initial;
  }
  return JSON.parse(data);
}

function saveStorageData(data: UserData): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function getIncomes(): Income[] {
  return getStorageData().incomes;
}

export function addIncome(income: Omit<Income, 'id'>): Income {
  const data = getStorageData();
  const newIncome = { ...income, id: generateId() };
  data.incomes.push(newIncome);
  saveStorageData(data);
  return newIncome;
}

export function deleteIncome(id: string): void {
  const data = getStorageData();
  data.incomes = data.incomes.filter(i => i.id !== id);
  saveStorageData(data);
}

export function getDebts(): Debt[] {
  return getStorageData().debts;
}

export function addDebt(debt: Omit<Debt, 'id'>): Debt {
  const data = getStorageData();
  const newDebt = { ...debt, id: generateId() };
  data.debts.push(newDebt);
  saveStorageData(data);
  return newDebt;
}

export function deleteDebt(id: string): void {
  const data = getStorageData();
  data.debts = data.debts.filter(d => d.id !== id);
  saveStorageData(data);
}

export function getGoals(): Goal[] {
  return getStorageData().goals;
}

export function addGoal(goal: Omit<Goal, 'id'>): Goal {
  const data = getStorageData();
  const newGoal = { ...goal, id: generateId() };
  data.goals.push(newGoal);
  saveStorageData(data);
  return newGoal;
}

export function deleteGoal(id: string): void {
  const data = getStorageData();
  data.goals = data.goals.filter(g => g.id !== id);
  saveStorageData(data);
}

export function getMonthlyData() {
  const data = getStorageData();
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const monthlyIncomes = data.incomes.filter(i => {
    const d = new Date(i.date);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });

  const monthlyDebts = data.debts.filter(d => {
    const dd = new Date(d.dueDate);
    return dd.getMonth() === currentMonth && dd.getFullYear() === currentYear;
  });

  const totalMonthlyIncomes = monthlyIncomes.reduce((sum, i) => sum + i.value, 0);
  const totalMonthlyDebts = monthlyDebts.reduce((sum, d) => sum + d.value, 0);
  const balance = totalMonthlyIncomes - totalMonthlyDebts;

  return {
    incomes: totalMonthlyIncomes,
    debts: totalMonthlyDebts,
    balance,
  };
}

export function getTotalData() {
  const data = getStorageData();
  const totalIncomes = data.incomes.reduce((sum, i) => sum + i.value, 0);
  const totalDebts = data.debts.reduce((sum, d) => sum + d.value, 0);
  return { totalIncomes, totalDebts };
}

export function getStatistics() {
  const data = getStorageData();
  const debts = data.debts;

  if (debts.length === 0) {
    return null;
  }

  const maxDebt = debts.reduce((prev, curr) => (prev.value > curr.value ? prev : curr));
  
  const categoryTotals: Record<string, number> = {};
  debts.forEach(d => {
    categoryTotals[d.category] = (categoryTotals[d.category] || 0) + d.value;
  });

  const maxCategory = Object.keys(categoryTotals).reduce((a, b) =>
    categoryTotals[a] > categoryTotals[b] ? a : b
  );

  const totalDebts = debts.reduce((sum, d) => sum + d.value, 0);
  
  const percentages = Object.keys(categoryTotals).map(cat => ({
    category: cat,
    percentage: (categoryTotals[cat] / totalDebts) * 100,
    value: categoryTotals[cat],
  }));

  return {
    maxDebt,
    maxCategory,
    percentages,
    totalDebts,
  };
}

export function getGoalProgress(goal: Goal) {
  const data = getStorageData();
  const debts = data.debts.filter(
    d => d.category === goal.category && d.subcategory === goal.subcategory
  );
  const incomes = data.incomes.filter(
    i => i.category === goal.category && i.subcategory === goal.subcategory
  );

  const totalSpent = debts.reduce((sum, d) => sum + d.value, 0);
  const totalEarned = incomes.reduce((sum, i) => sum + i.value, 0);
  
  let progress = ((totalEarned - totalSpent) / goal.value) * 100;
  if (progress > 100) progress = 100;
  if (progress < 0) progress = 0;

  return {
    progress,
    totalSpent,
    totalEarned,
    remaining: goal.value - (totalEarned - totalSpent),
  };
}

export function exportToCSV(type: 'incomes' | 'debts' | 'summary'): void {
  const data = getStorageData();
  let csvContent = 'data:text/csv;charset=utf-8,';

  if (type === 'incomes') {
    csvContent += 'Categoria,Subcategoria,Valor,Data\n';
    data.incomes.forEach(i => {
      csvContent += `${i.category},${i.subcategory},${i.value},${i.date}\n`;
    });
  } else if (type === 'debts') {
    csvContent += 'Categoria,Subcategoria,Valor,Juros,Parcelas,Vencimento,Forma de Pagamento\n';
    data.debts.forEach(d => {
      csvContent += `${d.category},${d.subcategory},${d.value},${d.interest || ''},${d.installments || ''},${d.dueDate || ''},${d.paymentMethod}\n`;
    });
  } else if (type === 'summary') {
    const totalIncomes = data.incomes.reduce((sum, i) => sum + i.value, 0);
    const totalDebts = data.debts.reduce((sum, d) => sum + d.value, 0);
    const balance = totalIncomes - totalDebts;
    csvContent += 'Entradas,Dívidas,Saldo\n';
    csvContent += `${totalIncomes},${totalDebts},${balance}\n`;
  }

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `${type}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
