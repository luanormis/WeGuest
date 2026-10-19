import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  ActiveView, 
  Casal, 
  Convidado, 
  FormaPagamento, 
  MuralRecado, 
  Presente, 
  Role, 
  TransacaoGetnet 
} from '../types';
import { 
  INITIAL_COUPLE, 
  INITIAL_GIFTS_200, 
  INITIAL_GUESTBOOK, 
  INITIAL_GUESTS, 
  INITIAL_TRANSACTIONS, 
  TENANT_ID_PITCH 
} from '../data/mockData';

interface Toast {
  id: string;
  message: string;
  type?: 'success' | 'info' | 'gold';
}

interface AppContextType {
  // Navigation & Role
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  activeRole: Role;
  setActiveRole: (role: Role) => void;
  isMobileFrame: boolean;
  setIsMobileFrame: (val: boolean | ((prev: boolean) => boolean)) => void;

  // Pitch Couple & Settings
  couple: Casal;
  updateCouple: (patch: Partial<Casal>) => void;
  toggleRepassarTaxas: () => void;

  // Gift Registry (200 items)
  gifts: Presente[];
  toggleGiftActive: (giftId: string) => void;
  updateGiftPrice: (giftId: string, newPrice: number) => void;
  resetAllGiftPrices: () => void;
  activateAllGifts: () => void;

  // Guests & RSVP
  guests: Convidado[];
  addOrUpdateRsvp: (rsvpData: {
    nome: string;
    email: string;
    whatsapp: string;
    status_rsvp: 'confirmado' | 'recusado';
    restricoes_alimentares: string;
    acompanhantes: number;
  }) => void;
  addGuest: (guest: Omit<Convidado, 'id' | 'tenant_id' | 'link_convite_unico'>) => void;
  removeGuest: (id: string) => void;

  // Transactions & Getnet Checkout
  transactions: TransacaoGetnet[];
  selectedGiftForCheckout: Presente | null;
  openCheckout: (gift: Presente) => void;
  closeCheckout: () => void;
  processGetnetPayment: (params: {
    convidadoNome: string;
    convidadoEmail: string;
    convidadoMensagem?: string;
    formaPagamento: FormaPagamento;
    parcelas: number;
    numeroCartao?: string;
  }) => Promise<TransacaoGetnet>;

  // Guestbook Mural
  guestbook: MuralRecado[];
  addGuestbookMessage: (autor: string, relacao: string, mensagem: string) => void;

  // Feedback Toasts
  toasts: Toast[];
  showToast: (message: string, type?: 'success' | 'info' | 'gold') => void;
  removeToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeView, setActiveView] = useState<ActiveView>('public_site');
  const [activeRole, setActiveRole] = useState<Role>('noivos');
  const [isMobileFrame, setIsMobileFrame] = useState<boolean>(false);

  // Entities in memory (persisted in localStorage for convenience)
  const [couple, setCouple] = useState<Casal>(() => {
    const saved = localStorage.getItem('weguest_couple_pitch');
    return saved ? JSON.parse(saved) : INITIAL_COUPLE;
  });

  const [gifts, setGifts] = useState<Presente[]>(() => {
    const saved = localStorage.getItem('weguest_gifts_pitch');
    return saved ? JSON.parse(saved) : INITIAL_GIFTS_200;
  });

  const [guests, setGuests] = useState<Convidado[]>(() => {
    const saved = localStorage.getItem('weguest_guests_pitch');
    return saved ? JSON.parse(saved) : INITIAL_GUESTS;
  });

  const [transactions, setTransactions] = useState<TransacaoGetnet[]>(() => {
    const saved = localStorage.getItem('weguest_transactions_pitch');
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  const [guestbook, setGuestbook] = useState<MuralRecado[]>(() => {
    const saved = localStorage.getItem('weguest_guestbook_pitch');
    return saved ? JSON.parse(saved) : INITIAL_GUESTBOOK;
  });

  // Modal Checkout state
  const [selectedGiftForCheckout, setSelectedGiftForCheckout] = useState<Presente | null>(null);

  // Toasts
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem('weguest_couple_pitch', JSON.stringify(couple));
  }, [couple]);

  useEffect(() => {
    localStorage.setItem('weguest_gifts_pitch', JSON.stringify(gifts));
  }, [gifts]);

  useEffect(() => {
    localStorage.setItem('weguest_guests_pitch', JSON.stringify(guests));
  }, [guests]);

  useEffect(() => {
    localStorage.setItem('weguest_transactions_pitch', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('weguest_guestbook_pitch', JSON.stringify(guestbook));
  }, [guestbook]);

  const showToast = (message: string, type: 'success' | 'info' | 'gold' = 'gold') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const updateCouple = (patch: Partial<Casal>) => {
    setCouple((prev) => ({ ...prev, ...patch }));
    showToast('Configurações dos noivos atualizadas com sucesso', 'success');
  };

  const toggleRepassarTaxas = () => {
    setCouple((prev) => {
      const nextVal = !prev.repassar_taxas;
      showToast(
        nextVal
          ? 'Taxas administrativas Getnet agora repassadas ao convidado.'
          : 'Taxas administrativas agora absorvidas pelos noivos.',
        'info'
      );
      return { ...prev, repassar_taxas: nextVal };
    });
  };

  const toggleGiftActive = (giftId: string) => {
    setGifts((prev) =>
      prev.map((g) => (g.id === giftId ? { ...g, ativo: !g.ativo } : g))
    );
  };

  const updateGiftPrice = (giftId: string, newPrice: number) => {
    const sanitized = Math.max(10, Number(newPrice) || 0);
    setGifts((prev) =>
      prev.map((g) => (g.id === giftId ? { ...g, valor_customizado: sanitized } : g))
    );
  };

  const resetAllGiftPrices = () => {
    setGifts((prev) =>
      prev.map((g) => ({ ...g, valor_customizado: g.valor_sugerido }))
    );
    showToast('Valores restaurados para os preços originais sugeridos.', 'info');
  };

  const activateAllGifts = () => {
    setGifts((prev) => prev.map((g) => ({ ...g, ativo: true })));
    showToast('Todos os 200 presentes foram ativados na vitrine!', 'success');
  };

  const addOrUpdateRsvp = (rsvpData: {
    nome: string;
    email: string;
    whatsapp: string;
    status_rsvp: 'confirmado' | 'recusado';
    restricoes_alimentares: string;
    acompanhantes: number;
  }) => {
    const existingIndex = guests.findIndex(
      (g) => g.nome.toLowerCase().trim() === rsvpData.nome.toLowerCase().trim() ||
             (rsvpData.email && g.email.toLowerCase() === rsvpData.email.toLowerCase())
    );

    if (existingIndex >= 0) {
      setGuests((prev) => {
        const next = [...prev];
        next[existingIndex] = {
          ...next[existingIndex],
          ...rsvpData,
          confirmado_em: new Date().toISOString(),
        };
        return next;
      });
      showToast(`Presença atualizada com sucesso para ${rsvpData.nome}!`, 'success');
    } else {
      const newGuest: Convidado = {
        id: `conv_${Date.now()}`,
        tenant_id: TENANT_ID_PITCH,
        ...rsvpData,
        link_convite_unico: `https://weguest.com.br/convite/conv-${Date.now().toString().slice(-4)}`,
        confirmado_em: new Date().toISOString(),
      };
      setGuests((prev) => [newGuest, ...prev]);
      showToast(`Presença registrada com sucesso para ${rsvpData.nome}!`, 'success');
    }
  };

  const addGuest = (guestData: Omit<Convidado, 'id' | 'tenant_id' | 'link_convite_unico'>) => {
    const newGuest: Convidado = {
      id: `conv_${Date.now()}`,
      tenant_id: TENANT_ID_PITCH,
      ...guestData,
      link_convite_unico: `https://weguest.com.br/convite/conv-${Date.now().toString().slice(-4)}`,
      confirmado_em: guestData.status_rsvp === 'confirmado' ? new Date().toISOString() : undefined,
    };
    setGuests((prev) => [newGuest, ...prev]);
    showToast(`Convidado ${guestData.nome} adicionado à lista.`, 'success');
  };

  const removeGuest = (id: string) => {
    setGuests((prev) => prev.filter((g) => g.id !== id));
    showToast('Convidado removido da lista.', 'info');
  };

  const openCheckout = (gift: Presente) => {
    setSelectedGiftForCheckout(gift);
  };

  const closeCheckout = () => {
    setSelectedGiftForCheckout(null);
  };

  const processGetnetPayment = async (params: {
    convidadoNome: string;
    convidadoEmail: string;
    convidadoMensagem?: string;
    formaPagamento: FormaPagamento;
    parcelas: number;
    numeroCartao?: string;
  }): Promise<TransacaoGetnet> => {
    if (!selectedGiftForCheckout) {
      throw new Error('Nenhum presente selecionado para checkout.');
    }

    const valorNominal = selectedGiftForCheckout.valor_customizado;

    // Regra de negócio:
    // Taxa gateway: 1.99% para PIX, 4.99% para Cartão de Crédito
    const percentualGateway = params.formaPagamento === 'pix' ? 0.0199 : 0.0499;
    const taxaGateway = Number((valorNominal * percentualGateway).toFixed(2));

    // Regra do Split Welucci & WeGuest:
    // Cobrança fixa de R$ 10,00 por convidado ativo / transação
    // R$ 5,00 líquidos para a conta WeGuest Admin + R$ 5,00 líquidos repassados para a Welucci Financeiro
    const taxaPlataformaFixa = 10.00;
    const splitWeGuest = 5.00;
    const splitWelucci = 5.00;

    // Valor bruto cobrado no checkout
    // Se noivos repassam taxas, o convidado paga o adicional de gateway;
    // Se noivos absorvem, o valor cobrado do convidado é o valor nominal puro.
    const valorBruto = couple.repassar_taxas 
      ? Number((valorNominal + taxaGateway).toFixed(2))
      : valorNominal;

    // Valor líquido que cai na conta dos noivos
    // Se taxas foram repassadas, noivos recebem o valor nominal menos a retenção de split plataforma (R$ 10)
    // Se noivos absorveram as taxas, desconta o gateway e a taxa de plataforma
    const valorLiquidoNoivos = couple.repassar_taxas
      ? Number(Math.max(0, valorNominal - taxaPlataformaFixa).toFixed(2))
      : Number(Math.max(0, valorNominal - taxaGateway - taxaPlataformaFixa).toFixed(2));

    const simulatedPaymentId = params.formaPagamento === 'pix'
      ? `gtn_pix_${Math.floor(100000000000 + Math.random() * 900000000000)}`
      : `gtn_cc_${Math.floor(100000000000 + Math.random() * 900000000000)}`;

    const novaTransacao: TransacaoGetnet = {
      id: `trx_${Date.now()}`,
      tenant_id: TENANT_ID_PITCH,
      convidado_nome: params.convidadoNome,
      convidado_email: params.convidadoEmail,
      convidado_mensagem: params.convidadoMensagem,
      presente_id: selectedGiftForCheckout.id,
      presente_nome: selectedGiftForCheckout.nome_item,
      valor_bruto: valorBruto,
      taxa_plataforma_fixa: taxaPlataformaFixa,
      taxa_gateway: taxaGateway,
      valor_liquido_noivos: valorLiquidoNoivos,
      valor_liquido_weguest: splitWeGuest,
      valor_liquido_welucci: splitWelucci,
      forma_pagamento: params.formaPagamento,
      parcelas: params.parcelas,
      status_pagamento: 'approved',
      getnet_payment_id: simulatedPaymentId,
      criado_em: new Date().toISOString(),
    };

    // Atualiza saldo dos noivos (adiciona saldo disponível no caso de PIX D+2 ou saldo bloqueado D+14 no caso de cartão)
    setCouple((prev) => {
      if (params.formaPagamento === 'pix') {
        return {
          ...prev,
          saldo_disponivel: Number((prev.saldo_disponivel + valorLiquidoNoivos).toFixed(2)),
        };
      } else {
        return {
          ...prev,
          saldo_bloqueado_d14: Number(((prev.saldo_bloqueado_d14 || 0) + valorLiquidoNoivos).toFixed(2)),
        };
      }
    });

    setTransactions((prev) => [novaTransacao, ...prev]);

    // Se o convidado deixou mensagem, publica também no mural
    if (params.convidadoMensagem && params.convidadoMensagem.trim().length > 3) {
      addGuestbookMessage(
        params.convidadoNome,
        'Convidado do Casamento',
        params.convidadoMensagem
      );
    }

    showToast(`Pagamento de R$ ${valorBruto.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} aprovado pela Getnet!`, 'gold');
    return novaTransacao;
  };

  const addGuestbookMessage = (autor: string, relacao: string, mensagem: string) => {
    const novoRecado: MuralRecado = {
      id: `rec_${Date.now()}`,
      tenant_id: TENANT_ID_PITCH,
      autor,
      relacao: relacao || 'Amigo(a) do Casal',
      mensagem,
      aprovado: true,
      criado_em: new Date().toISOString(),
    };
    setGuestbook((prev) => [novoRecado, ...prev]);
  };

  return (
    <AppContext.Provider
      value={{
        activeView,
        setActiveView,
        activeRole,
        setActiveRole,
        isMobileFrame,
        setIsMobileFrame,
        couple,
        updateCouple,
        toggleRepassarTaxas,
        gifts,
        toggleGiftActive,
        updateGiftPrice,
        resetAllGiftPrices,
        activateAllGifts,
        guests,
        addOrUpdateRsvp,
        addGuest,
        removeGuest,
        transactions,
        selectedGiftForCheckout,
        openCheckout,
        closeCheckout,
        processGetnetPayment,
        guestbook,
        addGuestbookMessage,
        toasts,
        showToast,
        removeToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
