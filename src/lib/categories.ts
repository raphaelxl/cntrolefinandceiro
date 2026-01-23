// Income Categories and Subcategories
export const incomeCategories: Record<string, string[]> = {
  'Salário': [
    'Salário mensal',
    'Hora extra',
    'Comissão',
    'Bônus',
    'Participação nos lucros',
  ],
  'Renda Extra': [
    'Freelancer',
    'Serviços autônomos',
    'Trabalhos temporários',
    'Aplicativos',
  ],
  'Negócios': [
    'Faturamento',
    'Lucro mensal',
    'Retirada de sócio',
  ],
  'Investimentos': [
    'Dividendos',
    'Juros',
    'Fundos de investimento',
    'Criptomoedas',
    'Renda fixa',
  ],
  'Vendas': [
    'Venda de produtos',
    'Venda online',
    'Marketplace',
    'Venda de bens usados',
  ],
  'Benefícios': [
    'Vale-alimentação',
    'Vale-refeição',
    'Auxílios',
  ],
  'Reembolsos': [
    'Reembolso médico',
    'Reembolso empresarial',
    'Estorno',
  ],
  'Outros': [
    'Prêmios',
    'Doações',
    'Indenizações',
  ],
};

// Debt Categories and Subcategories
export const debtCategories: Record<string, string[]> = {
  'Moradia': [
    'Aluguel',
    'Financiamento',
    'Condomínio',
    'IPTU',
  ],
  'Contas Fixas': [
    'Água',
    'Luz',
    'Gás',
    'Internet',
    'Telefone',
  ],
  'Alimentação': [
    'Supermercado',
    'Restaurante',
    'Delivery',
    'Lanches',
  ],
  'Transporte': [
    'Combustível',
    'Transporte público',
    'Aplicativos',
    'Manutenção',
    'Seguro',
  ],
  'Cartão de Crédito': [
    'Fatura mensal',
    'Parcelamentos',
    'Juros',
    'Anuidade',
  ],
  'Empréstimos': [
    'Empréstimo pessoal',
    'Financiamento',
    'Parcelas',
    'Juros',
  ],
  'Saúde': [
    'Plano de saúde',
    'Consultas',
    'Medicamentos',
  ],
  'Educação': [
    'Faculdade',
    'Cursos',
    'Material',
  ],
  'Lazer': [
    'Streaming',
    'Viagens',
    'Jogos',
    'Cinema',
  ],
  'Compras': [
    'Roupas',
    'Eletrônicos',
    'Presentes',
  ],
  'Impostos e Taxas': [
    'Imposto de renda',
    'Multas',
    'Tarifas bancárias',
  ],
  'Outros': [
    'Gastos imprevistos',
    'Ajustes',
  ],
};

export const getSubcategories = (
  type: 'income' | 'debt',
  category: string
): string[] => {
  const categories = type === 'income' ? incomeCategories : debtCategories;
  return categories[category] || [];
};

export const getCategoryList = (type: 'income' | 'debt'): string[] => {
  const categories = type === 'income' ? incomeCategories : debtCategories;
  return Object.keys(categories);
};
