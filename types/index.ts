export interface User {
  id: string;
  nome: string;
  email: string;
  imoveis: Property[];
}

export interface UserData {
  nome: string;
  qtdImoveis: number;
  valorDespesas: number;
  qtdDespesasPendentes: number;
  proximoVencimento: string;
}

export interface Property {
  id: string;
  endereco: string;
  cidade: string;
  estado: string;
  cep: string;
  tipo: 'Apartamento' | 'Casa' | 'Comercial' | 'Galpão' | 'Lote' | 'Chácara' | 'Outro';
  qtdQuartos: number;
  qtdBanheiro: number;
  qtdVagasGaragem: number;
  dataAquisicao: string;
  registroCartorio: string;
  inscricaoIptu: string;
  inscricaoCaesb: string;
  inscricaoNeoenergia: string;
  valorVenal: number;
}

export interface Document {
  id: string;
  name: string;
  type: 'Contract' | 'Deed' | 'Certificate' | 'Insurance' | 'Other';
  uploadDate: string;
  fileUrl: string;
}

export interface Expense {
  id: string;
  tipo: 'Energia' | 'Água' | 'Manutenção' | 'Seguro' | 'Outro';
  valor: number;
  vencimento: string;
  parcelas: number;
  status: string;
}