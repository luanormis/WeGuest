import React, { useState } from 'react';
import { FinanceProjectionCard } from './FinanceProjectionCard';
import { useApp } from '../context/AppContext';
import { Role } from '../types';
import { WelucciLogo } from './WelucciLogo';
import { 
  Building2, 
  Download, 
  Filter, 
  HelpCircle, 
  Search, 
  ShieldAlert, 
  ShieldCheck, 
  TrendingUp, 
  Wallet, 
  Users, 
  ArrowUpRight,
  CheckCircle2,
  Clock,
  Sparkles,
  ExternalLink
} from 'lucide-react';

export const SuperAdminPortal: React.FC = () => {
  const { 
    activeRole, 
    setActiveRole, 
    transactions, 
    guests, 
    couple, 
    showToast 
  } = useApp();

  const [paymentFilter, setPaymentFilter] = useState<'all' | 'pix' | 'cartao_credito'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Computations
  const totalGTV = transactions.reduce((acc, t) => acc + t.valor_bruto, 0);
  const totalTaxasGateway = transactions.reduce((acc, t) => acc + t.taxa_gateway, 0);
  const totalSplitWeGuest = transactions.reduce((acc, t) => acc + t.valor_liquido_weguest, 0);
  const totalSplitWelucci = transactions.reduce((acc, t) => acc + t.valor_liquido_welucci, 0);
  const totalLiquidoNoivos = transactions.reduce((acc, t) => acc + t.valor_liquido_noivos, 0);

  // Active confirmed guests count
  const activeConfirmedGuests = guests.filter(g => g.status_rsvp === 'confirmado');
  const totalGuestHeadcount = activeConfirmedGuests.reduce((acc, g) => acc + 1 + g.acompanhantes, 0);

  // Filtered transactions
  const filteredTransactions = transactions.filter((t) => {
    const matchesFilter = paymentFilter === 'all' || t.forma_pagamento === paymentFilter;
    const matchesSearch = 
      t.convidado_nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.presente_nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.getnet_payment_id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const exportCsv = () => {
    const headers = 'ID_Transacao;Data;Convidado;Presente;Valor_Bruto;Taxa_Gateway;Split_WeGuest;Split_Welucci;Liquido_Noivos;Forma_Pagto;ID_Getnet\n';
    const rows = filteredTransactions.map(t => 
      `${t.id};${new Date(t.criado_em).toLocaleDateString('pt-BR')};"${t.convidado_nome}";"${t.presente_nome}";${t.valor_bruto.toFixed(2)};${t.taxa_gateway.toFixed(2)};${t.valor_liquido_weguest.toFixed(2)};${t.valor_liquido_welucci.toFixed(2)};${t.valor_liquido_noivos.toFixed(2)};${t.forma_pagamento};${t.getnet_payment_id}`
    ).join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `weguest_extrato_repasse_welucci_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('Extrato de repasse CSV exportado com sucesso.', 'success');
  };

  const isSuperAdmin = activeRole === 'super_admin_weguest';
  const isWelucci = activeRole === 'financeiro_welucci';

  return (
    <div className="min-h-screen bg-[#F9F9F9] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Top Header & Role Switcher Bar */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-stone-200">
          <div>
            <div className="flex items-center gap-2 text-xs text-stone-500 mb-1">
              <span>SaaS Multi-Tenant</span>
              <span aria-hidden="true">·</span>
              <span>Welucci Ecosystem</span>
              <span aria-hidden="true">·</span>
              <span className="text-[#9F825B] font-medium">B2B Core</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#111111]">
              Portal Super Admin & Finanças B2B
            </h1>
            <p className="text-stone-600 text-sm mt-1">
              Controle de repasse automatizado e liquidação financeira integrada ao checkout Getnet.
            </p>
          </div>

          {/* Interactive Role Switcher for Pitch Demonstration */}
          <div className="flex items-center bg-white p-1 rounded-lg border border-stone-200 shadow-xs self-start md:self-auto">
            <span className="text-xs text-stone-500 font-medium px-2.5">Visão Ativa:</span>
            <button
              onClick={() => setActiveRole('super_admin_weguest')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                isSuperAdmin 
                  ? 'bg-[#111111] text-[#C5A880] shadow-xs font-semibold' 
                  : 'text-stone-600 hover:text-black'
              }`}
            >
              Super Admin WeGuest
            </button>
            <button
              onClick={() => setActiveRole('financeiro_welucci')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                isWelucci 
                  ? 'bg-[#480927] text-white shadow-xs font-semibold' 
                  : 'text-stone-600 hover:text-black'
              }`}
            >
              Financeiro Welucci
            </button>
          </div>
        </div>

        {/* Business Rule Explainer Banner */}
        <div className="bg-white border border-[#C5A880]/30 rounded-xl p-5 shadow-xs relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-[#C5A880]/5 rounded-full blur-2xl pointer-events-none" />
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#C5A880]" />
                <h2 className="text-sm font-semibold uppercase tracking-wider text-[#111111]">
                  Regra de Negócio de Repasse & Monetização B2B
                </h2>
              </div>
              <p className="text-sm text-stone-600 max-w-3xl leading-relaxed">
                Cobrança de taxa tecnológica de <strong className="text-[#111111]">R$ 10,00 fixos por convidado ativo</strong> na lista cadastrada do casamento. O valor é rateado automaticamente no checkout Getnet: <strong className="text-[#9F825B]">R$ 5,00 líquidos para o WeGuest</strong> (manutenção e infraestrutura) e <strong className="text-[#9F825B]">R$ 5,00 líquidos repassados para a conta da Welucci</strong> como receita de coparticipação do espaço.
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0 bg-[#F9F9F9] px-4 py-3 rounded-lg border border-stone-200">
              <div className="text-right">
                <div className="text-[11px] text-stone-500 uppercase tracking-wide">Split Rateado / Convidado</div>
                <div className="font-mono text-sm font-bold text-[#111111] tabular-nums">
                  R$ 5,00 <span className="text-stone-400 font-normal">WeGuest</span> + R$ 5,00 <span className="text-[#C5A880] font-normal">Welucci</span>
                </div>
              </div>
              <CheckCircle2 className="w-5 h-5 text-[#C5A880]" />
            </div>
          </div>
        </div>

        {/* Consolidated Financial Metrics Panel */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Metric 1: GTV */}
          <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs">
            <div className="flex items-center justify-between text-stone-500 mb-2">
              <span className="text-xs uppercase tracking-wider font-medium">GTV Volume Transacionado</span>
              <TrendingUp className="w-4 h-4 text-[#C5A880]" />
            </div>
            <div className="text-2xl font-bold font-mono text-[#111111] tabular-nums">
              R$ {totalGTV.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <div className="text-xs text-stone-500 mt-2 flex items-center gap-1">
              <span>{transactions.length} transações aprovadas</span>
              <span aria-hidden="true">·</span>
              <span>100% Getnet</span>
            </div>
          </div>

          {/* Metric 2: WeGuest Split Net */}
          <div className={`p-5 rounded-xl border shadow-xs transition-all ${
            isSuperAdmin ? 'bg-[#111111] text-white border-black' : 'bg-white border-stone-200'
          }`}>
            <div className="flex items-center justify-between text-stone-400 mb-2">
              <span className="text-xs uppercase tracking-wider font-medium">Conta WeGuest (Admin)</span>
              <Wallet className="w-4 h-4 text-[#C5A880]" />
            </div>
            <div className={`text-2xl font-bold font-mono tabular-nums ${isSuperAdmin ? 'text-[#C5A880]' : 'text-[#111111]'}`}>
              R$ {totalSplitWeGuest.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <div className="text-xs text-stone-400 mt-2">
              Taxa tecnologia líquida apurada (R$ 5/conv)
            </div>
          </div>

          {/* Metric 3: Welucci Split Net */}
          <div className={`p-5 rounded-xl border shadow-xs transition-all ${
            isWelucci ? 'bg-[#480927] text-white border-[#35051C]' : 'bg-white border-stone-200'
          }`}>
            <div className="flex items-center justify-between mb-2 opacity-90">
              <span className="text-xs uppercase tracking-wider font-medium">Repasse Welucci Gardens</span>
              <WelucciLogo iconOnly size={18} color={isWelucci ? '#ffffff' : '#480927'} />
            </div>
            <div className={`text-2xl font-bold font-mono tabular-nums ${isWelucci ? 'text-[#DFCDAE]' : 'text-[#480927]'}`}>
              R$ {totalSplitWelucci.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <div className="text-xs opacity-85 mt-2">
              Crédito em conta do espaço (R$ 5/conv)
            </div>
          </div>

          {/* Metric 4: Net to Couples */}
          <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs">
            <div className="flex items-center justify-between text-stone-500 mb-2">
              <span className="text-xs uppercase tracking-wider font-medium">Repasse Líquido Noivos</span>
              <Users className="w-4 h-4 text-[#C5A880]" />
            </div>
            <div className="text-2xl font-bold font-mono text-[#111111] tabular-nums">
              R$ {couple.saldo_disponivel.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <div className="text-xs text-stone-500 mt-2 flex items-center justify-between">
              <span>Disponível para saque PIX (D+2)</span>
              <span className="text-emerald-600 font-medium">Sem glosa</span>
            </div>
          </div>
        </div>

        {/* Transactions Split Breakdown Table */}
        <div className="bg-white border border-stone-200 rounded-xl shadow-xs overflow-hidden">
          {/* Table Toolbar */}
          <div className="p-4 sm:p-5 border-b border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-semibold text-[#111111]">
                Extrato Consolidado de Split & Repasse Getnet
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                Demonstrativo de cada presente recebido, taxa de gateway e divisão de receitas.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              {/* Search */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  placeholder="Buscar convidado ou presente..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 pr-3 py-1.5 text-xs bg-[#F9F9F9] border border-stone-200 rounded-md focus:outline-none focus:border-[#C5A880] w-48 sm:w-60"
                />
              </div>

              {/* Payment Filter */}
              <div className="flex items-center bg-[#F9F9F9] p-0.5 rounded-md border border-stone-200 text-xs">
                <button
                  onClick={() => setPaymentFilter('all')}
                  className={`px-2.5 py-1 rounded transition-colors ${
                    paymentFilter === 'all' ? 'bg-white shadow-xs font-semibold text-[#111111]' : 'text-stone-500'
                  }`}
                >
                  Todos
                </button>
                <button
                  onClick={() => setPaymentFilter('pix')}
                  className={`px-2.5 py-1 rounded transition-colors ${
                    paymentFilter === 'pix' ? 'bg-white shadow-xs font-semibold text-[#111111]' : 'text-stone-500'
                  }`}
                >
                  PIX (1.99%)
                </button>
                <button
                  onClick={() => setPaymentFilter('cartao_credito')}
                  className={`px-2.5 py-1 rounded transition-colors ${
                    paymentFilter === 'cartao_credito' ? 'bg-white shadow-xs font-semibold text-[#111111]' : 'text-stone-500'
                  }`}
                >
                  Cartão (4.99%)
                </button>
              </div>

              {/* Export CSV Button */}
              <button
                onClick={exportCsv}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#111111] text-[#DFCDAE] hover:text-white hover:bg-stone-900 rounded-md text-xs font-medium transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Exportar CSV</span>
              </button>
            </div>
          </div>

          {/* Table Content */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F9F9F9] text-stone-500 uppercase tracking-wider font-medium border-b border-stone-200">
                <tr>
                  <th className="py-3 px-4">Convidado & Presente</th>
                  <th className="py-3 px-4">Método & ID Getnet</th>
                  <th className="py-3 px-4 text-right">Valor Bruto</th>
                  <th className="py-3 px-4 text-right">MDR Gateway</th>
                  <th className="py-3 px-4 text-right text-stone-800 font-semibold bg-stone-100/50">Split WeGuest</th>
                  <th className="py-3 px-4 text-right text-[#9F825B] font-semibold bg-[#C5A880]/10">Split Welucci</th>
                  <th className="py-3 px-4 text-right font-semibold">Líquido Noivos</th>
                  <th className="py-3 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredTransactions.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-stone-400">
                      Nenhuma transação encontrada com os filtros selecionados.
                    </td>
                  </tr>
                ) : (
                  filteredTransactions.map((trx) => (
                    <tr key={trx.id} className="hover:bg-stone-50/70 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-semibold text-stone-900">{trx.convidado_nome}</div>
                        <div className="text-[11px] text-stone-500 truncate max-w-xs">{trx.presente_nome}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5">
                          <span className={`inline-block w-2 h-2 rounded-full ${
                            trx.forma_pagamento === 'pix' ? 'bg-emerald-500' : 'bg-sky-500'
                          }`} />
                          <span className="font-medium text-stone-800 uppercase text-[10px]">
                            {trx.forma_pagamento === 'pix' ? 'PIX Instantâneo' : `Cartão ${trx.parcelas}x`}
                          </span>
                        </div>
                        <div className="font-mono text-[10px] text-stone-400 tabular-nums">
                          {trx.getnet_payment_id}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right font-mono tabular-nums text-stone-900 font-medium">
                        R$ {trx.valor_bruto.toFixed(2)}
                      </td>
                      <td className="py-3 px-4 text-right font-mono tabular-nums text-red-700">
                        -R$ {trx.taxa_gateway.toFixed(2)}
                      </td>
                      <td className="py-3 px-4 text-right font-mono tabular-nums text-stone-900 font-semibold bg-stone-100/50">
                        +R$ {trx.valor_liquido_weguest.toFixed(2)}
                      </td>
                      <td className="py-3 px-4 text-right font-mono tabular-nums text-[#9F825B] font-semibold bg-[#C5A880]/10">
                        +R$ {trx.valor_liquido_welucci.toFixed(2)}
                      </td>
                      <td className="py-3 px-4 text-right font-mono tabular-nums text-emerald-800 font-bold">
                        R$ {trx.valor_liquido_noivos.toFixed(2)}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                          Aprovado
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Table Summary Footer */}
          <div className="bg-[#F9F9F9] p-4 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-2">
            <div>
              Exibindo <strong>{filteredTransactions.length}</strong> de <strong>{transactions.length}</strong> transações registradas no tenant Welucci Gardens.
            </div>
            <div className="flex items-center gap-4 font-mono tabular-nums">
              <span>Total Welucci: <strong className="text-[#9F825B]">R$ {totalSplitWelucci.toFixed(2)}</strong></span>
              <span>Total WeGuest: <strong className="text-stone-900">R$ {totalSplitWeGuest.toFixed(2)}</strong></span>
            </div>
          </div>
        </div>

        <FinanceProjectionCard />

        {/* Tenant Information Card */}
        <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[11px] uppercase tracking-wider text-[#C5A880] font-semibold">
                Contrato Ativo do Tenant
              </span>
              <h3 className="text-lg font-serif font-bold text-[#111111] mt-0.5">
                Welucci Gardens — Guilherme & Victória (#CasamentoGuiEVi)
              </h3>
              <p className="text-xs text-stone-500 mt-1">
                Data do Evento: 17 de Outubro de 2027 · Espaço: Av. Queiroz Filho, 830 - Alto de Pinheiros, São Paulo - SP
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs bg-stone-100 text-stone-700 px-3 py-1.5 rounded-md border border-stone-200 font-mono">
                Subdomínio: guilherme-e-victoria.weguest.com.br
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
