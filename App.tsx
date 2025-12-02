
import React, { useState } from 'react';
import { CONTENT } from './constants';
import { Language } from './types';
import Calculator from './components/Calculator';
import { 
  ShieldIcon, LockIcon, ZapIcon, UsersIcon 
} from './components/Icons';

const App = () => {
  const [lang, setLang] = useState<Language>('pt');
  const text = CONTENT[lang];

  // Função que redireciona o usuário para o Web App no subdomínio
  const redirectToApp = (path: string = '') => {
    // Em produção, isso levaria para https://app.yuanbr.com
    // Como estamos em ambiente de demo, usaremos um alert para explicar o comportamento
    const url = `https://app.yuanbr.com${path}`;
    window.location.href = url;
  };

  return (
    <div className="min-h-screen bg-brand-light font-sans text-brand-dark selection:bg-brand-red selection:text-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-sm safe-area-inset-top transition-all">
        <div className="container mx-auto px-4 lg:px-6 py-4 flex flex-wrap items-center justify-between gap-y-3">
          {/* Logo */}
          <div className="flex items-center gap-2 mr-auto cursor-pointer" onClick={() => window.location.reload()}>
            <div className="w-9 h-9 md:w-10 md:h-10 bg-brand-red rounded-lg flex items-center justify-center text-white font-black text-lg md:text-xl shadow-brand-red/30 shadow-lg transform hover:scale-105 transition-transform">
              ¥
            </div>
            <span className="text-xl md:text-2xl font-black tracking-tighter text-gray-900 group">
              YUAN<span className="text-brand-red group-hover:text-brand-darkRed transition-colors">BR</span>
            </span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 md:gap-4 w-full md:w-auto justify-end">
            <button 
              onClick={() => setLang(lang === 'pt' ? 'cn' : 'pt')} 
              className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 hover:border-brand-red transition-all text-xs font-bold whitespace-nowrap bg-gray-50 active:scale-95"
              title="Mudar idioma / Switch Language"
            >
              <span className="text-base leading-none">{lang === 'pt' ? '🇧🇷' : '🇨🇳'}</span>
            </button>
            
            <div className="flex gap-2">
              <button 
                onClick={() => redirectToApp('/login?role=supplier')} 
                className="px-3 py-2 md:px-5 md:py-2.5 text-xs md:text-sm font-bold text-gray-700 hover:text-brand-red transition-colors border border-gray-200 rounded-lg hover:border-brand-red hover:bg-red-50 active:scale-95"
              >
                {text.nav.supplierLogin}
              </button>
              <button 
                onClick={() => redirectToApp('/login?role=client')} 
                className="px-3 py-2 md:px-5 md:py-2.5 bg-brand-dark text-white text-xs md:text-sm font-bold rounded-lg hover:bg-brand-red transition-all shadow-lg hover:shadow-brand-red/40 transform hover:-translate-y-0.5 active:translate-y-0"
              >
                {text.nav.clientLogin}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative bg-gradient-to-br from-gray-900 via-brand-darkRed to-brand-red text-white overflow-hidden pb-12 pt-8 lg:pt-16 lg:pb-24">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1534351590666-13e3e96b5017?q=80&w=2070&auto=format&fit=crop')] opacity-10 mix-blend-overlay bg-cover bg-center"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-brand-red/20 to-transparent"></div>
        
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
            {/* Hero Copy */}
            <div className="flex-1 text-center lg:text-left order-2 lg:order-1 animate-fade-in-up">
              <div className="inline-flex items-center gap-2 bg-brand-gold/10 text-brand-gold border border-brand-gold/30 px-3 py-1.5 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-wide mb-6 backdrop-blur-md shadow-sm hover:bg-brand-gold/20 transition-colors cursor-default">
                <ShieldIcon className="w-3 h-3 md:w-4 md:h-4" />
                Dinheiro retido em conta Escrow auditada no Brasil
              </div>
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-black leading-tight mb-4 md:mb-6 tracking-tight drop-shadow-sm">
                 {lang === 'pt' ? 'CHEGA DE SER ENGANADO POR FORNECEDORES NA CHINA.' : 'The Safest Bridge to the Brazilian Market.'}
              </h1>
              <p className="text-base md:text-xl text-gray-100 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed opacity-90 font-light">
                 {lang === 'pt' 
                    ? 'O fornecedor sumiu com seu dinheiro? A carga veio errada? A YUANBR blinda seu capital. Nós só liberamos o pagamento quando sua mercadoria é conferida e entregue.' 
                    : 'We guarantee funds compliance and eliminate trust barriers, making Brazilian buyers more willing to order from you.'}
              </p>
              <button 
                onClick={() => redirectToApp('/register?role=client')}
                className="w-full md:w-auto px-8 py-4 bg-brand-gold text-brand-dark font-black rounded-xl shadow-[0_10px_20px_-10px_rgba(255,215,0,0.5)] hover:bg-white hover:scale-105 transition-all flex items-center justify-center gap-2 group"
              >
                {lang === 'pt' ? 'BLINDAR MINHA IMPORTAÇÃO' : 'START SECURE SELLING'}
                <ZapIcon className="w-5 h-5 group-hover:text-brand-red transition-colors" />
              </button>
              <p className="mt-4 text-xs text-white/40 font-mono">
                * Cadastro gratuito para compradores.
              </p>
            </div>
            
            {/* Calculator Widget */}
            <div className="flex-1 w-full max-w-md order-1 lg:order-2 mb-4 lg:mb-0 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <div className="transform hover:scale-[1.02] transition-transform duration-300">
                <Calculator lang={lang} />
              </div>
            </div>
          </div>
        </div>
        
        {/* Slanted Bottom Edge */}
        <div className="absolute bottom-0 left-0 right-0 h-8 md:h-16 bg-brand-light" style={{ clipPath: 'polygon(0 100%, 100% 100%, 100% 0)' }}></div>
      </header>
      
      {/* Features Grid */}
      <section className="py-12 md:py-20 container mx-auto px-4 md:px-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Por que usar a YUANBR?</h2>
            <p className="text-gray-500 text-sm">Eliminamos os riscos do comércio internacional com tecnologia e presença física.</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all text-center border border-gray-100 group">
                <div className="w-14 h-14 mx-auto bg-red-50 group-hover:bg-brand-red transition-colors rounded-full flex items-center justify-center mb-4">
                  <LockIcon className="w-7 h-7 text-brand-red group-hover:text-white transition-colors"/>
                </div>
                <h3 className="font-bold mb-2 text-sm md:text-base text-gray-900">Escrow Real</h3>
                <p className="text-xs md:text-sm text-gray-500 leading-relaxed">Seu dinheiro fica protegido no Brasil até a entrega.</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all text-center border border-gray-100 group">
                <div className="w-14 h-14 mx-auto bg-red-50 group-hover:bg-brand-red transition-colors rounded-full flex items-center justify-center mb-4">
                  <ShieldIcon className="w-7 h-7 text-brand-red group-hover:text-white transition-colors"/>
                </div>
                <h3 className="font-bold mb-2 text-sm md:text-base text-gray-900">Auditoria</h3>
                <p className="text-xs md:text-sm text-gray-500 leading-relaxed">Verificação física da carga antes do envio.</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all text-center border border-gray-100 group">
                <div className="w-14 h-14 mx-auto bg-red-50 group-hover:bg-brand-red transition-colors rounded-full flex items-center justify-center mb-4">
                  <ZapIcon className="w-7 h-7 text-brand-red group-hover:text-white transition-colors"/>
                </div>
                <h3 className="font-bold mb-2 text-sm md:text-base text-gray-900">Pagamento PIX</h3>
                <p className="text-xs md:text-sm text-gray-500 leading-relaxed">Instantâneo, sem burocracia de câmbio tradicional.</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all text-center border border-gray-100 group">
                <div className="w-14 h-14 mx-auto bg-red-50 group-hover:bg-brand-red transition-colors rounded-full flex items-center justify-center mb-4">
                  <UsersIcon className="w-7 h-7 text-brand-red group-hover:text-white transition-colors"/>
                </div>
                <h3 className="font-bold mb-2 text-sm md:text-base text-gray-900">Suporte BR/CN</h3>
                <p className="text-xs md:text-sm text-gray-500 leading-relaxed">Equipe fluente em Português e Mandarim.</p>
            </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-brand-dark text-white py-12 border-t border-gray-800">
          <div className="container mx-auto px-4 text-center md:text-left">
              <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                  <div>
                    <div className="flex items-center gap-2 justify-center md:justify-start mb-2">
                        <div className="w-6 h-6 bg-brand-red rounded flex items-center justify-center font-bold text-xs">¥</div>
                        <span className="font-bold tracking-tight">YUANBR</span>
                    </div>
                    <p className="text-gray-500 text-sm">Tecnologia financeira Brasil-China.</p>
                  </div>
                  <div className="text-gray-500 text-sm">
                      © {new Date().getFullYear()} YUANBR Fintech. Todos os direitos reservados.
                  </div>
              </div>
          </div>
      </footer>
    </div>
  );
};

export default App;
