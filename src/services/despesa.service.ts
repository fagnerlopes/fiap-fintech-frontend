import { httpClient } from './httpClient';
import type { Despesa, DespesaCreateRequest, DespesaUpdateRequest } from '../types/despesa.types';

export const despesaService = {
  /**
   * Lista todas as despesas do usuário autenticado
   */
  async listarTodas(): Promise<Despesa[]> {
    return httpClient.get<Despesa[]>('/despesas', true);
  },

  /**
   * Busca uma despesa por ID
   */
  async buscarPorId(id: number): Promise<Despesa> {
    return httpClient.get<Despesa>(`/despesas/${id}`, true);
  },

  /**
   * Lista despesas por período
   */
  async listarPorPeriodo(dataInicio: string, dataFim: string): Promise<Despesa[]> {
    return httpClient.get<Despesa[]>(
      `/despesas/periodo?dataInicio=${dataInicio}&dataFim=${dataFim}`,
      true
    );
  },

  /**
   * Lista despesas pendentes
   */
  async listarPendentes(): Promise<Despesa[]> {
    return httpClient.get<Despesa[]>('/despesas/pendentes', true);
  },

  /**
   * Cria uma nova despesa
   */
  async criar(data: DespesaCreateRequest): Promise<Despesa> {
    return httpClient.post<Despesa>('/despesas', data, true);
  },

  /**
   * Atualiza uma despesa existente
   */
  async atualizar(id: number, data: DespesaUpdateRequest): Promise<Despesa> {
    return httpClient.put<Despesa>(`/despesas/${id}`, data, true);
  },

  /**
   * Deleta uma despesa
   */
  async deletar(id: number): Promise<void> {
    return httpClient.delete<void>(`/despesas/${id}`, true);
  },
};

