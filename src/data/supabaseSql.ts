export const SUPABASE_SQL_SCHEMA = `-- ====================================================================
-- PLATAFORMA WEGUEST - SCHEMA SUPABASE COMPLETO & MULTI-TENANT
-- Ecossistema de Casamentos de Luxo Welucci (welucci.com)
-- ====================================================================

-- 1. Habilitar extensão para geração de UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Tabela: tenants
-- Cada evento/espaço possui seu próprio tenant isolado
CREATE TABLE IF NOT EXISTS public.tenants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    subdominio TEXT UNIQUE NOT NULL,
    plano TEXT NOT NULL DEFAULT 'welucci_luxury',
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Tabela: usuarios_adm
-- Controle de acessos segregados (RBAC)
CREATE TABLE IF NOT EXISTS public.usuarios_adm (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    nome TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('super_admin_weguest', 'financeiro_welucci', 'noivos')),
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Tabela: casais
-- Dados dos noivos e parâmetros financeiros do evento
CREATE TABLE IF NOT EXISTS public.casais (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
    noivo_nome TEXT NOT NULL,
    noiva_nome TEXT NOT NULL,
    data_evento DATE NOT NULL,
    espaco_nome TEXT NOT NULL DEFAULT 'Welucci Gardens (São Paulo - SP)',
    hashtag TEXT NOT NULL,
    saldo_disponivel NUMERIC(12, 2) DEFAULT 0.00,
    saldo_bloqueado_d14 NUMERIC(12, 2) DEFAULT 0.00,
    repassar_taxas BOOLEAN DEFAULT TRUE,
    pix_chave TEXT,
    banco_saque TEXT,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Tabela: convidados
-- Lista de convidados, RSVP em tempo real e restrições alimentares
CREATE TABLE IF NOT EXISTS public.convidados (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
    nome TEXT NOT NULL,
    email TEXT,
    whatsapp TEXT,
    status_rsvp TEXT NOT NULL DEFAULT 'pendente' CHECK (status_rsvp IN ('confirmado', 'recusado', 'pendente')),
    restricoes_alimentares TEXT,
    acompanhantes INTEGER DEFAULT 0,
    link_convite_unico TEXT UNIQUE,
    confirmado_em TIMESTAMP WITH TIME ZONE,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Tabela: lista_presentes
-- 200 itens com suporte a valor sugerido e customização manual pelos noivos
CREATE TABLE IF NOT EXISTS public.lista_presentes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
    nome_item TEXT NOT NULL,
    categoria TEXT NOT NULL,
    valor_sugerido NUMERIC(10, 2) NOT NULL,
    valor_customizado NUMERIC(10, 2) NOT NULL,
    imagem_url TEXT,
    ativo BOOLEAN DEFAULT TRUE,
    descricao TEXT,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Tabela: transacoes_getnet
-- Registro transparente de transações com split de repasse
-- Regra de Negócio: R$ 10 fixos por convidado ativo (Split: R$ 5 WeGuest + R$ 5 Welucci)
CREATE TABLE IF NOT EXISTS public.transacoes_getnet (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
    convidado_nome TEXT NOT NULL,
    convidado_email TEXT,
    presente_id UUID REFERENCES public.lista_presentes(id) ON DELETE SET NULL,
    valor_bruto NUMERIC(10, 2) NOT NULL,
    taxa_plataforma_fixa NUMERIC(10, 2) NOT NULL DEFAULT 10.00,
    taxa_gateway NUMERIC(10, 2) NOT NULL,
    valor_liquido_noivos NUMERIC(10, 2) NOT NULL,
    valor_liquido_weguest NUMERIC(10, 2) NOT NULL DEFAULT 5.00,
    valor_liquido_welucci NUMERIC(10, 2) NOT NULL DEFAULT 5.00,
    forma_pagamento TEXT NOT NULL CHECK (forma_pagamento IN ('pix', 'cartao_credito')),
    parcelas INTEGER DEFAULT 1,
    status_pagamento TEXT NOT NULL DEFAULT 'approved' CHECK (status_pagamento IN ('approved', 'pending', 'failed')),
    getnet_payment_id TEXT UNIQUE,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Tabela: mural_recados
-- Cartões e recados com moderação visual
CREATE TABLE IF NOT EXISTS public.mural_recados (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
    autor TEXT NOT NULL,
    relacao TEXT,
    mensagem TEXT NOT NULL,
    aprovado BOOLEAN DEFAULT TRUE,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ====================================================================
-- ÍNDICES DE PERFORMANCE MULTI-TENANT
-- ====================================================================
CREATE INDEX IF NOT EXISTS idx_usuarios_tenant ON public.usuarios_adm(tenant_id);
CREATE INDEX IF NOT EXISTS idx_casais_tenant ON public.casais(tenant_id);
CREATE INDEX IF NOT EXISTS idx_convidados_tenant ON public.convidados(tenant_id);
CREATE INDEX IF NOT EXISTS idx_convidados_rsvp ON public.convidados(status_rsvp);
CREATE INDEX IF NOT EXISTS idx_presentes_tenant ON public.lista_presentes(tenant_id);
CREATE INDEX IF NOT EXISTS idx_transacoes_tenant ON public.transacoes_getnet(tenant_id);
CREATE INDEX IF NOT EXISTS idx_mural_tenant ON public.mural_recados(tenant_id);

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================
ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usuarios_adm ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.casais ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.convidados ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lista_presentes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transacoes_getnet ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mural_recados ENABLE ROW LEVEL SECURITY;

-- Políticas de Leitura Pública para o Convidado
CREATE POLICY "Convidados podem visualizar presentes ativos do tenant"
    ON public.lista_presentes FOR SELECT
    USING (ativo = TRUE);

CREATE POLICY "Convidados podem ler mural de recados aprovados"
    ON public.mural_recados FOR SELECT
    USING (aprovado = TRUE);

CREATE POLICY "Qualquer convidado pode enviar recado no mural"
    ON public.mural_recados FOR INSERT
    WITH CHECK (TRUE);

-- Políticas Administrativas Segregadas
CREATE POLICY "Acesso completo para Administradores e Noivos do Tenant"
    ON public.casais FOR ALL
    USING (auth.uid() IN (
        SELECT id FROM public.usuarios_adm 
        WHERE tenant_id = casais.tenant_id
    ));
`;
