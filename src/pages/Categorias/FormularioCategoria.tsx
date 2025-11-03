import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Layout } from '../../components/Layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/Card/Card';
import { Button } from '../../components/Button/Button';
import { Input } from '../../components/Input/Input';
import { SubcategoriaList } from '../../components/SubcategoriaList/SubcategoriaList';
import type { TipoCategoria } from '../../types/categoria.types';
import { categoriaService } from '../../services/categoria.service';
import { AlertCircle } from 'lucide-react';
import styles from './FormularioCategoria.module.css';

export function FormularioCategoria() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;

  const [nomeCategoria, setNomeCategoria] = useState('');
  const [tipoCategoria, setTipoCategoria] = useState<TipoCategoria>('RECEITA');
  const [idCategoria, setIdCategoria] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isEditMode && id) {
      carregarCategoria(Number(id));
    }
  }, [isEditMode, id]);

  const carregarCategoria = async (categoriaId: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const categoria = await categoriaService.buscarPorId(categoriaId);
      setNomeCategoria(categoria.nomeCategoria);
      setTipoCategoria(categoria.tipoCategoria);
      setIdCategoria(categoria.idCategoria);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar categoria');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!nomeCategoria.trim()) {
      setError('O nome da categoria é obrigatório');
      return;
    }

    setIsLoading(true);

    try {
      if (isEditMode && id) {
        await categoriaService.atualizar(Number(id), {
          idCategoria: Number(id),
          nomeCategoria: nomeCategoria.trim(),
          tipoCategoria,
        });
      } else {
        const novaCategoria = await categoriaService.criar({
          nomeCategoria: nomeCategoria.trim(),
          tipoCategoria,
        });
        setIdCategoria(novaCategoria.idCategoria);
        
        // Após criar, redireciona para edição para poder adicionar subcategorias
        navigate(`/categorias/${novaCategoria.idCategoria}/editar`, { replace: true });
        return;
      }

      navigate('/categorias');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar categoria');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelar = () => {
    navigate('/categorias');
  };

  return (
    <Layout>
      <div className={styles.container}>
        <Card>
          <CardHeader>
            <CardTitle>
              {isEditMode ? 'Editar Categoria' : 'Nova Categoria'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className={styles.form}>
              {error && (
                <div className={styles.error}>
                  <AlertCircle size={20} />
                  <span>{error}</span>
                </div>
              )}

              <div className={styles.formGroup}>
                <Input
                  label="Nome da Categoria"
                  type="text"
                  value={nomeCategoria}
                  onChange={(e) => setNomeCategoria(e.target.value)}
                  placeholder="Ex: Alimentação, Salário, etc."
                  required
                  disabled={isLoading}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>
                  Tipo de Categoria <span className={styles.required}>*</span>
                </label>
                <div className={styles.radioGroup}>
                  <label className={styles.radioLabel}>
                    <input
                      type="radio"
                      name="tipoCategoria"
                      value="RECEITA"
                      checked={tipoCategoria === 'RECEITA'}
                      onChange={(e) => setTipoCategoria(e.target.value as TipoCategoria)}
                      disabled={isLoading}
                    />
                    <span>Receita</span>
                  </label>
                  <label className={styles.radioLabel}>
                    <input
                      type="radio"
                      name="tipoCategoria"
                      value="DESPESA"
                      checked={tipoCategoria === 'DESPESA'}
                      onChange={(e) => setTipoCategoria(e.target.value as TipoCategoria)}
                      disabled={isLoading}
                    />
                    <span>Despesa</span>
                  </label>
                </div>
              </div>

              <div className={styles.actions}>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancelar}
                  disabled={isLoading}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'Salvando...' : isEditMode ? 'Atualizar' : 'Criar Categoria'}
                </Button>
              </div>
            </form>

            {/* Subcategorias - só aparece após salvar a categoria */}
            {isEditMode && idCategoria && (
              <SubcategoriaList idCategoria={idCategoria} />
            )}

            {!isEditMode && (
              <div className={styles.info}>
                💡 Após criar a categoria, você poderá adicionar subcategorias.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}

