// Goal categories and subcategories
export const goalCategories: Record<string, string[]> = {
  Economia: ['Reserva de emergência', 'Guardar dinheiro', 'Bens'],
  Casa: ['Reforma', 'Comprar casa'],
  Veículos: ['Carro', 'Moto'],
  Viagem: ['Viagem nacional', 'Viagem internacional'],
  Educação: ['Cursos', 'Faculdade'],
  Investimentos: ['Ações', 'Criptomoedas'],
  'Quitar Dívidas': ['Cartão de crédito', 'Empréstimos'],
  Outros: ['Outros'],
};

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

export function getSubcategories(type: 'income' | 'debt' | 'goal', category: string): string[] {
  const categoriesMap = {
    income: incomeCategories,
    debt: debtCategories,
    goal: goalCategories,
  };
  const categories = categoriesMap[type];
  return categories[category] || [];
}

export function getCategoryList(type: 'income' | 'debt' | 'goal'): string[] {
  const categoriesMap = {
    income: incomeCategories,
    debt: debtCategories,
    goal: goalCategories,
  };
  const categories = categoriesMap[type];
  return Object.keys(categories);
}

export function isValidCategory(type: 'income' | 'debt' | 'goal', category: string): boolean {
  const categoriesMap = {
    income: incomeCategories,
    debt: debtCategories,
    goal: goalCategories,
  };
  const categories = categoriesMap[type];
  return category in categories;
}
