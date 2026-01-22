import { useState, useCallback, useEffect } from 'react';
import * as store from '@/lib/finance-store';

export function useFinance() {
  const [incomes, setIncomes] = useState(store.getIncomes());
  const [debts, setDebts] = useState(store.getDebts());
  const [goals, setGoals] = useState(store.getGoals());
  const [refreshKey, setRefreshKey] = useState(0);

  const refresh = useCallback(() => {
    setIncomes(store.getIncomes());
    setDebts(store.getDebts());
    setGoals(store.getGoals());
    setRefreshKey(k => k + 1);
  }, []);

  const addIncome = useCallback((income: Omit<store.Income, 'id'>) => {
    store.addIncome(income);
    refresh();
  }, [refresh]);

  const deleteIncome = useCallback((id: string) => {
    store.deleteIncome(id);
    refresh();
  }, [refresh]);

  const addDebt = useCallback((debt: Omit<store.Debt, 'id'>) => {
    store.addDebt(debt);
    refresh();
  }, [refresh]);

  const deleteDebt = useCallback((id: string) => {
    store.deleteDebt(id);
    refresh();
  }, [refresh]);

  const addGoal = useCallback((goal: Omit<store.Goal, 'id'>) => {
    store.addGoal(goal);
    refresh();
  }, [refresh]);

  const deleteGoal = useCallback((id: string) => {
    store.deleteGoal(id);
    refresh();
  }, [refresh]);

  const monthlyData = store.getMonthlyData();
  const totalData = store.getTotalData();
  const statistics = store.getStatistics();

  const getGoalProgress = useCallback((goal: store.Goal) => {
    return store.getGoalProgress(goal);
  }, [refreshKey]);

  const exportData = useCallback((type: 'incomes' | 'debts' | 'summary') => {
    store.exportToCSV(type);
  }, []);

  return {
    incomes,
    debts,
    goals,
    monthlyData,
    totalData,
    statistics,
    addIncome,
    deleteIncome,
    addDebt,
    deleteDebt,
    addGoal,
    deleteGoal,
    getGoalProgress,
    exportData,
    refresh,
  };
}
