import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../../components/Button/Button';
import { Input } from '../../components/Input/Input';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/Card/Card';
import styles from './Login.module.css';

export function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, senha);
      navigate('/dashboard');
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Email ou senha inválidos');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.logo}>
          <h1>Fintech</h1>
          <p>Sistema de Gestão Financeira</p>
        </div>

        <Card className={styles.card}>
          <CardHeader>
            <CardTitle>Bem-vindo</CardTitle>
            <p className={styles.subtitle}>
              Entre com suas credenciais para acessar o sistema
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className={styles.form}>
              <Input
                label="Email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />

              <Input
                label="Senha"
                type="password"
                placeholder="••••••••"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
                autoComplete="current-password"
              />

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
                      d="M8 1.5C4.41 1.5 1.5 4.41 1.5 8C1.5 11.59 4.41 14.5 8 14.5C11.59 14.5 14.5 11.59 14.5 8C14.5 4.41 11.59 1.5 8 1.5ZM8 13C5.24 13 3 10.76 3 8C3 5.24 5.24 3 8 3C10.76 3 13 5.24 13 8C13 10.76 10.76 13 8 13Z"
                      fill="currentColor"
                    />
                    <path
                      d="M7.25 4.75H8.75V9.25H7.25V4.75Z"
                      fill="currentColor"
                    />
                    <path
                      d="M8 10C7.586 10 7.25 10.336 7.25 10.75C7.25 11.164 7.586 11.5 8 11.5C8.414 11.5 8.75 11.164 8.75 10.75C8.75 10.336 8.414 10 8 10Z"
                      fill="currentColor"
                    />
                  </svg>
                  {error}
                </div>
              )}

              <Button type="submit" fullWidth disabled={isLoading}>
                {isLoading ? 'Entrando...' : 'Entrar'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

