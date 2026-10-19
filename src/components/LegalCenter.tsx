import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { WelucciLogo } from './WelucciLogo';
import { 
  Building2, 
  CheckCircle2, 
  Copy, 
  Download, 
  FileCheck, 
  FileText, 
  Printer, 
  Scale, 
  ShieldCheck,
  ExternalLink
} from 'lucide-react';

export const LegalCenter: React.FC = () => {
  const { couple, showToast } = useApp();
  const [activeTab, setActiveTab] = useState<'b2b_annex' | 'guest_terms'>('b2b_annex');

  const copyContractAnnex = () => {
    const textToCopy = `ANEXO CONTRATUAL TECNOLÓGICO — PARCERIA WEGUEST & WELUCCI GARDENS
INTEGRAÇÃO DA PLATAFORMA WEGUEST DE GESTÃO DE CONVIDADOS E LISTA DE PRESENTES

Pelo presente instrumento particular, as partes ajustam o presente ANEXO TECNOLÓGICO integrante do Contrato Principal de Locação e Serviços firmado entre WELUCCI GARDENS e os NOIVOS (${couple.noivo_nome} & ${couple.noiva_nome}):

CLÁUSULA 1ª – DO OBJETO DA PLATAFORMA WEGUEST
A plataforma WeGuest disponibiliza aos noivos um ambiente digital exclusivo de alto padrão, responsivo para dispositivos móveis e computadores, contendo: (a) gerador de convites com link único e QR Code; (b) confirmação digital de presença (RSVP) em tempo real com mapeamento de restrições alimentares; (c) mural interativo de recados; e (d) lista com até 200 itens de presentes virtuais integrados a gateway de pagamento seguro.

CLÁUSULA 2ª – DA REMUNERAÇÃO TECNOLÓGICA E SPLIT DE RECEITAS (B2B)
2.1. Fica estipulada a taxa de serviço tecnológico no valor fixo de R$ 10,00 (dez reais) por convidado ativo cadastrado na lista final do evento.
2.2. A liquidação da taxa ocorre de maneira automatizada através do split financeiro da plataforma, cabendo a exata divisão:
   a) R$ 5,00 (cinco reais) líquidos destinados à Conta de Operação e Tecnologia WEGUEST;
   b) R$ 5,00 (cinco reais) líquidos repassados diretamente à conta de Gestão do Espaço WELUCCI GARDENS.

CLÁUSULA 3ª – DOS PRAZOS DE LIQUIDAÇÃO E REPASSE AOS NOIVOS
3.1. Todos os valores recebidos a título de presentes virtuais serão transferidos aos noivos via PIX nos seguintes prazos operacionais:
   a) Modalidade PIX: Liberação do saldo líquido em D+2 dias úteis após a confirmação do pagamento;
   b) Modalidade Cartão de Crédito (Getnet): Liberação do saldo líquido em D+14 dias corridos, garantindo a antecipação sem juros predatórios.
3.2. As taxas de intermediação bancária Getnet (1.99% no PIX e 4.99% no Cartão de Crédito) serão debitadas na fonte, com opção no painel do casal de repasse transparente ao convidado ou absorção pelos noivos.

CLÁUSULA 4ª – DA PROTEÇÃO DE DADOS E AUDITORIA (LGPD)
O WeGuest e o Welucci Gardens comprometem-se com o sigilo das informações de convidados nos termos da Lei Geral de Proteção de Dados (Lei nº 13.709/2018), sendo vedada a comercialização de dados a terceiros.

São Paulo, 18 de Outubro de 2026.
__________________________________
WELUCCI GARDENS EVENTOS LTDA
__________________________________
WEGUEST TECNOLOGIA SAAS LTDA
__________________________________
CONTRATANTES: ${couple.noivo_nome} & ${couple.noiva_nome}`;

    navigator.clipboard.writeText(textToCopy);
    showToast('Minuta do anexo contratual B2B copiada para a área de transferência!', 'success');
  };

  return (
    <div className="min-h-screen bg-[#F9F9F9] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="border-b border-stone-200 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-stone-500 mb-1">
              <span>Compliance Jurídico</span>
              <span aria-hidden="true">·</span>
              <span>Welucci Legal Framework</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#111111]">
              Central Legal, Contratual & Compliance
            </h1>
            <p className="text-stone-600 text-sm mt-1">
              Termos operacionais de transparência Getnet, minuta contratual B2B para o espaço e regras de repasse.
            </p>
          </div>

          {/* Tab Selector */}
          <div className="flex items-center bg-white p-1 rounded-lg border border-stone-200 shadow-xs self-start sm:self-auto">
            <button
              onClick={() => setActiveTab('b2b_annex')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                activeTab === 'b2b_annex' 
                  ? 'bg-[#111111] text-[#C5A880] shadow-xs font-semibold' 
                  : 'text-stone-600 hover:text-black'
              }`}
            >
              Anexo Contratual Welucci (B2B)
            </button>
            <button
              onClick={() => setActiveTab('guest_terms')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                activeTab === 'guest_terms' 
                  ? 'bg-[#111111] text-[#C5A880] shadow-xs font-semibold' 
                  : 'text-stone-600 hover:text-black'
              }`}
            >
              Termos de Uso do Convidado
            </button>
          </div>
        </div>

        {/* TAB 1: B2B CONTRACT ANNEX */}
        {activeTab === 'b2b_annex' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Quick Actions Header */}
            <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#C5A880]/15 text-[#9F825B] flex items-center justify-center">
                  <Scale className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-stone-900">
                    Minuta Jurídica Oficial para Anexo Físico / Digital
                  </h3>
                  <p className="text-xs text-stone-500">
                    Documento pronto para ser anexado ao contrato principal de locação do espaço Welucci Gardens.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={copyContractAnnex}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-[#111111] text-[#DFCDAE] hover:text-white rounded-lg text-xs font-semibold transition-colors shadow-xs"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copiar Minuta Completa</span>
                </button>
                <button
                  onClick={() => window.print()}
                  className="p-2 border border-stone-200 hover:bg-stone-100 rounded-lg text-stone-700 text-xs transition-colors"
                  title="Imprimir minuta"
                >
                  <Printer className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Document Sheet Visual Presentation */}
            <div className="bg-white p-8 sm:p-12 rounded-2xl border border-stone-200 shadow-sm max-w-4xl mx-auto space-y-6 font-serif text-stone-800 leading-relaxed text-sm">
              <div className="text-center pb-6 border-b border-stone-200 space-y-2">
                <div className="flex justify-center pb-1">
                  <WelucciLogo color="#480927" size={36} textClassName="text-xl font-light text-[#480927]" />
                </div>
                <div className="text-xs font-sans tracking-widest text-stone-500 uppercase font-semibold">
                  Ecossistema Welucci Gardens & WeGuest SaaS
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-[#111111]">
                  ANEXO CONTRATUAL TECNOLÓGICO — INTEGRAÇÃO WEGUEST
                </h2>
                <div className="text-xs font-sans text-[#480927] font-mono font-medium">
                  REF: CONTRATO DE LOCAÇÃO E EVENTOS — CASAL {couple.noivo_nome.toUpperCase()} & {couple.noiva_nome.toUpperCase()}
                </div>
              </div>

              <p className="text-justify font-sans text-xs text-stone-600 leading-normal">
                Pelo presente instrumento particular, as partes celebram este <strong>ANEXO TECNOLÓGICO</strong> integrante inseparável do Contrato de Prestação de Serviços e Locação de Espaço para Eventos celebrado pela <strong>WELUCCI GARDENS</strong> e pelos <strong>CONTRATANTES</strong> qualificados no instrumento principal.
              </p>

              <div className="space-y-4 font-sans text-xs">
                {/* Cláusula 1 */}
                <div className="space-y-1">
                  <h4 className="font-bold text-stone-900 text-sm">
                    CLÁUSULA 1ª — DO OBJETO E FUNCIONALIDADE DO SOFTWARE
                  </h4>
                  <p className="text-stone-700 leading-relaxed text-justify">
                    1.1. O software <strong>WeGuest</strong> consiste em uma aplicação SaaS (Software as a Service) multi-tenant de altíssimo padrão, fornecendo aos Contratantes: (i) site personalizado responsivo para dispositivos móveis com visual contemporâneo; (ii) gestão digital de RSVP e restrições alimentares com integração direta à equipe de banquete do Welucci; (iii) gerador de links e QR Codes de convite com compartilhamento rápido; (iv) catálogo estruturado de até 200 opções de presentes virtuais com precificação customizável.
                  </p>
                </div>

                {/* Cláusula 2 */}
                <div className="space-y-1 bg-[#F9F9F9] p-4 rounded-xl border border-stone-200">
                  <h4 className="font-bold text-[#111111] text-sm flex items-center justify-between">
                    <span>CLÁUSULA 2ª — DA TAXA TECNOLÓGICA E REPASSE SPLIT (REGRA DE NEGÓCIO)</span>
                    <span className="text-[11px] bg-[#C5A880]/20 text-[#9F825B] px-2 py-0.5 rounded font-mono font-bold">R$ 10,00 / Convidado</span>
                  </h4>
                  <p className="text-stone-700 leading-relaxed text-justify">
                    2.1. Fica pactuada a cobrança transparente de <strong>R$ 10,00 (dez reais)</strong> fixos por convidado ativo constante na lista oficial do casamento.
                  </p>
                  <p className="text-stone-700 leading-relaxed text-justify">
                    2.2. A arrecadação desta taxa é automatizada no fluxo de checkout da adquirente Getnet, sendo liquidada diretamente em split:
                  </p>
                  <ul className="list-disc pl-5 space-y-1 text-stone-700">
                    <li><strong>R$ 5,00 (cinco reais)</strong> líquidos para a <strong>WeGuest Tecnologia</strong>, remunerando a infraestrutura em nuvem, segurança de dados e manutenção contínua.</li>
                    <li><strong>R$ 5,00 (cinco reais)</strong> líquidos repassados à <strong>Welucci Gardens</strong> a título de coparticipação em tecnologia e operação de hospitalidade.</li>
                  </ul>
                </div>

                {/* Cláusula 3 */}
                <div className="space-y-1">
                  <h4 className="font-bold text-stone-900 text-sm">
                    CLÁUSULA 3ª — DOS PRAZOS DE LIQUIDAÇÃO E SAQUES AOS NOIVOS
                  </h4>
                  <p className="text-stone-700 leading-relaxed text-justify">
                    3.1. Todos os valores arrecadados pela lista de presentes virtuais constituem patrimônio exclusivo dos Noivos, sendo liberados para saque via PIX nos seguintes prazos operacionais:
                  </p>
                  <ul className="list-disc pl-5 space-y-1 text-stone-700">
                    <li><strong>Modalidade PIX:</strong> Disponibilização para saque bancário em <strong>D+2 dias úteis</strong> após a confirmação da transação.</li>
                    <li><strong>Modalidade Cartão de Crédito:</strong> Disponibilização para saque bancário em <strong>D+14 dias corridos</strong> após a aprovação da operadora Getnet.</li>
                  </ul>
                  <p className="text-stone-700 leading-relaxed text-justify mt-1">
                    3.2. As taxas de adquirente (1.99% PIX e 4.99% Cartão) poderão, por decisão expressa dos Contratantes em seu painel digital, ser acrescidas ao checkout do convidado ou descontadas do valor líquido a ser creditado.
                  </p>
                </div>

                {/* Cláusula 4 */}
                <div className="space-y-1">
                  <h4 className="font-bold text-stone-900 text-sm">
                    CLÁUSULA 4ª — DA SEGURANÇA E AUDITORIA
                  </h4>
                  <p className="text-stone-700 leading-relaxed text-justify">
                    4.1. O processamento dos dados bancários é realizado diretamente sob os padrões de segurança PCI-DSS da Getnet S.A., não havendo armazenamento de números completos de cartões ou senhas nos servidores da aplicação.
                  </p>
                </div>
              </div>

              {/* Signatures simulation */}
              <div className="pt-8 border-t border-stone-200 grid grid-cols-1 sm:grid-cols-2 gap-8 text-center font-sans text-xs">
                <div className="space-y-1">
                  <div className="w-48 h-px bg-stone-400 mx-auto" />
                  <div className="font-bold text-stone-900">WELUCCI GARDENS EVENTOS</div>
                  <div className="text-stone-500 text-[10px]">Diretoria Financeira & Operações</div>
                </div>

                <div className="space-y-1">
                  <div className="w-48 h-px bg-stone-400 mx-auto" />
                  <div className="font-bold text-stone-900">WEGUEST TECNOLOGIA SAAS</div>
                  <div className="text-stone-500 text-[10px]">Gestão de Infraestrutura & Split</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: GUEST TERMS OF SERVICE */}
        {activeTab === 'guest_terms' && (
          <div className="bg-white p-8 rounded-2xl border border-stone-200 shadow-xs space-y-6 text-xs text-stone-700 leading-relaxed">
            <div className="space-y-1 pb-4 border-b border-stone-200">
              <span className="text-[10px] uppercase tracking-wider text-[#C5A880] font-semibold">
                Transparência ao Convidado
              </span>
              <h2 className="text-xl font-serif font-bold text-[#111111]">
                Termos de Uso e Política de Pagamentos Getnet
              </h2>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-stone-900 text-sm mb-1">
                  1. Natureza dos Presentes Virtuais
                </h4>
                <p>
                  Os itens expostos na lista de presentes do casamento de <strong>Guilherme & Victória</strong> são simbólicos e representam cotas financeiras destinadas a proporcionar experiências inesquecíveis durante a Lua de Mel e o início do novo lar do casal. Ao realizar a compra de qualquer item, o valor correspondente (deduzidas as taxas de gateway bancário ou com taxas transparentemente detalhadas) é transferido diretamente para a conta bancária indicada pelos noivos.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-stone-900 text-sm mb-1">
                  2. Segurança do Checkout Transparente Getnet
                </h4>
                <p>
                  Todas as transações por PIX e Cartão de Crédito são criptografadas e processadas de forma segura através dos servidores certificados da <strong>Getnet S.A.</strong> (adquirente do Grupo Santander). A plataforma WeGuest não armazena dados de segurança de cartões de crédito (como CVV ou senhas), garantindo conformidade com as normas internacionais PCI-DSS.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-stone-900 text-sm mb-1">
                  3. Política de Não-Reembolso após a Confirmação
                </h4>
                <p>
                  Por se tratar de um repasse financeiro de natureza voluntária e de incentivo à união matrimonial, uma vez aprovada a transação bancária e emitido o comprovante digital Getnet, não será admitido cancelamento unilateral ou reembolso, ressalvados os casos de comprovada fraude bancária apurada junto à instituição emissora do cartão.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-stone-900 text-sm mb-1">
                  4. Privacidade e Sigilo de Dados (LGPD)
                </h4>
                <p>
                  Os dados informados no formulário de RSVP e no mural de mensagens (nome, e-mail, telefone e restrições alimentares) são utilizados estritamente para a organização do cerimonial no <strong>Welucci Gardens</strong> e para a comunicação direta com os noivos.
                </p>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
