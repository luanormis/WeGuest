import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ActiveView, Role } from '../types';
import { WelucciLogo } from './WelucciLogo';
import { 
  Building2, 
  Crown, 
  Database, 
  FileText, 
  Gift, 
  Heart, 
  Menu, 
  Smartphone, 
  Monitor, 
  X, 
  ShieldCheck,
  CreditCard
} from 'lucide-react';

export const Navigation: React.FC = () => {
  const { 
    activeView, 
    setActiveView, 
    activeRole, 
    setActiveRole, 
    isMobileFrame, 
    setIsMobileFrame, 
    couple 
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: Array<{ id: ActiveView; label: string; icon: React.ReactNode; badge?: string }> = [
    { id: 'public_site', label: 'Site do Casamento', icon: <Heart className="w-4 h-4 text-[#DFCDAE]" /> },
    { id: 'couple_dashboard', label: 'Painel dos Noivos', icon: <Gift className="w-4 h-4 text-[#DFCDAE]" />, badge: 'Noivos' },
    { id: 'super_admin', label: 'Portal Super Admin', icon: <Building2 className="w-4 h-4 text-[#DFCDAE]" />, badge: 'B2B' },
    { id: 'checkout_demo', label: 'Checkout Getnet', icon: <CreditCard className="w-4 h-4 text-[#DFCDAE]" />, badge: 'API' },
    { id: 'legal_center', label: 'Central Jurídica', icon: <FileText className="w-4 h-4 text-[#DFCDAE]" /> },
    { id: 'supabase_schema', label: 'Supabase SQL', icon: <Database className="w-4 h-4 text-[#DFCDAE]" /> },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#480927] text-white border-b border-[#35051C] shadow-md">
      {/* Top micro-bar for Pitch info & Welucci Partnership */}
      <div className="bg-[#35051C] text-[#DFCDAE] text-[11px] tracking-widest uppercase py-1.5 px-4 md:px-8 flex justify-between items-center font-medium">
        <div className="flex items-center gap-2">
          <WelucciLogo iconOnly size={14} color="#DFCDAE" />
          <span className="text-[#DFCDAE] font-semibold tracking-wider">WEGUEST BY WELUCCI</span>
          <span className="text-stone-400">·</span>
          <span className="text-stone-300">ECOSSISTEMA OFICIAL</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-1.5 text-stone-300">
            <span>Pitch:</span>
            <strong className="text-white font-serif tracking-normal text-xs">{couple.noivo_nome} & {couple.noiva_nome}</strong>
            <span className="text-[#DFCDAE]/70">({couple.hashtag})</span>
          </div>

          {/* Quick simulator frame toggle */}
          <button
            onClick={() => setIsMobileFrame(prev => !prev)}
            className="flex items-center gap-1 text-[11px] bg-black/40 hover:bg-black/60 text-[#DFCDAE] px-2.5 py-0.5 rounded transition-colors border border-white/10"
            title="Alternar entre tela cheia e moldura de smartphone mobile-first"
          >
            {isMobileFrame ? (
              <>
                <Monitor className="w-3 h-3 text-[#DFCDAE]" />
                <span className="hidden md:inline">Ver Desktop</span>
              </>
            ) : (
              <>
                <Smartphone className="w-3 h-3 text-[#DFCDAE]" />
                <span className="hidden md:inline">Simulador Mobile</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Header bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Zone with Authentic Welucci Logo */}
        <div className="flex items-center gap-3 shrink-0">
          <button 
            onClick={() => setActiveView('public_site')}
            className="text-left group flex items-center gap-2.5 transition-opacity hover:opacity-95"
          >
            <WelucciLogo 
              color="#ffffff" 
              size={36} 
              textClassName="text-2xl font-light tracking-tight text-white"
            />
          </button>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 bg-black/20 p-1 rounded-lg border border-white/10">
          {navItems.map((item) => {
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-white text-[#480927] shadow-sm font-semibold'
                    : 'text-stone-200 hover:text-white hover:bg-white/10'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
                {item.badge && (
                  <span className={`text-[9px] px-1.5 py-0.2 rounded font-mono ${
                    isActive ? 'bg-[#480927]/15 text-[#480927]' : 'bg-white/15 text-stone-200'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Action & Role Selector */}
        <div className="hidden sm:flex items-center gap-3 shrink-0">
          <div className="flex items-center bg-black/25 rounded-md p-0.5 border border-white/15 text-xs text-white">
            <span className="px-2 text-[11px] text-stone-300 font-medium">Perfil:</span>
            <button
              onClick={() => {
                setActiveRole('noivos');
                setActiveView('couple_dashboard');
              }}
              className={`px-2.5 py-1 rounded text-xs transition-colors ${
                activeRole === 'noivos' ? 'bg-white text-[#480927] font-semibold shadow-xs' : 'text-stone-300 hover:text-white'
              }`}
            >
              Noivos
            </button>
            <button
              onClick={() => {
                setActiveRole('super_admin_weguest');
                setActiveView('super_admin');
              }}
              className={`px-2.5 py-1 rounded text-xs transition-colors ${
                activeRole === 'super_admin_weguest' ? 'bg-[#111111] text-[#DFCDAE] font-semibold' : 'text-stone-300 hover:text-white'
              }`}
            >
              Admin WeGuest
            </button>
            <button
              onClick={() => {
                setActiveRole('financeiro_welucci');
                setActiveView('super_admin');
              }}
              className={`px-2.5 py-1 rounded text-xs transition-colors ${
                activeRole === 'financeiro_welucci' ? 'bg-[#C5A880] text-[#111111] font-semibold' : 'text-stone-300 hover:text-white'
              }`}
            >
              Welucci Fin
            </button>
          </div>
        </div>

        {/* Mobile menu toggle button */}
        <button
          onClick={() => setMobileMenuOpen(prev => !prev)}
          className="lg:hidden p-2 rounded-md text-white hover:bg-white/10 focus:outline-none"
          aria-label="Menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#35051C] bg-[#35051C] text-white px-4 py-4 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200 shadow-xl">
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <WelucciLogo color="#ffffff" size={24} textClassName="text-base font-light text-white" />
            <span className="text-[10px] text-[#DFCDAE] uppercase font-mono">Menu Principal</span>
          </div>
          <div className="text-xs text-stone-400 uppercase tracking-wider font-semibold mb-2">
            Navegar pelas Telas do MVP
          </div>
          <div className="grid grid-cols-1 gap-1.5">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveView(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`flex items-center justify-between w-full px-3 py-2.5 rounded-lg text-sm text-left transition-colors ${
                  activeView === item.id
                    ? 'bg-[#111111] text-[#C5A880] font-medium'
                    : 'text-stone-800 hover:bg-stone-100'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] bg-stone-200/70 text-stone-700 px-1.5 py-0.5 rounded">
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="pt-3 border-t border-stone-200">
            <div className="text-xs text-stone-500 uppercase tracking-wider font-semibold mb-2">
              Alternar Perfil Ativo (RBAC)
            </div>
            <div className="grid grid-cols-3 gap-1">
              <button
                onClick={() => {
                  setActiveRole('noivos');
                  setActiveView('couple_dashboard');
                  setMobileMenuOpen(false);
                }}
                className={`px-2 py-2 text-xs rounded border text-center ${
                  activeRole === 'noivos' ? 'bg-[#111111] text-[#C5A880] border-[#111111]' : 'border-stone-200 text-stone-700'
                }`}
              >
                Noivos
              </button>
              <button
                onClick={() => {
                  setActiveRole('super_admin_weguest');
                  setActiveView('super_admin');
                  setMobileMenuOpen(false);
                }}
                className={`px-2 py-2 text-xs rounded border text-center ${
                  activeRole === 'super_admin_weguest' ? 'bg-[#111111] text-[#C5A880] border-[#111111]' : 'border-stone-200 text-stone-700'
                }`}
              >
                WeGuest
              </button>
              <button
                onClick={() => {
                  setActiveRole('financeiro_welucci');
                  setActiveView('super_admin');
                  setMobileMenuOpen(false);
                }}
                className={`px-2 py-2 text-xs rounded border text-center ${
                  activeRole === 'financeiro_welucci' ? 'bg-[#C5A880] text-white border-[#C5A880]' : 'border-stone-200 text-stone-700'
                }`}
              >
                Welucci
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
