export interface Categoria {
  idCategoria: number;
  nomeCategoria: string;
  tipoCategoria: 'RECEITA' | 'DESPESA';
}

export interface Subcategoria {
  idSubcategoria: number;
  nomeSubcat: string;
}

export interface Receita {
  idReceita: number;
  descricao: string;
  valor: number;
  dataEntrada: string; // formato ISO: "YYYY-MM-DD"
  recorrente: number; // 0 ou 1
  pendente: number; // 0 ou 1
  categoria?: Categoria;
  subcategoria?: Subcategoria;
  criadoEm: string;
}

export interface ReceitaCreateRequest {
  descricao: string;
  valor: number;
  dataEntrada: string;
  recorrente?: number;
  pendente?: number;
  idCategoria?: number;
  idSubcategoria?: number;
}

export interface ReceitaUpdateRequest extends ReceitaCreateRequest {
  idReceita: number;
}

