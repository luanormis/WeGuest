import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { WEDDING_IMAGES } from '../data/assets';
import { Image, Save, Sparkles } from 'lucide-react';

const venueOptions = [
  { name: 'Welucci Gardens', key: 'gardensCeremony' as const, label: 'Cerimônia no jardim' },
  { name: 'Welucci Gardens — Salão Principal', key: 'gardensMainHall' as const, label: 'Salão principal' },
  { name: 'Welucci Gardens — Cascata', key: 'gardensWaterfall' as const, label: 'Jardim com cascata' },
  { name: 'Welucci Gardens — Spa Lounge', key: 'gardensSpa' as const, label: 'Spa lounge' },
];

export const WeddingCustomizationPanel: React.FC = () => {
  const { couple, updateCouple, showToast } = useApp();
  const [noivo, setNoivo] = useState(couple.noivo_nome);
  const [noiva, setNoiva] = useState(couple.noiva_nome);
  const [date, setDate] = useState(couple.data_evento);
  const [venue, setVenue] = useState(couple.espaco_nome);
  const [hashtag, setHashtag] = useState(couple.hashtag);
  const [story, setStory] = useState(couple.historia_casal || 'Nossa história começou com um encontro inesperado e cresceu com sonhos, viagens e momentos que queremos celebrar com quem amamos.');
  const [welcome, setWelcome] = useState(couple.mensagem_boas_vindas || 'Sua presença ao nosso lado é o nosso maior presente. Vamos celebrar juntos este novo capítulo!');
  const [coverKey, setCoverKey] = useState<'coupleHero' | 'coupleMoment'>(couple.foto_capa_key || 'coupleHero');
  const [venueKey, setVenueKey] = useState<'gardensCeremony' | 'gardensMainHall' | 'gardensWaterfall' | 'gardensSpa'>(couple.espaco_foto_key || 'gardensCeremony');

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noivo.trim() || !noiva.trim() || !venue.trim()) {
      showToast('Preencha os nomes dos noivos e o espaço do casamento.', 'info');
      return;
    }
    updateCouple({
      noivo_nome: noivo.trim(),
      noiva_nome: noiva.trim(),
      data_evento: date,
      espaco_nome: venue.trim(),
      hashtag: hashtag.trim() || '#NossoCasamento',
      historia_casal: story.trim(),
      mensagem_boas_vindas: welcome.trim(),
      foto_capa_key: coverKey,
      espaco_foto_key: venueKey,
    });
    showToast('Personalização salva neste navegador de demonstração.', 'success');
  };

  return (
    <section className="bg-white border border-stone-200 rounded-2xl p-5 sm:p-7 shadow-xs space-y-5">
      <div className="flex items-start gap-3">
        <div className="rounded-xl bg-[#480927]/5 p-3"><Sparkles className="w-5 h-5 text-[#9F825B]" /></div>
        <div>
          <h2 className="text-xl font-serif font-bold text-[#480927]">Personalize o site do casamento</h2>
          <p className="text-sm text-stone-600 mt-1">Edite nomes, data, história, mensagem de boas-vindas e escolha fotos do espaço para a prévia.</p>
        </div>
      </div>
      <form onSubmit={save} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label className="text-xs font-semibold text-stone-700 space-y-1">Nome do noivo
          <input value={noivo} onChange={e => setNoivo(e.target.value)} className="w-full mt-1 rounded-lg border border-stone-300 px-3 py-2.5 text-sm font-normal" required />
        </label>
        <label className="text-xs font-semibold text-stone-700 space-y-1">Nome da noiva
          <input value={noiva} onChange={e => setNoiva(e.target.value)} className="w-full mt-1 rounded-lg border border-stone-300 px-3 py-2.5 text-sm font-normal" required />
        </label>
        <label className="text-xs font-semibold text-stone-700 space-y-1">Data do casamento
          <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full mt-1 rounded-lg border border-stone-300 px-3 py-2.5 text-sm font-normal" />
        </label>
        <label className="text-xs font-semibold text-stone-700 space-y-1">Hashtag
          <input value={hashtag} onChange={e => setHashtag(e.target.value)} placeholder="#NossoCasamento" className="w-full mt-1 rounded-lg border border-stone-300 px-3 py-2.5 text-sm font-normal" />
        </label>
        <label className="text-xs font-semibold text-stone-700 space-y-1 md:col-span-2">Espaço do casamento
          <input value={venue} onChange={e => setVenue(e.target.value)} className="w-full mt-1 rounded-lg border border-stone-300 px-3 py-2.5 text-sm font-normal" required />
        </label>
        <div className="md:col-span-2">
          <p className="text-xs font-semibold text-stone-700 mb-2">Foto de capa</p>
          <div className="grid grid-cols-2 gap-3">
            {(['coupleHero', 'coupleMoment'] as const).map(key => (
              <button type="button" key={key} onClick={() => setCoverKey(key)} className={`overflow-hidden rounded-xl border-2 text-left ${coverKey === key ? 'border-[#C5A880] ring-2 ring-[#C5A880]/20' : 'border-stone-200'}`}>
                <img src={WEDDING_IMAGES[key]} alt={key === 'coupleHero' ? 'Casal na foto de capa' : 'Momento do casal'} className="h-28 w-full object-cover" />
                <span className="block p-2 text-xs text-stone-700">{key === 'coupleHero' ? 'Foto editorial' : 'Momento do casal'}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="md:col-span-2">
          <p className="text-xs font-semibold text-stone-700 mb-2">Foto do espaço</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {venueOptions.map(option => (
              <button type="button" key={option.key} onClick={() => { setVenueKey(option.key); setVenue(option.name); }} className={`overflow-hidden rounded-xl border-2 text-left ${venueKey === option.key ? 'border-[#C5A880] ring-2 ring-[#C5A880]/20' : 'border-stone-200'}`}>
                <img src={WEDDING_IMAGES[option.key]} alt={option.label} className="h-24 w-full object-cover" loading="lazy" />
                <span className="block p-2 text-xs text-stone-700">{option.label}</span>
              </button>
            ))}
          </div>
        </div>
        <label className="text-xs font-semibold text-stone-700 space-y-1 md:col-span-2">Nossa história
          <textarea value={story} onChange={e => setStory(e.target.value)} rows={4} maxLength={1500} className="w-full mt-1 rounded-lg border border-stone-300 px-3 py-2.5 text-sm font-normal" />
          <span className="block text-right text-[11px] text-stone-400">{story.length}/1500</span>
        </label>
        <label className="text-xs font-semibold text-stone-700 space-y-1 md:col-span-2">Mensagem de boas-vindas
          <textarea value={welcome} onChange={e => setWelcome(e.target.value)} rows={3} maxLength={500} className="w-full mt-1 rounded-lg border border-stone-300 px-3 py-2.5 text-sm font-normal" />
          <span className="block text-right text-[11px] text-stone-400">{welcome.length}/500</span>
        </label>
        <div className="md:col-span-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-t border-stone-100 pt-4">
          <p className="text-xs text-stone-500 flex items-center gap-2"><Image className="w-4 h-4" /> Fotos incluídas no projeto. Uploads pessoais exigem conexão com Storage.</p>
          <button type="submit" className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#480927] px-5 py-3 text-sm font-semibold text-white hover:bg-[#5C0D33]"><Save className="w-4 h-4" /> Salvar personalização</button>
        </div>
      </form>
    </section>
  );
};
