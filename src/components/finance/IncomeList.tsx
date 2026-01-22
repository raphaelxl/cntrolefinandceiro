import { Trash2, Download, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Income } from '@/lib/finance-store';

interface IncomeListProps {
  incomes: Income[];
  onDelete: (id: string) => void;
  onExport: () => void;
}

export function IncomeList({ incomes, onDelete, onExport }: IncomeListProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">Lista de Entradas</CardTitle>
        <Button variant="outline" size="sm" onClick={onExport}>
          <Download className="mr-2 h-4 w-4" />
          Exportar
        </Button>
      </CardHeader>
      <CardContent>
        {incomes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
            <TrendingUp className="h-12 w-12 mb-2 opacity-50" />
            <p>Nenhuma entrada cadastrada</p>
          </div>
        ) : (
          <div className="space-y-3">
            {incomes.map((income) => (
              <div
                key={income.id}
                className="flex items-center justify-between p-4 rounded-lg bg-accent/50 hover:bg-accent transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-income/10 p-2">
                    <TrendingUp className="h-4 w-4 text-income" />
                  </div>
                  <div>
                    <p className="font-medium">
                      {income.category}
                      {income.subcategory && ` / ${income.subcategory}`}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(income.date)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-semibold text-income">
                    {formatCurrency(income.value)}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(income.id)}
                    className="text-muted-foreground hover:text-debt"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
