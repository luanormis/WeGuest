import React, { useMemo, useState } from 'react';
import { Calculator, TrendingUp, Users, Gift, Info } from 'lucide-react';

const money = (value: number) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });

export const FinanceProjectionCard: React.FC = () => {
  const [monthlyVenueRevenue, setMonthlyVenueRevenue] = useState(6000000);
  const [averageWeddingPrice, setAverageWeddingPrice] = useState(120000);
  const [guestsPerWedding, setGuestsPerWedding] = useState(120);
  const [feePerGuest, setFeePerGuest] = useState(11);
  const [adminShare, setAdminShare] = useState(27);
  const [giftSpendPerGuest, setGiftSpendPerGuest] = useState(300);
  const [giftPlatformRate, setGiftPlatformRate] = useState(5);
  const [cardFee, setCardFee] = useState(4.99);

  const model = useMemo(() => {
    const weddings = averageWeddingPrice > 0 ? monthlyVenueRevenue / averageWeddingPrice : 0;
    const guests = weddings * guestsPerWedding;
    const guestFeeRevenue = guests * feePerGuest;
    const adminGuestFeeIncome = guestFeeRevenue * adminShare / 100;
    const companyGuestFeeIncome = guestFeeRevenue - adminGuestFeeIncome;
    const giftsGross = guests * giftSpendPerGuest;
    const cardCosts = giftsGross * cardFee / 100;
    const giftPlatformIncome = giftsGross * giftPlatformRate / 100;
    const giftsToCouples = Math.max(0, giftsGross - cardCosts - giftPlatformIncome);
    const adminGiftIncome = giftPlatformIncome * adminShare / 100;
    const companyGiftIncome = giftPlatformIncome - adminGiftIncome;
    return { weddings, guests, guestFeeRevenue, adminGuestFeeIncome, companyGuestFeeIncome, giftsGross, cardCosts, giftPlatformIncome, giftsToCouples, adminGiftIncome, companyGiftIncome, adminTotal: adminGuestFeeIncome + adminGiftIncome, companyTotal: companyGuestFeeIncome + companyGiftIncome, platformTotal: guestFeeRevenue + giftPlatformIncome };
  }, [monthlyVenueRevenue, averageWeddingPrice, guestsPerWedding, feePerGuest, adminShare, giftSpendPerGuest, giftPlatformRate, cardFee]);

  const numberInput = (label: string, value: number, onChange: (value: number) => void, suffix = '') => (
    <label className="block text-xs font-medium text-stone-700">{label}
      <div className="mt-1 flex items-center rounded-lg border border-stone-300 bg-white">
        <input type="number" min="0" value={value} onChange={e => onChange(Math.max(0, Number(e.target.value) || 0))} className="w-full min-w-0 rounded-lg px-3 py-2.5 text-sm outline-none" />
        {suffix && <span className="pr-3 text-xs text-stone-500">{suffix}</span>}
      </div>
    </label>
  );

  return (
    <section className="bg-white border border-stone-200 rounded-2xl p-5 sm:p-7 shadow-xs space-y-5">
      <div className="flex items-start gap-3">
        <div className="rounded-xl bg-[#480927]/5 p-3"><Calculator className="w-5 h-5 text-[#9F825B]" /></div>
        <div className="flex-1">
          <h2 className="text-xl font-serif font-bold text-[#480927]">Projeção financeira para investidores</h2>
          <p className="text-sm text-stone-600 mt-1">Modelo editável de receita mensal. Os valores de presentes e taxas são premissas de simulação, não contratos ou tarifas confirmadas.</p>
        </div>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {numberInput('Faturamento mensal dos espaços (R$)', monthlyVenueRevenue, setMonthlyVenueRevenue)}
        {numberInput('Preço médio por casamento (R$)', averageWeddingPrice, setAverageWeddingPrice)}
        {numberInput('Convidados por casamento', guestsPerWedding, setGuestsPerWedding)}
        {numberInput('Taxa WeGuest por convidado (R$)', feePerGuest, setFeePerGuest)}
        {numberInput('Sua participação', adminShare, setAdminShare, '%')}
        {numberInput('Presentes por convidado (R$)', giftSpendPerGuest, setGiftSpendPerGuest)}
        {numberInput('Taxa WeGuest sobre presentes', giftPlatformRate, setGiftPlatformRate, '%')}
        {numberInput('Taxa da maquininha estimada', cardFee, setCardFee, '%')}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="rounded-xl bg-stone-50 border border-stone-200 p-4">
          <Users className="w-4 h-4 text-[#9F825B] mb-2" />
          <p className="text-xs text-stone-500">Casamentos / mês</p>
          <p className="text-2xl font-semibold text-stone-900">{model.weddings.toLocaleString('pt-BR', { maximumFractionDigits: 1 })}</p>
          <p className="text-xs text-stone-500 mt-1">{Math.round(model.guests).toLocaleString('pt-BR')} convidados estimados</p>
        </div>
        <div className="rounded-xl bg-[#480927] text-white p-4">
          <TrendingUp className="w-4 h-4 text-[#DFCDAE] mb-2" />
          <p className="text-xs text-white/70">Receita da taxa por convidado</p>
          <p className="text-2xl font-semibold">{money(model.guestFeeRevenue)}</p>
          <p className="text-xs text-white/70 mt-1">Antes de impostos e custos operacionais</p>
        </div>
        <div className="rounded-xl bg-[#F5F0E8] border border-[#C5A880]/40 p-4">
          <Gift className="w-4 h-4 text-[#9F825B] mb-2" />
          <p className="text-xs text-stone-500">Volume bruto estimado de presentes</p>
          <p className="text-2xl font-semibold text-stone-900">{money(model.giftsGross)}</p>
          <p className="text-xs text-stone-500 mt-1">Não é receita da plataforma</p>
        </div>
      </div>
      <div className="overflow-x-auto rounded-xl border border-stone-200">
        <table className="w-full text-sm">
          <thead className="bg-stone-50 text-left text-xs uppercase tracking-wide text-stone-500">
            <tr><th className="px-4 py-3">Projeção mensal</th><th className="px-4 py-3 text-right">Empresa WeGuest</th><th className="px-4 py-3 text-right">Sua parte ({adminShare}%)</th></tr>
          </thead>
          <tbody>
            <tr className="border-t border-stone-100"><td className="px-4 py-3">Taxa por convidado</td><td className="px-4 py-3 text-right tabular-nums">{money(model.companyGuestFeeIncome)}</td><td className="px-4 py-3 text-right tabular-nums">{money(model.adminGuestFeeIncome)}</td></tr>
            <tr className="border-t border-stone-100"><td className="px-4 py-3">Participação estimada nos presentes</td><td className="px-4 py-3 text-right tabular-nums">{money(model.companyGiftIncome)}</td><td className="px-4 py-3 text-right tabular-nums">{money(model.adminGiftIncome)}</td></tr>
            <tr className="border-t border-stone-100 bg-stone-50 font-semibold"><td className="px-4 py-3">Total estimado da plataforma</td><td className="px-4 py-3 text-right tabular-nums">{money(model.companyTotal)}</td><td className="px-4 py-3 text-right tabular-nums">{money(model.adminTotal)}</td></tr>
          </tbody>
        </table>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
        <div className="rounded-lg border border-stone-200 p-4">
          <p className="font-semibold text-stone-800">Presentes: custos e repasse estimados</p>
          <div className="mt-2 space-y-1 text-stone-600">
            <div className="flex justify-between gap-3"><span>Volume bruto de presentes</span><strong>{money(model.giftsGross)}</strong></div>
            <div className="flex justify-between gap-3"><span>Taxa da maquininha ({cardFee}%)</span><strong>{money(model.cardCosts)}</strong></div>
            <div className="flex justify-between gap-3"><span>Receita plataforma ({giftPlatformRate}%)</span><strong>{money(model.giftPlatformIncome)}</strong></div>
            <div className="flex justify-between gap-3 border-t border-stone-100 pt-2"><span>Estimativa líquida aos noivos</span><strong>{money(model.giftsToCouples)}</strong></div>
          </div>
        </div>
        <div className="rounded-lg bg-amber-50 border border-amber-200 p-4 text-amber-950">
          <p className="font-semibold flex items-center gap-2"><Info className="w-4 h-4" /> Premissas importantes</p>
          <p className="text-xs leading-relaxed mt-2">O cálculo supõe que o faturamento dos espaços se converte em casamentos ao preço médio informado; todos os convidados pagam a taxa; presentes médios e percentuais são ajustáveis; sua participação de {adminShare}% incide sobre as receitas modeladas da plataforma. Não inclui impostos, chargebacks, inadimplência, custos fixos, aquisição de clientes ou negociação real com adquirente.</p>
        </div>
      </div>
    </section>
  );
};
