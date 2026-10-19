import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { FormaPagamento, Presente, TransacaoGetnet } from '../types';
import { WelucciLogo } from './WelucciLogo';
import { 
  CheckCircle2, 
  CreditCard, 
  Lock, 
  QrCode, 
  Search, 
  ShieldCheck, 
  Sparkles, 
  Sliders,
  AlertCircle,
  Copy,
  Terminal,
  Code2
} from 'lucide-react';

export const CheckoutDemoView: React.FC = () => {
  const { 
    couple, 
    gifts, 
    toggleRepassarTaxas, 
    processGetnetPayment, 
    openCheckout,
    showToast 
  } = useApp();

  const activeGifts = gifts.filter(g => g.ativo);
  const [selectedGiftId, setSelectedGiftId] = useState<string>(activeGifts[0]?.id || 'gift_001');
  const [paymentMode, setPaymentMode] = useState<FormaPagamento>('pix');
  const [parcelas, setParcelas] = useState(1);
  const [nomeConvidado, setNomeConvidado] = useState('Eduardo Guimarães');
  const [emailConvidado, setEmailConvidado] = useState('eduardo.guimaraes@email.com');
  const [mensagem, setMensagem] = useState('Felicidades infinitas aos noivos neste dia inesquecível!');

  // Card fields
  const [cardNumber, setCardNumber] = useState('4532 8912 3049 8812');
  const [cardHolder, setCardHolder] = useState('EDUARDO GUIMARAES');
  const [cardExpiry, setCardExpiry] = useState('11/29');
  const [cardCvv, setCardCvv] = useState('842');

  const [isProcessing, setIsProcessing] = useState(false);
  const [lastPaymentResult, setLastPaymentResult] = useState<TransacaoGetnet | null>(null);

  const currentGift = gifts.find(g => g.id === selectedGiftId) || activeGifts[0];
  const valorNominal = currentGift ? currentGift.valor_customizado : 350;

  // Fee Calculation
  const taxaPercentual = paymentMode === 'pix' ? 0.0199 : 0.0499;
  const taxaGateway = Number((valorNominal * taxaPercentual).toFixed(2));
  const taxaPlataforma = 10.00; // R$ 10 fixos (R$ 5 WeGuest + R$ 5 Welucci)

  const valorFinalCobrado = couple.repassar_taxas 
    ? Number((valorNominal + taxaGateway).toFixed(2))
    : valorNominal;

  const handleExecutePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentGift) return;

    setIsProcessing(true);
    try {
      await new Promise(r => setTimeout(r, 1200));
      openCheckout(currentGift); // Also sets the selected gift for the context processor
      const trx = await processGetnetPayment({
        convidadoNome: nomeConvidado,
        convidadoEmail: emailConvidado,
        convidadoMensagem: mensagem,
        formaPagamento: paymentMode,
        parcelas: paymentMode === 'pix' ? 1 : parcelas,
        numeroCartao: cardNumber,
      });
      setLastPaymentResult(trx);
    } catch (err: any) {
      showToast(err.message, 'info');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F9F9] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="border-b border-stone-200 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-stone-500 mb-1">
              <span>Ambiente de Testes da API</span>
              <span aria-hidden="true">·</span>
              <span className="text-[#9F825B] font-medium">Gateway Getnet Adquirência</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#111111]">
              Simulador de Checkout Transparente Getnet
            </h1>
            <p className="text-stone-600 text-sm mt-1">
              Teste a autorização direta via PIX e Cartão de Crédito com cálculo de split financeiro em tempo real.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleRepassarTaxas}
              className="flex items-center gap-2 px-3.5 py-2 bg-white hover:bg-stone-50 border border-stone-200 rounded-lg text-xs font-medium text-stone-800 transition-colors shadow-2xs"
            >
              <Sliders className="w-3.5 h-3.5 text-[#C5A880]" />
              <span>
                Taxas: {couple.repassar_taxas ? 'Repassadas ao Convidado' : 'Absorvidas pelos Noivos'}
              </span>
            </button>
          </div>
        </div>

        {/* Two Column Layout: Checkout Interface + Live API Payload Inspector */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Getnet Interface (7 cols) */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-stone-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#480927] flex items-center justify-center">
                  <WelucciLogo iconOnly size={20} color="#ffffff" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-stone-900">WeGuest · Getnet Transparent Engine</h3>
                  <div className="text-[10px] text-stone-400">Endpoint: https://api.getnet.com.br/v1/payments</div>
                </div>
              </div>
              <span className="text-[10px] font-mono bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200">
                SANDBOX / LIVE READY
              </span>
            </div>

            {/* Select Gift */}
            <div>
              <label className="text-xs font-semibold text-stone-700 block mb-1">
                Selecione o Presente da Lista de 200 Itens:
              </label>
              <select
                value={selectedGiftId}
                onChange={(e) => setSelectedGiftId(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-[#F9F9F9] border border-stone-200 rounded-lg focus:outline-none focus:border-[#C5A880]"
              >
                {activeGifts.map(g => (
                  <option key={g.id} value={g.id}>
                    {g.nome_item} — R$ {g.valor_customizado.toFixed(2)} ({g.categoria})
                  </option>
                ))}
              </select>
            </div>

            {/* Payment Method Switcher */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPaymentMode('pix')}
                className={`p-3.5 rounded-xl border text-center transition-all ${
                  paymentMode === 'pix'
                    ? 'border-[#C5A880] bg-[#C5A880]/10 text-stone-900 font-semibold'
                    : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                }`}
              >
                <div className="flex items-center justify-center gap-1.5 text-xs font-bold">
                  <QrCode className="w-4 h-4 text-emerald-600" />
                  <span>PIX Instantâneo</span>
                </div>
                <div className="text-[10px] text-stone-500 mt-0.5">Taxa 1.99% · D+2 para os noivos</div>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMode('cartao_credito')}
                className={`p-3.5 rounded-xl border text-center transition-all ${
                  paymentMode === 'cartao_credito'
                    ? 'border-[#C5A880] bg-[#C5A880]/10 text-stone-900 font-semibold'
                    : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                }`}
              >
                <div className="flex items-center justify-center gap-1.5 text-xs font-bold">
                  <CreditCard className="w-4 h-4 text-sky-600" />
                  <span>Cartão de Crédito</span>
                </div>
                <div className="text-[10px] text-stone-500 mt-0.5">Taxa 4.99% · Em até 6x · D+14</div>
              </button>
            </div>

            {/* Fee Breakdown Card */}
            <div className="bg-[#F9F9F9] p-4 rounded-xl border border-stone-200 text-xs space-y-2">
              <div className="flex justify-between text-stone-600">
                <span>Valor Nominal do Item:</span>
                <span className="font-mono tabular-nums">R$ {valorNominal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Taxa Gateway ({paymentMode === 'pix' ? '1.99%' : '4.99%'}):</span>
                <span className="font-mono tabular-nums">
                  {couple.repassar_taxas ? `+ R$ ${taxaGateway.toFixed(2)}` : 'R$ 0,00 (Coberta pelos noivos)'}
                </span>
              </div>
              <div className="pt-2 border-t border-stone-200 flex justify-between font-bold text-sm text-[#111111]">
                <span>Cobrado do Convidado:</span>
                <span className="font-mono tabular-nums">R$ {valorFinalCobrado.toFixed(2)}</span>
              </div>
            </div>

            {/* Guest Details Form */}
            <form onSubmit={handleExecutePayment} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-stone-700 block mb-1">Nome do Convidado *</label>
                  <input
                    type="text"
                    required
                    value={nomeConvidado}
                    onChange={(e) => setNomeConvidado(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-[#F9F9F9] border border-stone-200 rounded-lg focus:outline-none focus:border-[#C5A880]"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-stone-700 block mb-1">E-mail do Convidado</label>
                  <input
                    type="email"
                    value={emailConvidado}
                    onChange={(e) => setEmailConvidado(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-[#F9F9F9] border border-stone-200 rounded-lg focus:outline-none focus:border-[#C5A880]"
                  />
                </div>
              </div>

              {paymentMode === 'cartao_credito' && (
                <div className="space-y-3 pt-2 border-t border-stone-100">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-medium text-stone-700 block mb-1">Número do Cartão</label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full px-3 py-2 text-xs font-mono bg-[#F9F9F9] border border-stone-200 rounded-lg focus:outline-none focus:border-[#C5A880]"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-stone-700 block mb-1">Parcelamento</label>
                      <select
                        value={parcelas}
                        onChange={(e) => setParcelas(Number(e.target.value))}
                        className="w-full px-3 py-2 text-xs bg-[#F9F9F9] border border-stone-200 rounded-lg focus:outline-none focus:border-[#C5A880]"
                      >
                        {[1, 2, 3, 4, 5, 6].map(p => (
                          <option key={p} value={p}>
                            {p}x de R$ {(valorFinalCobrado / p).toFixed(2)}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-3 bg-[#111111] hover:bg-stone-900 text-[#DFCDAE] hover:text-white rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors shadow-xs flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {isProcessing ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-[#DFCDAE] border-t-transparent rounded-full animate-spin" />
                    <span>Processando na API Getnet...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-3.5 h-3.5" />
                    <span>Disparar Transação de Teste Getnet</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Right Column: Live API Request / Response Inspector (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#111111] text-stone-200 rounded-2xl border border-stone-800 p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-stone-800 pb-3">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-[#C5A880]" />
                  <span className="font-mono text-xs font-semibold text-white">Getnet Payload Inspector</span>
                </div>
                <span className="text-[10px] font-mono text-emerald-400">JSON API v1</span>
              </div>

              <div>
                <div className="text-[10px] font-mono uppercase text-stone-400 mb-1">Request Payload Simulado:</div>
                <pre className="bg-stone-900 p-3 rounded-lg text-[10px] font-mono text-emerald-300 overflow-x-auto selection:bg-[#C5A880]/30 leading-relaxed">
{JSON.stringify({
  seller_id: couple.tenant_id,
  amount: Math.round(valorFinalCobrado * 100),
  currency: 'BRL',
  order: {
    order_id: `ord_${Date.now()}`,
    product_type: 'wedding_gift',
    gift_name: currentGift?.nome_item
  },
  customer: {
    customer_id: 'cust_conv_01',
    first_name: nomeConvidado.split(' ')[0],
    last_name: nomeConvidado.split(' ').slice(1).join(' ') || 'Convidado',
    email: emailConvidado
  },
  device: {
    ip_address: '189.120.44.10',
    device_id: 'hash_sandbox_device'
  },
  [paymentMode === 'pix' ? 'pix' : 'credit']: paymentMode === 'pix' ? {
    additional_data: 'Casamento Guilherme & Victoria'
  } : {
    delayed: false,
    save_card_data: false,
    transaction_type: parcelas > 1 ? 'INSTALL_NO_INTEREST' : 'FULL',
    number_installments: parcelas,
    card: {
      number_token: 'tok_gtn_4532891230498812',
      cardholder_name: cardHolder,
      expiration_month: cardExpiry.split('/')[0] || '12',
      expiration_year: cardExpiry.split('/')[1] || '29',
    }
  }
}, null, 2)}
                </pre>
              </div>

              {lastPaymentResult && (
                <div className="pt-2 border-t border-stone-800">
                  <div className="text-[10px] font-mono uppercase text-[#C5A880] mb-1">Response Recebido (HTTP 200 OK):</div>
                  <pre className="bg-stone-900 p-3 rounded-lg text-[10px] font-mono text-stone-300 overflow-x-auto leading-relaxed">
{JSON.stringify({
  payment_id: lastPaymentResult.getnet_payment_id,
  status: lastPaymentResult.status_pagamento,
  amount: Math.round(lastPaymentResult.valor_bruto * 100),
  split_rules: [
    { recipient: 'noivos', amount_net: lastPaymentResult.valor_liquido_noivos },
    { recipient: 'weguest_platform', amount_net: lastPaymentResult.valor_liquido_weguest },
    { recipient: 'welucci_venue', amount_net: lastPaymentResult.valor_liquido_welucci }
  ],
  created_at: lastPaymentResult.criado_em
}, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
