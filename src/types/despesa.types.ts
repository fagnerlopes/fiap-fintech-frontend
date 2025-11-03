import type { Categoria, Subcategoria } from './receita.types';

export interface Despesa {
  idDespesa: number;
  descricao: string;
  valor: number;
  dataVencimento: string; // formato ISO: "YYYY-MM-DD"
  recorrente: number; // 0 ou 1
  pendente: number; // 0 ou 1
  categoria?: Categoria;
  subcategoria?: Subcategoria;
  criadoEm: string;
}

export interface DespesaCreateRequest {
  descricao: string;
  valor: number;
  dataVencimento: string;
  recorrente?: number;
  pendente?: number;
  idCategoria?: number;
  idSubcategoria?: number;
}

export interface DespesaUpdateRequest extends DespesaCreateRequest {
  idDespesa: number;
}

