import { httpClient } from './httpClient';
import type {
  Subcategoria,
  SubcategoriaCreateRequest,
  SubcategoriaUpdateRequest,
} from '../types/categoria.types';

export const subcategoriaService = {
  async listarTodas(): Promise<Subcategoria[]> {
    return httpClient.get<Subcategoria[]>('/subcategorias', true);
  },

  async listarPorCategoria(idCategoria: number): Promise<Subcategoria[]> {
    return httpClient.get<Subcategoria[]>(`/subcategorias/categoria/${idCategoria}`, true);
  },

  async buscarPorId(id: number): Promise<Subcategoria> {
    return httpClient.get<Subcategoria>(`/subcategorias/${id}`, true);
  },

  async criar(data: SubcategoriaCreateRequest): Promise<Subcategoria> {
    return httpClient.post<Subcategoria>('/subcategorias', data, true);
  },

  async atualizar(id: number, data: SubcategoriaUpdateRequest): Promise<Subcategoria> {
    return httpClient.put<Subcategoria>(`/subcategorias/${id}`, data, true);
  },

  async deletar(id: number): Promise<void> {
    return httpClient.delete<void>(`/subcategorias/${id}`, true);
  },
};

