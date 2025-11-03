import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Layout } from '../../components/Layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/Card/Card';
import { Button } from '../../components/Button/Button';
import { Input } from '../../components/Input/Input';
import type { Categoria, Subcategoria } from '../../types/categoria.types';
import { receitaService } from '../../services/receita.service';
import { categoriaService } from '../../services/categoria.service';
import { subcategoriaService } from '../../services/subcategoria.service';
import { AlertCircle } from 'lucide-react';
import styles from './FormularioReceita.module.css';

export function FormularioReceita() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;

  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState('');
  const [dataEntrada, setDataEntrada] = useState('');
  const [recorrente, setRecorrente] = useState(false);
  const [pendente, setPendente] = useState(false);
  const [categoriaId, setCategoriaId] = useState<string>('');
  const [subcategoriaId, setSubcategoriaId] = useState<string>('');

  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [subcategorias, setSubcategorias] = useState<Subcategoria[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    carregarCategorias();
    if (isEditMode && id) {
      carregarReceita(Number(id));
    }
  }, [isEditMode, id]);

  useEffect(() => {
    if (categoriaId) {
      carregarSubcategorias(Number(categoriaId));
    } else {
      setSubcategorias([]);
      setSubcategoriaId('');
    }
  }, [categoriaId]);

  const carregarCategorias = async () => {
    try {
      const data = await categoriaService.listarPorTipo('RECEITA');
      setCategorias(data);
    } catch (err) {
      console.error('Erro ao carregar categorias:', err);
    }
  };

  const carregarSubcategorias = async (idCategoria: number) => {
    try {
      const data = await subcategoriaService.listarPorCategoria(idCategoria);
      setSubcategorias(data);
    } catch (err) {
      console.error('Erro ao carregar subcategorias:', err);
    }
  };

  const carregarReceita = async (receitaId: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const receita = await receitaService.buscarPorId(receitaId);
      setDescricao(receita.descricao);
      setValor(receita.valor.toString());
      setDataEntrada(receita.dataEntrada);
      setRecorrente(receita.recorrente === 1);
      setPendente(receita.pendente === 1);
      
      if (receita.categoria) {
        setCategoriaId(receita.categoria.idCategoria.toString());
      }
      if (receita.subcategoria) {
        setSubcategoriaId(receita.subcategoria.idSubcategoria.toString());
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar receita');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!descricao.trim()) {
      setError('A descrição é obrigatória');
      return;
    }

    if (!valor || Number(valor) <= 0) {
      setError('O valor deve ser maior que zero');
      return;
    }

    if (!dataEntrada) {
      setError('A data de entrada é obrigatória');
      return;
    }

    setIsLoading(true);

    try {
      const receitaData = {
        descricao: descricao.trim(),
        valor: Number(valor),
        dataEntrada,
        recorrente: recorrente ? 1 : 0,
        pendente: pendente ? 1 : 0,
        idCategoria: categoriaId ? Number(categoriaId) : undefined,
        idSubcategoria: subcategoriaId ? Number(subcategoriaId) : undefined,
      };

      if (isEditMode && id) {
        await receitaService.atualizar(Number(id), {
          ...receitaData,
          idReceita: Number(id),
        });
      } else {
        await receitaService.criar(receitaData);
      }

      navigate('/receitas');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar receita');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelar = () => {
    navigate('/receitas');
  };

  return (
    <Layout>
      <div className={styles.container}>
        <Card>
          <CardHeader>
            <CardTitle>
              {isEditMode ? 'Editar Receita' : 'Nova Receita'}
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

              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <Input
                    label="Descrição"
                    type="text"
                    value={descricao}
                    onChange={(e) => setDescricao(e.target.value)}
                    placeholder="Ex: Salário, Freelance, etc."
                    required
                    disabled={isLoading}
                  />
                </div>

                <div className={styles.formGroup}>
                  <Input
                    label="Valor"
                    type="number"
                    step="0.01"
                    min="0"
                    value={valor}
                    onChange={(e) => setValor(e.target.value)}
                    placeholder="0,00"
                    required
                    disabled={isLoading}
                  />
                </div>

                <div className={styles.formGroup}>
                  <Input
                    label="Data de Entrada"
                    type="date"
                    value={dataEntrada}
                    onChange={(e) => setDataEntrada(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Categoria:</label>
                  <select
                    className={styles.select}
                    value={categoriaId}
                    onChange={(e) => setCategoriaId(e.target.value)}
                    disabled={isLoading}
                  >
                    <option value="">Selecione uma categoria</option>
                    {categorias.map((cat) => (
                      <option key={cat.idCategoria} value={cat.idCategoria}>
                        {cat.nomeCategoria}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Subcategoria:</label>
                  <select
                    className={styles.select}
                    value={subcategoriaId}
                    onChange={(e) => setSubcategoriaId(e.target.value)}
                    disabled={isLoading || !categoriaId || subcategorias.length === 0}
                  >
                    <option value="">Selecione uma subcategoria</option>
                    {subcategorias.map((sub) => (
                      <option key={sub.idSubcategoria} value={sub.idSubcategoria}>
                        {sub.nomeSubcat}
                      </option>
                    ))}
                  </select>
                  {categoriaId && subcategorias.length === 0 && (
                    <span className={styles.hint}>
                      Nenhuma subcategoria disponível para esta categoria
                    </span>
                  )}
                </div>
              </div>

              <div className={styles.checkboxGroup}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={recorrente}
                    onChange={(e) => setRecorrente(e.target.checked)}
                    disabled={isLoading}
                  />
                  <span>Receita recorrente</span>
                </label>

                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={pendente}
                    onChange={(e) => setPendente(e.target.checked)}
                    disabled={isLoading}
                  />
                  <span>Receita pendente (a receber)</span>
                </label>
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
                  {isLoading ? 'Salvando...' : isEditMode ? 'Atualizar' : 'Criar Receita'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}

