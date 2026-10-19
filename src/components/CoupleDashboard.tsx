import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Calendar, 
  Clock, 
  Copy, 
  ExternalLink, 
  Heart, 
  Mail, 
  MessageCircle, 
  QrCode, 
  Search, 
  Send, 
  Share2, 
  Sliders, 
  Tag, 
  Users, 
  Wallet, 
  Check, 
  ToggleLeft, 
  ToggleRight, 
  DollarSign, 
  Instagram, 
  Plus, 
  Trash2,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

export const CoupleDashboard: React.FC = () => {
  const { 
    couple, 
    updateCouple, 
    toggleRepassarTaxas, 
    gifts, 
    toggleGiftActive, 
    updateGiftPrice, 
    resetAllGiftPrices, 
    activateAllGifts, 
    guests, 
    addGuest, 
    removeGuest, 
    showToast,
    setActiveView
  } = useApp();

  // Sub-tab in Couple Dashboard
  const [activeTab, setActiveTab] = useState<'overview' | 'gifts' | 'guests' | 'share'>('overview');

  // Gift search & filter state
  const [giftCategory, setGiftCategory] = useState<string>('all');
  const [giftSearch, setGiftSearch] = useState<string>('');
  const [giftFilterActiveOnly, setGiftFilterActiveOnly] = useState<boolean>(false);

  // Guest search & modal
  const [guestSearch, setGuestSearch] = useState<string>('');
  const [isAddGuestModalOpen, setIsAddGuestModalOpen] = useState(false);
  const [newGuestForm, setNewGuestForm] = useState({
    nome: '',
    email: '',
    whatsapp: '',
    acompanhantes: 0,
    restricoes_alimentares: '',
  });

  // Saque modal state
  const [isSaqueModalOpen, setIsSaqueModalOpen] = useState(false);
  const [saqueValor, setSaqueValor] = useState(couple.saldo_disponivel);

  // Live Countdown to 17/10/2027
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const targetDate = new Date('2027-10-17T17:00:00').getTime();

    const updateTimer = () => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        });
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  // Unique Wedding Link
  const weddingUniqueLink = `https://weguest.com.br/welucci/${couple.noivo_nome.toLowerCase()}-e-${couple.noiva_nome.toLowerCase()}`;

  // Sharing Handlers
  const handleCopyLink = () => {
    navigator.clipboard.writeText(weddingUniqueLink);
    showToast('Link do casamento copiado com sucesso!', 'success');
  };

  const handleShareWhatsApp = () => {
    const message = encodeURIComponent(
      `Com imensa alegria, nós, ${couple.noivo_nome} & ${couple.noiva_nome}, convidamos você para o nosso casamento no ${couple.espaco_nome}!\n\nConfirme sua presença e acesse nossa lista de presentes em:\n${weddingUniqueLink}\n\n${couple.hashtag}`
    );
    window.open(`https://api.whatsapp.com/send?text=${message}`, '_blank');
  };

  const handleShareEmail = () => {
    const subject = encodeURIComponent(`Convite de Casamento: ${couple.noivo_nome} & ${couple.noiva_nome} | Welucci Gardens`);
    const body = encodeURIComponent(
      `Queridos amigos e familiares,\n\nTemos a honra de convidar vocês para celebrar o nosso amor no dia 17 de Outubro de 2027 no Welucci Gardens em São Paulo.\n\nPor favor, confirmem sua presença (RSVP) e consultem nossa lista de presentes oficial através do nosso portal WeGuest:\n${weddingUniqueLink}\n\nCom carinho,\n${couple.noivo_nome} & ${couple.noiva_nome}\n${couple.hashtag}`
    );
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  const handleShareInstagram = () => {
    navigator.clipboard.writeText(weddingUniqueLink);
    showToast('Link copiado! Cole na Bio do seu Instagram ou na figurinha de Link dos Stories com a hashtag ' + couple.hashtag, 'gold');
  };

  // RSVP metrics
  const confirmedGuests = guests.filter(g => g.status_rsvp === 'confirmado');
  const declinedGuests = guests.filter(g => g.status_rsvp === 'recusado');
  const pendingGuests = guests.filter(g => g.status_rsvp === 'pendente');
  const totalCompanions = confirmedGuests.reduce((acc, g) => acc + g.acompanhantes, 0);
  const totalAttending = confirmedGuests.length + totalCompanions;

  // Categories list
  const categories = ['all', ...Array.from(new Set(gifts.map(g => g.categoria)))];

  // Filtered gifts (200 items manager)
  const filteredGifts = gifts.filter(gift => {
    const matchesCat = giftCategory === 'all' || gift.categoria === giftCategory;
    const matchesSearch = gift.nome_item.toLowerCase().includes(giftSearch.toLowerCase());
    const matchesActive = !giftFilterActiveOnly || gift.ativo;
    return matchesCat && matchesSearch && matchesActive;
  });

  const activeGiftsCount = gifts.filter(g => g.ativo).length;
  const totalGiftsValue = gifts.filter(g => g.ativo).reduce((acc, g) => acc + g.valor_customizado, 0);

  // New Guest submission
  const handleAddGuestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGuestForm.nome.trim()) {
      showToast('Por favor, informe o nome do convidado.', 'info');
      return;
    }
    addGuest({
      nome: newGuestForm.nome,
      email: newGuestForm.email || 'contato@convidado.com',
      whatsapp: newGuestForm.whatsapp || '+55 11 99999-0000',
      status_rsvp: 'pendente',
      restricoes_alimentares: newGuestForm.restricoes_alimentares || 'Nenhuma',
      acompanhantes: Number(newGuestForm.acompanhantes) || 0,
    });
    setNewGuestForm({
      nome: '',
      email: '',
      whatsapp: '',
      acompanhantes: 0,
      restricoes_alimentares: '',
    });
    setIsAddGuestModalOpen(false);
  };

  const handleSaqueSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (saqueValor <= 0 || saqueValor > couple.saldo_disponivel) {
      showToast('Valor de saque inválido ou superior ao saldo disponível.', 'info');
      return;
    }
    updateCouple({
      saldo_disponivel: Number((couple.saldo_disponivel - saqueValor).toFixed(2))
    });
    setIsSaqueModalOpen(false);
    showToast(`Solicitação de saque PIX de R$ ${saqueValor.toFixed(2)} enviada com sucesso! Liquidação em D+2 na chave: ${couple.pix_chave}`, 'success');
  };

  return (
    <div className="min-h-screen bg-[#F9F9F9] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Welcome Header */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-xs text-[#9F825B] font-medium">
              <span>{couple.espaco_nome}</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono text-stone-500">{couple.hashtag}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#111111]">
              Painel dos Noivos — {couple.noivo_nome} & {couple.noiva_nome}
            </h1>
            <p className="text-sm text-stone-600">
              Gerencie seus convites, lista de 200 presentes, confirmações de RSVP e repasses financeiros Getnet.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setActiveView('public_site')}
              className="flex items-center gap-2 px-4 py-2 text-xs font-semibold bg-[#111111] text-[#DFCDAE] hover:text-white rounded-lg transition-colors shadow-xs"
            >
              <span>Ver Nosso Site ao Vivo</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setActiveTab('share')}
              className="flex items-center gap-2 px-4 py-2 text-xs font-medium bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg transition-colors border border-stone-200"
            >
              <Share2 className="w-3.5 h-3.5 text-[#C5A880]" />
              <span>Gerador de Convites</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-stone-200 pb-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 text-xs font-medium rounded-lg transition-all whitespace-nowrap ${
              activeTab === 'overview'
                ? 'bg-[#111111] text-[#C5A880] shadow-xs font-semibold'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            Visão Geral & Finanças
          </button>
          <button
            onClick={() => setActiveTab('gifts')}
            className={`px-4 py-2 text-xs font-medium rounded-lg transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'gifts'
                ? 'bg-[#111111] text-[#C5A880] shadow-xs font-semibold'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            <span>Lista de Presentes (200 itens)</span>
            <span className="text-[10px] bg-[#C5A880]/20 text-[#9F825B] px-1.5 py-0.2 rounded-full font-mono">
              {activeGiftsCount} ativos
            </span>
          </button>
          <button
            onClick={() => setActiveTab('guests')}
            className={`px-4 py-2 text-xs font-medium rounded-lg transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'guests'
                ? 'bg-[#111111] text-[#C5A880] shadow-xs font-semibold'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            <span>Gestão de Convidados & RSVP</span>
            <span className="text-[10px] bg-stone-200 text-stone-700 px-1.5 py-0.2 rounded-full font-mono">
              {guests.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('share')}
            className={`px-4 py-2 text-xs font-medium rounded-lg transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'share'
                ? 'bg-[#111111] text-[#C5A880] shadow-xs font-semibold'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            <QrCode className="w-3.5 h-3.5 text-[#C5A880]" />
            <span>Hub de Compartilhamento</span>
          </button>
        </div>

        {/* TAB 1: OVERVIEW & COUNTDOWN & FINANCIALS */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* Top Grid: Countdown + Financial Balance */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Countdown Card */}
              <div className="bg-gradient-to-br from-[#111111] to-stone-900 text-white p-6 rounded-2xl border border-stone-800 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-stone-400 mb-2">
                    <span className="text-xs uppercase tracking-widest text-[#C5A880] font-semibold">Contagem Regressiva</span>
                    <Clock className="w-4 h-4 text-[#C5A880]" />
                  </div>
                  <h3 className="text-xl font-serif font-bold text-white">
                    17 de Outubro de 2027
                  </h3>
                  <p className="text-xs text-stone-400 mt-1">
                    Welucci Gardens · Cerimônia & Festa
                  </p>
                </div>

                <div className="grid grid-cols-4 gap-2 text-center py-6">
                  <div className="bg-white/5 border border-white/10 rounded-xl p-2.5">
                    <div className="text-2xl sm:text-3xl font-mono font-bold text-[#C5A880] tabular-nums">
                      {timeLeft.days}
                    </div>
                    <div className="text-[10px] text-stone-400 uppercase tracking-wider mt-1">Dias</div>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-xl p-2.5">
                    <div className="text-2xl sm:text-3xl font-mono font-bold text-white tabular-nums">
                      {timeLeft.hours}
                    </div>
                    <div className="text-[10px] text-stone-400 uppercase tracking-wider mt-1">Horas</div>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-xl p-2.5">
                    <div className="text-2xl sm:text-3xl font-mono font-bold text-white tabular-nums">
                      {timeLeft.minutes}
                    </div>
                    <div className="text-[10px] text-stone-400 uppercase tracking-wider mt-1">Min</div>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-xl p-2.5">
                    <div className="text-2xl sm:text-3xl font-mono font-bold text-stone-300 tabular-nums">
                      {timeLeft.seconds}
                    </div>
                    <div className="text-[10px] text-stone-400 uppercase tracking-wider mt-1">Seg</div>
                  </div>
                </div>

                <div className="text-center text-xs text-stone-400 border-t border-white/10 pt-3">
                  {totalAttending} presenças já confirmadas para celebrar com vocês!
                </div>
              </div>

              {/* Saldo Disponível para Saque */}
              <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-stone-500 mb-2">
                    <span className="text-xs uppercase tracking-wider font-semibold text-stone-700">Saldo Disponível para Saque</span>
                    <Wallet className="w-4 h-4 text-[#C5A880]" />
                  </div>
                  <div className="text-3xl sm:text-4xl font-mono font-bold text-[#111111] tabular-nums mt-1">
                    R$ {couple.saldo_disponivel.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </div>
                  <div className="text-xs text-emerald-700 flex items-center gap-1.5 mt-2 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100 w-fit">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Liberado para transferência PIX imediata (D+2)</span>
                  </div>
                </div>

                <div className="space-y-3 pt-6 border-t border-stone-100">
                  <div className="flex justify-between text-xs text-stone-600">
                    <span>A compensar (Cartão D+14):</span>
                    <strong className="font-mono tabular-nums text-stone-900">
                      R$ {(couple.saldo_bloqueado_d14 || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </strong>
                  </div>
                  <div className="flex justify-between text-xs text-stone-600">
                    <span>Chave PIX cadastrada:</span>
                    <span className="font-mono text-[11px] text-stone-800 truncate max-w-[170px]">{couple.pix_chave}</span>
                  </div>
                  <button
                    onClick={() => {
                      setSaqueValor(couple.saldo_disponivel);
                      setIsSaqueModalOpen(true);
                    }}
                    className="w-full py-2.5 bg-[#C5A880] hover:bg-[#9F825B] text-white rounded-lg text-xs font-semibold transition-colors shadow-xs"
                  >
                    Solicitar Saque PIX Agora
                  </button>
                </div>
              </div>

              {/* Fee Pass-through Settings Toggle */}
              <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-stone-500 mb-2">
                    <span className="text-xs uppercase tracking-wider font-semibold text-stone-700">Configuração de Taxas Getnet</span>
                    <Sliders className="w-4 h-4 text-[#C5A880]" />
                  </div>
                  <h4 className="text-base font-semibold text-[#111111] mt-1">
                    Repassar Taxas ao Convidado
                  </h4>
                  <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                    Quando <strong className="text-[#111111]">ativado</strong>, a taxa administrativa da Getnet (1.99% PIX ou 4.99% Cartão) é somada no checkout do convidado. Quando <strong className="text-[#111111]">desativado</strong>, os noivos recebem o valor líquido com desconto das taxas.
                  </p>
                </div>

                <div className="pt-6 border-t border-stone-100">
                  <div className="flex items-center justify-between bg-[#F9F9F9] p-3.5 rounded-xl border border-stone-200">
                    <div>
                      <div className="text-xs font-semibold text-stone-900">
                        {couple.repassar_taxas ? 'Repassar ao Convidado (Ativo)' : 'Absorver pelos Noivos'}
                      </div>
                      <div className="text-[11px] text-stone-500">
                        {couple.repassar_taxas ? 'Convidado paga o acréscimo' : 'Convidado paga apenas valor de face'}
                      </div>
                    </div>
                    <button
                      onClick={toggleRepassarTaxas}
                      className="p-1 text-[#C5A880] hover:text-[#9F825B] transition-transform active:scale-95"
                    >
                      {couple.repassar_taxas ? (
                        <ToggleRight className="w-8 h-8 text-[#C5A880]" />
                      ) : (
                        <ToggleLeft className="w-8 h-8 text-stone-300" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

            </div>

            {/* Dynamic RSVP Graph & Statistics */}
            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-stone-100">
                <div>
                  <h3 className="text-lg font-serif font-bold text-[#111111]">
                    Gráfico RSVP & Análise de Presenças
                  </h3>
                  <p className="text-xs text-stone-500">
                    Entrada de dados atualizada em tempo real conforme os convidados respondem ao formulário.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-stone-600">Total na Lista: <strong className="text-[#111111]">{guests.length} titulares</strong></span>
                  <span className="text-stone-300">|</span>
                  <span className="text-xs text-[#9F825B] font-semibold">Total Confirmado: {totalAttending} pessoas</span>
                </div>
              </div>

              {/* Progress Visual Bar */}
              <div className="space-y-2 mb-6">
                <div className="h-4 w-full bg-stone-100 rounded-full overflow-hidden flex shadow-inner">
                  <div 
                    style={{ width: `${(confirmedGuests.length / (guests.length || 1)) * 100}%` }}
                    className="bg-emerald-500 h-full transition-all duration-500"
                    title={`Confirmados: ${confirmedGuests.length}`}
                  />
                  <div 
                    style={{ width: `${(declinedGuests.length / (guests.length || 1)) * 100}%` }}
                    className="bg-stone-400 h-full transition-all duration-500"
                    title={`Recusados: ${declinedGuests.length}`}
                  />
                  <div 
                    style={{ width: `${(pendingGuests.length / (guests.length || 1)) * 100}%` }}
                    className="bg-amber-400 h-full transition-all duration-500"
                    title={`Pendentes: ${pendingGuests.length}`}
                  />
                </div>
                <div className="flex items-center justify-between text-xs text-stone-500 pt-1">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <span>Confirmados ({confirmedGuests.length} titulares + {totalCompanions} acompanhantes)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-stone-400" />
                    <span>Recusados ({declinedGuests.length})</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                    <span>Pendentes ({pendingGuests.length})</span>
                  </div>
                </div>
              </div>

              {/* Dietary summary pills without AI slop */}
              <div className="bg-[#F9F9F9] p-4 rounded-xl border border-stone-200">
                <h4 className="text-xs uppercase tracking-wider font-semibold text-stone-700 mb-2">
                  Restrições Alimentares Sinalizadas para o Buffet Welucci Gardens
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="bg-white p-3 rounded-lg border border-stone-200">
                    <span className="text-stone-500">Vegetarianos / Veganos:</span>
                    <strong className="block text-sm font-semibold text-stone-900 mt-0.5">2 convidados</strong>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-stone-200">
                    <span className="text-stone-500">Celíacos (Sem Glúten):</span>
                    <strong className="block text-sm font-semibold text-stone-900 mt-0.5">1 convidado (Dra. Beatriz)</strong>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-stone-200">
                    <span className="text-stone-500">Intolerantes a Lactose:</span>
                    <strong className="block text-sm font-semibold text-stone-900 mt-0.5">1 convidado (Camila Silveira)</strong>
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: GIFTS MANAGER (200 ITEMS WITH NUMBER INPUT PRICE EDIT) */}
        {activeTab === 'gifts' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Control Bar */}
            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-serif font-bold text-[#111111]">
                      Gerenciador Global da Lista de Presentes
                    </h3>
                    <span className="text-xs bg-[#C5A880]/15 text-[#9F825B] px-2 py-0.5 rounded font-mono font-semibold">
                      200 Itens Carregados
                    </span>
                  </div>
                  <p className="text-xs text-stone-500 mt-1">
                    Edite o valor de qualquer presente diretamente no campo numérico e ative/desative conforme a preferência do casal.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={activateAllGifts}
                    className="px-3 py-1.5 text-xs bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-md transition-colors border border-stone-200"
                  >
                    Ativar Todos
                  </button>
                  <button
                    onClick={resetAllGiftPrices}
                    className="px-3 py-1.5 text-xs bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-md transition-colors border border-stone-200"
                  >
                    Restaurar Preços Sugeridos
                  </button>
                </div>
              </div>

              {/* Filters & Search */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3 border-t border-stone-100">
                <div className="relative flex-1 max-w-md">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    type="text"
                    placeholder="Filtrar por nome do presente (ex: Paris, Airfryer, Cristal...)"
                    value={giftSearch}
                    onChange={(e) => setGiftSearch(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#F9F9F9] border border-stone-200 rounded-md focus:outline-none focus:border-[#C5A880]"
                  />
                </div>

                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  <label className="flex items-center gap-1.5 text-xs text-stone-600 cursor-pointer shrink-0">
                    <input
                      type="checkbox"
                      checked={giftFilterActiveOnly}
                      onChange={(e) => setGiftFilterActiveOnly(e.target.checked)}
                      className="rounded border-stone-300 text-[#C5A880] focus:ring-[#C5A880]"
                    />
                    <span>Apenas ativos</span>
                  </label>
                  <select
                    value={giftCategory}
                    onChange={(e) => setGiftCategory(e.target.value)}
                    className="text-xs bg-[#F9F9F9] border border-stone-200 rounded-md px-2.5 py-1.5 focus:outline-none focus:border-[#C5A880]"
                  >
                    <option value="all">Todas as Categorias</option>
                    {categories.filter(c => c !== 'all').map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Gifts Grid / Table */}
            <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
              <div className="p-4 bg-[#F9F9F9] border-b border-stone-200 flex justify-between items-center text-xs text-stone-500">
                <span>Exibindo <strong>{filteredGifts.length}</strong> de <strong>{gifts.length}</strong> itens</span>
                <span className="font-mono tabular-nums">
                  Valor Total Vitrine Ativa: <strong className="text-stone-900">R$ {totalGiftsValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong>
                </span>
              </div>

              <div className="divide-y divide-stone-100 max-h-[640px] overflow-y-auto">
                {filteredGifts.map((gift) => (
                  <div 
                    key={gift.id}
                    className={`p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors ${
                      gift.ativo ? 'hover:bg-stone-50/70' : 'bg-stone-50/50 opacity-60'
                    }`}
                  >
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <button
                        onClick={() => toggleGiftActive(gift.id)}
                        className={`mt-1 p-1 rounded-md transition-colors ${
                          gift.ativo ? 'text-emerald-600 hover:text-emerald-700' : 'text-stone-300 hover:text-stone-400'
                        }`}
                        title={gift.ativo ? 'Desativar da vitrine' : 'Ativar na vitrine'}
                      >
                        {gift.ativo ? <ToggleRight className="w-6 h-6" /> : <ToggleLeft className="w-6 h-6" />}
                      </button>

                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-stone-400 font-mono">#{gift.id.replace('gift_', '')}</span>
                          <span className="text-[11px] font-medium text-[#9F825B] uppercase tracking-wider">{gift.categoria}</span>
                          {gift.popular && (
                            <span className="text-[9px] bg-[#C5A880]/15 text-[#9F825B] px-1.5 py-0.2 rounded font-semibold">
                              Destaque
                            </span>
                          )}
                        </div>
                        <h4 className="text-sm font-semibold text-stone-900 leading-snug">
                          {gift.nome_item}
                        </h4>
                        <p className="text-xs text-stone-500 line-clamp-1">
                          {gift.descricao}
                        </p>
                      </div>
                    </div>

                    {/* Numeric Input for Manual Value Customization */}
                    <div className="flex items-center gap-4 self-end sm:self-auto shrink-0">
                      <div className="text-right">
                        <div className="text-[10px] text-stone-400">Preço Sugerido</div>
                        <div className="text-xs font-mono tabular-nums text-stone-500 line-through">
                          R$ {gift.valor_sugerido.toFixed(2)}
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 bg-[#F9F9F9] border border-stone-200 rounded-lg p-1 px-2.5">
                        <span className="text-xs font-semibold text-stone-500">R$</span>
                        <input
                          type="number"
                          step="10"
                          min="10"
                          max="20000"
                          value={gift.valor_customizado}
                          onChange={(e) => updateGiftPrice(gift.id, Number(e.target.value))}
                          className="w-24 text-sm font-mono font-bold text-stone-900 bg-transparent focus:outline-none tabular-nums text-right"
                          title="Edite o valor deste presente manualmente"
                        />
                      </div>

                      <button
                        onClick={() => toggleGiftActive(gift.id)}
                        className={`text-xs px-2.5 py-1.5 rounded-md border font-medium transition-colors ${
                          gift.ativo 
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                            : 'bg-stone-100 text-stone-500 border-stone-200 hover:bg-stone-200'
                        }`}
                      >
                        {gift.ativo ? 'Ativo' : 'Oculto'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: GUEST LIST & RSVP MANAGEMENT */}
        {activeTab === 'guests' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-serif font-bold text-[#111111]">
                  Gestão de Convidados & Confirmações de Presença
                </h3>
                <p className="text-xs text-stone-500 mt-1">
                  Acompanhe os dados de cada convidado, restrições alimentares e links únicos de convite.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsAddGuestModalOpen(true)}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-[#111111] text-[#DFCDAE] hover:text-white rounded-lg text-xs font-semibold transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Adicionar Convidado</span>
                </button>
              </div>
            </div>

            {/* Guest Table */}
            <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F9F9F9] text-stone-500 uppercase tracking-wider font-medium border-b border-stone-200">
                    <tr>
                      <th className="py-3 px-4">Nome do Convidado</th>
                      <th className="py-3 px-4">Status RSVP</th>
                      <th className="py-3 px-4 text-center">Acompanhantes</th>
                      <th className="py-3 px-4">Restrições Alimentares</th>
                      <th className="py-3 px-4">Link Único de Convite</th>
                      <th className="py-3 px-4 text-center">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {guests.map((guest) => (
                      <tr key={guest.id} className="hover:bg-stone-50/70 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-stone-900">{guest.nome}</div>
                          <div className="text-[11px] text-stone-500">{guest.whatsapp} · {guest.email}</div>
                        </td>
                        <td className="py-3.5 px-4">
                          {guest.status_rsvp === 'confirmado' && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              Confirmado
                            </span>
                          )}
                          {guest.status_rsvp === 'recusado' && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-semibold bg-stone-100 text-stone-600 border border-stone-200">
                              Recusado
                            </span>
                          )}
                          {guest.status_rsvp === 'pendente' && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                              Pendente
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-center font-mono font-semibold text-stone-900 tabular-nums">
                          +{guest.acompanhantes}
                        </td>
                        <td className="py-3.5 px-4 text-stone-700">
                          {guest.restricoes_alimentares || 'Nenhuma'}
                        </td>
                        <td className="py-3.5 px-4">
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(guest.link_convite_unico);
                              showToast(`Link de ${guest.nome} copiado!`, 'success');
                            }}
                            className="flex items-center gap-1 text-[11px] font-mono text-[#9F825B] hover:underline"
                          >
                            <Copy className="w-3 h-3" />
                            <span>Copiar Link Individual</span>
                          </button>
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <button
                            onClick={() => removeGuest(guest.id)}
                            className="p-1.5 text-stone-400 hover:text-red-600 rounded transition-colors"
                            title="Remover convidado"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: SHARING HUB & QR CODE GENERATOR */}
        {activeTab === 'share' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-xs">
              <div className="max-w-3xl space-y-2 mb-8">
                <span className="text-xs uppercase tracking-widest text-[#C5A880] font-semibold">
                  Hub de Compartilhamento & Convites
                </span>
                <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#111111]">
                  Compartilhe seu Casamento com 1 Clique
                </h3>
                <p className="text-sm text-stone-600 leading-relaxed">
                  Utilize o link exclusivo do casal ou o QR Code em alta resolução para enviar aos convidados via WhatsApp, E-mail ou incluir na Bio e Stories do Instagram.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                {/* Visual QR Code Card */}
                <div className="bg-[#F9F9F9] p-8 rounded-2xl border border-stone-200 text-center flex flex-col items-center justify-center space-y-4 shadow-inner">
                  <div className="p-4 bg-white rounded-xl border border-stone-200 shadow-sm relative group">
                    {/* Simulated High-Res SVG QR Code */}
                    <svg viewBox="0 0 100 100" className="w-48 h-48 sm:w-56 sm:h-56">
                      <rect width="100" height="100" fill="#ffffff" />
                      {/* Outer positioning squares */}
                      <rect x="5" y="5" width="28" height="28" fill="#111111" rx="2" />
                      <rect x="9" y="9" width="20" height="20" fill="#ffffff" rx="1" />
                      <rect x="13" y="13" width="12" height="12" fill="#C5A880" rx="1" />

                      <rect x="67" y="5" width="28" height="28" fill="#111111" rx="2" />
                      <rect x="71" y="9" width="20" height="20" fill="#ffffff" rx="1" />
                      <rect x="75" y="13" width="12" height="12" fill="#C5A880" rx="1" />

                      <rect x="5" y="67" width="28" height="28" fill="#111111" rx="2" />
                      <rect x="9" y="71" width="20" height="20" fill="#ffffff" rx="1" />
                      <rect x="13" y="75" width="12" height="12" fill="#C5A880" rx="1" />

                      {/* Micro QR Data Dots Matrix */}
                      <circle cx="45" cy="15" r="2.5" fill="#111111" />
                      <circle cx="55" cy="15" r="2.5" fill="#111111" />
                      <circle cx="40" cy="25" r="2.5" fill="#C5A880" />
                      <circle cx="50" cy="25" r="2.5" fill="#111111" />
                      <circle cx="60" cy="25" r="2.5" fill="#111111" />
                      
                      <circle cx="15" cy="45" r="2.5" fill="#111111" />
                      <circle cx="25" cy="45" r="2.5" fill="#C5A880" />
                      <circle cx="45" cy="45" r="3.5" fill="#111111" />
                      <circle cx="55" cy="45" r="2.5" fill="#C5A880" />
                      <circle cx="75" cy="45" r="2.5" fill="#111111" />
                      <circle cx="85" cy="45" r="2.5" fill="#111111" />

                      <circle cx="15" cy="55" r="2.5" fill="#111111" />
                      <circle cx="35" cy="55" r="2.5" fill="#111111" />
                      <circle cx="45" cy="55" r="2.5" fill="#C5A880" />
                      <circle cx="65" cy="55" r="2.5" fill="#111111" />
                      <circle cx="85" cy="55" r="2.5" fill="#C5A880" />

                      <circle cx="45" cy="75" r="2.5" fill="#111111" />
                      <circle cx="55" cy="75" r="2.5" fill="#111111" />
                      <circle cx="40" cy="85" r="2.5" fill="#C5A880" />
                      <circle cx="50" cy="85" r="2.5" fill="#111111" />
                      <circle cx="60" cy="85" r="2.5" fill="#111111" />
                      <circle cx="70" cy="85" r="2.5" fill="#111111" />
                      <circle cx="80" cy="85" r="2.5" fill="#111111" />

                      {/* Center Welucci Emblem */}
                      <circle cx="50" cy="50" r="10" fill="#480927" stroke="#ffffff" strokeWidth="1.2" />
                      <circle cx="50" cy="50" r="8.5" fill="none" stroke="#DFCDAE" strokeWidth="0.6" />
                      <path d="M 50 44 Q 50 50 56 50 Q 50 50 50 56 Q 50 50 44 50 Q 50 50 50 44 Z" fill="#ffffff" />
                    </svg>
                  </div>

                  <div>
                    <div className="font-serif font-bold text-base text-stone-900">
                      {couple.noivo_nome} & {couple.noiva_nome}
                    </div>
                    <div className="text-xs text-stone-500 font-mono mt-0.5">
                      {couple.hashtag} · Welucci Gardens
                    </div>
                  </div>
                </div>

                {/* Share Link & One-Click Buttons */}
                <div className="space-y-6">
                  {/* Link Copy Box */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-stone-700">
                      Link Único do Casamento (URL Oficial)
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        readOnly
                        value={weddingUniqueLink}
                        className="flex-1 bg-[#F9F9F9] border border-stone-200 rounded-lg px-3.5 py-2.5 text-xs font-mono text-stone-900 select-all"
                      />
                      <button
                        onClick={handleCopyLink}
                        className="px-4 py-2.5 bg-[#111111] hover:bg-stone-900 text-[#DFCDAE] hover:text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0 shadow-xs"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copiar</span>
                      </button>
                    </div>
                  </div>

                  {/* Fast Action Buttons */}
                  <div className="space-y-3 pt-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-stone-700 block">
                      Disparo Rápido em Redes Sociais
                    </label>

                    {/* WhatsApp */}
                    <button
                      onClick={handleShareWhatsApp}
                      className="w-full flex items-center justify-between p-3.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-900 transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
                          <MessageCircle className="w-5 h-5" />
                        </div>
                        <div className="text-left">
                          <div className="text-xs font-semibold">Compartilhar via WhatsApp</div>
                          <div className="text-[11px] text-emerald-700">Abre mensagem pronta com data e link</div>
                        </div>
                      </div>
                      <ArrowUpRight className="w-4 h-4 text-emerald-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </button>

                    {/* E-mail */}
                    <button
                      onClick={handleShareEmail}
                      className="w-full flex items-center justify-between p-3.5 rounded-xl bg-stone-50 hover:bg-stone-100 border border-stone-200 text-stone-900 transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-[#111111] text-[#C5A880] flex items-center justify-center">
                          <Mail className="w-5 h-5" />
                        </div>
                        <div className="text-left">
                          <div className="text-xs font-semibold">Enviar por E-mail Formal</div>
                          <div className="text-[11px] text-stone-500">Abre mailto com layout de convite elegante</div>
                        </div>
                      </div>
                      <ArrowUpRight className="w-4 h-4 text-stone-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </button>

                    {/* Instagram */}
                    <button
                      onClick={handleShareInstagram}
                      className="w-full flex items-center justify-between p-3.5 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-900 transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white flex items-center justify-center">
                          <Instagram className="w-5 h-5" />
                        </div>
                        <div className="text-left">
                          <div className="text-xs font-semibold">Copiar para Instagram Bio / Stories</div>
                          <div className="text-[11px] text-rose-700">Link rápido pronto para colar nos Stories com figurinha</div>
                        </div>
                      </div>
                      <ArrowUpRight className="w-4 h-4 text-rose-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: SAQUE PIX */}
        {isSaqueModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <h3 className="text-lg font-serif font-bold text-stone-900">
                  Solicitação de Saque PIX
                </h3>
                <button 
                  onClick={() => setIsSaqueModalOpen(false)}
                  className="text-stone-400 hover:text-stone-600 text-xs font-bold"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSaqueSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">
                    Valor a Transferir (Disponível: R$ {couple.saldo_disponivel.toFixed(2)})
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-stone-500">R$</span>
                    <input
                      type="number"
                      step="0.01"
                      max={couple.saldo_disponivel}
                      value={saqueValor}
                      onChange={(e) => setSaqueValor(Number(e.target.value))}
                      className="w-full pl-10 pr-3 py-2 text-base font-mono font-bold text-stone-900 border border-stone-200 rounded-lg focus:outline-none focus:border-[#C5A880]"
                    />
                  </div>
                </div>

                <div className="bg-[#F9F9F9] p-3 rounded-lg border border-stone-200 text-xs space-y-1">
                  <div className="text-stone-500">Destino do Pagamento:</div>
                  <div className="font-semibold text-stone-900">{couple.banco_saque}</div>
                  <div className="font-mono text-stone-600">Chave PIX: {couple.pix_chave}</div>
                  <div className="text-[11px] text-[#9F825B] pt-1">
                    Prazo de liquidação: D+2 para PIX · Isento de taxas de saque
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsSaqueModalOpen(false)}
                    className="px-4 py-2 text-xs font-medium text-stone-600 hover:bg-stone-100 rounded-lg"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-semibold bg-[#C5A880] hover:bg-[#9F825B] text-white rounded-lg transition-colors shadow-xs"
                  >
                    Confirmar Saque
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL: ADD GUEST */}
        {isAddGuestModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <h3 className="text-lg font-serif font-bold text-stone-900">
                  Adicionar Convidado à Lista
                </h3>
                <button 
                  onClick={() => setIsAddGuestModalOpen(false)}
                  className="text-stone-400 hover:text-stone-600 text-xs font-bold"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleAddGuestSubmit} className="space-y-3.5">
                <div>
                  <label className="text-xs font-medium text-stone-700 block mb-1">
                    Nome Completo / Família *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Eduardo Guimarães & Família"
                    value={newGuestForm.nome}
                    onChange={(e) => setNewGuestForm({ ...newGuestForm, nome: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-stone-200 rounded-lg focus:outline-none focus:border-[#C5A880]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-stone-700 block mb-1">
                      WhatsApp
                    </label>
                    <input
                      type="text"
                      placeholder="+55 11 99999-0000"
                      value={newGuestForm.whatsapp}
                      onChange={(e) => setNewGuestForm({ ...newGuestForm, whatsapp: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-stone-200 rounded-lg focus:outline-none focus:border-[#C5A880]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-stone-700 block mb-1">
                      Acompanhantes
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="10"
                      value={newGuestForm.acompanhantes}
                      onChange={(e) => setNewGuestForm({ ...newGuestForm, acompanhantes: Number(e.target.value) })}
                      className="w-full px-3 py-2 text-xs border border-stone-200 rounded-lg focus:outline-none focus:border-[#C5A880]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-stone-700 block mb-1">
                    E-mail
                  </label>
                  <input
                    type="email"
                    placeholder="convidado@email.com"
                    value={newGuestForm.email}
                    onChange={(e) => setNewGuestForm({ ...newGuestForm, email: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-stone-200 rounded-lg focus:outline-none focus:border-[#C5A880]"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-stone-700 block mb-1">
                    Restrições Alimentares Conhecidas
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Celíaco, Vegano, Sem lactose..."
                    value={newGuestForm.restricoes_alimentares}
                    onChange={(e) => setNewGuestForm({ ...newGuestForm, restricoes_alimentares: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-stone-200 rounded-lg focus:outline-none focus:border-[#C5A880]"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAddGuestModalOpen(false)}
                    className="px-4 py-2 text-xs font-medium text-stone-600 hover:bg-stone-100 rounded-lg"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-semibold bg-[#111111] hover:bg-stone-900 text-white rounded-lg transition-colors shadow-xs"
                  >
                    Salvar Convidado
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
