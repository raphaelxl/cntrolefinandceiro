import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

interface IncomeFormProps {
  onAdd: (income: {
    category: string;
    subcategory: string;
    value: number;
    date: string;
  }) => void;
}

export function IncomeForm({ onAdd }: IncomeFormProps) {
  const [category, setCategory] = useState('');
  const [subcategory, setSubcategory] = useState('');
  const [value, setValue] = useState('');
  const [date, setDate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!category || !value || !date) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    onAdd({
      category,
      subcategory,
      value: parseFloat(value),
      date,
    });

    setCategory('');
    setSubcategory('');
    setValue('');
    setDate('');
    toast.success('Entrada adicionada com sucesso!');
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Nova Entrada</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="category">Categoria *</Label>
              <Input
                id="category"
                placeholder="Ex: Salário"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subcategory">Subcategoria</Label>
              <Input
                id="subcategory"
                placeholder="Ex: Freelance"
                value={subcategory}
                onChange={(e) => setSubcategory(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="value">Valor *</Label>
              <Input
                id="value"
                type="number"
                step="0.01"
                placeholder="0,00"
                value={value}
                onChange={(e) => setValue(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Data *</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
          </div>
          <Button type="submit" className="w-full md:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            Adicionar Entrada
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
