export type TipoCategoria = 'RECEITA' | 'DESPESA';

export interface Categoria {
  idCategoria: number;
  nomeCategoria: string;
  tipoCategoria: TipoCategoria;
}

export interface Subcategoria {
  idSubcategoria: number;
  nomeSubcat: string;
  categoria?: Categoria;
}

export interface CategoriaComSubcategorias extends Categoria {
  subcategorias?: Subcategoria[];
}

export interface CategoriaCreateRequest {
  nomeCategoria: string;
  tipoCategoria: TipoCategoria;
}

export interface CategoriaUpdateRequest {
  idCategoria: number;
  nomeCategoria: string;
  tipoCategoria: TipoCategoria;
}

export interface SubcategoriaCreateRequest {
  nomeSubcat: string;
  idCategoria: number;
}

export interface SubcategoriaUpdateRequest {
  idSubcategoria: number;
  nomeSubcat: string;
  idCategoria: number;
}

