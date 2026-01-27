import { useState } from 'react';
import { CalendarIcon, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';

export interface DateRange {
  startDate: Date | undefined;
  endDate: Date | undefined;
}

interface DateRangeFilterProps {
  dateRange: DateRange;
  onDateRangeChange: (range: DateRange) => void;
}

export function DateRangeFilter({ dateRange, onDateRangeChange }: DateRangeFilterProps) {
  const [startOpen, setStartOpen] = useState(false);
  const [endOpen, setEndOpen] = useState(false);

  const handleClear = () => {
    onDateRangeChange({ startDate: undefined, endDate: undefined });
  };

  const hasFilter = dateRange.startDate || dateRange.endDate;

  return (
    <div className="flex flex-wrap items-center gap-2 p-2 bg-secondary/50 rounded-xl">
      <div className="flex items-center gap-2">
        <Popover open={startOpen} onOpenChange={setStartOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className={cn(
                "justify-start text-left font-normal min-w-[140px]",
                !dateRange.startDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateRange.startDate ? (
                format(dateRange.startDate, "dd/MM/yyyy", { locale: ptBR })
              ) : (
                <span>Data inicial</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={dateRange.startDate}
              onSelect={(date) => {
                onDateRangeChange({ ...dateRange, startDate: date });
                setStartOpen(false);
              }}
              initialFocus
              className={cn("p-3 pointer-events-auto")}
              locale={ptBR}
            />
          </PopoverContent>
        </Popover>

        <span className="text-muted-foreground text-sm">até</span>

        <Popover open={endOpen} onOpenChange={setEndOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className={cn(
                "justify-start text-left font-normal min-w-[140px]",
                !dateRange.endDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateRange.endDate ? (
                format(dateRange.endDate, "dd/MM/yyyy", { locale: ptBR })
              ) : (
                <span>Data final</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={dateRange.endDate}
              onSelect={(date) => {
                onDateRangeChange({ ...dateRange, endDate: date });
                setEndOpen(false);
              }}
              disabled={(date) => 
                dateRange.startDate ? date < dateRange.startDate : false
              }
              initialFocus
              className={cn("p-3 pointer-events-auto")}
              locale={ptBR}
            />
          </PopoverContent>
        </Popover>
      </div>

      {hasFilter && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClear}
          className="h-8 px-2 text-muted-foreground hover:text-foreground"
        >
          <X className="h-4 w-4 mr-1" />
          Limpar
        </Button>
      )}
    </div>
  );
}
