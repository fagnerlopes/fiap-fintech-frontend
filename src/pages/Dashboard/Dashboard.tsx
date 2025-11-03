import { useState, useEffect } from 'react';
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

  // Busca receitas e despesas ao carregar o componente (useEffect conforme o curso)
  useEffect(() => {
    const carregarDados = async () => {
      try {
        setIsLoading(true);
        setError('');

        // Busca receitas e despesas em paralelo
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
  }, []); // Array vazio = executa apenas uma vez ao montar

  // Calcula o total de receitas
  const totalReceitas = receitas.reduce((acc, receita) => acc + receita.valor, 0);

  // Calcula o total de despesas
  const totalDespesas = despesas.reduce((acc, despesa) => acc + despesa.valor, 0);

  // Calcula o saldo
  const saldo = totalReceitas - totalDespesas;

  // Formata valor em reais
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
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8 1.5C4.41 1.5 1.5 4.41 1.5 8C1.5 11.59 4.41 14.5 8 14.5C11.59 14.5 14.5 11.59 14.5 8C14.5 4.41 11.59 1.5 8 1.5Z"
              fill="currentColor"
            />
          </svg>
          {error}
        </div>
      )}

      <div className={styles.grid}>
        <Card className={styles.cardReceitas}>
          <CardHeader>
            <div className={styles.cardTitleRow}>
              <CardTitle>Receitas</CardTitle>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 5V19M5 12L12 5L19 12"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
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
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 19V5M5 12L12 19L19 12"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
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
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 2V22M17 5H9.5C8.57174 5 7.6815 5.36875 7.02513 6.02513C6.36875 6.6815 6 7.57174 6 8.5C6 9.42826 6.36875 10.3185 7.02513 10.9749C7.6815 11.6313 8.57174 12 9.5 12H14.5C15.4283 12 16.3185 12.3687 16.9749 13.0251C17.6313 13.6815 18 14.5717 18 15.5C18 16.4283 17.6313 17.3185 16.9749 17.9749C16.3185 18.6313 15.4283 19 14.5 19H6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
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
