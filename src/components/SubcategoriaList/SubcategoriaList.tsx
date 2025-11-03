import { useState, useEffect } from 'react';
import type { Subcategoria } from '../../types/categoria.types';
import { subcategoriaService } from '../../services/subcategoria.service';
import { Button } from '../Button/Button';
import { Input } from '../Input/Input';
import { Edit2, Trash2, Plus, X, Check } from 'lucide-react';
import styles from './SubcategoriaList.module.css';

interface SubcategoriaListProps {
  idCategoria: number | null;
}

export function SubcategoriaList({ idCategoria }: SubcategoriaListProps) {
  const [subcategorias, setSubcategorias] = useState<Subcategoria[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [nomeSubcat, setNomeSubcat] = useState('');

  useEffect(() => {
    if (idCategoria) {
      carregarSubcategorias();
    }
  }, [idCategoria]);

  const carregarSubcategorias = async () => {
    if (!idCategoria) return;

    setIsLoading(true);
    setError(null);
    try {
      const data = await subcategoriaService.listarPorCategoria(idCategoria);
      setSubcategorias(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar subcategorias');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdicionar = async () => {
    if (!idCategoria || !nomeSubcat.trim()) return;

    try {
      const novaSubcategoria = await subcategoriaService.criar({
        nomeSubcat: nomeSubcat.trim(),
        idCategoria,
      });
      setSubcategorias([...subcategorias, novaSubcategoria]);
      setNomeSubcat('');
      setIsAdding(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao adicionar subcategoria');
    }
  };

  const handleEditar = async (id: number) => {
    if (!idCategoria || !nomeSubcat.trim()) return;

    try {
      const subcategoriaAtualizada = await subcategoriaService.atualizar(id, {
        idSubcategoria: id,
        nomeSubcat: nomeSubcat.trim(),
        idCategoria,
      });
      setSubcategorias(
        subcategorias.map((sub) =>
          sub.idSubcategoria === id ? subcategoriaAtualizada : sub
        )
      );
      setNomeSubcat('');
      setEditingId(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao editar subcategoria');
    }
  };

  const handleDeletar = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir esta subcategoria?')) return;

    try {
      await subcategoriaService.deletar(id);
      setSubcategorias(subcategorias.filter((sub) => sub.idSubcategoria !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao deletar subcategoria');
    }
  };

  const iniciarEdicao = (subcategoria: Subcategoria) => {
    setEditingId(subcategoria.idSubcategoria);
    setNomeSubcat(subcategoria.nomeSubcat);
    setIsAdding(false);
  };

  const cancelarEdicao = () => {
    setEditingId(null);
    setNomeSubcat('');
  };

  const cancelarAdicao = () => {
    setIsAdding(false);
    setNomeSubcat('');
  };

  if (!idCategoria) {
    return (
      <div className={styles.container}>
        <div className={styles.info}>
          Salve a categoria primeiro para adicionar subcategorias.
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3>Subcategorias</h3>
        {!isAdding && !editingId && (
          <Button
            variant="outline"
            onClick={() => setIsAdding(true)}
            disabled={isLoading}
          >
            <Plus size={16} />
            Adicionar
          </Button>
        )}
      </div>

      {error && (
        <div className={styles.error}>
          {error}
        </div>
      )}

      {isLoading ? (
        <div className={styles.loading}>Carregando subcategorias...</div>
      ) : (
        <div className={styles.list}>
          {subcategorias.map((subcategoria) => (
            <div key={subcategoria.idSubcategoria} className={styles.item}>
              {editingId === subcategoria.idSubcategoria ? (
                <div className={styles.editForm}>
                  <Input
                    type="text"
                    value={nomeSubcat}
                    onChange={(e) => setNomeSubcat(e.target.value)}
                    placeholder="Nome da subcategoria"
                  />
                  <div className={styles.actions}>
                    <button
                      className={styles.iconButton}
                      onClick={() => handleEditar(subcategoria.idSubcategoria)}
                      title="Salvar"
                    >
                      <Check size={16} />
                    </button>
                    <button
                      className={styles.iconButton}
                      onClick={cancelarEdicao}
                      title="Cancelar"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <span className={styles.name}>{subcategoria.nomeSubcat}</span>
                  <div className={styles.actions}>
                    <button
                      className={styles.iconButton}
                      onClick={() => iniciarEdicao(subcategoria)}
                      title="Editar"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      className={styles.iconButton}
                      onClick={() => handleDeletar(subcategoria.idSubcategoria)}
                      title="Excluir"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}

          {isAdding && (
            <div className={styles.item}>
              <div className={styles.editForm}>
                <Input
                  type="text"
                  value={nomeSubcat}
                  onChange={(e) => setNomeSubcat(e.target.value)}
                  placeholder="Nome da nova subcategoria"
                />
                <div className={styles.actions}>
                  <button
                    className={styles.iconButton}
                    onClick={handleAdicionar}
                    title="Adicionar"
                  >
                    <Check size={16} />
                  </button>
                  <button
                    className={styles.iconButton}
                    onClick={cancelarAdicao}
                    title="Cancelar"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {subcategorias.length === 0 && !isAdding && (
            <div className={styles.empty}>
              Nenhuma subcategoria cadastrada.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

