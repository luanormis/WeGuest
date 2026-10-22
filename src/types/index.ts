export type Role = 'super_admin_weguest' | 'financeiro_welucci' | 'noivos';

export type StatusRsvp = 'confirmado' | 'recusado' | 'pendente';

export type FormaPagamento = 'pix' | 'cartao_credito';

export type StatusPagamento = 'approved' | 'pending' | 'failed';

export interface Tenant {
  id: string;
  subdominio: string;
  plano: string;
  criado_em: string;
}

export interface UsuarioAdm {
  id: string;
  tenant_id: string;
  email: string;
  role: Role;
  nome: string;
}

export interface Casal {
  id: string;
  tenant_id: string;
  noivo_nome: string;
  noiva_nome: string;
  data_evento: string; // ISO date string '2027-10-17'
  espaco_nome: string;
  hashtag: string;
  saldo_disponivel: number;
  saldo_bloqueado_d14?: number;
  repassar_taxas: boolean; // Se true, convidado paga taxas no checkout
  pix_chave?: string;
  banco_saque?: string;
  historia_casal?: string;
  mensagem_boas_vindas?: string;
  foto_capa_key?: 'coupleHero' | 'coupleMoment';
  espaco_foto_key?: 'gardensCeremony' | 'gardensMainHall' | 'gardensWaterfall' | 'gardensSpa';
  video_urls?: string[];
  foto_urls?: string[];
}

export interface Convidado {
  id: string;
  tenant_id: string;
  nome: string;
  email: string;
  whatsapp: string;
  status_rsvp: StatusRsvp;
  restricoes_alimentares: string;
  acompanhantes: number;
  link_convite_unico: string;
  confirmado_em?: string;
}

export interface Presente {
  id: string;
  tenant_id: string;
  nome_item: string;
  categoria: string;
  valor_sugerido: number;
  valor_customizado: number;
  imagem_url?: string;
  ativo: boolean;
  descricao?: string;
  popular?: boolean;
}

export interface TransacaoGetnet {
  id: string;
  tenant_id: string;
  convidado_nome: string;
  convidado_email?: string;
  convidado_mensagem?: string;
  presente_id: string;
  presente_nome: string;
  valor_bruto: number;
  taxa_plataforma_fixa: number; // R$ 10,00 por convidado ativo ou rateada
  taxa_gateway: number; // 1.99% pix ou 4.99% cartao
  valor_liquido_noivos: number;
  valor_liquido_weguest: number; // R$ 5,00 split
  valor_liquido_welucci: number; // R$ 5,00 split
  forma_pagamento: FormaPagamento;
  parcelas: number;
  status_pagamento: StatusPagamento;
  getnet_payment_id: string;
  criado_em: string;
}

export interface MuralRecado {
  id: string;
  tenant_id: string;
  autor: string;
  relacao?: string;
  mensagem: string;
  aprovado: boolean;
  criado_em: string;
}

export type ActiveView = 
  | 'public_site' 
  | 'couple_dashboard' 
  | 'super_admin' 
  | 'checkout_demo' 
  | 'legal_center' 
  | 'supabase_schema';
