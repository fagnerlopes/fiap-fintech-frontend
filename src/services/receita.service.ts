import { httpClient } from './httpClient';
import type { Receita, ReceitaCreateRequest, ReceitaUpdateRequest } from '../types/receita.types';
import type { PageResponse } from '../types/pagination.types';

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

  /**
   * Lista receitas com filtros e paginação
   */
  async listarComFiltros(params: {
    dataInicio?: string;
    dataFim?: string;
    idCategoria?: number;
    pendente?: number;
    page?: number;
    size?: number;
  }): Promise<PageResponse<Receita>> {
    const queryParams = new URLSearchParams();

    if (params.dataInicio) queryParams.append('dataInicio', params.dataInicio);
    if (params.dataFim) queryParams.append('dataFim', params.dataFim);
    if (params.idCategoria) queryParams.append('idCategoria', params.idCategoria.toString());
    if (params.pendente !== undefined) queryParams.append('pendente', params.pendente.toString());
    if (params.page !== undefined) queryParams.append('page', params.page.toString());
    if (params.size !== undefined) queryParams.append('size', params.size.toString());

    const query = queryParams.toString();
    const endpoint = query ? `/receitas?${query}` : '/receitas';

    return httpClient.get<PageResponse<Receita>>(endpoint, true);
  },
};

