import { BarChart3, TrendingDown, PieChart } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface StatisticsProps {
  statistics: {
    maxDebt: { value: number; category: string; subcategory: string };
    maxCategory: string;
    percentages: { category: string; percentage: number; value: number }[];
    totalDebts: number;
  } | null;
}

export function Statistics({ statistics }: StatisticsProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  if (!statistics) {
    return (
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Estatísticas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
            <BarChart3 className="h-12 w-12 mb-2 opacity-50" />
            <p>Nenhuma dívida cadastrada para análise</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <TrendingDown className="h-5 w-5 text-debt" />
              Maior Gasto
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-debt">{formatCurrency(statistics.maxDebt.value)}</p>
            <p className="text-muted-foreground mt-1">
              {statistics.maxDebt.subcategory || statistics.maxDebt.category}
              {statistics.maxDebt.subcategory && ` (${statistics.maxDebt.category})`}
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-warning" />
              Categoria com Mais Despesas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-foreground">{statistics.maxCategory}</p>
            <p className="text-muted-foreground mt-1">
              {formatCurrency(
                statistics.percentages.find(p => p.category === statistics.maxCategory)?.value || 0
              )}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <PieChart className="h-5 w-5 text-primary" />
            Percentual por Categoria
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {statistics.percentages.map((item) => (
              <div key={item.category} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{item.category}</span>
                  <span className="text-muted-foreground">
                    {item.percentage.toFixed(1)}% ({formatCurrency(item.value)})
                  </span>
                </div>
                <Progress value={item.percentage} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
