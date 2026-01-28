import { useState } from 'react';
import { Wallet, Loader2 } from 'lucide-react';
import { Navigation, ScreenType } from '@/components/finance/Navigation';
import { DateRangeFilter, DateRange } from '@/components/finance/DateRangeFilter';
import { QuickSummary } from '@/components/finance/QuickSummary';
import { IncomeForm } from '@/components/finance/IncomeForm';
import { IncomeList } from '@/components/finance/IncomeList';
import { DebtForm } from '@/components/finance/DebtForm';
import { DebtList } from '@/components/finance/DebtList';
import { FinancialChart } from '@/components/finance/FinancialChart';
import { Statistics } from '@/components/finance/Statistics';
import { GoalForm } from '@/components/finance/GoalForm';
import { GoalList } from '@/components/finance/GoalList';
import { AuthForm } from '@/components/auth/AuthForm';
import { UserHeader } from '@/components/auth/UserHeader';
import { useAuth } from '@/hooks/useAuth';
import { useSupabaseFinance } from '@/hooks/useSupabaseFinance';

const Index = () => {
  const [activeScreen, setActiveScreen] = useState<ScreenType>('resumo');
  const [dateRange, setDateRange] = useState<DateRange>({ startDate: undefined, endDate: undefined });
  const { user, profile, loading: authLoading, configError, signUp, signIn, signOut } = useAuth();
  
  const {
    incomes,
    debts,
    goals,
    loading: dataLoading,
    addIncome,
    deleteIncome,
    addDebt,
    deleteDebt,
    addGoal,
    deleteGoal,
    addContribution,
    linkIncomeToGoal,
    getDataByDateRange,
    getFilteredIncomes,
    getFilteredDebts,
    getTotalData,
    getStatistics,
    getGoalProgress,
    exportData,
  } = useSupabaseFinance(user?.id);

  if (configError) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6">
        <div className="max-w-lg text-center space-y-4">
          <div className="inline-flex items-center justify-center rounded-full bg-destructive/10 px-4 py-2 text-sm font-medium text-destructive">
            Configuração necessária
          </div>
          <h1 className="text-2xl font-semibold text-foreground">
            Não foi possível carregar o controle financeiro
          </h1>
          <p className="text-muted-foreground">
            {configError} Verifique seu arquivo <span className="font-medium text-foreground">.env</span> e reinicie o projeto.
          </p>
        </div>
      </div>
    );
  }

  // Show loading while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Show auth form if not logged in
  if (!user) {
    return <AuthForm onSignUp={signUp} onSignIn={signIn} />;
  }

  const rangeData = getDataByDateRange(dateRange.startDate, dateRange.endDate);
  const filteredIncomes = getFilteredIncomes(dateRange.startDate, dateRange.endDate);
  const filteredDebts = getFilteredDebts(dateRange.startDate, dateRange.endDate);
  const totalData = getTotalData(dateRange.startDate, dateRange.endDate);
  const statistics = getStatistics(dateRange.startDate, dateRange.endDate);
  const userName = profile?.name || 'Usuário';

  const renderScreen = () => {
    if (dataLoading) {
      return (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      );
    }

    switch (activeScreen) {
      case 'resumo':
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <QuickSummary
              incomes={rangeData.incomes}
              debts={rangeData.debts}
              balance={rangeData.balance}
            />
          </div>
        );
      
      case 'entradas':
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <IncomeForm onAdd={addIncome} />
            <IncomeList
              incomes={filteredIncomes}
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
              debts={filteredDebts}
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
              incomes={incomes}
              getProgress={getGoalProgress}
              onDelete={deleteGoal}
              onAddContribution={addContribution}
              onLinkIncome={linkIncomeToGoal}
            />
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background relative">
      <UserHeader name={userName} onSignOut={signOut} />
      
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
                Olá, {userName}! Gerencie suas finanças
              </p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <Navigation activeScreen={activeScreen} onNavigate={setActiveScreen} />
            <DateRangeFilter dateRange={dateRange} onDateRangeChange={setDateRange} />
          </div>
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
