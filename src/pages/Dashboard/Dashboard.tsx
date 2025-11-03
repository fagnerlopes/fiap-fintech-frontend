import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, DollarSign, AlertCircle } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { Layout } from '../../components/Layout/Layout';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/Card/Card';
import { receitaService } from '../../services/receita.service';
import { despesaService } from '../../services/despesa.service';
import type { Receita } from '../../types/receita.types';
import type { Despesa } from '../../types/despesa.types';
import styles from './Dashboard.module.css';

export function Dashboard() {
  const { user } = useAuth();
  const [receitas, setReceitas] = useState<Receita[]>([]);
  const [despesas, setDespesas] = useState<Despesa[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const carregarDados = async () => {
      try {
        setIsLoading(true);
        setError('');

        const [receitasData, despesasData] = await Promise.all([
          receitaService.listarTodas(),
          despesaService.listarTodas(),
        ]);

        setReceitas(receitasData);
        setDespesas(despesasData);
      } catch (err) {
        console.error('Erro ao carregar dados:', err);
        setError('Erro ao carregar dados do dashboard');
      } finally {
        setIsLoading(false);
      }
    };

    carregarDados();
  }, []);

  const totalReceitas = receitas.reduce((acc, receita) => acc + receita.valor, 0);

  const totalDespesas = despesas.reduce((acc, despesa) => acc + despesa.valor, 0);

  const saldo = totalReceitas - totalDespesas;

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(valor);
  };

  return (
    <Layout>
      <div className={styles.welcome}>
        <h2>Bem-vindo ao Sistema</h2>
        <p>Olá, {user?.pessoaFisica?.nome || user?.pessoaJuridica?.razaoSocial || user?.email}!</p>
      </div>

      {error && (
        <div className={styles.error}>
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      <div className={styles.grid}>
        <Card className={styles.cardReceitas}>
          <CardHeader>
            <div className={styles.cardTitleRow}>
              <CardTitle>Receitas</CardTitle>
              <TrendingUp size={24} />
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className={styles.loading}>Carregando...</div>
            ) : (
              <>
                <div className={styles.valor}>{formatarMoeda(totalReceitas)}</div>
                <p className={styles.cardText}>{receitas.length} receita(s) cadastrada(s)</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card className={styles.cardDespesas}>
          <CardHeader>
            <div className={styles.cardTitleRow}>
              <CardTitle>Despesas</CardTitle>
              <TrendingDown size={24} />
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className={styles.loading}>Carregando...</div>
            ) : (
              <>
                <div className={styles.valor}>{formatarMoeda(totalDespesas)}</div>
                <p className={styles.cardText}>{despesas.length} despesa(s) cadastrada(s)</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card className={styles.cardSaldo}>
          <CardHeader>
            <div className={styles.cardTitleRow}>
              <CardTitle>Saldo</CardTitle>
              <DollarSign size={24} />
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className={styles.loading}>Carregando...</div>
            ) : (
              <>
                <div className={`${styles.valor} ${saldo < 0 ? styles.negativo : styles.positivo}`}>
                  {formatarMoeda(saldo)}
                </div>
                <p className={styles.cardText}>
                  {saldo >= 0 ? 'Saldo positivo' : 'Saldo negativo'}
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
