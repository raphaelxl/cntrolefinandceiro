-- Keep goals.accumulated_value consistent with goal_contributions
CREATE OR REPLACE FUNCTION public.recalculate_goal_accumulated_value(target_goal_id UUID)
RETURNS VOID
SECURITY DEFINER AS $$
BEGIN
  UPDATE public.goals
  SET accumulated_value = COALESCE(
    (SELECT SUM(value) FROM public.goal_contributions WHERE goal_id = target_goal_id),
    0
  )
  WHERE id = target_goal_id;
END;
$$ LANGUAGE plpgsql SET search_path = public, pg_temp;

CREATE OR REPLACE FUNCTION public.sync_goal_accumulated_value()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    PERFORM public.recalculate_goal_accumulated_value(OLD.goal_id);
    RETURN NULL;
  END IF;

  IF TG_OP = 'UPDATE' AND OLD.goal_id IS DISTINCT FROM NEW.goal_id THEN
    PERFORM public.recalculate_goal_accumulated_value(OLD.goal_id);
  END IF;

  PERFORM public.recalculate_goal_accumulated_value(NEW.goal_id);
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SET search_path = public;

DROP TRIGGER IF EXISTS sync_goal_accumulated_value_on_insert ON public.goal_contributions;
DROP TRIGGER IF EXISTS sync_goal_accumulated_value_on_update ON public.goal_contributions;
DROP TRIGGER IF EXISTS sync_goal_accumulated_value_on_delete ON public.goal_contributions;

CREATE TRIGGER sync_goal_accumulated_value_on_insert
AFTER INSERT ON public.goal_contributions
FOR EACH ROW EXECUTE FUNCTION public.sync_goal_accumulated_value();

CREATE TRIGGER sync_goal_accumulated_value_on_update
AFTER UPDATE ON public.goal_contributions
FOR EACH ROW EXECUTE FUNCTION public.sync_goal_accumulated_value();

CREATE TRIGGER sync_goal_accumulated_value_on_delete
AFTER DELETE ON public.goal_contributions
FOR EACH ROW EXECUTE FUNCTION public.sync_goal_accumulated_value();
