import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../../components/Layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/Card/Card';
import { Button } from '../../components/Button/Button';
import { DataTable } from '../../components/DataTable/DataTable';
import { RowActions } from '../../components/DataTable/RowActions';
import type { Action } from '../../components/DataTable/RowActions';
import type { Column } from '../../types/table.types';
import type { Categoria, TipoCategoria } from '../../types/categoria.types';
import { categoriaService } from '../../services/categoria.service';
import { subcategoriaService } from '../../services/subcategoria.service';
import { AlertCircle, Plus, Edit2, Trash2 } from 'lucide-react';
import styles from './ListaCategorias.module.css';

interface CategoriaComContagem extends Categoria {
  qtdSubcategorias: number;
}

export function ListaCategorias() {
  const navigate = useNavigate();
  const [categorias, setCategorias] = useState<CategoriaComContagem[]>([]);
  const [filteredCategorias, setFilteredCategorias] = useState<CategoriaComContagem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filtroTipo, setFiltroTipo] = useState<'TODAS' | TipoCategoria>('TODAS');

  useEffect(() => {
    carregarCategorias();
  }, []);

  useEffect(() => {
    aplicarFiltro();
  }, [categorias, filtroTipo]);

  const carregarCategorias = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await categoriaService.listarTodas();

      // Para cada categoria, buscar a quantidade de subcategorias
      const categoriasComContagem = await Promise.all(
        data.map(async (categoria) => {
          const subcategorias = await subcategoriaService.listarPorCategoria(
            categoria.idCategoria
          );
          return {
            ...categoria,
            qtdSubcategorias: subcategorias.length,
          };
        })
      );

      setCategorias(categoriasComContagem);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar categorias');
    } finally {
      setIsLoading(false);
    }
  };

  const aplicarFiltro = () => {
    if (filtroTipo === 'TODAS') {
      setFilteredCategorias(categorias);
    } else {
      setFilteredCategorias(
        categorias.filter((cat) => cat.tipoCategoria === filtroTipo)
      );
    }
  };

  const handleEditar = (id: number) => {
    navigate(`/categorias/${id}/editar`);
  };

  const handleExcluir = async (id: number) => {
    const categoria = categorias.find((c) => c.idCategoria === id);
    if (!categoria) return;

    if (categoria.qtdSubcategorias > 0) {
      alert(
        'Não é possível excluir uma categoria que possui subcategorias. Exclua as subcategorias primeiro.'
      );
      return;
    }

    if (!confirm(`Tem certeza que deseja excluir a categoria "${categoria.nomeCategoria}"?`)) {
      return;
    }

    try {
      await categoriaService.deletar(id);
      setCategorias(categorias.filter((c) => c.idCategoria !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao excluir categoria');
    }
  };

  const columns: Column<CategoriaComContagem>[] = [
    {
      key: 'nomeCategoria',
      header: 'Nome',
      render: (categoria) => categoria.nomeCategoria,
    },
    {
      key: 'tipoCategoria',
      header: 'Tipo',
      render: (categoria) => (
        <span className={styles[`badge${categoria.tipoCategoria}`]}>
          {categoria.tipoCategoria}
        </span>
      ),
    },
    {
      key: 'qtdSubcategorias',
      header: 'Subcategorias',
      render: (categoria) => categoria.qtdSubcategorias,
    },
  ];

  const renderActions = (categoria: CategoriaComContagem) => {
    const actions: Action[] = [
      {
        label: 'Editar',
        icon: <Edit2 size={16} />,
        onClick: () => handleEditar(categoria.idCategoria),
      },
      {
        label: 'Excluir',
        icon: <Trash2 size={16} />,
        onClick: () => handleExcluir(categoria.idCategoria),
        variant: 'destructive',
      },
    ];

    return <RowActions actions={actions} />;
  };

  return (
    <Layout>
      <div className={styles.container}>
        <Card>
          <CardHeader>
            <div className={styles.headerContent}>
              <CardTitle>Categorias</CardTitle>
              <Button onClick={() => navigate('/categorias/nova')}>
                <Plus size={16} />
                Nova Categoria
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* Filtros */}
            <div className={styles.filters}>
              <div className={styles.filterGroup}>
                <label className={styles.filterLabel}>Filtrar por tipo:</label>
                <div className={styles.filterButtons}>
                  <button
                    className={`${styles.filterButton} ${
                      filtroTipo === 'TODAS' ? styles.active : ''
                    }`}
                    onClick={() => setFiltroTipo('TODAS')}
                  >
                    Todas
                  </button>
                  <button
                    className={`${styles.filterButton} ${
                      filtroTipo === 'RECEITA' ? styles.active : ''
                    }`}
                    onClick={() => setFiltroTipo('RECEITA')}
                  >
                    Receitas
                  </button>
                  <button
                    className={`${styles.filterButton} ${
                      filtroTipo === 'DESPESA' ? styles.active : ''
                    }`}
                    onClick={() => setFiltroTipo('DESPESA')}
                  >
                    Despesas
                  </button>
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
              <div className={styles.loading}>Carregando categorias...</div>
            ) : filteredCategorias.length === 0 ? (
              <div className={styles.empty}>
                {filtroTipo === 'TODAS'
                  ? 'Nenhuma categoria cadastrada.'
                  : `Nenhuma categoria de ${filtroTipo.toLowerCase()} cadastrada.`}
              </div>
            ) : (
              <DataTable
                data={filteredCategorias}
                columns={columns}
                renderActions={renderActions}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}

