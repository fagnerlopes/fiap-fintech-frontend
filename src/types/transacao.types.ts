export interface Transacao {
  id: number;
  tipo: 'RECEITA' | 'DESPESA';
  descricao: string;
  valor: number;
  data: string; // ISO date string
  categoria?: string;
  subcategoria?: string;
}

