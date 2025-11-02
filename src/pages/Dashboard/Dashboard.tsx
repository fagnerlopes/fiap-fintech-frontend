import { useAuth } from '../../hooks/useAuth';
import { Layout } from '../../components/Layout/Layout';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/Card/Card';
import styles from './Dashboard.module.css';

export function Dashboard() {
  const { user } = useAuth();

  return (
    <Layout>
      <div className={styles.welcome}>
        <h2>Bem-vindo ao Sistema</h2>
        <p>Olá, {user?.pessoaFisica?.nome || user?.pessoaJuridica?.razaoSocial || user?.email}!</p>
      </div>

      <div className={styles.grid}>
        <Card>
          <CardHeader>
            <CardTitle>Receitas</CardTitle>
          </CardHeader>
          <CardContent>
            <p className={styles.cardText}>Gerencie suas receitas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Despesas</CardTitle>
          </CardHeader>
          <CardContent>
            <p className={styles.cardText}>Controle suas despesas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Categorias</CardTitle>
          </CardHeader>
          <CardContent>
            <p className={styles.cardText}>Organize por categorias</p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
