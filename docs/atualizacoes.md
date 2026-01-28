# Atualizações sugeridas

## 1) Atualização prioritária (com script)

**Objetivo:** manter `goals.accumulated_value` sempre consistente com as contribuições registradas em `goal_contributions`.

**Script:** `supabase/migrations/20260201090000_recalculate_goal_accumulated_value.sql`

O script cria funções e triggers que recalculam o valor acumulado após inserções, atualizações e exclusões de contribuições.

## Demais atualizações — ordenadas por impacto

1. **Adicionar políticas de UPDATE nas tabelas com RLS** (`incomes`, `debts`, `goals`, `goal_contributions`).
2. **Criar índices para consultas por usuário e datas** (ex.: `incomes(user_id, date)`, `debts(user_id, due_date)`, `goal_contributions(goal_id, created_at)`).
3. **Aplicar `CHECK` constraints para valores numéricos não-negativos** (ex.: `value >= 0`, `interest >= 0`, `installments >= 0`).
4. **Adicionar coluna `updated_at` nas tabelas financeiras** e triggers de atualização automática.

## Demais atualizações — ordenadas por importância

1. **Adicionar políticas de UPDATE nas tabelas com RLS** (`incomes`, `debts`, `goals`, `goal_contributions`).
2. **Aplicar `CHECK` constraints para valores numéricos não-negativos** (ex.: `value >= 0`, `interest >= 0`, `installments >= 0`).
3. **Adicionar coluna `updated_at` nas tabelas financeiras** e triggers de atualização automática.
4. **Criar índices para consultas por usuário e datas** (ex.: `incomes(user_id, date)`, `debts(user_id, due_date)`, `goal_contributions(goal_id, created_at)`).
