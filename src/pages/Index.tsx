import { useState } from 'react';
import { Wallet } from 'lucide-react';
import { Navigation, ScreenType } from '@/components/finance/Navigation';
import { QuickSummary } from '@/components/finance/QuickSummary';
import { IncomeForm } from '@/components/finance/IncomeForm';
import { IncomeList } from '@/components/finance/IncomeList';
import { DebtForm } from '@/components/finance/DebtForm';
import { DebtList } from '@/components/finance/DebtList';
import { FinancialChart } from '@/components/finance/FinancialChart';
import { Statistics } from '@/components/finance/Statistics';
import { GoalForm } from '@/components/finance/GoalForm';
import { GoalList } from '@/components/finance/GoalList';
import { useFinance } from '@/hooks/useFinance';

const Index = () => {
  const [activeScreen, setActiveScreen] = useState<ScreenType>('resumo');
  const {
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
  } = useFinance();

  const renderScreen = () => {
    switch (activeScreen) {
      case 'resumo':
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <QuickSummary
              incomes={monthlyData.incomes}
              debts={monthlyData.debts}
              balance={monthlyData.balance}
            />
          </div>
        );
      
      case 'entradas':
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <IncomeForm onAdd={addIncome} />
            <IncomeList
              incomes={incomes}
              onDelete={deleteIncome}
              onExport={() => exportData('incomes')}
            />
          </div>
        );
      
      case 'dividas':
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <DebtForm onAdd={addDebt} />
            <DebtList
              debts={debts}
              onDelete={deleteDebt}
              onExport={() => exportData('debts')}
            />
          </div>
        );
      
      case 'resumoFinanceiro':
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <FinancialChart
              totalIncomes={totalData.totalIncomes}
              totalDebts={totalData.totalDebts}
              onExport={() => exportData('summary')}
            />
          </div>
        );
      
      case 'estatisticas':
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <Statistics statistics={statistics} />
          </div>
        );
      
      case 'metas':
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <GoalForm onAdd={addGoal} />
            <GoalList
              goals={goals}
              getProgress={getGoalProgress}
              onDelete={deleteGoal}
            />
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-5xl py-6 px-4 md:py-10">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="rounded-xl bg-primary p-3 shadow-lg">
              <Wallet className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                Controle Financeiro
              </h1>
              <p className="text-muted-foreground">
                Gerencie suas finanças de forma simples
              </p>
            </div>
          </div>
          
          <Navigation activeScreen={activeScreen} onNavigate={setActiveScreen} />
        </header>

        {/* Main Content */}
        <main>
          {renderScreen()}
        </main>
      </div>
    </div>
  );
};

export default Index;
