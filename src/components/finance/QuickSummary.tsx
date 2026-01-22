import { TrendingUp, TrendingDown, Wallet } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface QuickSummaryProps {
  incomes: number;
  debts: number;
  balance: number;
}

export function QuickSummary({ incomes, debts, balance }: QuickSummaryProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card className="border-0 shadow-lg bg-gradient-to-br from-card to-accent/30">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-income/10 p-3">
              <TrendingUp className="h-6 w-6 text-income" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Entradas do Mês</p>
              <p className="text-2xl font-bold text-income">{formatCurrency(incomes)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-lg bg-gradient-to-br from-card to-destructive/5">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-debt/10 p-3">
              <TrendingDown className="h-6 w-6 text-debt" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Dívidas do Mês</p>
              <p className="text-2xl font-bold text-debt">{formatCurrency(debts)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className={cn(
        "border-0 shadow-lg",
        balance >= 0 
          ? "bg-gradient-to-br from-card to-income/10" 
          : "bg-gradient-to-br from-card to-debt/10"
      )}>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className={cn(
              "rounded-full p-3",
              balance >= 0 ? "bg-income/10" : "bg-debt/10"
            )}>
              <Wallet className={cn(
                "h-6 w-6",
                balance >= 0 ? "text-income" : "text-debt"
              )} />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Saldo do Mês</p>
              <p className={cn(
                "text-2xl font-bold",
                balance >= 0 ? "text-income" : "text-debt"
              )}>
                {formatCurrency(balance)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
