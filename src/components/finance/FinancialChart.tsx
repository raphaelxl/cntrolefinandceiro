import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface FinancialChartProps {
  totalIncomes: number;
  totalDebts: number;
  onExport: () => void;
}

export function FinancialChart({ totalIncomes, totalDebts, onExport }: FinancialChartProps) {
  const data = [
    {
      name: 'Total Geral',
      Entradas: totalIncomes,
      Dívidas: totalDebts,
    },
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const balance = totalIncomes - totalDebts;

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">Resumo Financeiro</CardTitle>
        <Button variant="outline" size="sm" onClick={onExport}>
          <Download className="mr-2 h-4 w-4" />
          Exportar
        </Button>
      </CardHeader>
      <CardContent>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="name" />
              <YAxis 
                tickFormatter={(value) => `R$ ${value}`}
                domain={[0, 'auto']}
                allowDataOverflow={false}
              />
              <Tooltip 
                formatter={(value: number) => formatCurrency(value)}
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Bar dataKey="Entradas" fill="hsl(142, 76%, 36%)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Dívidas" fill="hsl(0, 72%, 51%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-6 grid grid-cols-3 gap-4 text-center">
          <div className="p-4 rounded-lg bg-income/10">
            <p className="text-sm text-muted-foreground">Total Entradas</p>
            <p className="text-xl font-bold text-income">{formatCurrency(totalIncomes)}</p>
          </div>
          <div className="p-4 rounded-lg bg-debt/10">
            <p className="text-sm text-muted-foreground">Total Dívidas</p>
            <p className="text-xl font-bold text-debt">{formatCurrency(totalDebts)}</p>
          </div>
          <div className={`p-4 rounded-lg ${balance >= 0 ? 'bg-income/10' : 'bg-debt/10'}`}>
            <p className="text-sm text-muted-foreground">Saldo</p>
            <p className={`text-xl font-bold ${balance >= 0 ? 'text-income' : 'text-debt'}`}>
              {formatCurrency(balance)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
