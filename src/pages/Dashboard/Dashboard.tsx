import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, DollarSign, AlertCircle } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { Layout } from '../../components/Layout/Layout';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/Card/Card';
import { DataTable } from '../../components/DataTable';
import type { Column } from '../../types/table.types';
import { receitaService } from '../../services/receita.service';
import { despesaService } from '../../services/despesa.service';
import type { Receita } from '../../types/receita.types';
import type { Despesa } from '../../types/despesa.types';
import type { Transacao } from '../../types/transacao.types';
import styles from './Dashboard.module.css';

export function Dashboard() {
  const { user } = useAuth();
  const [receitas, setReceitas] = useState<Receita[]>([]);
  const [despesas, setDespesas] = useState<Despesa[]>([]);
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
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

        // Consolidar transações
        const todasTransacoes: Transacao[] = [
          ...receitasData.map((receita) => ({
            id: receita.idReceita,
            tipo: 'RECEITA' as const,
            descricao: receita.descricao,
            valor: receita.valor,
            data: receita.dataEntrada,
            categoria: receita.categoria?.nomeCategoria,
            subcategoria: receita.subcategoria?.nomeSubcat,
          })),
          ...despesasData.map((despesa) => ({
            id: despesa.idDespesa,
            tipo: 'DESPESA' as const,
            descricao: despesa.descricao,
            valor: despesa.valor,
            data: despesa.dataVencimento,
            categoria: despesa.categoria?.nomeCategoria,
            subcategoria: despesa.subcategoria?.nomeSubcat,
          })),
        ];

        // Ordenar por data (mais recente primeiro) e limitar a 20
        const transacoesOrdenadas = todasTransacoes
          .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())
          .slice(0, 20);

        setTransacoes(transacoesOrdenadas);
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

  const formatarData = (data: string) => {
    return new Date(data).toLocaleDateString('pt-BR');
  };

  const colunas: Column<Transacao>[] = [
    {
      key: 'tipo',
      header: 'Tipo',
      render: (transacao) => (
        <span className={transacao.tipo === 'RECEITA' ? styles.tipoReceita : styles.tipoDespesa}>
          {transacao.tipo}
        </span>
      ),
    },
    {
      key: 'descricao',
      header: 'Descrição',
    },
    {
      key: 'valor',
      header: 'Valor',
      render: (transacao) => (
        <span className={transacao.tipo === 'RECEITA' ? styles.valorReceita : styles.valorDespesa}>
          {formatarMoeda(transacao.valor)}
        </span>
      ),
    },
    {
      key: 'data',
      header: 'Data',
      render: (transacao) => formatarData(transacao.data),
    },
    {
      key: 'categoria',
      header: 'Categoria',
      render: (transacao) => transacao.categoria || '-',
    },
    {
      key: 'subcategoria',
      header: 'Subcategoria',
      render: (transacao) => transacao.subcategoria || '-',
    },
  ];

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

      <div className={styles.transactions}>
        <Card>
          <CardHeader>
            <CardTitle>Transações Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable
              data={transacoes}
              columns={colunas}
              isLoading={isLoading}
              emptyMessage="Nenhuma transação encontrada"
            />
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
