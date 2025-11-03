import { httpClient } from './httpClient';
import type { Despesa, DespesaCreateRequest, DespesaUpdateRequest } from '../types/despesa.types';
import type { PageResponse } from '../types/pagination.types';

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

  /**
   * Lista despesas com filtros e paginação
   */
  async listarComFiltros(params: {
    dataInicio?: string;
    dataFim?: string;
    idCategoria?: number;
    pendente?: number;
    page?: number;
    size?: number;
  }): Promise<PageResponse<Despesa>> {
    const queryParams = new URLSearchParams();

    if (params.dataInicio) queryParams.append('dataInicio', params.dataInicio);
    if (params.dataFim) queryParams.append('dataFim', params.dataFim);
    if (params.idCategoria) queryParams.append('idCategoria', params.idCategoria.toString());
    if (params.pendente !== undefined) queryParams.append('pendente', params.pendente.toString());
    if (params.page !== undefined) queryParams.append('page', params.page.toString());
    if (params.size !== undefined) queryParams.append('size', params.size.toString());

    const query = queryParams.toString();
    const endpoint = query ? `/despesas?${query}` : '/despesas';

    return httpClient.get<PageResponse<Despesa>>(endpoint, true);
  },
};

