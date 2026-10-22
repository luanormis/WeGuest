import React, { FormEvent, useState } from 'react';
import { Heart, LockKeyhole, UserPlus, LogIn, Info } from 'lucide-react';

type DemoUser = { name: string; email: string; password: string; role: 'noivos' | 'investidor' };
const DEMO_USERS_KEY = 'weguest_demo_users_v1';
const DEMO_SESSION_KEY = 'weguest_demo_session_v1';
const DEFAULT_USER: DemoUser = { name: 'Casal Demonstração', email: 'investidor@weguest.demo', password: '102030', role: 'noivos' };

function readUsers(): DemoUser[] {
  try {
    const saved = localStorage.getItem(DEMO_USERS_KEY);
    const users = saved ? JSON.parse(saved) as DemoUser[] : [];
    if (!users.some(u => u.email === DEFAULT_USER.email)) users.unshift(DEFAULT_USER);
    return users;
  } catch { return [DEFAULT_USER]; }
}

export const DemoAccessGate: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<DemoUser[]>(readUsers);
  const [session, setSession] = useState<DemoUser | null>(() => {
    try { return JSON.parse(localStorage.getItem(DEMO_SESSION_KEY) || 'null'); } catch { return null; }
  });
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const login = (e: FormEvent) => {
    e.preventDefault(); setError(''); setNotice('');
    const found = users.find(u => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password);
    if (!found) { setError('E-mail ou senha incorretos. Para testar, use investidor@weguest.demo e senha 102030.'); return; }
    localStorage.setItem(DEMO_SESSION_KEY, JSON.stringify({ name: found.name, email: found.email, role: found.role }));
    setSession({ name: found.name, email: found.email, role: found.role });
  };

  const signup = (e: FormEvent) => {
    e.preventDefault(); setError(''); setNotice('');
    if (name.trim().length < 2) { setError('Informe seu nome.'); return; }
    if (password.length < 6) { setError('A senha precisa ter pelo menos 6 caracteres.'); return; }
    if (users.some(u => u.email.toLowerCase() === email.trim().toLowerCase())) { setError('Este e-mail já está cadastrado neste navegador.'); return; }
    const next = [...users, { name: name.trim(), email: email.trim(), password, role: 'noivos' as const }];
    localStorage.setItem(DEMO_USERS_KEY, JSON.stringify(next));
    setUsers(next);
    setNotice('Cadastro de demonstração criado neste navegador. Faça login para continuar.');
    setMode('login'); setPassword('');
  };

  if (session) return <>{children}<button onClick={() => { localStorage.removeItem(DEMO_SESSION_KEY); setSession(null); }} className="fixed bottom-4 right-4 z-[100] rounded-full bg-[#480927] px-4 py-2 text-xs font-semibold text-white shadow-lg">Sair da demonstração</button></>;

  return (
    <main className="min-h-screen bg-[#F8F6F2] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-xl">
        <div className="bg-[#480927] px-8 py-8 text-white">
          <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10"><Heart className="h-6 w-6 text-[#DFCDAE]" /></div>
          <p className="text-xs uppercase tracking-[0.24em] text-[#DFCDAE]">WeGuest by Welucci</p>
          <h1 className="mt-2 font-serif text-3xl">{mode === 'login' ? 'Bem-vindo ao WeGuest' : 'Crie seu acesso'}</h1>
          <p className="mt-2 text-sm text-white/75">Demonstração interativa para apresentar a experiência da plataforma.</p>
        </div>
        <div className="space-y-5 p-8">
          <div className="grid grid-cols-2 gap-2 rounded-xl bg-stone-100 p-1">
            <button onClick={() => { setMode('login'); setError(''); }} className={`rounded-lg py-2 text-sm font-medium ${mode === 'login' ? 'bg-white text-[#480927] shadow-sm' : 'text-stone-500'}`}><LogIn className="mr-1 inline h-4 w-4" /> Entrar</button>
            <button onClick={() => { setMode('signup'); setError(''); }} className={`rounded-lg py-2 text-sm font-medium ${mode === 'signup' ? 'bg-white text-[#480927] shadow-sm' : 'text-stone-500'}`}><UserPlus className="mr-1 inline h-4 w-4" /> Cadastrar</button>
          </div>
          {mode === 'login' && <div className="rounded-xl border border-[#C5A880]/50 bg-[#F8F4ED] p-3 text-sm"><p className="font-semibold text-[#480927]">Acesso para investidor</p><p className="mt-1 text-stone-700">E-mail: <strong>investidor@weguest.demo</strong></p><p className="text-stone-700">Senha: <strong>102030</strong></p><button onClick={() => { setEmail(DEFAULT_USER.email); setPassword(DEFAULT_USER.password); }} className="mt-2 text-xs font-semibold text-[#480927] underline">Preencher acesso de teste</button></div>}
          <form onSubmit={mode === 'login' ? login : signup} className="space-y-4">
            {mode === 'signup' && <label className="block text-sm font-medium text-stone-700">Seu nome<input required value={name} onChange={e => setName(e.target.value)} className="mt-1 w-full rounded-xl border border-stone-300 px-3 py-3 outline-none focus:border-[#C5A880]" placeholder="Nome dos noivos" /></label>}
            <label className="block text-sm font-medium text-stone-700">E-mail<input required type="email" value={email} onChange={e => setEmail(e.target.value)} className="mt-1 w-full rounded-xl border border-stone-300 px-3 py-3 outline-none focus:border-[#C5A880]" placeholder="voce@exemplo.com" /></label>
            <label className="block text-sm font-medium text-stone-700">Senha<input required type="password" value={password} onChange={e => setPassword(e.target.value)} className="mt-1 w-full rounded-xl border border-stone-300 px-3 py-3 outline-none focus:border-[#C5A880]" placeholder={mode === 'signup' ? 'Mínimo 6 caracteres' : 'Sua senha'} /></label>
            {error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
            {notice && <p role="status" className="rounded-lg bg-green-50 p-3 text-sm text-green-700">{notice}</p>}
            <button type="submit" className="w-full rounded-xl bg-[#480927] px-4 py-3 font-semibold text-white hover:bg-[#5B0D32]">{mode === 'login' ? 'Entrar na demonstração' : 'Criar cadastro de demonstração'}</button>
          </form>
          <p className="flex gap-2 text-xs leading-relaxed text-stone-500"><Info className="mt-0.5 h-4 w-4 shrink-0" /> Modo de demonstração: os cadastros ficam apenas neste navegador e não são contas seguras nem compartilhadas. Não use dados reais. A autenticação Supabase será necessária antes do lançamento público.</p>
        </div>
      </div>
    </main>
  );
};
