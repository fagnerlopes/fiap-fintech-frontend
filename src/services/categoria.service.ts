import { httpClient } from './httpClient';
import type {
  Categoria,
  CategoriaCreateRequest,
  CategoriaUpdateRequest,
  TipoCategoria,
} from '../types/categoria.types';

export const categoriaService = {
  async listarTodas(): Promise<Categoria[]> {
    return httpClient.get<Categoria[]>('/categorias', true);
  },

  async listarPorTipo(tipo: TipoCategoria): Promise<Categoria[]> {
    return httpClient.get<Categoria[]>(`/categorias/tipo/${tipo}`, true);
  },

  async buscarPorId(id: number): Promise<Categoria> {
    return httpClient.get<Categoria>(`/categorias/${id}`, true);
  },

  async criar(data: CategoriaCreateRequest): Promise<Categoria> {
    return httpClient.post<Categoria>('/categorias', data, true);
  },

  async atualizar(id: number, data: CategoriaUpdateRequest): Promise<Categoria> {
    return httpClient.put<Categoria>(`/categorias/${id}`, data, true);
  },

  async deletar(id: number): Promise<void> {
    return httpClient.delete<void>(`/categorias/${id}`, true);
  },
};

