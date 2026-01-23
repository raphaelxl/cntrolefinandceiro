import { useState, useEffect } from 'react';
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
import { getCategoryList, getSubcategories } from '@/lib/categories';

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
  const [customCategory, setCustomCategory] = useState('');
  const [customSubcategory, setCustomSubcategory] = useState('');
  const [value, setValue] = useState('');
  const [date, setDate] = useState('');
  const [subcategories, setSubcategories] = useState<string[]>([]);

  const categories = getCategoryList('income');
  const isCustomCategory = category === '__custom__';
  const isCustomSubcategory = subcategory === '__custom__';

  useEffect(() => {
    if (category && category !== '__custom__') {
      setSubcategories(getSubcategories('income', category));
      setSubcategory('');
      setCustomSubcategory('');
    } else {
      setSubcategories([]);
      setSubcategory('');
    }
  }, [category]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const finalCategory = isCustomCategory ? customCategory : category;
    const finalSubcategory = isCustomSubcategory ? customSubcategory : subcategory;

    if (!finalCategory || !value || !date) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    onAdd({
      category: finalCategory,
      subcategory: finalSubcategory || '',
      value: parseFloat(value),
      date,
    });

    setCategory('');
    setSubcategory('');
    setCustomCategory('');
    setCustomSubcategory('');
    setValue('');
    setDate('');
    setSubcategories([]);
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
              <Label htmlFor="income-category">Categoria *</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                  <SelectItem value="__custom__">+ Personalizada</SelectItem>
                </SelectContent>
              </Select>
              {isCustomCategory && (
                <Input
                  placeholder="Digite a categoria"
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  className="mt-2"
                />
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="income-subcategory">Subcategoria</Label>
              <Select
                value={subcategory}
                onValueChange={setSubcategory}
                disabled={!category || isCustomCategory}
              >
                <SelectTrigger>
                  <SelectValue placeholder={category ? 'Selecione a subcategoria' : 'Selecione uma categoria primeiro'} />
                </SelectTrigger>
                <SelectContent>
                  {subcategories.map((sub) => (
                    <SelectItem key={sub} value={sub}>
                      {sub}
                    </SelectItem>
                  ))}
                  {subcategories.length > 0 && (
                    <SelectItem value="__custom__">+ Personalizada</SelectItem>
                  )}
                </SelectContent>
              </Select>
              {(isCustomSubcategory || isCustomCategory) && (
                <Input
                  placeholder="Digite a subcategoria"
                  value={customSubcategory}
                  onChange={(e) => setCustomSubcategory(e.target.value)}
                  className="mt-2"
                />
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="income-value">Valor *</Label>
              <Input
                id="income-value"
                type="number"
                step="0.01"
                placeholder="0,00"
                value={value}
                onChange={(e) => setValue(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="income-date">Data *</Label>
              <Input
                id="income-date"
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
