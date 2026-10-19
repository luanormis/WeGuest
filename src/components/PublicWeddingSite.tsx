import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { WEDDING_IMAGES } from '../data/assets';
import { Presente } from '../types';
import { WelucciLogo } from './WelucciLogo';
import { 
  Calendar, 
  Clock, 
  Heart, 
  MapPin, 
  Navigation as NavigationIcon, 
  Sparkles, 
  Search, 
  CreditCard, 
  MessageSquare, 
  CheckCircle2, 
  Send,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Compass
} from 'lucide-react';

export const PublicWeddingSite: React.FC = () => {
  const { 
    couple, 
    gifts, 
    guestbook, 
    addGuestbookMessage, 
    addOrUpdateRsvp, 
    openCheckout, 
    showToast 
  } = useApp();

  // Internal page navigation
  const [activeSection, setActiveSection] = useState<'home' | 'schedule' | 'rsvp' | 'gifts' | 'guestbook'>('home');

  // Gift Registry filters
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [giftSearchQuery, setGiftSearchQuery] = useState<string>('');
  const [priceSort, setPriceSort] = useState<'asc' | 'desc' | 'popular'>('popular');

  // RSVP Form State
  const [rsvpNome, setRsvpNome] = useState('');
  const [rsvpEmail, setRsvpEmail] = useState('');
  const [rsvpWhatsapp, setRsvpWhatsapp] = useState('');
  const [rsvpStatus, setRsvpStatus] = useState<'confirmado' | 'recusado'>('confirmado');
  const [rsvpAcompanhantes, setRsvpAcompanhantes] = useState(0);
  const [rsvpRestricoes, setRsvpRestricoes] = useState('');
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false);

  // Guestbook Form State
  const [guestAuthor, setGuestAuthor] = useState('');
  const [guestRelation, setGuestRelation] = useState('');
  const [guestMessage, setGuestMessage] = useState('');

  // Filter gifts to show active ones
  const activeGifts = gifts.filter(g => g.ativo);
  const categories = ['all', ...Array.from(new Set(activeGifts.map(g => g.categoria)))];

  const displayedGifts = activeGifts
    .filter(g => {
      const matchCat = selectedCategory === 'all' || g.categoria === selectedCategory;
      const matchSearch = g.nome_item.toLowerCase().includes(giftSearchQuery.toLowerCase());
      return matchCat && matchSearch;
    })
    .sort((a, b) => {
      if (priceSort === 'asc') return a.valor_customizado - b.valor_customizado;
      if (priceSort === 'desc') return b.valor_customizado - a.valor_customizado;
      if (priceSort === 'popular') return (b.popular ? 1 : 0) - (a.popular ? 1 : 0);
      return 0;
    });

  const handleRsvpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rsvpNome.trim()) {
      showToast('Por favor, informe seu nome completo.', 'info');
      return;
    }
    addOrUpdateRsvp({
      nome: rsvpNome,
      email: rsvpEmail,
      whatsapp: rsvpWhatsapp,
      status_rsvp: rsvpStatus,
      restricoes_alimentares: rsvpRestricoes || 'Nenhuma restrição',
      acompanhantes: Number(rsvpAcompanhantes) || 0,
    });
    setRsvpSubmitted(true);
  };

  const handleGuestbookSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestAuthor.trim() || !guestMessage.trim()) {
      showToast('Por favor, preencha seu nome e sua mensagem.', 'info');
      return;
    }
    addGuestbookMessage(guestAuthor, guestRelation, guestMessage);
    setGuestAuthor('');
    setGuestRelation('');
    setGuestMessage('');
    showToast('Sua mensagem foi publicada no mural com sucesso!', 'gold');
  };

  return (
    <div className="min-h-screen bg-[#FFFFFF] text-[#111111]">
      
      {/* Wedding Micro-Navigation */}
      <nav className="sticky top-16 z-30 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-2xs">
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-12 overflow-x-auto">
          <div className="flex items-center gap-6 text-xs uppercase tracking-wider font-medium text-stone-600">
            <button
              onClick={() => setActiveSection('home')}
              className={`hover:text-[#111111] transition-colors whitespace-nowrap py-1 ${
                activeSection === 'home' ? 'text-[#111111] font-bold border-b-2 border-[#C5A880]' : ''
              }`}
            >
              Os Noivos
            </button>
            <button
              onClick={() => setActiveSection('schedule')}
              className={`hover:text-[#111111] transition-colors whitespace-nowrap py-1 ${
                activeSection === 'schedule' ? 'text-[#111111] font-bold border-b-2 border-[#C5A880]' : ''
              }`}
            >
              O Casamento & Espaço
            </button>
            <button
              onClick={() => setActiveSection('rsvp')}
              className={`hover:text-[#111111] transition-colors whitespace-nowrap py-1 ${
                activeSection === 'rsvp' ? 'text-[#111111] font-bold border-b-2 border-[#C5A880]' : ''
              }`}
            >
              Confirmar Presença (RSVP)
            </button>
            <button
              onClick={() => setActiveSection('gifts')}
              className={`hover:text-[#111111] transition-colors whitespace-nowrap py-1 flex items-center gap-1 ${
                activeSection === 'gifts' ? 'text-[#111111] font-bold border-b-2 border-[#C5A880]' : ''
              }`}
            >
              <span>Lista de Presentes</span>
              <span className="text-[10px] text-[#9F825B] font-mono">({activeGifts.length})</span>
            </button>
            <button
              onClick={() => setActiveSection('guestbook')}
              className={`hover:text-[#111111] transition-colors whitespace-nowrap py-1 ${
                activeSection === 'guestbook' ? 'text-[#111111] font-bold border-b-2 border-[#C5A880]' : ''
              }`}
            >
              Mural de Recados
            </button>
          </div>

          <button
            onClick={() => setActiveSection('gifts')}
            className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold tracking-wider uppercase px-3 py-1 bg-[#111111] text-[#DFCDAE] hover:text-white rounded transition-colors shrink-0"
          >
            <Sparkles className="w-3 h-3 text-[#C5A880]" />
            <span>Presentear Noivos</span>
          </button>
        </div>
      </nav>

      {/* SECTION: HERO & HOME */}
      {(activeSection === 'home' || activeSection === 'schedule') && (
        <>
          {/* Main Hero Header */}
          <section className="relative overflow-hidden bg-[#111111] text-white">
            <div className="absolute inset-0 z-0 opacity-40 mix-blend-luminosity">
              <img
                src={WEDDING_IMAGES.coupleHero}
                alt="Guilherme & Victória"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-[#111111]/60 to-transparent z-1" />

            <div className="relative z-10 max-w-5xl mx-auto px-4 py-20 sm:py-32 text-center space-y-6">
              <div className="inline-flex items-center gap-2.5 text-xs sm:text-sm tracking-[0.3em] uppercase text-[#DFCDAE] font-light bg-black/40 px-4 py-1.5 rounded-full border border-white/10 backdrop-blur-xs">
                <WelucciLogo iconOnly size={16} color="#DFCDAE" />
                <span>Welucci Gardens</span>
                <span className="text-[#C5A880]">·</span>
                <span>São Paulo</span>
              </div>

              <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif font-normal tracking-tight text-white leading-tight">
                {couple.noivo_nome} <span className="text-[#C5A880] italic font-serif">&</span> {couple.noiva_nome}
              </h1>

              <div className="w-24 h-px bg-gradient-to-r from-transparent via-[#C5A880] to-transparent mx-auto" />

              <p className="font-serif italic text-lg sm:text-xl text-[#DFCDAE]/90 max-w-xl mx-auto leading-relaxed">
                "O amor é paciente e bondoso. Celebramos a certeza de um amor que floresce em cada estação."
              </p>

              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4 text-xs font-mono tracking-widest text-stone-300">
                <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full border border-white/15 backdrop-blur-xs">
                  <Calendar className="w-4 h-4 text-[#C5A880]" />
                  <span>17 DE OUTUBRO DE 2027</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full border border-white/15 backdrop-blur-xs">
                  <MapPin className="w-4 h-4 text-[#C5A880]" />
                  <span>WELUCCI GARDENS, SP</span>
                </div>
              </div>

              <div className="pt-6 flex flex-wrap justify-center gap-3">
                <button
                  onClick={() => setActiveSection('rsvp')}
                  className="px-6 py-3 bg-[#C5A880] hover:bg-[#9F825B] text-white text-xs uppercase tracking-widest font-semibold rounded-md shadow-md transition-colors"
                >
                  Confirmar Presença (RSVP)
                </button>
                <button
                  onClick={() => setActiveSection('gifts')}
                  className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs uppercase tracking-widest font-semibold rounded-md backdrop-blur-xs transition-colors"
                >
                  Lista de Casamento
                </button>
              </div>
            </div>
          </section>

          {/* Couple Story Split */}
          <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="space-y-2">
                  <span className="text-xs uppercase tracking-[0.25em] text-[#C5A880] font-semibold">
                    A Nossa História
                  </span>
                  <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#111111]">
                    O início de uma jornada para a vida inteira
                  </h2>
                </div>
                
                <p className="text-stone-600 leading-relaxed text-sm">
                  De encontros despretensiosos a viagens inesquecíveis, construímos juntos cada detalhe do nosso sonho. Escolhemos o Welucci Gardens por representar perfeitamente o nosso estilo: a sofisticação da arquitetura moderna em total harmonia com a natureza exuberante de São Paulo.
                </p>

                <p className="text-stone-600 leading-relaxed text-sm">
                  Ter a sua presença ao nosso lado neste altar é o nosso maior presente. Esperamos você para celebrar, dançar e brindar ao amor!
                </p>

                <div className="pt-2 flex items-center gap-4 text-xs text-stone-500 font-mono">
                  <span className="font-semibold text-[#111111]">{couple.hashtag}</span>
                  <span>·</span>
                  <span>#GuiEViParaSempre</span>
                </div>
              </div>

              <div className="relative">
                <div className="aspect-4/3 rounded-2xl overflow-hidden border border-stone-200 shadow-md">
                  <img
                    src={WEDDING_IMAGES.coupleMoment}
                    alt="Guilherme & Victória votos"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-5 -left-5 bg-white p-4 rounded-xl border border-stone-200 shadow-lg hidden sm:block max-w-xs">
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#111111]">
                    <Sparkles className="w-4 h-4 text-[#C5A880]" />
                    <span>Cerimônia ao Entardecer</span>
                  </div>
                  <p className="text-[11px] text-stone-500 mt-1">
                    Cúpula de vidro do Welucci Gardens iluminada pela luz dourada natural.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Schedule of the Day at Welucci Gardens */}
          <section className="bg-[#F9F9F9] py-20 px-4 sm:px-6 lg:px-8 border-y border-stone-200">
            <div className="max-w-4xl mx-auto space-y-12">
              <div className="text-center space-y-3">
                <span className="text-xs uppercase tracking-[0.25em] text-[#C5A880] font-semibold">
                  17 de Outubro de 2027
                </span>
                <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#111111]">
                  Cronograma do Grande Dia
                </h2>
                <p className="text-xs sm:text-sm text-stone-600 max-w-lg mx-auto">
                  Programação pensada com todo carinho para que você aproveite cada minuto no Welucci Gardens.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-xs text-center space-y-2">
                  <div className="text-lg font-mono font-bold text-[#9F825B]">16:30</div>
                  <h4 className="text-sm font-semibold text-stone-900">Recepção dos Convidados</h4>
                  <p className="text-xs text-stone-500">Welcome drink no átrio botânico</p>
                </div>

                <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-xs text-center space-y-2 border-t-2 border-t-[#C5A880]">
                  <div className="text-lg font-mono font-bold text-[#111111]">17:00</div>
                  <h4 className="text-sm font-semibold text-stone-900">A Cerimônia Religiosa</h4>
                  <p className="text-xs text-stone-500">Sob o teto de cristal do Jardim Principal</p>
                </div>

                <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-xs text-center space-y-2">
                  <div className="text-lg font-mono font-bold text-[#9F825B]">18:30</div>
                  <h4 className="text-sm font-semibold text-stone-900">Jantar Gastronômico</h4>
                  <p className="text-xs text-stone-500">Menu exclusivo assinado pelo Chef Welucci</p>
                </div>

                <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-xs text-center space-y-2">
                  <div className="text-lg font-mono font-bold text-[#9F825B]">20:30</div>
                  <h4 className="text-sm font-semibold text-stone-900">Festa & Baile</h4>
                  <p className="text-xs text-stone-500">Pista aberta até o amanhecer</p>
                </div>
              </div>

              {/* Venue & Google Maps Integration */}
              <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs space-y-6">
                
                {/* Real Spaces of Welucci Gardens Tabs & Gallery */}
                <div className="p-6 sm:p-8 pb-0">
                  <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-stone-100">
                    <div>
                      <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-[#480927] font-semibold mb-1">
                        <WelucciLogo iconOnly size={16} color="#480927" />
                        <span>Espaço Oficial Contratado · 1.900 m²</span>
                      </div>
                      <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#111111]">
                        Welucci Gardens — Alto de Pinheiros
                      </h3>
                      <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-2xl leading-relaxed">
                        Av. Queiroz Filho, 830 - Alto de Pinheiros, São Paulo - SP. Um refúgio arborizado que integra natureza exuberante, jardim vertical com cascata d'água e arquitetura contemporânea em vidro.
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <a
                        href="https://welucci.com/welucci-gardens/?utm_source=www.google.com"
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1.5 text-xs text-[#480927] hover:text-[#35051C] font-semibold bg-[#480927]/10 hover:bg-[#480927]/20 px-3 py-1.5 rounded-lg transition-colors border border-[#480927]/20"
                      >
                        <span>Conhecer o Espaço</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                </div>

                {/* 4 Authentic Real Spaces Grid from welucci.com/welucci-gardens */}
                <div className="px-6 sm:px-8 grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Space 1: Cerimônia ao Ar Livre */}
                  <div className="rounded-xl overflow-hidden border border-stone-200 bg-[#F9F9F9] group">
                    <div className="aspect-16/10 overflow-hidden relative">
                      <img
                        src={WEDDING_IMAGES.gardensCeremony}
                        alt="Cerimônia ao Ar Livre Welucci Gardens"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3 bg-[#480927]/90 text-white text-[10px] uppercase font-mono tracking-wider px-2 py-0.5 rounded">
                        Altar & Jardins
                      </div>
                    </div>
                    <div className="p-4 space-y-1">
                      <h4 className="font-serif font-bold text-base text-stone-900">
                        Área da Cerimônia ao Ar Livre
                      </h4>
                      <p className="text-xs text-stone-600 leading-relaxed">
                        Pergolado de madeira nobre sob árvores tropicais e passarela integrada, com iluminação cênica ao entardecer.
                      </p>
                    </div>
                  </div>

                  {/* Space 2: Salão Principal de Vidro */}
                  <div className="rounded-xl overflow-hidden border border-stone-200 bg-[#F9F9F9] group">
                    <div className="aspect-16/10 overflow-hidden relative">
                      <img
                        src={WEDDING_IMAGES.gardensMainHall}
                        alt="Salão Principal de Vidro Welucci Gardens"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3 bg-[#480927]/90 text-white text-[10px] uppercase font-mono tracking-wider px-2 py-0.5 rounded">
                        Salão Rústico-Chique
                      </div>
                    </div>
                    <div className="p-4 space-y-1">
                      <h4 className="font-serif font-bold text-base text-stone-900">
                        Salão Principal Climatizado
                      </h4>
                      <p className="text-xs text-stone-600 leading-relaxed">
                        Estrutura metálica contemporânea com teto de vidro reflexivo, lustres de cristal e acústica de alta fidelidade.
                      </p>
                    </div>
                  </div>

                  {/* Space 3: Jardim Vertical & Cascata */}
                  <div className="rounded-xl overflow-hidden border border-stone-200 bg-[#F9F9F9] group">
                    <div className="aspect-16/10 overflow-hidden relative">
                      <img
                        src={WEDDING_IMAGES.gardensWaterfall}
                        alt="Jardim Vertical com Queda d'Água Welucci Gardens"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3 bg-[#480927]/90 text-white text-[10px] uppercase font-mono tracking-wider px-2 py-0.5 rounded">
                        Jardim Vertical & Bar
                      </div>
                    </div>
                    <div className="p-4 space-y-1">
                      <h4 className="font-serif font-bold text-base text-stone-900">
                        Paredão Botânico com Cascata d'Água
                      </h4>
                      <p className="text-xs text-stone-600 leading-relaxed">
                        A icônica queda d'água do Welucci Gardens em meio a orquídeas e samambaias gigantes, integrado ao lounge de coquetéis.
                      </p>
                    </div>
                  </div>

                  {/* Space 4: SPA dos Noivos */}
                  <div className="rounded-xl overflow-hidden border border-stone-200 bg-[#F9F9F9] group">
                    <div className="aspect-16/10 overflow-hidden relative">
                      <img
                        src={WEDDING_IMAGES.gardensSpa}
                        alt="SPA dos Noivos Welucci Gardens"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3 bg-[#480927]/90 text-white text-[10px] uppercase font-mono tracking-wider px-2 py-0.5 rounded">
                        SPA Exclusivo
                      </div>
                    </div>
                    <div className="p-4 space-y-1">
                      <h4 className="font-serif font-bold text-base text-stone-900">
                        SPA Privativo para o Dia dos Noivos
                      </h4>
                      <p className="text-xs text-stone-600 leading-relaxed">
                        Suíte mármore travertino para relaxamento, banheira de imersão e camarim com vista panorâmica para o jardim.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Directions & Logistics Box */}
                <div className="p-6 sm:p-8 bg-[#F9F9F9] border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="space-y-1 text-center sm:text-left">
                    <div className="text-xs font-semibold text-stone-900 flex items-center justify-center sm:justify-start gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#480927]" />
                      <span>Av. Queiroz Filho, 830 - Alto de Pinheiros, São Paulo - SP</span>
                    </div>
                    <p className="text-[11px] text-stone-500">
                      Capacidade para até 540 convidados · Serviço de valet com manobrista cortesia na entrada principal
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center justify-center gap-2">
                    <a
                      href="https://maps.google.com/?q=Av.+Queiroz+Filho,+830+-+Alto+de+Pinheiros,+Sao+Paulo"
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-stone-50 border border-stone-200 rounded-lg text-xs font-medium text-stone-800 transition-colors shadow-2xs"
                    >
                      <Compass className="w-3.5 h-3.5 text-[#C5A880]" />
                      <span>Google Maps</span>
                    </a>
                    <a
                      href="https://waze.com/ul?q=Av.+Queiroz+Filho,+830"
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-stone-50 border border-stone-200 rounded-lg text-xs font-medium text-stone-800 transition-colors shadow-2xs"
                    >
                      <NavigationIcon className="w-3.5 h-3.5 text-sky-600" />
                      <span>Waze</span>
                    </a>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText('Av. Queiroz Filho, 830 - Alto de Pinheiros, São Paulo - SP');
                        showToast('Endereço oficial do Welucci Gardens copiado para o seu app!', 'success');
                      }}
                      className="flex items-center gap-1.5 px-3.5 py-2 bg-[#111111] hover:bg-black text-[#DFCDAE] hover:text-white rounded-lg text-xs font-medium transition-colors shadow-xs"
                    >
                      <span>Copiar Endereço</span>
                    </button>
                  </div>
                </div>

              </div>
            </div>
          </section>
        </>
      )}

      {/* SECTION: RSVP FORM */}
      {(activeSection === 'rsvp' || activeSection === 'home') && (
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          <div className="bg-white p-8 sm:p-12 rounded-2xl border border-stone-200 shadow-xs space-y-8">
            <div className="text-center space-y-2 max-w-xl mx-auto">
              <span className="text-xs uppercase tracking-[0.25em] text-[#C5A880] font-semibold">
                R.S.V.P.
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#111111]">
                Confirmação de Presença
              </h2>
              <p className="text-xs sm:text-sm text-stone-600">
                Por favor, confirme sua presença até o dia 15 de Agosto de 2027 para organizarmos os lugares e o menu especial.
              </p>
            </div>

            {rsvpSubmitted ? (
              <div className="text-center py-10 space-y-4 bg-stone-50 rounded-xl border border-stone-200 p-6">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-serif font-bold text-stone-900">
                  Presença Registrada com Sucesso!
                </h3>
                <p className="text-xs text-stone-600 max-w-md mx-auto">
                  Obrigado, <strong className="text-stone-900">{rsvpNome}</strong>. Seus dados e restrições foram comunicados aos noivos e à equipe do Welucci Gardens.
                </p>
                <button
                  onClick={() => {
                    setRsvpSubmitted(false);
                    setRsvpNome('');
                    setRsvpEmail('');
                    setRsvpRestricoes('');
                  }}
                  className="px-4 py-2 text-xs font-semibold bg-[#111111] text-[#DFCDAE] hover:text-white rounded-md transition-colors"
                >
                  Confirmar Outro Convidado
                </button>
              </div>
            ) : (
              <form onSubmit={handleRsvpSubmit} className="space-y-6 max-w-xl mx-auto">
                {/* Decision Radio */}
                <div className="grid grid-cols-2 gap-3">
                  <label className={`p-4 rounded-xl border text-center cursor-pointer transition-all ${
                    rsvpStatus === 'confirmado' 
                      ? 'border-[#C5A880] bg-[#C5A880]/10 text-[#111111] font-semibold' 
                      : 'border-stone-200 hover:bg-stone-50 text-stone-600'
                  }`}>
                    <input
                      type="radio"
                      name="rsvpStatus"
                      value="confirmado"
                      checked={rsvpStatus === 'confirmado'}
                      onChange={() => setRsvpStatus('confirmado')}
                      className="sr-only"
                    />
                    <div className="text-sm">Sim, estarei presente!</div>
                    <div className="text-[10px] text-stone-500 mt-0.5">Com certeza irei celebrar</div>
                  </label>

                  <label className={`p-4 rounded-xl border text-center cursor-pointer transition-all ${
                    rsvpStatus === 'recusado' 
                      ? 'border-stone-800 bg-stone-100 text-[#111111] font-semibold' 
                      : 'border-stone-200 hover:bg-stone-50 text-stone-600'
                  }`}>
                    <input
                      type="radio"
                      name="rsvpStatus"
                      value="recusado"
                      checked={rsvpStatus === 'recusado'}
                      onChange={() => setRsvpStatus('recusado')}
                      className="sr-only"
                    />
                    <div className="text-sm">Infelizmente não poderei ir</div>
                    <div className="text-[10px] text-stone-500 mt-0.5">Desejo felicidades ao casal</div>
                  </label>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-medium text-stone-700 block mb-1">
                      Nome Completo do Titular *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Dra. Beatriz Albuquerque"
                      value={rsvpNome}
                      onChange={(e) => setRsvpNome(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs bg-[#F9F9F9] border border-stone-200 rounded-lg focus:outline-none focus:border-[#C5A880]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-medium text-stone-700 block mb-1">
                        E-mail de Confirmação
                      </label>
                      <input
                        type="email"
                        placeholder="seu.email@exemplo.com"
                        value={rsvpEmail}
                        onChange={(e) => setRsvpEmail(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-xs bg-[#F9F9F9] border border-stone-200 rounded-lg focus:outline-none focus:border-[#C5A880]"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-medium text-stone-700 block mb-1">
                        WhatsApp para Lembretes
                      </label>
                      <input
                        type="tel"
                        placeholder="+55 11 99999-0000"
                        value={rsvpWhatsapp}
                        onChange={(e) => setRsvpWhatsapp(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-xs bg-[#F9F9F9] border border-stone-200 rounded-lg focus:outline-none focus:border-[#C5A880]"
                      />
                    </div>
                  </div>

                  {rsvpStatus === 'confirmado' && (
                    <>
                      <div>
                        <label className="text-xs font-medium text-stone-700 block mb-1">
                          Número de Acompanhantes (Cônjuge / Filhos)
                        </label>
                        <select
                          value={rsvpAcompanhantes}
                          onChange={(e) => setRsvpAcompanhantes(Number(e.target.value))}
                          className="w-full px-3.5 py-2.5 text-xs bg-[#F9F9F9] border border-stone-200 rounded-lg focus:outline-none focus:border-[#C5A880]"
                        >
                          <option value={0}>Apenas eu (0 acompanhantes)</option>
                          <option value={1}>+1 Acompanhante</option>
                          <option value={2}>+2 Acompanhantes</option>
                          <option value={3}>+3 Acompanhantes</option>
                          <option value={4}>+4 Acompanhantes</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-xs font-medium text-stone-700 block mb-1">
                          Restrições Alimentares ou Alergias (Buffet Welucci)
                        </label>
                        <input
                          type="text"
                          placeholder="Ex: Celíaco, Vegano, Alergia a frutos do mar..."
                          value={rsvpRestricoes}
                          onChange={(e) => setRsvpRestricoes(e.target.value)}
                          className="w-full px-3.5 py-2.5 text-xs bg-[#F9F9F9] border border-stone-200 rounded-lg focus:outline-none focus:border-[#C5A880]"
                        />
                      </div>
                    </>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#111111] hover:bg-stone-900 text-[#DFCDAE] hover:text-white rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors shadow-xs"
                >
                  Enviar Confirmação
                </button>
              </form>
            )}
          </div>
        </section>
      )}

      {/* SECTION: GIFT REGISTRY SHOWCASE */}
      {(activeSection === 'gifts' || activeSection === 'home') && (
        <section className="bg-[#F9F9F9] py-20 px-4 sm:px-6 lg:px-8 border-t border-stone-200">
          <div className="max-w-6xl mx-auto space-y-8">
            <div className="text-center space-y-3 max-w-2xl mx-auto">
              <span className="text-xs uppercase tracking-[0.25em] text-[#C5A880] font-semibold">
                Lista de Casamento
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#111111]">
                Presentes para o Novo Lar & Lua de Mel
              </h2>
              <p className="text-xs sm:text-sm text-stone-600">
                Os presentes selecionados são convertidos em repasses diretos aos noivos através do checkout seguro Getnet (PIX ou Cartão em até 6x).
              </p>
            </div>

            {/* Filter & Search Bar */}
            <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  placeholder="Buscar presente (ex: Paris, Airfryer, Sofá, Taças...)"
                  value={giftSearchQuery}
                  onChange={(e) => setGiftSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 text-xs bg-[#F9F9F9] border border-stone-200 rounded-md focus:outline-none focus:border-[#C5A880]"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="text-xs bg-[#F9F9F9] border border-stone-200 rounded-md px-3 py-2 focus:outline-none focus:border-[#C5A880]"
                >
                  <option value="all">Todas as Categorias</option>
                  {categories.filter(c => c !== 'all').map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>

                <select
                  value={priceSort}
                  onChange={(e) => setPriceSort(e.target.value as any)}
                  className="text-xs bg-[#F9F9F9] border border-stone-200 rounded-md px-3 py-2 focus:outline-none focus:border-[#C5A880]"
                >
                  <option value="popular">Mais Populares</option>
                  <option value="asc">Menor Preço</option>
                  <option value="desc">Maior Preço</option>
                </select>
              </div>
            </div>

            {/* Gifts Showcase Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {displayedGifts.slice(0, 32).map((gift) => (
                <div
                  key={gift.id}
                  className="bg-white rounded-xl border border-stone-200 shadow-xs hover:border-[#C5A880] transition-all flex flex-col justify-between overflow-hidden group"
                >
                  <div className="p-5 space-y-3">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="uppercase tracking-wider font-semibold text-[#9F825B]">
                        {gift.categoria}
                      </span>
                      {gift.popular && (
                        <span className="bg-[#C5A880]/15 text-[#9F825B] px-1.5 py-0.2 rounded font-semibold text-[10px]">
                          Favorito
                        </span>
                      )}
                    </div>

                    <h4 className="text-sm font-semibold text-stone-900 group-hover:text-[#9F825B] transition-colors leading-snug min-h-[40px]">
                      {gift.nome_item}
                    </h4>

                    <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed">
                      {gift.descricao}
                    </p>
                  </div>

                  <div className="p-5 pt-0 space-y-3">
                    <div className="flex items-baseline justify-between border-t border-stone-100 pt-3">
                      <span className="text-[11px] text-stone-400">Valor do Presente:</span>
                      <span className="font-mono text-base font-bold text-[#111111] tabular-nums">
                        R$ {gift.valor_customizado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                    </div>

                    <button
                      onClick={() => openCheckout(gift)}
                      className="w-full py-2 bg-[#111111] group-hover:bg-[#C5A880] text-[#DFCDAE] group-hover:text-white rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                    >
                      <CreditCard className="w-3.5 h-3.5" />
                      <span>Presentear Noivos</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {displayedGifts.length > 32 && (
              <div className="text-center pt-6">
                <span className="text-xs text-stone-500">
                  Mostrando os 32 itens em destaque de <strong>{displayedGifts.length}</strong> presentes ativos.
                </span>
              </div>
            )}
          </div>
        </section>
      )}

      {/* SECTION: GUESTBOOK MURAL */}
      {(activeSection === 'guestbook' || activeSection === 'home') && (
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-12">
          <div className="text-center space-y-2 max-w-xl mx-auto">
            <span className="text-xs uppercase tracking-[0.25em] text-[#C5A880] font-semibold">
              Mural de Recados
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#111111]">
              Votos de Felicidade aos Noivos
            </h2>
            <p className="text-xs sm:text-sm text-stone-600">
              Deixe sua mensagem de carinho para Guilherme & Victória eternizarem em seu livro de recordações.
            </p>
          </div>

          {/* Form to leave message */}
          <div className="bg-[#F9F9F9] p-6 sm:p-8 rounded-2xl border border-stone-200">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-stone-800 mb-4">
              Escrever um Novo Recado
            </h3>
            <form onSubmit={handleGuestbookSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-stone-700 block mb-1">
                    Seu Nome Completo *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Roberto Matarazzo"
                    value={guestAuthor}
                    onChange={(e) => setGuestAuthor(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-stone-200 rounded-lg focus:outline-none focus:border-[#C5A880]"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-stone-700 block mb-1">
                    Relação com os Noivos
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Padrinho, Amigo de Infância, Prima..."
                    value={guestRelation}
                    onChange={(e) => setGuestRelation(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-stone-200 rounded-lg focus:outline-none focus:border-[#C5A880]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-stone-700 block mb-1">
                  Mensagem aos Noivos *
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Deixe seus votos para a nova vida do casal..."
                  value={guestMessage}
                  onChange={(e) => setGuestMessage(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-stone-200 rounded-lg focus:outline-none focus:border-[#C5A880]"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#111111] hover:bg-stone-900 text-[#DFCDAE] hover:text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Publicar Mensagem no Mural</span>
                </button>
              </div>
            </form>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {guestbook.map((recado) => (
              <div 
                key={recado.id}
                className="bg-white p-6 rounded-2xl border border-[#C5A880]/30 shadow-xs relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-16 h-16 bg-[#C5A880]/5 rounded-bl-full pointer-events-none" />
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <div>
                      <div className="font-serif font-bold text-base text-[#111111]">{recado.autor}</div>
                      <div className="text-[11px] text-[#9F825B] font-medium">{recado.relacao}</div>
                    </div>
                    <span className="text-[10px] text-stone-400 font-mono">
                      {new Date(recado.criado_em).toLocaleDateString('pt-BR')}
                    </span>
                  </div>

                  <p className="text-xs text-stone-600 leading-relaxed font-serif italic text-stone-800">
                    "{recado.mensagem}"
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* FOOTER */}
      <footer className="bg-[#111111] text-white py-12 px-4 sm:px-6 lg:px-8 border-t border-stone-800">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="space-y-1">
            <div className="font-serif text-lg text-white font-semibold">
              {couple.noivo_nome} & {couple.noiva_nome}
            </div>
            <p className="text-xs text-stone-400">
              17 de Outubro de 2027 · Welucci Gardens (Alto de Pinheiros, São Paulo - SP)
            </p>
          </div>
          <div className="text-xs text-[#DFCDAE] font-mono">
            {couple.hashtag}
          </div>
        </div>
      </footer>

    </div>
  );
};
