import { httpClient } from './httpClient';
import type { Receita, ReceitaCreateRequest, ReceitaUpdateRequest } from '../types/receita.types';

export const receitaService = {
  /**
   * Lista todas as receitas do usuário autenticado
   */
  async listarTodas(): Promise<Receita[]> {
    return httpClient.get<Receita[]>('/receitas', true);
  },

  /**
   * Busca uma receita por ID
   */
  async buscarPorId(id: number): Promise<Receita> {
    return httpClient.get<Receita>(`/receitas/${id}`, true);
  },

  /**
   * Lista receitas por período
   */
  async listarPorPeriodo(dataInicio: string, dataFim: string): Promise<Receita[]> {
    return httpClient.get<Receita[]>(
      `/receitas/periodo?dataInicio=${dataInicio}&dataFim=${dataFim}`,
      true
    );
  },

  /**
   * Lista receitas pendentes
   */
  async listarPendentes(): Promise<Receita[]> {
    return httpClient.get<Receita[]>('/receitas/pendentes', true);
  },

  /**
   * Cria uma nova receita
   */
  async criar(data: ReceitaCreateRequest): Promise<Receita> {
    return httpClient.post<Receita>('/receitas', data, true);
  },

  /**
   * Atualiza uma receita existente
   */
  async atualizar(id: number, data: ReceitaUpdateRequest): Promise<Receita> {
    return httpClient.put<Receita>(`/receitas/${id}`, data, true);
  },

  /**
   * Deleta uma receita
   */
  async deletar(id: number): Promise<void> {
    return httpClient.delete<void>(`/receitas/${id}`, true);
  },
};

