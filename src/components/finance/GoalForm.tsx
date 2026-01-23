import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { getCategoryList, getSubcategories } from '@/lib/categories';

interface GoalFormProps {
  onAdd: (goal: {
    name: string;
    category: string;
    subcategory: string;
    value: number;
    startDate: string;
    endDate: string | null;
  }) => void;
}

export function GoalForm({ onAdd }: GoalFormProps) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [subcategory, setSubcategory] = useState('');
  const [customCategory, setCustomCategory] = useState('');
  const [customSubcategory, setCustomSubcategory] = useState('');
  const [value, setValue] = useState('');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState('');
  const [subcategories, setSubcategories] = useState<string[]>([]);

  const categories = getCategoryList('goal');

  useEffect(() => {
    if (category && category !== 'custom') {
      setSubcategories(getSubcategories('goal', category));
      setSubcategory('');
    } else {
      setSubcategories([]);
    }
  }, [category]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const finalCategory = category === 'custom' ? customCategory : category;
    const finalSubcategory = subcategory === 'custom' ? customSubcategory : subcategory;

    if (!name || !finalCategory || !value) {
      toast.error('Preencha nome, categoria e valor');
      return;
    }

    onAdd({
      name,
      category: finalCategory,
      subcategory: finalSubcategory,
      value: parseFloat(value),
      startDate,
      endDate: endDate || null,
    });

    setName('');
    setCategory('');
    setSubcategory('');
    setCustomCategory('');
    setCustomSubcategory('');
    setValue('');
    setStartDate(new Date().toISOString().split('T')[0]);
    setEndDate('');
    toast.success('Meta adicionada com sucesso!');
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Nova Meta</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="goal-name">Nome da Meta *</Label>
              <Input
                id="goal-name"
                placeholder="Ex: Viagem para Europa"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="goal-category">Categoria *</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger id="goal-category">
                  <SelectValue placeholder="Selecione a categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                  <SelectItem value="custom">+ Categoria personalizada</SelectItem>
                </SelectContent>
              </Select>
              {category === 'custom' && (
                <Input
                  placeholder="Digite a categoria"
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  className="mt-2"
                />
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="goal-subcategory">Subcategoria</Label>
              <Select
                value={subcategory}
                onValueChange={setSubcategory}
                disabled={!category || category === 'custom'}
              >
                <SelectTrigger id="goal-subcategory">
                  <SelectValue placeholder="Selecione a subcategoria" />
                </SelectTrigger>
                <SelectContent>
                  {subcategories.map((sub) => (
                    <SelectItem key={sub} value={sub}>
                      {sub}
                    </SelectItem>
                  ))}
                  <SelectItem value="custom">+ Subcategoria personalizada</SelectItem>
                </SelectContent>
              </Select>
              {(subcategory === 'custom' || category === 'custom') && (
                <Input
                  placeholder="Digite a subcategoria"
                  value={customSubcategory}
                  onChange={(e) => setCustomSubcategory(e.target.value)}
                  className="mt-2"
                />
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="goal-value">Valor da Meta *</Label>
              <Input
                id="goal-value"
                type="number"
                step="0.01"
                min="0"
                placeholder="0,00"
                value={value}
                onChange={(e) => setValue(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="goal-start-date">Data Inicial</Label>
              <Input
                id="goal-start-date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="goal-end-date">Data Final</Label>
              <Input
                id="goal-end-date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
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
