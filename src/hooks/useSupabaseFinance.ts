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

    const monthlyIncomes = incomes.filter(i => {
      const d = new Date(i.date);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    });

    const monthlyDebts = debts.filter(d => {
      if (!d.due_date) return false;
      const dd = new Date(d.due_date);
      return dd.getMonth() === currentMonth && dd.getFullYear() === currentYear;
    });

    const totalMonthlyIncomes = monthlyIncomes.reduce((sum, i) => sum + Number(i.value), 0);
    const totalMonthlyDebts = monthlyDebts.reduce((sum, d) => sum + Number(d.value), 0);
    const balance = totalMonthlyIncomes - totalMonthlyDebts;

    return {
      incomes: totalMonthlyIncomes,
      debts: totalMonthlyDebts,
      balance,
    };
  }, [incomes, debts]);

  const getTotalData = useCallback(() => {
    const totalIncomes = incomes.reduce((sum, i) => sum + Number(i.value), 0);
    const totalDebts = debts.reduce((sum, d) => sum + Number(d.value), 0);
    return { totalIncomes, totalDebts };
  }, [incomes, debts]);

  const getStatistics = useCallback(() => {
    if (debts.length === 0) return null;

    const maxDebt = debts.reduce((prev, curr) => 
      Number(prev.value) > Number(curr.value) ? prev : curr
    );

    const categoryTotals: Record<string, number> = {};
    debts.forEach(d => {
      categoryTotals[d.category] = (categoryTotals[d.category] || 0) + Number(d.value);
    });

    const maxCategory = Object.keys(categoryTotals).reduce((a, b) =>
      categoryTotals[a] > categoryTotals[b] ? a : b
    );

    const totalDebts = debts.reduce((sum, d) => sum + Number(d.value), 0);

    const percentages = Object.keys(categoryTotals).map(cat => ({
      category: cat,
      percentage: (categoryTotals[cat] / totalDebts) * 100,
      value: categoryTotals[cat],
    }));

    return {
      maxDebt: {
        value: Number(maxDebt.value),
        category: maxDebt.category,
        subcategory: maxDebt.subcategory,
      },
      maxCategory,
      percentages,
      totalDebts,
    };
  }, [debts]);

  const getGoalProgress = useCallback((goal: Goal) => {
    const relatedDebts = debts.filter(
      d => d.category === goal.category && d.subcategory === goal.subcategory
    );
    const relatedIncomes = incomes.filter(
      i => i.category === goal.category && i.subcategory === goal.subcategory
    );

    const totalSpent = relatedDebts.reduce((sum, d) => sum + Number(d.value), 0);
    const totalEarned = relatedIncomes.reduce((sum, i) => sum + Number(i.value), 0);

    let progress = ((totalEarned - totalSpent) / Number(goal.value)) * 100;
    if (progress > 100) progress = 100;
    if (progress < 0) progress = 0;

    return {
      progress,
      totalSpent,
      totalEarned,
      remaining: Number(goal.value) - (totalEarned - totalSpent),
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
