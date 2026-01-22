import { Home, TrendingUp, TrendingDown, BarChart3, PieChart, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export type ScreenType = 'resumo' | 'entradas' | 'dividas' | 'resumoFinanceiro' | 'estatisticas' | 'metas';

interface NavigationProps {
  activeScreen: ScreenType;
  onNavigate: (screen: ScreenType) => void;
}

const navItems: { id: ScreenType; label: string; icon: React.ElementType }[] = [
  { id: 'resumo', label: 'Resumo', icon: Home },
  { id: 'entradas', label: 'Entradas', icon: TrendingUp },
  { id: 'dividas', label: 'Dívidas', icon: TrendingDown },
  { id: 'resumoFinanceiro', label: 'Gráficos', icon: BarChart3 },
  { id: 'estatisticas', label: 'Estatísticas', icon: PieChart },
  { id: 'metas', label: 'Metas', icon: Target },
];

export function Navigation({ activeScreen, onNavigate }: NavigationProps) {
  return (
    <nav className="flex flex-wrap gap-2 p-1 bg-secondary/50 rounded-xl">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeScreen === item.id;
        
        return (
          <Button
            key={item.id}
            variant={isActive ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onNavigate(item.id)}
            className={cn(
              'flex items-center gap-2 transition-all',
              isActive && 'shadow-md'
            )}
          >
            <Icon className="h-4 w-4" />
            <span className="hidden sm:inline">{item.label}</span>
          </Button>
        );
      })}
    </nav>
  );
}
