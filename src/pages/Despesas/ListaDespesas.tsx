import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../../components/Layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/Card/Card';
import { Button } from '../../components/Button/Button';
import { Input } from '../../components/Input/Input';
import { DataTable } from '../../components/DataTable/DataTable';
import { RowActions } from '../../components/DataTable/RowActions';
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
  const [filteredDespesas, setFilteredDespesas] = useState<Despesa[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filtros
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [categoriaId, setCategoriaId] = useState<string>('');
  const [statusPendente, setStatusPendente] = useState<string>('todas');
  
  // Paginação
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    carregarDados();
  }, []);

  useEffect(() => {
    aplicarFiltros();
  }, [despesas, dataInicio, dataFim, categoriaId, statusPendente]);

  const carregarDados = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [despesasData, categoriasData] = await Promise.all([
        despesaService.listarTodas(),
        categoriaService.listarPorTipo('DESPESA'),
      ]);
      setDespesas(despesasData);
      setCategorias(categoriasData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar despesas');
    } finally {
      setIsLoading(false);
    }
  };

  const aplicarFiltros = () => {
    let filtered = [...despesas];

    // Filtro por período
    if (dataInicio) {
      filtered = filtered.filter((d) => d.dataVencimento >= dataInicio);
    }
    if (dataFim) {
      filtered = filtered.filter((d) => d.dataVencimento <= dataFim);
    }

    // Filtro por categoria
    if (categoriaId) {
      filtered = filtered.filter(
        (d) => d.categoria?.idCategoria === Number(categoriaId)
      );
    }

    // Filtro por status pendente
    if (statusPendente === 'pendentes') {
      filtered = filtered.filter((d) => d.pendente === 1);
    } else if (statusPendente === 'pagas') {
      filtered = filtered.filter((d) => d.pendente === 0);
    }

    // Ordenar por data mais recente
    filtered.sort((a, b) => new Date(b.dataVencimento).getTime() - new Date(a.dataVencimento).getTime());

    setFilteredDespesas(filtered);
    setTotalPages(Math.ceil(filtered.length / ITEMS_PER_PAGE));
    setCurrentPage(1);
  };

  const limparFiltros = () => {
    setDataInicio('');
    setDataFim('');
    setCategoriaId('');
    setStatusPendente('todas');
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
      setDespesas(despesas.filter((d) => d.idDespesa !== id));
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

  // Paginação client-side
  const paginatedDespesas = filteredDespesas.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const totalDespesas = filteredDespesas.reduce((sum, d) => sum + d.valor, 0);

  return (
    <Layout>
      <div className={styles.container}>
        <Card>
          <CardHeader>
            <div className={styles.headerContent}>
              <div>
                <CardTitle>Despesas</CardTitle>
                <p className={styles.subtitle}>
                  {filteredDespesas.length} despesa(s) • Total: {formatCurrency(totalDespesas)}
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
            ) : filteredDespesas.length === 0 ? (
              <div className={styles.empty}>Nenhuma despesa encontrada.</div>
            ) : (
              <>
                <DataTable
                  data={paginatedDespesas}
                  columns={columns}
                  renderActions={renderActions}
                />

                {/* Paginação */}
                {totalPages > 1 && (
                  <div className={styles.pagination}>
                    <button
                      className={styles.paginationButton}
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                    >
                      Anterior
                    </button>
                    <span className={styles.paginationInfo}>
                      Página {currentPage} de {totalPages}
                    </span>
                    <button
                      className={styles.paginationButton}
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                    >
                      Próxima
                    </button>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}

