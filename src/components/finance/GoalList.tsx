import { useState } from 'react';
import { Trash2, Target, Plus, Calendar, TrendingUp, Link2, ChevronDown, ChevronUp, History } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { GoalContribution } from '@/hooks/useSupabaseFinance';

interface Goal {
  id: string;
  name: string;
  category: string;
  subcategory: string;
  value: number;
  accumulated_value: number;
  start_date: string;
  end_date: string | null;
}

interface Income {
  id: string;
  category: string;
  subcategory: string;
  value: number;
  date: string;
}

interface GoalListProps {
  goals: Goal[];
  incomes: Income[];
  getProgress: (goal: Goal) => {
    progress: number;
    accumulated: number;
    remaining: number;
    status: 'em_andamento' | 'concluida' | 'atrasada';
    contributions: GoalContribution[];
  };
  onDelete: (id: string) => void;
  onAddContribution: (contribution: { goalId: string; value: number; description?: string }) => void;
  onLinkIncome: (incomeId: string, goalId: string) => void;
}

export function GoalList({ goals, incomes, getProgress, onDelete, onAddContribution, onLinkIncome }: GoalListProps) {
  const [contributionValue, setContributionValue] = useState('');
  const [contributionDescription, setContributionDescription] = useState('');
  const [selectedIncome, setSelectedIncome] = useState('');
  const [activeGoalId, setActiveGoalId] = useState<string | null>(null);
  const [expandedGoals, setExpandedGoals] = useState<Set<string>>(new Set());

  const toggleExpanded = (goalId: string) => {
    setExpandedGoals(prev => {
      const next = new Set(prev);
      if (next.has(goalId)) {
        next.delete(goalId);
      } else {
        next.add(goalId);
      }
      return next;
    });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getStatusBadge = (status: 'em_andamento' | 'concluida' | 'atrasada') => {
    switch (status) {
      case 'concluida':
        return <Badge className="bg-income text-income-foreground">Concluída</Badge>;
      case 'atrasada':
        return <Badge variant="destructive">Atrasada</Badge>;
      default:
        return <Badge variant="secondary">Em andamento</Badge>;
    }
  };

  const handleAddContribution = (goalId: string) => {
    if (!contributionValue || parseFloat(contributionValue) <= 0) return;
    
    onAddContribution({
      goalId,
      value: parseFloat(contributionValue),
      description: contributionDescription || undefined,
    });
    
    setContributionValue('');
    setContributionDescription('');
    setActiveGoalId(null);
  };

  const handleLinkIncome = (goalId: string) => {
    if (!selectedIncome) return;
    onLinkIncome(selectedIncome, goalId);
    setSelectedIncome('');
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Progresso das Metas</CardTitle>
      </CardHeader>
      <CardContent>
        {goals.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
            <Target className="h-12 w-12 mb-2 opacity-50" />
            <p>Nenhuma meta cadastrada</p>
          </div>
        ) : (
          <div className="space-y-6">
            {goals.map((goal) => {
              const { progress, accumulated, remaining, status, contributions } = getProgress(goal);
              const isExpanded = expandedGoals.has(goal.id);
              
              return (
                <div
                  key={goal.id}
                  className="p-4 rounded-lg bg-accent/50"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3 flex-1">
                      <div className={`rounded-full p-2 ${status === 'concluida' ? 'bg-income/20' : status === 'atrasada' ? 'bg-destructive/20' : 'bg-primary/10'}`}>
                        <Target className={`h-4 w-4 ${status === 'concluida' ? 'text-income' : status === 'atrasada' ? 'text-destructive' : 'text-primary'}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-medium truncate">{goal.name}</p>
                          {getStatusBadge(status)}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {goal.category}
                          {goal.subcategory && ` / ${goal.subcategory}`}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Meta: {formatCurrency(goal.value)}
                        </p>
                        {(goal.start_date || goal.end_date) && (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                            <Calendar className="h-3 w-3" />
                            {formatDate(goal.start_date)} {goal.end_date && `- ${formatDate(goal.end_date)}`}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
                            <Plus className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Adicionar Aporte</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4 pt-4">
                            <div className="space-y-2">
                              <Label>Valor do Aporte *</Label>
                              <Input
                                type="number"
                                step="0.01"
                                min="0"
                                placeholder="0,00"
                                value={contributionValue}
                                onChange={(e) => setContributionValue(e.target.value)}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Descrição</Label>
                              <Input
                                placeholder="Ex: Economia do mês"
                                value={contributionDescription}
                                onChange={(e) => setContributionDescription(e.target.value)}
                              />
                            </div>
                            <Button 
                              onClick={() => handleAddContribution(goal.id)} 
                              className="w-full"
                              disabled={!contributionValue || parseFloat(contributionValue) <= 0}
                            >
                              <TrendingUp className="mr-2 h-4 w-4" />
                              Adicionar Aporte
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>

                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
                            <Link2 className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Vincular Entrada</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4 pt-4">
                            <div className="space-y-2">
                              <Label>Selecione uma Entrada</Label>
                              <Select value={selectedIncome} onValueChange={setSelectedIncome}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione uma entrada" />
                                </SelectTrigger>
                                <SelectContent>
                                  {incomes.map((income) => (
                                    <SelectItem key={income.id} value={income.id}>
                                      {income.category} - {formatCurrency(income.value)} ({formatDate(income.date)})
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <Button 
                              onClick={() => handleLinkIncome(goal.id)} 
                              className="w-full"
                              disabled={!selectedIncome}
                            >
                              <Link2 className="mr-2 h-4 w-4" />
                              Vincular Entrada
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete(goal.id)}
                        className="text-muted-foreground hover:text-debt"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className={status === 'concluida' ? 'text-income font-medium' : 'text-muted-foreground'}>
                        {progress.toFixed(1)}% concluído
                      </span>
                      <span className="text-muted-foreground">
                        Acumulado: {formatCurrency(accumulated)}
                      </span>
                    </div>
                    <Progress 
                      value={progress} 
                      className={`h-3 ${status === 'concluida' ? '[&>div]:bg-income' : status === 'atrasada' ? '[&>div]:bg-destructive' : ''}`}
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Faltam: {formatCurrency(remaining)}</span>
                    </div>
                  </div>

                  {/* Histórico de Aportes */}
                  {contributions.length > 0 && (
                    <Collapsible open={isExpanded} onOpenChange={() => toggleExpanded(goal.id)}>
                      <CollapsibleTrigger asChild>
                        <Button variant="ghost" size="sm" className="w-full mt-3 text-muted-foreground hover:text-foreground">
                          <History className="h-4 w-4 mr-2" />
                          Histórico de Aportes ({contributions.length})
                          {isExpanded ? <ChevronUp className="h-4 w-4 ml-auto" /> : <ChevronDown className="h-4 w-4 ml-auto" />}
                        </Button>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="mt-2">
                        <div className="space-y-2 max-h-48 overflow-y-auto">
                          {contributions.map((contribution) => (
                            <div 
                              key={contribution.id} 
                              className="flex items-center justify-between p-2 rounded-md bg-background/50 text-sm"
                            >
                              <div className="flex flex-col">
                                <span className="font-medium text-income">
                                  + {formatCurrency(contribution.value)}
                                </span>
                                {contribution.description && (
                                  <span className="text-xs text-muted-foreground">
                                    {contribution.description}
                                  </span>
                                )}
                              </div>
                              <span className="text-xs text-muted-foreground">
                                {formatDate(contribution.created_at)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
