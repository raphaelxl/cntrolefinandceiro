import { Trash2, Download, TrendingDown, CreditCard, Banknote, QrCode, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Debt {
  id: string;
  category: string;
  subcategory: string;
  value: number;
  interest: number;
  installments: number;
  due_date: string | null;
  payment_method: string;
}

interface DebtListProps {
  debts: Debt[];
  onDelete: (id: string) => void;
  onExport: () => void;
}

const getPaymentIcon = (method: string) => {
  switch (method) {
    case 'Cartão de Crédito':
    case 'Cartão de Débito':
      return CreditCard;
    case 'PIX':
      return QrCode;
    case 'Boleto':
      return FileText;
    default:
      return Banknote;
  }
};

export function DebtList({ debts, onDelete, onExport }: DebtListProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">Lista de Dívidas</CardTitle>
        <Button variant="outline" size="sm" onClick={onExport}>
          <Download className="mr-2 h-4 w-4" />
          Exportar
        </Button>
      </CardHeader>
      <CardContent>
        {debts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
            <TrendingDown className="h-12 w-12 mb-2 opacity-50" />
            <p>Nenhuma dívida cadastrada</p>
          </div>
        ) : (
          <div className="space-y-3">
            {debts.map((debt) => {
              const PaymentIcon = getPaymentIcon(debt.payment_method);
              return (
                <div
                  key={debt.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-destructive/5 hover:bg-destructive/10 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="rounded-full bg-debt/10 p-2">
                      <TrendingDown className="h-4 w-4 text-debt" />
                    </div>
                    <div>
                      <p className="font-medium">
                        {debt.category}
                        {debt.subcategory && ` / ${debt.subcategory}`}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          <PaymentIcon className="h-3 w-3 mr-1" />
                          {debt.payment_method}
                        </Badge>
                        {debt.installments > 0 && (
                          <Badge variant="secondary" className="text-xs">
                            {debt.installments}x
                          </Badge>
                        )}
                        {debt.interest > 0 && (
                          <Badge variant="secondary" className="text-xs">
                            {debt.interest}% juros
                          </Badge>
                        )}
                      </div>
                      {debt.due_date && (
                        <p className="text-sm text-muted-foreground mt-1">
                          Vencimento: {formatDate(debt.due_date)}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-semibold text-debt">
                      {formatCurrency(debt.value)}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(debt.id)}
                      className="text-muted-foreground hover:text-debt"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
