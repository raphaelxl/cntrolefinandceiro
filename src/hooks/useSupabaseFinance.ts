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
  category: string;
  subcategory: string;
  value: number;
}

export function useSupabaseFinance(userId: string | undefined) {
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [debts, setDebts] = useState<Debt[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    if (!userId) return;
    
    setLoading(true);
    
    const [incomesRes, debtsRes, goalsRes] = await Promise.all([
      supabase.from('incomes').select('*').eq('user_id', userId).order('date', { ascending: false }),
      supabase.from('debts').select('*').eq('user_id', userId).order('due_date', { ascending: false }),
      supabase.from('goals').select('*').eq('user_id', userId),
    ]);

    if (incomesRes.data) setIncomes(incomesRes.data);
    if (debtsRes.data) setDebts(debtsRes.data);
    if (goalsRes.data) setGoals(goalsRes.data);
    
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
    category: string;
    subcategory: string;
    value: number;
  }) => {
    if (!userId) return;
    
    const { error } = await supabase.from('goals').insert({
      user_id: userId,
      category: goal.category,
      subcategory: goal.subcategory || '',
      value: goal.value,
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

  const getMonthlyData = useCallback(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    // Filter incomes for current month
    const monthlyIncomes = incomes.filter(i => {
      const d = new Date(i.date);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    });

    // Filter debts for current month - include debts without due_date as current month
    const monthlyDebts = debts.filter(d => {
      if (!d.due_date) {
        // If no due_date, check created_at or include in current month
        return true;
      }
      const dd = new Date(d.due_date);
      return dd.getMonth() === currentMonth && dd.getFullYear() === currentYear;
    });

    // Sum all values ensuring they are treated as numbers
    const totalMonthlyIncomes = monthlyIncomes.reduce((acc, i) => {
      const val = typeof i.value === 'string' ? parseFloat(i.value) : Number(i.value);
      return acc + (isNaN(val) ? 0 : val);
    }, 0);
    
    const totalMonthlyDebts = monthlyDebts.reduce((acc, d) => {
      const val = typeof d.value === 'string' ? parseFloat(d.value) : Number(d.value);
      return acc + (isNaN(val) ? 0 : val);
    }, 0);
    
    const balance = totalMonthlyIncomes - totalMonthlyDebts;

    return {
      incomes: totalMonthlyIncomes,
      debts: totalMonthlyDebts,
      balance,
    };
  }, [incomes, debts]);

  const getTotalData = useCallback(() => {
    // Sum ALL incomes from database
    const totalIncomes = incomes.reduce((acc, i) => {
      const val = typeof i.value === 'string' ? parseFloat(i.value) : Number(i.value);
      return acc + (isNaN(val) ? 0 : val);
    }, 0);
    
    // Sum ALL debts from database
    const totalDebts = debts.reduce((acc, d) => {
      const val = typeof d.value === 'string' ? parseFloat(d.value) : Number(d.value);
      return acc + (isNaN(val) ? 0 : val);
    }, 0);
    
    return { totalIncomes, totalDebts };
  }, [incomes, debts]);

  const getStatistics = useCallback(() => {
    if (debts.length === 0) return null;

    // Helper to safely parse value
    const parseValue = (val: number | string): number => {
      const parsed = typeof val === 'string' ? parseFloat(val) : Number(val);
      return isNaN(parsed) ? 0 : parsed;
    };

    // Find the highest debt
    const maxDebt = debts.reduce((prev, curr) => 
      parseValue(prev.value) > parseValue(curr.value) ? prev : curr
    );

    // Calculate totals by category
    const categoryTotals: Record<string, number> = {};
    debts.forEach(d => {
      const val = parseValue(d.value);
      categoryTotals[d.category] = (categoryTotals[d.category] || 0) + val;
    });

    // Find the category with highest total
    const maxCategory = Object.keys(categoryTotals).reduce((a, b) =>
      categoryTotals[a] > categoryTotals[b] ? a : b
    );

    // Calculate total of ALL debts
    const totalDebts = debts.reduce((acc, d) => acc + parseValue(d.value), 0);

    // Calculate percentage for each category
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
    // Helper to safely parse value
    const parseValue = (val: number | string): number => {
      const parsed = typeof val === 'string' ? parseFloat(val) : Number(val);
      return isNaN(parsed) ? 0 : parsed;
    };

    // Find all debts matching this goal's category and subcategory
    const relatedDebts = debts.filter(
      d => d.category === goal.category && d.subcategory === goal.subcategory
    );
    
    // Find all incomes matching this goal's category and subcategory
    const relatedIncomes = incomes.filter(
      i => i.category === goal.category && i.subcategory === goal.subcategory
    );

    // Sum ALL related debts
    const totalSpent = relatedDebts.reduce((acc, d) => acc + parseValue(d.value), 0);
    
    // Sum ALL related incomes
    const totalEarned = relatedIncomes.reduce((acc, i) => acc + parseValue(i.value), 0);

    const goalValue = parseValue(goal.value);
    let progress = goalValue > 0 ? ((totalEarned - totalSpent) / goalValue) * 100 : 0;
    if (progress > 100) progress = 100;
    if (progress < 0) progress = 0;

    return {
      progress,
      totalSpent,
      totalEarned,
      remaining: goalValue - (totalEarned - totalSpent),
    };
  }, [debts, incomes]);

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
    loading,
    addIncome,
    deleteIncome,
    addDebt,
    deleteDebt,
    addGoal,
    deleteGoal,
    getMonthlyData,
    getTotalData,
    getStatistics,
    getGoalProgress,
    exportData,
    refresh: fetchData,
  };
}
