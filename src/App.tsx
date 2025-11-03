import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute/ProtectedRoute';
import { Login } from './pages/Login/Login';
import { Dashboard } from './pages/Dashboard/Dashboard';
import { ListaCategorias, FormularioCategoria } from './pages/Categorias';
import { ListaReceitas, FormularioReceita } from './pages/Receitas';
import { ListaDespesas, FormularioDespesa } from './pages/Despesas';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/categorias"
            element={
              <ProtectedRoute>
                <ListaCategorias />
              </ProtectedRoute>
            }
          />
          <Route
            path="/categorias/nova"
            element={
              <ProtectedRoute>
                <FormularioCategoria />
              </ProtectedRoute>
            }
          />
          <Route
            path="/categorias/:id/editar"
            element={
              <ProtectedRoute>
                <FormularioCategoria />
              </ProtectedRoute>
            }
          />
          <Route
            path="/receitas"
            element={
              <ProtectedRoute>
                <ListaReceitas />
              </ProtectedRoute>
            }
          />
          <Route
            path="/receitas/nova"
            element={
              <ProtectedRoute>
                <FormularioReceita />
              </ProtectedRoute>
            }
          />
          <Route
            path="/receitas/:id/editar"
            element={
              <ProtectedRoute>
                <FormularioReceita />
              </ProtectedRoute>
            }
          />
          <Route
            path="/despesas"
            element={
              <ProtectedRoute>
                <ListaDespesas />
              </ProtectedRoute>
            }
          />
          <Route
            path="/despesas/nova"
            element={
              <ProtectedRoute>
                <FormularioDespesa />
              </ProtectedRoute>
            }
          />
          <Route
            path="/despesas/:id/editar"
            element={
              <ProtectedRoute>
                <FormularioDespesa />
              </ProtectedRoute>
            }
          />
          {/* Adicionar outras rotas protegidas aqui */}
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
