import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

interface GoalFormProps {
  onAdd: (goal: {
    category: string;
    subcategory: string;
    value: number;
  }) => void;
}

export function GoalForm({ onAdd }: GoalFormProps) {
  const [category, setCategory] = useState('');
  const [subcategory, setSubcategory] = useState('');
  const [value, setValue] = useState('');

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
    });

    setCategory('');
    setSubcategory('');
    setValue('');
    toast.success('Meta adicionada com sucesso!');
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Nova Meta</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="goal-category">Categoria *</Label>
              <Input
                id="goal-category"
                placeholder="Ex: Comida"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="goal-subcategory">Subcategoria</Label>
              <Input
                id="goal-subcategory"
                placeholder="Ex: Mercado"
                value={subcategory}
                onChange={(e) => setSubcategory(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="goal-value">Valor da Meta *</Label>
              <Input
                id="goal-value"
                type="number"
                step="0.01"
                placeholder="0,00"
                value={value}
                onChange={(e) => setValue(e.target.value)}
              />
            </div>
          </div>
          <Button type="submit" className="w-full md:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            Adicionar Meta
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
