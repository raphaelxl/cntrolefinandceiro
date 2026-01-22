import { Trash2, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface Goal {
  id: string;
  category: string;
  subcategory: string;
  value: number;
}

interface GoalListProps {
  goals: Goal[];
  getProgress: (goal: Goal) => {
    progress: number;
    totalSpent: number;
    totalEarned: number;
    remaining: number;
  };
  onDelete: (id: string) => void;
}

export function GoalList({ goals, getProgress, onDelete }: GoalListProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
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
              const { progress, remaining } = getProgress(goal);
              const isComplete = progress >= 100;
              
              return (
                <div
                  key={goal.id}
                  className="p-4 rounded-lg bg-accent/50"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`rounded-full p-2 ${isComplete ? 'bg-income/20' : 'bg-primary/10'}`}>
                        <Target className={`h-4 w-4 ${isComplete ? 'text-income' : 'text-primary'}`} />
                      </div>
                      <div>
                        <p className="font-medium">
                          {goal.category}
                          {goal.subcategory && ` / ${goal.subcategory}`}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Meta: {formatCurrency(goal.value)}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(goal.id)}
                      className="text-muted-foreground hover:text-debt"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className={isComplete ? 'text-income font-medium' : 'text-muted-foreground'}>
                        {progress.toFixed(1)}% concluído
                      </span>
                      <span className="text-muted-foreground">
                        Faltam: {formatCurrency(Math.max(0, remaining))}
                      </span>
                    </div>
                    <Progress 
                      value={progress} 
                      className={`h-3 ${isComplete ? '[&>div]:bg-income' : ''}`}
                    />
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
