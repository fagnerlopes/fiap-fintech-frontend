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
  const [filteredReceitas, setFilteredReceitas] = useState<Receita[]>([]);
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
  }, [receitas, dataInicio, dataFim, categoriaId, statusPendente]);

  const carregarDados = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [receitasData, categoriasData] = await Promise.all([
        receitaService.listarTodas(),
        categoriaService.listarPorTipo('RECEITA'),
      ]);
      setReceitas(receitasData);
      setCategorias(categoriasData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar receitas');
    } finally {
      setIsLoading(false);
    }
  };

  const aplicarFiltros = () => {
    let filtered = [...receitas];

    // Filtro por período
    if (dataInicio) {
      filtered = filtered.filter((r) => r.dataEntrada >= dataInicio);
    }
    if (dataFim) {
      filtered = filtered.filter((r) => r.dataEntrada <= dataFim);
    }

    // Filtro por categoria
    if (categoriaId) {
      filtered = filtered.filter(
        (r) => r.categoria?.idCategoria === Number(categoriaId)
      );
    }

    // Filtro por status pendente
    if (statusPendente === 'pendentes') {
      filtered = filtered.filter((r) => r.pendente === 1);
    } else if (statusPendente === 'recebidas') {
      filtered = filtered.filter((r) => r.pendente === 0);
    }

    // Ordenar por data mais recente
    filtered.sort((a, b) => new Date(b.dataEntrada).getTime() - new Date(a.dataEntrada).getTime());

    setFilteredReceitas(filtered);
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
      setReceitas(receitas.filter((r) => r.idReceita !== id));
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

  // Paginação client-side
  const paginatedReceitas = filteredReceitas.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const totalReceitas = filteredReceitas.reduce((sum, r) => sum + r.valor, 0);

  return (
    <Layout>
      <div className={styles.container}>
        <Card>
          <CardHeader>
            <div className={styles.headerContent}>
              <div>
                <CardTitle>Receitas</CardTitle>
                <p className={styles.subtitle}>
                  {filteredReceitas.length} receita(s) • Total: {formatCurrency(totalReceitas)}
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
            ) : filteredReceitas.length === 0 ? (
              <div className={styles.empty}>Nenhuma receita encontrada.</div>
            ) : (
              <>
                <DataTable
                  data={paginatedReceitas}
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

