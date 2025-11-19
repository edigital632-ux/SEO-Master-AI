import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { ReportView } from './components/ReportView';
import { PaywallModal } from './components/PaywallModal';
import { analyzeUrl } from './services/geminiService';
import { AppState, SeoReport } from './types';
import { Search, Zap, BarChart, Layout, Star } from 'lucide-react';

const STORAGE_KEY = 'seo_audit_count';
const FREE_LIMIT = 2;
const PRO_USER_FLAG = -100; // Special value to indicate PRO user

function App() {
  const [url, setUrl] = useState('');
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [report, setReport] = useState<SeoReport | null>(null);
  const [usageCount, setUsageCount] = useState(0);
  const [showPaywall, setShowPaywall] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setUsageCount(parseInt(stored, 10));
    }
  }, []);

  const isPro = usageCount === PRO_USER_FLAG;

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url.trim()) return;

    // Check limit for free users
    if (!isPro && usageCount >= FREE_LIMIT) {
      setShowPaywall(true);
      return;
    }

    setAppState(AppState.ANALYZING);
    setErrorMessage('');

    try {
      // Determine plan type based on user status
      const planType = isPro ? 'pro' : 'free';
      const result = await analyzeUrl(url, planType);
      
      // Increment usage if not pro
      if (!isPro) {
        const newCount = usageCount + 1;
        setUsageCount(newCount);
        localStorage.setItem(STORAGE_KEY, newCount.toString());
      }
      
      setReport(result);
      setAppState(AppState.SUCCESS);
    } catch (error: any) {
      setErrorMessage(error.message || 'Ocorreu um erro inesperado.');
      setAppState(AppState.ERROR);
    }
  };

  const handleUnlock = () => {
    // Set to PRO status
    localStorage.setItem(STORAGE_KEY, PRO_USER_FLAG.toString()); 
    setUsageCount(PRO_USER_FLAG);
    setShowPaywall(false);
    
    // Automatically retry the analysis with PRO features
    if (url) {
        setTimeout(() => {
           // Trigger a re-analysis by finding the form button or just calling the function if we refactored, 
           // but simpler to just let the user click "Analyze" again which now shows "Pro Active"
           // Or better, force a state reset to ready
           setAppState(AppState.IDLE);
        }, 100);
    }
  };

  const resetAnalysis = () => {
    setUrl('');
    setReport(null);
    setAppState(AppState.IDLE);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      <Navbar />
      
      {/* Paywall Modal */}
      <PaywallModal isOpen={showPaywall} onUnlock={handleUnlock} />

      {/* Main Content */}
      <main className="flex-grow">
        {appState === AppState.SUCCESS && report ? (
          <ReportView report={report} onBack={resetAnalysis} />
        ) : (
          <div className="max-w-4xl mx-auto px-4 pt-16 pb-20 sm:px-6 lg:px-8">
            
            {/* Hero Section */}
            <div className="text-center mb-12">
              <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-6">
                Auditoria de SEO <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-indigo-600">
                  Potencializada por IA
                </span>
              </h1>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Analise seu site em segundos. Descubra erros ocultos, oportunidades de palavras-chave e melhore seu ranking no Google.
              </p>
            </div>

            {/* Search Box */}
            <div className={`max-w-2xl mx-auto bg-white p-2 rounded-2xl shadow-lg border ${isPro ? 'border-amber-400 ring-2 ring-amber-100' : 'border-slate-200'} mb-8 transition-all`}>
              <form onSubmit={handleAnalyze} className="relative flex items-center">
                <div className="absolute left-4 text-slate-400">
                  <Search className="w-6 h-6" />
                </div>
                <input
                  type="url"
                  placeholder="Insira a URL do seu site (ex: https://seusite.com)"
                  className="w-full pl-12 pr-4 py-4 bg-transparent border-none outline-none text-slate-900 placeholder-slate-400 text-lg rounded-xl focus:ring-0"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  required
                  disabled={appState === AppState.ANALYZING}
                />
                <button
                  type="submit"
                  disabled={appState === AppState.ANALYZING}
                  className={`bg-brand-600 hover:bg-brand-700 text-white px-8 py-3 rounded-xl font-semibold transition-all disabled:opacity-70 flex items-center gap-2 ${isPro ? 'bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700' : ''}`}
                >
                  {appState === AppState.ANALYZING ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Analisando...
                    </>
                  ) : (
                    isPro ? <><Star className="w-4 h-4 fill-current" /> Analisar Pro</> : 'Analisar'
                  )}
                </button>
              </form>
            </div>

            {/* Status Indicator */}
            <div className="flex justify-center mb-12">
               {isPro ? (
                 <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
                   <Star className="w-4 h-4 fill-current" /> Plano PRO Ativo: Análises Profundas Ilimitadas
                 </div>
               ) : (
                 <div className="text-sm text-slate-400">
                   {Math.max(0, FREE_LIMIT - usageCount)} análises gratuitas restantes
                 </div>
               )}
            </div>

            {/* Error Message */}
            {appState === AppState.ERROR && (
              <div className="max-w-2xl mx-auto mb-8 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center justify-center gap-2">
                <span>⚠️ {errorMessage}</span>
              </div>
            )}

            {/* Features Grid */}
            <div className="grid md:grid-cols-3 gap-8 mt-8">
              <FeatureCard 
                icon={<Zap className="w-6 h-6 text-amber-500" />}
                title="Velocidade & Performance"
                description="Verificamos o tempo de carregamento e Core Web Vitals para garantir a melhor experiência."
              />
              <FeatureCard 
                icon={<Layout className="w-6 h-6 text-blue-500" />}
                title="SEO On-Page"
                description="Análise profunda de meta tags, estrutura de cabeçalhos e densidade de palavras-chave."
              />
              <FeatureCard 
                icon={<BarChart className="w-6 h-6 text-green-500" />}
                title="Relatório Acionável"
                description="Receba uma lista de tarefas priorizada para corrigir os problemas encontrados."
              />
            </div>

          </div>
        )}
      </main>
    </div>
  );
}

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
  <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
    <div className="bg-slate-50 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
      {icon}
    </div>
    <h3 className="font-bold text-slate-900 text-lg mb-2">{title}</h3>
    <p className="text-slate-600 leading-relaxed">{description}</p>
  </div>
);

export default App;