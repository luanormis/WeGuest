import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { FormaPagamento, TransacaoGetnet } from '../types';
import { WelucciLogo } from './WelucciLogo';
import { 
  CheckCircle2, 
  CreditCard, 
  HelpCircle, 
  Lock, 
  QrCode, 
  ShieldCheck, 
  Sparkles, 
  X, 
  AlertCircle,
  Copy,
  ExternalLink,
  ArrowRight
} from 'lucide-react';

export const GetnetCheckoutModal: React.FC = () => {
  const { 
    selectedGiftForCheckout, 
    closeCheckout, 
    couple, 
    processGetnetPayment, 
    showToast 
  } = useApp();

  const [paymentMode, setPaymentMode] = useState<FormaPagamento>('pix');
  const [environment, setEnvironment] = useState<'sandbox' | 'production'>('production');

  // Guest details
  const [nomeConvidado, setNomeConvidado] = useState('');
  const [emailConvidado, setEmailConvidado] = useState('');
  const [mensagemCarinho, setMensagemCarinho] = useState('');

  // Card details
  const [cardNome, setCardNome] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [parcelas, setParcelas] = useState(1);

  // Status
  const [isProcessing, setIsProcessing] = useState(false);
  const [approvedTransaction, setApprovedTransaction] = useState<TransacaoGetnet | null>(null);

  if (!selectedGiftForCheckout) return null;

  const valorNominal = selectedGiftForCheckout.valor_customizado;

  // Fee Calculation
  const taxaPercentual = paymentMode === 'pix' ? 0.0199 : 0.0499;
  const taxaCalculada = Number((valorNominal * taxaPercentual).toFixed(2));

  // If repassar_taxas is true: guest pays valorNominal + taxaCalculada
  // If repassar_taxas is false: guest pays only valorNominal (couple absorbs fees)
  const totalAPagar = couple.repassar_taxas 
    ? Number((valorNominal + taxaCalculada).toFixed(2))
    : valorNominal;

  const valorParcela = Number((totalAPagar / parcelas).toFixed(2));

  // Auto-format card number
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 16);
    const formatted = raw.replace(/(\d{4})(?=\d)/g, '$1 ');
    setCardNumber(formatted);
  };

  // Auto-format MM/AA
  const handleCardExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (raw.length >= 3) {
      raw = `${raw.slice(0, 2)}/${raw.slice(2, 4)}`;
    }
    setCardExpiry(raw);
  };

  const handleSimulatePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nomeConvidado.trim()) {
      showToast('Por favor, informe seu nome.', 'info');
      return;
    }

    if (paymentMode === 'cartao_credito') {
      if (cardNumber.replace(/\s/g, '').length < 15 || !cardExpiry || !cardCvv) {
        showToast('Preencha os dados completos do cartão de crédito.', 'info');
        return;
      }
    }

    setIsProcessing(true);

    try {
      // Simulate Getnet API latency
      await new Promise((resolve) => setTimeout(resolve, 1400));

      const trx = await processGetnetPayment({
        convidadoNome: nomeConvidado,
        convidadoEmail: emailConvidado || 'convidado@weguest.com.br',
        convidadoMensagem: mensagemCarinho,
        formaPagamento: paymentMode,
        parcelas: paymentMode === 'pix' ? 1 : parcelas,
        numeroCartao: cardNumber,
      });

      setApprovedTransaction(trx);
    } catch (err: any) {
      showToast(err.message || 'Erro ao processar pagamento Getnet.', 'info');
    } finally {
      setIsProcessing(false);
    }
  };

  const simulatedPixCode = `00020126580014BR.GOV.BCB.PIX0136${couple.pix_chave}520400005303986540${totalAPagar.toFixed(2)}5802BR5925GUILHERME E VICTORIA6009SAO PAULO62070503***6304E8A9`;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95 duration-200 my-8">
        
        {/* Header Getnet Security Bar with Welucci Branding */}
        <div className="bg-[#480927] text-white px-6 py-4 flex items-center justify-between border-b border-[#35051C]">
          <div className="flex items-center gap-3">
            <WelucciLogo iconOnly size={26} color="#ffffff" />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-xs tracking-wide">Checkout WeGuest · Getnet</span>
                <span className={`text-[9px] px-1.5 py-0.2 rounded font-mono uppercase ${
                  environment === 'production' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                }`}>
                  {environment === 'production' ? 'Live Gateway' : 'SandBox Test'}
                </span>
              </div>
              <p className="text-[10px] text-stone-300">Criptografia SSL 256-bit ponta a ponta</p>
            </div>
          </div>

          <button
            onClick={closeCheckout}
            className="text-stone-400 hover:text-white p-1 rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {approvedTransaction ? (
          /* Payment Approved Voucher State */
          <div className="p-8 text-center space-y-5">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <span className="text-xs uppercase tracking-widest text-[#C5A880] font-semibold">
                Transação Aprovada
              </span>
              <h3 className="text-2xl font-serif font-bold text-[#111111]">
                Presente Enviado com Sucesso!
              </h3>
              <p className="text-xs text-stone-600 max-w-sm mx-auto">
                {couple.noivo_nome} & {couple.noiva_nome} receberam sua contribuição e sua mensagem de felicitações.
              </p>
            </div>

            {/* Voucher Details */}
            <div className="bg-[#F9F9F9] p-5 rounded-xl border border-stone-200 text-left text-xs space-y-2.5">
              <div className="flex justify-between border-b border-stone-200 pb-2">
                <span className="text-stone-500">Presente:</span>
                <span className="font-semibold text-stone-900 text-right">{selectedGiftForCheckout.nome_item}</span>
              </div>
              <div className="flex justify-between border-b border-stone-200 pb-2">
                <span className="text-stone-500">Valor Pago:</span>
                <span className="font-mono font-bold text-stone-900">
                  R$ {approvedTransaction.valor_bruto.toFixed(2)} ({approvedTransaction.forma_pagamento === 'pix' ? 'PIX' : `Cartão ${approvedTransaction.parcelas}x`})
                </span>
              </div>
              <div className="flex justify-between border-b border-stone-200 pb-2">
                <span className="text-stone-500">Autenticação Getnet ID:</span>
                <span className="font-mono text-[10px] text-stone-700">{approvedTransaction.getnet_payment_id}</span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-stone-500">Destino dos Fundos:</span>
                <span className="text-emerald-700 font-medium">Repasse aos noivos (D+2 PIX / D+14 CC)</span>
              </div>
            </div>

            <button
              onClick={closeCheckout}
              className="w-full py-3 bg-[#111111] hover:bg-stone-900 text-[#DFCDAE] hover:text-white rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors shadow-xs"
            >
              Concluir & Voltar ao Casamento
            </button>
          </div>
        ) : (
          /* Checkout Form */
          <form onSubmit={handleSimulatePayment} className="p-6 space-y-6">
            {/* Selected Gift Summary */}
            <div className="bg-[#F9F9F9] p-4 rounded-xl border border-stone-200 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#9F825B] font-semibold">
                  {selectedGiftForCheckout.categoria}
                </span>
                <h4 className="text-sm font-semibold text-stone-900 line-clamp-1">
                  {selectedGiftForCheckout.nome_item}
                </h4>
                <div className="text-xs text-stone-500 mt-0.5">
                  Para o casal {couple.noivo_nome} & {couple.noiva_nome}
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-[10px] text-stone-400">Valor de face</div>
                <div className="font-mono text-base font-bold text-stone-900 tabular-nums">
                  R$ {valorNominal.toFixed(2)}
                </div>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPaymentMode('pix')}
                className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1 ${
                  paymentMode === 'pix'
                    ? 'border-[#C5A880] bg-[#C5A880]/10 text-stone-900 font-semibold shadow-xs'
                    : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                }`}
              >
                <div className="flex items-center gap-1.5 text-xs font-bold">
                  <QrCode className="w-4 h-4 text-emerald-600" />
                  <span>PIX Instantâneo</span>
                </div>
                <span className="text-[10px] text-stone-500">Taxa 1.99% · Aprovação Imediata</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMode('cartao_credito')}
                className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1 ${
                  paymentMode === 'cartao_credito'
                    ? 'border-[#C5A880] bg-[#C5A880]/10 text-stone-900 font-semibold shadow-xs'
                    : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                }`}
              >
                <div className="flex items-center gap-1.5 text-xs font-bold">
                  <CreditCard className="w-4 h-4 text-sky-600" />
                  <span>Cartão de Crédito</span>
                </div>
                <span className="text-[10px] text-stone-500">Até 6x · Taxa 4.99%</span>
              </button>
            </div>

            {/* Transparent Fees Table (Requirement 4) */}
            <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 text-xs space-y-2">
              <div className="flex items-center justify-between text-stone-600">
                <span>Valor Nominal do Presente:</span>
                <span className="font-mono tabular-nums">R$ {valorNominal.toFixed(2)}</span>
              </div>

              <div className="flex items-center justify-between text-stone-600">
                <span>
                  Taxa Adm. Gateway Getnet ({paymentMode === 'pix' ? '1.99%' : '4.99%'}):
                </span>
                <span className="font-mono tabular-nums">
                  {couple.repassar_taxas ? `+ R$ ${taxaCalculada.toFixed(2)}` : 'R$ 0,00'}
                </span>
              </div>

              {/* Notice whether couple or guest absorbs fees */}
              <div className="text-[11px] pt-1 border-t border-stone-200 flex items-center justify-between font-medium">
                {couple.repassar_taxas ? (
                  <span className="text-amber-800 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                    <span>Taxa administrativa adicionada ao checkout do convidado.</span>
                  </span>
                ) : (
                  <span className="text-emerald-700 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Taxas cobertas pelos noivos. Você paga apenas o valor nominal.</span>
                  </span>
                )}
              </div>

              <div className="flex items-baseline justify-between border-t border-stone-200 pt-2 text-sm font-bold text-stone-900">
                <span>Total Final a Pagar:</span>
                <span className="font-mono text-base tabular-nums text-[#111111]">
                  R$ {totalAPagar.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Guest Identification Fields */}
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-stone-700 block mb-1">
                  Seu Nome Completo *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Dra. Beatriz Albuquerque"
                  value={nomeConvidado}
                  onChange={(e) => setNomeConvidado(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-[#F9F9F9] border border-stone-200 rounded-lg focus:outline-none focus:border-[#C5A880]"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-stone-700 block mb-1">
                  E-mail para Recibo
                </label>
                <input
                  type="email"
                  placeholder="seu.email@exemplo.com"
                  value={emailConvidado}
                  onChange={(e) => setEmailConvidado(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-[#F9F9F9] border border-stone-200 rounded-lg focus:outline-none focus:border-[#C5A880]"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-stone-700 block mb-1">
                  Mensagem de Felicitações aos Noivos (Opcional)
                </label>
                <input
                  type="text"
                  placeholder="Ex: Que essa viagem a dois seja inesquecível!"
                  value={mensagemCarinho}
                  onChange={(e) => setMensagemCarinho(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-[#F9F9F9] border border-stone-200 rounded-lg focus:outline-none focus:border-[#C5A880]"
                />
              </div>
            </div>

            {/* Payment Fields: PIX OR CARD */}
            {paymentMode === 'pix' ? (
              <div className="bg-[#F9F9F9] p-4 rounded-xl border border-stone-200 text-center space-y-3">
                <div className="text-xs text-stone-600">
                  Ao clicar em prosseguir, o código QR Code e chave PIX Copia e Cola serão gerados via Getnet.
                </div>
                <div className="p-3 bg-white rounded-lg border border-stone-200 font-mono text-[10px] text-stone-600 break-all select-all">
                  {simulatedPixCode.slice(0, 75)}...
                </div>
                <div className="text-[11px] text-emerald-700 font-medium">
                  ✓ Reconhecimento em segundos via Webhook Getnet
                </div>
              </div>
            ) : (
              <div className="space-y-3 pt-1">
                <div>
                  <label className="text-xs font-medium text-stone-700 block mb-1">
                    Nome Impresso no Cartão *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Como está no cartão"
                    value={cardNome}
                    onChange={(e) => setCardNome(e.target.value.toUpperCase())}
                    className="w-full px-3.5 py-2 text-xs bg-[#F9F9F9] border border-stone-200 rounded-lg focus:outline-none focus:border-[#C5A880] uppercase"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-stone-700 block mb-1">
                    Número do Cartão *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="0000 0000 0000 0000"
                    value={cardNumber}
                    onChange={handleCardNumberChange}
                    className="w-full px-3.5 py-2 text-xs font-mono bg-[#F9F9F9] border border-stone-200 rounded-lg focus:outline-none focus:border-[#C5A880]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-stone-700 block mb-1">
                      Validade (MM/AA) *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="MM/AA"
                      value={cardExpiry}
                      onChange={handleCardExpiryChange}
                      className="w-full px-3.5 py-2 text-xs font-mono bg-[#F9F9F9] border border-stone-200 rounded-lg focus:outline-none focus:border-[#C5A880]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-stone-700 block mb-1">
                      CVV *
                    </label>
                    <input
                      type="password"
                      required
                      maxLength={4}
                      placeholder="123"
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ''))}
                      className="w-full px-3.5 py-2 text-xs font-mono bg-[#F9F9F9] border border-stone-200 rounded-lg focus:outline-none focus:border-[#C5A880]"
                    />
                  </div>
                </div>

                {/* Installments selector up to 6x */}
                <div>
                  <label className="text-xs font-medium text-stone-700 block mb-1">
                    Número de Parcelas (Sem juros adicionais além do gateway)
                  </label>
                  <select
                    value={parcelas}
                    onChange={(e) => setParcelas(Number(e.target.value))}
                    className="w-full px-3.5 py-2 text-xs bg-[#F9F9F9] border border-stone-200 rounded-lg focus:outline-none focus:border-[#C5A880]"
                  >
                    {[1, 2, 3, 4, 5, 6].map(num => (
                      <option key={num} value={num}>
                        {num}x de R$ {(totalAPagar / num).toFixed(2)} {num === 1 ? '(À vista)' : ''}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* Submit Action */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-3.5 bg-[#C5A880] hover:bg-[#9F825B] text-white rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors shadow-md flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {isProcessing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Autorizando via Getnet...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-3.5 h-3.5" />
                    <span>
                      {paymentMode === 'pix' ? 'Gerar PIX e Concluir' : `Pagar R$ ${totalAPagar.toFixed(2)} com Cartão`}
                    </span>
                  </>
                )}
              </button>
            </div>

            <div className="text-[11px] text-center text-stone-400 flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#C5A880]" />
              <span>Transação protegida e auditada pela tecnologia WeGuest & Getnet S.A.</span>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
