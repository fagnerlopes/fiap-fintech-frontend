import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../../components/Layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/Card/Card';
import { Button } from '../../components/Button/Button';
import { Input } from '../../components/Input/Input';
import { DataTable } from '../../components/DataTable/DataTable';
import { RowActions } from '../../components/DataTable/RowActions';
import { Pagination } from '../../components/Pagination/Pagination';
import type { Action } from '../../components/DataTable/RowActions';
import type { Column } from '../../types/table.types';
import type { Despesa } from '../../types/despesa.types';
import type { Categoria } from '../../types/categoria.types';
import { despesaService } from '../../services/despesa.service';
import { categoriaService } from '../../services/categoria.service';
import { AlertCircle, Plus, Edit2, Trash2, Filter } from 'lucide-react';
import styles from './ListaDespesas.module.css';

const ITEMS_PER_PAGE = 20;

export function ListaDespesas() {
  const navigate = useNavigate();
  const [despesas, setDespesas] = useState<Despesa[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filtros
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [categoriaId, setCategoriaId] = useState<string>('');
  const [statusPendente, setStatusPendente] = useState<string>('todas');
  
  // Paginação (state do backend)
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  // Carregar categorias apenas uma vez
  useEffect(() => {
    carregarCategorias();
  }, []);

  // Carregar despesas sempre que filtros ou página mudarem
  useEffect(() => {
    carregarDespesas();
  }, [currentPage, dataInicio, dataFim, categoriaId, statusPendente]);

  const carregarCategorias = async () => {
    try {
      const data = await categoriaService.listarPorTipo('DESPESA');
      setCategorias(data);
    } catch (err) {
      console.error('Erro ao carregar categorias:', err);
    }
  };

  const carregarDespesas = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params: {
        dataInicio?: string;
        dataFim?: string;
        idCategoria?: number;
        pendente?: number;
        page: number;
        size: number;
      } = {
        page: currentPage,
        size: ITEMS_PER_PAGE,
      };

      if (dataInicio) params.dataInicio = dataInicio;
      if (dataFim) params.dataFim = dataFim;
      if (categoriaId) params.idCategoria = Number(categoriaId);
      if (statusPendente === 'pendentes') params.pendente = 1;
      if (statusPendente === 'pagas') params.pendente = 0;

      const response = await despesaService.listarComFiltros(params);
      
      setDespesas(response.content);
      setTotalPages(response.totalPages);
      setTotalElements(response.totalElements);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar despesas');
      setDespesas([]);
      setTotalPages(0);
      setTotalElements(0);
    } finally {
      setIsLoading(false);
    }
  };

  const limparFiltros = () => {
    setDataInicio('');
    setDataFim('');
    setCategoriaId('');
    setStatusPendente('todas');
    setCurrentPage(0);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleEditar = (id: number) => {
    navigate(`/despesas/${id}/editar`);
  };

  const handleExcluir = async (id: number) => {
    const despesa = despesas.find((d) => d.idDespesa === id);
    if (!despesa) return;

    if (!confirm(`Tem certeza que deseja excluir a despesa "${despesa.descricao}"?`)) {
      return;
    }

    try {
      await despesaService.deletar(id);
      // Recarregar a página atual após exclusão
      carregarDespesas();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao excluir despesa');
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const columns: Column<Despesa>[] = [
    {
      key: 'dataVencimento',
      header: 'Vencimento',
      render: (despesa) => formatDate(despesa.dataVencimento),
    },
    {
      key: 'descricao',
      header: 'Descrição',
      render: (despesa) => despesa.descricao,
    },
    {
      key: 'valor',
      header: 'Valor',
      render: (despesa) => (
        <span className={styles.valorNegativo}>{formatCurrency(despesa.valor)}</span>
      ),
    },
    {
      key: 'categoria',
      header: 'Categoria',
      render: (despesa) => despesa.categoria?.nomeCategoria || '-',
    },
    {
      key: 'subcategoria',
      header: 'Subcategoria',
      render: (despesa) => despesa.subcategoria?.nomeSubcat || '-',
    },
    {
      key: 'pendente',
      header: 'Status',
      render: (despesa) => (
        <span className={despesa.pendente === 1 ? styles.badgePendente : styles.badgePaga}>
          {despesa.pendente === 1 ? 'Pendente' : 'Paga'}
        </span>
      ),
    },
  ];

  const renderActions = (despesa: Despesa) => {
    const actions: Action[] = [
      {
        label: 'Editar',
        icon: <Edit2 size={16} />,
        onClick: () => handleEditar(despesa.idDespesa),
      },
      {
        label: 'Excluir',
        icon: <Trash2 size={16} />,
        onClick: () => handleExcluir(despesa.idDespesa),
        variant: 'destructive',
      },
    ];

    return <RowActions actions={actions} />;
  };

  const totalDespesas = despesas.reduce((sum, d) => sum + d.valor, 0);

  return (
    <Layout>
      <div className={styles.container}>
        <Card>
          <CardHeader>
            <div className={styles.headerContent}>
              <div>
                <CardTitle>Despesas</CardTitle>
                <p className={styles.subtitle}>
                  {totalElements} despesa(s) • Total da página: {formatCurrency(totalDespesas)}
                </p>
              </div>
              <Button onClick={() => navigate('/despesas/nova')}>
                <Plus size={16} />
                Nova Despesa
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* Filtros */}
            <div className={styles.filters}>
              <div className={styles.filterHeader}>
                <h3>
                  <Filter size={18} />
                  Filtros
                </h3>
                <button className={styles.clearButton} onClick={limparFiltros}>
                  Limpar filtros
                </button>
              </div>

              <div className={styles.filterGrid}>
                <div className={styles.filterGroup}>
                  <label className={styles.filterLabel}>Data Início:</label>
                  <Input
                    type="date"
                    value={dataInicio}
                    onChange={(e) => setDataInicio(e.target.value)}
                  />
                </div>

                <div className={styles.filterGroup}>
                  <label className={styles.filterLabel}>Data Fim:</label>
                  <Input
                    type="date"
                    value={dataFim}
                    onChange={(e) => setDataFim(e.target.value)}
                  />
                </div>

                <div className={styles.filterGroup}>
                  <label className={styles.filterLabel}>Categoria:</label>
                  <select
                    className={styles.select}
                    value={categoriaId}
                    onChange={(e) => setCategoriaId(e.target.value)}
                  >
                    <option value="">Todas</option>
                    {categorias.map((cat) => (
                      <option key={cat.idCategoria} value={cat.idCategoria}>
                        {cat.nomeCategoria}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={styles.filterGroup}>
                  <label className={styles.filterLabel}>Status:</label>
                  <select
                    className={styles.select}
                    value={statusPendente}
                    onChange={(e) => setStatusPendente(e.target.value)}
                  >
                    <option value="todas">Todas</option>
                    <option value="pagas">Pagas</option>
                    <option value="pendentes">Pendentes</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Conteúdo */}
            {error && (
              <div className={styles.error}>
                <AlertCircle size={20} />
                <span>{error}</span>
              </div>
            )}

            {isLoading ? (
              <div className={styles.loading}>Carregando despesas...</div>
            ) : despesas.length === 0 ? (
              <div className={styles.empty}>Nenhuma despesa encontrada.</div>
            ) : (
              <>
                <DataTable
                  data={despesas}
                  columns={columns}
                  renderActions={renderActions}
                />

                {/* Paginação */}
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalElements={totalElements}
                  pageSize={ITEMS_PER_PAGE}
                  onPageChange={handlePageChange}
                />
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}

