-- Add new columns to goals table
ALTER TABLE public.goals 
ADD COLUMN IF NOT EXISTS name TEXT,
ADD COLUMN IF NOT EXISTS start_date DATE DEFAULT CURRENT_DATE,
ADD COLUMN IF NOT EXISTS end_date DATE,
ADD COLUMN IF NOT EXISTS accumulated_value NUMERIC DEFAULT 0;

-- Create table for goal contributions (manual deposits and linked incomes)
CREATE TABLE public.goal_contributions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  goal_id UUID NOT NULL REFERENCES public.goals(id) ON DELETE CASCADE,
  income_id UUID REFERENCES public.incomes(id) ON DELETE SET NULL,
  value NUMERIC NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.goal_contributions ENABLE ROW LEVEL SECURITY;

-- Create policies for goal_contributions
CREATE POLICY "Users can view their own goal contributions" 
ON public.goal_contributions 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own goal contributions" 
ON public.goal_contributions 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own goal contributions" 
ON public.goal_contributions 
FOR DELETE 
USING (auth.uid() = user_id);