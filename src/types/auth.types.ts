export interface User {
  idUsuario: number;
  email: string;
  tipoUsuario: 'PF' | 'PJ';
  criadoEm: string;
  pessoaFisica?: {
    nome: string;
    cpf: string;
    dataNasc?: string;
  };
  pessoaJuridica?: {
    cnpj: string;
    razaoSocial: string;
  };
}

export interface LoginRequest {
  email: string;
  senha: string;
}

export interface LoginResponse {
  token: string;
  type: string;
  expiresIn: number;
  message: string;
  usuario: User;
}

export interface RegisterRequest {
  email: string;
  senha: string;
  tipoUsuario: 'PF' | 'PJ';
  pessoaFisica?: {
    nome: string;
    cpf: string;
    dataNasc?: string;
  };
  pessoaJuridica?: {
    cnpj: string;
    razaoSocial: string;
  };
}

