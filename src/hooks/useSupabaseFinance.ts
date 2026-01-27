import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Income {
  id: string;
  user_id: string;
  category: string;
  subcategory: string;
  value: number;
  date: string;
}

export interface Debt {
  id: string;
  user_id: string;
  category: string;
  subcategory: string;
  value: number;
  interest: number;
  installments: number;
  due_date: string | null;
  payment_method: string;
}

export interface Goal {
  id: string;
  user_id: string;
  name: string;
  category: string;
  subcategory: string;
  value: number;
  accumulated_value: number;
  start_date: string;
  end_date: string | null;
}

export interface GoalContribution {
  id: string;
  user_id: string;
  goal_id: string;
  income_id: string | null;
  value: number;
  description: string | null;
  created_at: string;
}

export function useSupabaseFinance(userId: string | undefined) {
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [debts, setDebts] = useState<Debt[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [contributions, setContributions] = useState<GoalContribution[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    if (!userId) return;
    
    setLoading(true);
    
    const [incomesRes, debtsRes, goalsRes, contributionsRes] = await Promise.all([
      supabase.from('incomes').select('*').eq('user_id', userId).order('date', { ascending: false }),
      supabase.from('debts').select('*').eq('user_id', userId).order('due_date', { ascending: false }),
      supabase.from('goals').select('*').eq('user_id', userId),
      supabase.from('goal_contributions').select('*').eq('user_id', userId).order('created_at', { ascending: false }),
    ]);

    if (incomesRes.data) setIncomes(incomesRes.data);
    if (debtsRes.data) setDebts(debtsRes.data);
    if (goalsRes.data) setGoals(goalsRes.data as Goal[]);
    if (contributionsRes.data) setContributions(contributionsRes.data);
    
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const addIncome = useCallback(async (income: {
    category: string;
    subcategory: string;
    value: number;
    date: string;
  }) => {
    if (!userId) return;
    
    const { error } = await supabase.from('incomes').insert({
      user_id: userId,
      category: income.category,
      subcategory: income.subcategory || '',
      value: income.value,
      date: income.date,
    });
    
    if (!error) {
      fetchData();
    }
    return { error };
  }, [userId, fetchData]);

  const deleteIncome = useCallback(async (id: string) => {
    const { error } = await supabase.from('incomes').delete().eq('id', id);
    if (!error) {
      fetchData();
    }
  }, [fetchData]);

  const addDebt = useCallback(async (debt: {
    category: string;
    subcategory: string;
    value: number;
    interest: number;
    installments: number;
    dueDate: string;
    paymentMethod: string;
  }) => {
    if (!userId) return;
    
    const { error } = await supabase.from('debts').insert({
      user_id: userId,
      category: debt.category,
      subcategory: debt.subcategory || '',
      value: debt.value,
      interest: debt.interest || 0,
      installments: debt.installments || 0,
      due_date: debt.dueDate || null,
      payment_method: debt.paymentMethod,
    });
    
    if (!error) {
      fetchData();
    }
    return { error };
  }, [userId, fetchData]);

  const deleteDebt = useCallback(async (id: string) => {
    const { error } = await supabase.from('debts').delete().eq('id', id);
    if (!error) {
      fetchData();
    }
  }, [fetchData]);

  const addGoal = useCallback(async (goal: {
    name: string;
    category: string;
    subcategory: string;
    value: number;
    startDate: string;
    endDate: string | null;
  }) => {
    if (!userId) return;
    
    const { error } = await supabase.from('goals').insert({
      user_id: userId,
      name: goal.name,
      category: goal.category,
      subcategory: goal.subcategory || '',
      value: goal.value,
      start_date: goal.startDate,
      end_date: goal.endDate || null,
      accumulated_value: 0,
    });
    
    if (!error) {
      fetchData();
    }
    return { error };
  }, [userId, fetchData]);

  const deleteGoal = useCallback(async (id: string) => {
    const { error } = await supabase.from('goals').delete().eq('id', id);
    if (!error) {
      fetchData();
    }
  }, [fetchData]);

  const addContribution = useCallback(async (contribution: {
    goalId: string;
    value: number;
    description?: string;
    incomeId?: string;
  }) => {
    if (!userId) return;
    
    const { error } = await supabase.from('goal_contributions').insert({
      user_id: userId,
      goal_id: contribution.goalId,
      value: contribution.value,
      description: contribution.description || null,
      income_id: contribution.incomeId || null,
    });
    
    if (!error) {
      // Update accumulated_value on the goal
      const goal = goals.find(g => g.id === contribution.goalId);
      if (goal) {
        const newAccumulated = (goal.accumulated_value || 0) + contribution.value;
        await supabase.from('goals').update({ accumulated_value: newAccumulated }).eq('id', contribution.goalId);
      }
      fetchData();
    }
    return { error };
  }, [userId, goals, fetchData]);

  const deleteContribution = useCallback(async (id: string, goalId: string, value: number) => {
    const { error } = await supabase.from('goal_contributions').delete().eq('id', id);
    if (!error) {
      // Update accumulated_value on the goal
      const goal = goals.find(g => g.id === goalId);
      if (goal) {
        const newAccumulated = Math.max(0, (goal.accumulated_value || 0) - value);
        await supabase.from('goals').update({ accumulated_value: newAccumulated }).eq('id', goalId);
      }
      fetchData();
    }
  }, [goals, fetchData]);

  const linkIncomeToGoal = useCallback(async (incomeId: string, goalId: string) => {
    const income = incomes.find(i => i.id === incomeId);
    if (!income || !userId) return;
    
    await addContribution({
      goalId,
      value: income.value,
      description: `Entrada vinculada: ${income.category}${income.subcategory ? ` / ${income.subcategory}` : ''}`,
      incomeId,
    });
  }, [incomes, userId, addContribution]);

  const getDataByDateRange = useCallback((startDate?: Date, endDate?: Date) => {
    const parseValue = (val: number | string): number => {
      const parsed = typeof val === 'string' ? parseFloat(val) : Number(val);
      return isNaN(parsed) ? 0 : parsed;
    };

    let filteredIncomes = incomes;
    let filteredDebts = debts;

    if (startDate || endDate) {
      filteredIncomes = incomes.filter(i => {
        const d = new Date(i.date);
        if (startDate && d < startDate) return false;
        if (endDate) {
          const endOfDay = new Date(endDate);
          endOfDay.setHours(23, 59, 59, 999);
          if (d > endOfDay) return false;
        }
        return true;
      });

      filteredDebts = debts.filter(d => {
        if (!d.due_date) return false;
        const dd = new Date(d.due_date);
        if (startDate && dd < startDate) return false;
        if (endDate) {
          const endOfDay = new Date(endDate);
          endOfDay.setHours(23, 59, 59, 999);
          if (dd > endOfDay) return false;
        }
        return true;
      });
    }

    const totalIncomes = filteredIncomes.reduce((acc, i) => acc + parseValue(i.value), 0);
    const totalDebts = filteredDebts.reduce((acc, d) => acc + parseValue(d.value), 0);
    const balance = totalIncomes - totalDebts;

    return { incomes: totalIncomes, debts: totalDebts, balance };
  }, [incomes, debts]);

  const getFilteredIncomes = useCallback((startDate?: Date, endDate?: Date) => {
    if (!startDate && !endDate) return incomes;

    return incomes.filter(i => {
      const d = new Date(i.date);
      if (startDate && d < startDate) return false;
      if (endDate) {
        const endOfDay = new Date(endDate);
        endOfDay.setHours(23, 59, 59, 999);
        if (d > endOfDay) return false;
      }
      return true;
    });
  }, [incomes]);

  const getFilteredDebts = useCallback((startDate?: Date, endDate?: Date) => {
    if (!startDate && !endDate) return debts;

    return debts.filter(d => {
      if (!d.due_date) return false;
      const dd = new Date(d.due_date);
      if (startDate && dd < startDate) return false;
      if (endDate) {
        const endOfDay = new Date(endDate);
        endOfDay.setHours(23, 59, 59, 999);
        if (dd > endOfDay) return false;
      }
      return true;
    });
  }, [debts]);

  const getTotalData = useCallback((startDate?: Date, endDate?: Date) => {
    const parseValue = (val: number | string): number => {
      const parsed = typeof val === 'string' ? parseFloat(val) : Number(val);
      return isNaN(parsed) ? 0 : parsed;
    };

    let filteredIncomes = incomes;
    let filteredDebts = debts;

    if (startDate || endDate) {
      filteredIncomes = incomes.filter(i => {
        const d = new Date(i.date);
        if (startDate && d < startDate) return false;
        if (endDate) {
          const endOfDay = new Date(endDate);
          endOfDay.setHours(23, 59, 59, 999);
          if (d > endOfDay) return false;
        }
        return true;
      });

      filteredDebts = debts.filter(d => {
        if (!d.due_date) return false;
        const dd = new Date(d.due_date);
        if (startDate && dd < startDate) return false;
        if (endDate) {
          const endOfDay = new Date(endDate);
          endOfDay.setHours(23, 59, 59, 999);
          if (dd > endOfDay) return false;
        }
        return true;
      });
    }

    const totalIncomes = filteredIncomes.reduce((acc, i) => acc + parseValue(i.value), 0);
    const totalDebts = filteredDebts.reduce((acc, d) => acc + parseValue(d.value), 0);
    
    return { totalIncomes, totalDebts };
  }, [incomes, debts]);

  const getStatistics = useCallback((startDate?: Date, endDate?: Date) => {
    let filteredDebts = debts;

    if (startDate || endDate) {
      filteredDebts = debts.filter(d => {
        if (!d.due_date) return false;
        const dd = new Date(d.due_date);
        if (startDate && dd < startDate) return false;
        if (endDate) {
          const endOfDay = new Date(endDate);
          endOfDay.setHours(23, 59, 59, 999);
          if (dd > endOfDay) return false;
        }
        return true;
      });
    }

    if (filteredDebts.length === 0) return null;

    const parseValue = (val: number | string): number => {
      const parsed = typeof val === 'string' ? parseFloat(val) : Number(val);
      return isNaN(parsed) ? 0 : parsed;
    };

    const maxDebt = filteredDebts.reduce((prev, curr) => 
      parseValue(prev.value) > parseValue(curr.value) ? prev : curr
    );

    const categoryTotals: Record<string, number> = {};
    filteredDebts.forEach(d => {
      const val = parseValue(d.value);
      categoryTotals[d.category] = (categoryTotals[d.category] || 0) + val;
    });

    const maxCategory = Object.keys(categoryTotals).reduce((a, b) =>
      categoryTotals[a] > categoryTotals[b] ? a : b
    );

    const totalDebts = filteredDebts.reduce((acc, d) => acc + parseValue(d.value), 0);

    const percentages = Object.keys(categoryTotals).map(cat => ({
      category: cat,
      percentage: totalDebts > 0 ? (categoryTotals[cat] / totalDebts) * 100 : 0,
      value: categoryTotals[cat],
    }));

    return {
      maxDebt: {
        value: parseValue(maxDebt.value),
        category: maxDebt.category,
        subcategory: maxDebt.subcategory || '',
      },
      maxCategory,
      percentages,
      totalDebts,
    };
  }, [debts]);

  const getGoalProgress = useCallback((goal: Goal) => {
    const parseValue = (val: number | string): number => {
      const parsed = typeof val === 'string' ? parseFloat(val) : Number(val);
      return isNaN(parsed) ? 0 : parsed;
    };

    const goalValue = parseValue(goal.value);
    const accumulatedValue = parseValue(goal.accumulated_value);
    
    // Calculate progress based on accumulated value
    let progress = goalValue > 0 ? (accumulatedValue / goalValue) * 100 : 0;
    if (progress > 100) progress = 100;
    if (progress < 0) progress = 0;

    // Calculate status
    const now = new Date();
    const endDate = goal.end_date ? new Date(goal.end_date) : null;
    
    let status: 'em_andamento' | 'concluida' | 'atrasada' = 'em_andamento';
    if (progress >= 100) {
      status = 'concluida';
    } else if (endDate && now > endDate) {
      status = 'atrasada';
    }

    // Get contributions for this goal
    const goalContributions = contributions.filter(c => c.goal_id === goal.id);

    return {
      progress,
      accumulated: accumulatedValue,
      remaining: Math.max(0, goalValue - accumulatedValue),
      status,
      contributions: goalContributions,
    };
  }, [contributions]);

  const exportData = useCallback((type: 'incomes' | 'debts' | 'summary') => {
    let csvContent = 'data:text/csv;charset=utf-8,';

    if (type === 'incomes') {
      csvContent += 'Categoria,Subcategoria,Valor,Data\n';
      incomes.forEach(i => {
        csvContent += `${i.category},${i.subcategory},${i.value},${i.date}\n`;
      });
    } else if (type === 'debts') {
      csvContent += 'Categoria,Subcategoria,Valor,Juros,Parcelas,Vencimento,Forma de Pagamento\n';
      debts.forEach(d => {
        csvContent += `${d.category},${d.subcategory},${d.value},${d.interest || ''},${d.installments || ''},${d.due_date || ''},${d.payment_method}\n`;
      });
    } else if (type === 'summary') {
      const totalIncomes = incomes.reduce((sum, i) => sum + Number(i.value), 0);
      const totalDebts = debts.reduce((sum, d) => sum + Number(d.value), 0);
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
  }, [incomes, debts]);

  return {
    incomes,
    debts,
    goals,
    contributions,
    loading,
    addIncome,
    deleteIncome,
    addDebt,
    deleteDebt,
    addGoal,
    deleteGoal,
    addContribution,
    deleteContribution,
    linkIncomeToGoal,
    getDataByDateRange,
    getFilteredIncomes,
    getFilteredDebts,
    getTotalData,
    getStatistics,
    getGoalProgress,
    exportData,
    refresh: fetchData,
  };
}
