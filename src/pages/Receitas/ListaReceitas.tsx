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
import type { Receita } from '../../types/receita.types';
import type { Categoria } from '../../types/categoria.types';
import { receitaService } from '../../services/receita.service';
import { categoriaService } from '../../services/categoria.service';
import { AlertCircle, Plus, Edit2, Trash2, Filter } from 'lucide-react';
import styles from './ListaReceitas.module.css';

const ITEMS_PER_PAGE = 20;

export function ListaReceitas() {
  const navigate = useNavigate();
  const [receitas, setReceitas] = useState<Receita[]>([]);
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

  // Carregar receitas sempre que filtros ou página mudarem
  useEffect(() => {
    carregarReceitas();
  }, [currentPage, dataInicio, dataFim, categoriaId, statusPendente]);

  const carregarCategorias = async () => {
    try {
      const data = await categoriaService.listarPorTipo('RECEITA');
      setCategorias(data);
    } catch (err) {
      console.error('Erro ao carregar categorias:', err);
    }
  };

  const carregarReceitas = async () => {
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
      if (statusPendente === 'recebidas') params.pendente = 0;

      const response = await receitaService.listarComFiltros(params);
      
      setReceitas(response.content);
      setTotalPages(response.totalPages);
      setTotalElements(response.totalElements);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar receitas');
      setReceitas([]);
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
    navigate(`/receitas/${id}/editar`);
  };

  const handleExcluir = async (id: number) => {
    const receita = receitas.find((r) => r.idReceita === id);
    if (!receita) return;

    if (!confirm(`Tem certeza que deseja excluir a receita "${receita.descricao}"?`)) {
      return;
    }

    try {
      await receitaService.deletar(id);
      // Recarregar a página atual após exclusão
      carregarReceitas();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao excluir receita');
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

  const columns: Column<Receita>[] = [
    {
      key: 'dataEntrada',
      header: 'Data',
      render: (receita) => formatDate(receita.dataEntrada),
    },
    {
      key: 'descricao',
      header: 'Descrição',
      render: (receita) => receita.descricao,
    },
    {
      key: 'valor',
      header: 'Valor',
      render: (receita) => (
        <span className={styles.valorPositivo}>{formatCurrency(receita.valor)}</span>
      ),
    },
    {
      key: 'categoria',
      header: 'Categoria',
      render: (receita) => receita.categoria?.nomeCategoria || '-',
    },
    {
      key: 'subcategoria',
      header: 'Subcategoria',
      render: (receita) => receita.subcategoria?.nomeSubcat || '-',
    },
    {
      key: 'pendente',
      header: 'Status',
      render: (receita) => (
        <span className={receita.pendente === 1 ? styles.badgePendente : styles.badgeRecebida}>
          {receita.pendente === 1 ? 'Pendente' : 'Recebida'}
        </span>
      ),
    },
  ];

  const renderActions = (receita: Receita) => {
    const actions: Action[] = [
      {
        label: 'Editar',
        icon: <Edit2 size={16} />,
        onClick: () => handleEditar(receita.idReceita),
      },
      {
        label: 'Excluir',
        icon: <Trash2 size={16} />,
        onClick: () => handleExcluir(receita.idReceita),
        variant: 'destructive',
      },
    ];

    return <RowActions actions={actions} />;
  };

  const totalReceitas = receitas.reduce((sum, r) => sum + r.valor, 0);

  return (
    <Layout>
      <div className={styles.container}>
        <Card>
          <CardHeader>
            <div className={styles.headerContent}>
              <div>
                <CardTitle>Receitas</CardTitle>
                <p className={styles.subtitle}>
                  {totalElements} receita(s) • Total da página: {formatCurrency(totalReceitas)}
                </p>
              </div>
              <Button onClick={() => navigate('/receitas/nova')}>
                <Plus size={16} />
                Nova Receita
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
                    <option value="recebidas">Recebidas</option>
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
              <div className={styles.loading}>Carregando receitas...</div>
            ) : receitas.length === 0 ? (
              <div className={styles.empty}>Nenhuma receita encontrada.</div>
            ) : (
              <>
                <DataTable
                  data={receitas}
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

