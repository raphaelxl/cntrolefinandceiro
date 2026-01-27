import { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format, addMonths, subMonths } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface MonthFilterProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

export function MonthFilter({ selectedDate, onDateChange }: MonthFilterProps) {
  const handlePreviousMonth = () => {
    onDateChange(subMonths(selectedDate, 1));
  };

  const handleNextMonth = () => {
    onDateChange(addMonths(selectedDate, 1));
  };

  const handleCurrentMonth = () => {
    onDateChange(new Date());
  };

  const formattedDate = format(selectedDate, "MMMM 'de' yyyy", { locale: ptBR });
  const isCurrentMonth = 
    selectedDate.getMonth() === new Date().getMonth() && 
    selectedDate.getFullYear() === new Date().getFullYear();

  return (
    <div className="flex items-center gap-2 p-2 bg-secondary/50 rounded-xl">
      <Button
        variant="ghost"
        size="icon"
        onClick={handlePreviousMonth}
        className="h-8 w-8"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      
      <div className="flex items-center gap-2 min-w-[160px] justify-center">
        <Calendar className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium capitalize">
          {formattedDate}
        </span>
      </div>
      
      <Button
        variant="ghost"
        size="icon"
        onClick={handleNextMonth}
        className="h-8 w-8"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>

      {!isCurrentMonth && (
        <Button
          variant="outline"
          size="sm"
          onClick={handleCurrentMonth}
          className="ml-2 text-xs"
        >
          Mês Atual
        </Button>
      )}
    </div>
  );
}
