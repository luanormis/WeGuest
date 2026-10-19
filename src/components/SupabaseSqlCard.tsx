import React, { useState } from 'react';
import { SUPABASE_SQL_SCHEMA } from '../data/supabaseSql';
import { useApp } from '../context/AppContext';
import { 
  Check, 
  Copy, 
  Database, 
  Download, 
  FileCode, 
  Layers, 
  ShieldCheck, 
  Sparkles,
  Terminal,
  ExternalLink
} from 'lucide-react';

export const SupabaseSqlCard: React.FC = () => {
  const { showToast } = useApp();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
    setCopied(true);
    showToast('Código SQL completo copiado para o seu Supabase SQL Editor!', 'success');
    setTimeout(() => setCopied(false), 3000);
  };

  const handleDownload = () => {
    const blob = new Blob([SUPABASE_SQL_SCHEMA], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'weguest_supabase_schema.sql';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Arquivo weguest_supabase_schema.sql baixado com sucesso.', 'info');
  };

  const tablesSummary = [
    { name: 'tenants', desc: 'Isolamento multi-tenant por espaço/evento, subdomínio único e plano.', pk: 'id (UUID)', rel: 'Tenant Root' },
    { name: 'usuarios_adm', desc: 'Controle de acesso por papel: super_admin_weguest, financeiro_welucci, noivos.', pk: 'id (UUID)', rel: 'tenants(id)' },
    { name: 'casais', desc: 'Dados noivos, contagem regressiva, saldo disponível e parâmetro de taxas.', pk: 'id (UUID)', rel: 'tenants(id)' },
    { name: 'convidados', desc: 'Lista RSVP, acompanhantes, restrições alimentares e link único.', pk: 'id (UUID)', rel: 'tenants(id)' },
    { name: 'lista_presentes', desc: '200 itens com suporte a valor sugerido e valor customizado pelos noivos.', pk: 'id (UUID)', rel: 'tenants(id)' },
    { name: 'transacoes_getnet', desc: 'Split automatizado: R$ 10 fixos (R$ 5 WeGuest + R$ 5 Welucci) e taxas Getnet.', pk: 'id (UUID)', rel: 'tenants(id), lista_presentes(id)' },
    { name: 'mural_recados', desc: 'Mensagens e votos de casamento com moderação e publicação em tempo real.', pk: 'id (UUID)', rel: 'tenants(id)' },
  ];

  return (
    <div className="min-h-screen bg-[#F9F9F9] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Top Header */}
        <div className="border-b border-stone-200 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-stone-500 mb-1">
              <span>Arquitetura de Dados Relacional</span>
              <span aria-hidden="true">·</span>
              <span className="text-[#9F825B] font-medium">PostgreSQL / Supabase</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#111111]">
              Supabase SQL Schema — WeGuest Multi-Tenant
            </h1>
            <p className="text-stone-600 text-sm mt-1">
              Script DDL completo e estruturado pronto para execução no Supabase SQL Editor.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 px-4 py-2 bg-[#111111] hover:bg-stone-900 text-[#DFCDAE] hover:text-white rounded-lg text-xs font-semibold transition-colors shadow-xs"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Código SQL Copiado!' : 'Copiar SQL Completo'}</span>
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-3.5 py-2 bg-white hover:bg-stone-50 text-stone-800 border border-stone-200 rounded-lg text-xs font-medium transition-colors shadow-2xs"
            >
              <Download className="w-4 h-4 text-[#C5A880]" />
              <span>Baixar .sql</span>
            </button>
          </div>
        </div>

        {/* 7 Tables Taxonomy Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {tablesSummary.map((tab, idx) => (
            <div key={tab.name} className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-stone-400">0{idx + 1}</span>
                <span className="text-[10px] font-mono text-[#9F825B] bg-[#C5A880]/15 px-1.5 py-0.2 rounded font-semibold">
                  TABLE
                </span>
              </div>
              <h3 className="font-mono text-sm font-bold text-stone-900">
                {tab.name}
              </h3>
              <p className="text-xs text-stone-500 leading-relaxed min-h-[44px]">
                {tab.desc}
              </p>
              <div className="pt-2 border-t border-stone-100 text-[10px] text-stone-400 font-mono">
                FK: {tab.rel}
              </div>
            </div>
          ))}
        </div>

        {/* Visual SQL Code Card */}
        <div className="bg-[#111111] text-stone-200 rounded-2xl border border-stone-800 shadow-xl overflow-hidden">
          {/* Editor Header Bar */}
          <div className="bg-stone-900/90 px-6 py-3 border-b border-stone-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/70" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                <div className="w-3 h-3 rounded-full bg-green-500/70" />
              </div>
              <span className="text-xs font-mono text-stone-400">
                supabase_schema_weguest_v1.sql
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-[11px] font-mono text-[#C5A880]">PostgreSQL 15+ · RLS Habilitado</span>
              <button
                onClick={handleCopy}
                className="text-xs text-stone-400 hover:text-white flex items-center gap-1 transition-colors"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copiar</span>
              </button>
            </div>
          </div>

          {/* Formatted Code Block */}
          <div className="p-6 overflow-x-auto max-h-[600px] overflow-y-auto font-mono text-xs text-stone-300 leading-relaxed selection:bg-[#C5A880]/40">
            <pre>
              <code>{SUPABASE_SQL_SCHEMA}</code>
            </pre>
          </div>

          {/* Editor Footer */}
          <div className="bg-stone-900/90 px-6 py-3 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-400 gap-2">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#C5A880]" />
              <span>Inclui Row Level Security (RLS) para proteção multi-tenant</span>
            </div>
            <div className="font-mono text-[11px] text-[#DFCDAE]">
              Pronto para colar no Supabase Dashboard &gt; SQL Editor &gt; Run
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
