import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';

interface DebtFormProps {
  onAdd: (debt: {
    category: string;
    subcategory: string;
    value: number;
    interest: number;
    installments: number;
    dueDate: string;
    paymentMethod: string;
  }) => void;
}

const paymentMethods = [
  'Dinheiro',
  'PIX',
  'Boleto',
  'Cartão de Crédito',
  'Cartão de Débito',
  'Outro',
];

export function DebtForm({ onAdd }: DebtFormProps) {
  const [category, setCategory] = useState('');
  const [subcategory, setSubcategory] = useState('');
  const [value, setValue] = useState('');
  const [interest, setInterest] = useState('');
  const [installments, setInstallments] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('PIX');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!category || !value) {
      toast.error('Preencha categoria e valor');
      return;
    }

    onAdd({
      category,
      subcategory,
      value: parseFloat(value),
      interest: parseFloat(interest) || 0,
      installments: parseInt(installments) || 0,
      dueDate,
      paymentMethod,
    });

    setCategory('');
    setSubcategory('');
    setValue('');
    setInterest('');
    setInstallments('');
    setDueDate('');
    setPaymentMethod('PIX');
    toast.success('Dívida adicionada com sucesso!');
  };

  const isInstantPayment = paymentMethod === 'Dinheiro' || paymentMethod === 'PIX';

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Nova Dívida</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="debt-category">Categoria *</Label>
              <Input
                id="debt-category"
                placeholder="Ex: Casa"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="debt-subcategory">Subcategoria</Label>
              <Input
                id="debt-subcategory"
                placeholder="Ex: Aluguel"
                value={subcategory}
                onChange={(e) => setSubcategory(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="debt-value">Valor *</Label>
              <Input
                id="debt-value"
                type="number"
                step="0.01"
                placeholder="0,00"
                value={value}
                onChange={(e) => setValue(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="debt-payment-method">Forma de Pagamento</Label>
              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {paymentMethods.map((method) => (
                    <SelectItem key={method} value={method}>
                      {method}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {!isInstantPayment && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="debt-interest">Juros (%)</Label>
                  <Input
                    id="debt-interest"
                    type="number"
                    step="0.01"
                    placeholder="0"
                    value={interest}
                    onChange={(e) => setInterest(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="debt-installments">Parcelas</Label>
                  <Input
                    id="debt-installments"
                    type="number"
                    placeholder="0"
                    value={installments}
                    onChange={(e) => setInstallments(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="debt-due-date">Data de Vencimento</Label>
                  <Input
                    id="debt-due-date"
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                  />
                </div>
              </>
            )}
          </div>
          <Button type="submit" variant="destructive" className="w-full md:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            Adicionar Dívida
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
