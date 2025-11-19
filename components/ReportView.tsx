import React, { useRef } from 'react';
import { SeoReport, Suggestion } from '../types';
import { ScoreChart } from './ScoreChart';
import { Download, ExternalLink, AlertTriangle, CheckCircle, Info, Zap, Smartphone, Link as LinkIcon, Type, Star, Sparkles } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface ReportViewProps {
  report: SeoReport;
  onBack: () => void;
}

export const ReportView: React.FC<ReportViewProps> = ({ report, onBack }) => {
  const printRef = useRef<HTMLDivElement>(null);
  const isPro = report.planType === 'pro';

  const handleDownloadPdf = async () => {
    if (!printRef.current) return;
    
    const element = printRef.current;
    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`seo-report-${report.url.replace(/[^a-z0-9]/gi, '_')}.pdf`);
  };

  const getIcon = (category: string) => {
    switch (category) {
      case 'speed': return <Zap className="w-5 h-5 text-amber-500" />;
      case 'mobile': return <Smartphone className="w-5 h-5 text-blue-500" />;
      case 'links': return <LinkIcon className="w-5 h-5 text-purple-500" />;
      case 'content': return <Type className="w-5 h-5 text-green-500" />;
      default: return <Info className="w-5 h-5 text-slate-500" />;
    }
  };

  return (
    <div className="animate-fade-in pb-20">
      {/* Toolbar */}
      <div className="bg-white border-b border-slate-200 shadow-sm sticky top-16 z-40 py-4 px-4 sm:px-8 flex justify-between items-center">
        <button onClick={onBack} className="text-slate-600 hover:text-brand-600 font-medium text-sm transition-colors">
          &larr; Nova Análise
        </button>
        <div className="flex gap-3 items-center">
          {isPro && (
             <div className="hidden sm:flex items-center gap-1 bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-xs font-bold">
                <Star className="w-3 h-3 fill-current" /> RELATÓRIO PRO
             </div>
          )}
          <button 
            onClick={handleDownloadPdf}
            className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition-all shadow-sm"
          >
            <Download className="w-4 h-4" /> Baixar PDF
          </button>
        </div>
      </div>

      {/* Printable Area */}
      <div ref={printRef} className="max-w-5xl mx-auto mt-8 px-4 sm:px-8 bg-white min-h-screen p-8 rounded-xl shadow-sm border border-slate-100 relative overflow-hidden">
        
        {/* Pro Watermark (Subtle) */}
        {isPro && (
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-amber-400/10 rotate-45 pointer-events-none" />
        )}

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-100 pb-8 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold text-slate-900">Relatório de Auditoria SEO</h1>
              {isPro ? (
                 <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs px-2 py-0.5 rounded font-bold uppercase tracking-wider shadow-sm">Premium</span>
              ) : (
                 <span className="bg-slate-200 text-slate-600 text-xs px-2 py-0.5 rounded font-bold uppercase tracking-wider">Básico</span>
              )}
            </div>
            <a href={report.url} target="_blank" rel="noreferrer" className="flex items-center text-brand-600 hover:underline gap-1 text-sm break-all">
              {report.url} <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-slate-400 text-xs mt-2">Gerado em: {new Date(report.timestamp).toLocaleString()}</p>
          </div>
          <div className="mt-6 md:mt-0 flex items-center gap-6">
             <div className="text-right">
                <p className="text-sm text-slate-500 mb-1">Saúde do Site</p>
                <div className="flex gap-2">
                   <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${report.technicalDetails.sslSecure ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                     SSL: {report.technicalDetails.sslSecure ? "Ativo" : "Inativo"}
                   </span>
                   <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${report.technicalDetails.mobileFriendly ? "bg-blue-100 text-blue-800" : "bg-red-100 text-red-800"}`}>
                     Mobile: {report.technicalDetails.mobileFriendly ? "Otimizado" : "Falha"}
                   </span>
                </div>
             </div>
             <ScoreChart score={report.overallScore} size={100} />
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <MetricCard title="Performance" score={report.metrics.performance} icon={<Zap className="w-5 h-5" />} />
          <MetricCard title="SEO On-Page" score={report.metrics.seo} icon={<Type className="w-5 h-5" />} />
          <MetricCard title="Mobile" score={report.metrics.mobile} icon={<Smartphone className="w-5 h-5" />} />
          <MetricCard title="Links" score={report.metrics.links} icon={<LinkIcon className="w-5 h-5" />} />
        </div>

        {/* Summary */}
        <div className={`${isPro ? 'bg-gradient-to-br from-amber-50 to-white border-amber-100' : 'bg-slate-50 border-slate-100'} rounded-xl p-6 mb-10 border`}>
          <h3 className={`text-lg font-semibold mb-3 flex items-center gap-2 ${isPro ? 'text-amber-900' : 'text-slate-800'}`}>
             {isPro && <Sparkles className="w-4 h-4 text-amber-500" />}
             Resumo Executivo
          </h3>
          <p className="text-slate-600 leading-relaxed text-sm md:text-base">{report.summary}</p>
        </div>

        {/* Technical Details */}
        <div className="mb-10">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Detalhes Técnicos</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <TechItem label="Tempo Est. Carregamento" value={report.technicalDetails.loadTimeEstimate} />
            <TechItem label="Links Internos" value={report.technicalDetails.internalLinksCount.toString()} />
            <TechItem label="Links Externos" value={report.technicalDetails.externalLinksCount.toString()} />
          </div>
        </div>

        {/* Suggestions */}
        <div>
          <h3 className="text-lg font-semibold text-slate-800 mb-6 flex items-center gap-2">
            <span className="bg-brand-100 text-brand-700 p-1 rounded text-sm font-bold min-w-[1.5rem] text-center">
              {report.suggestions.length}
            </span>
            {isPro ? 'Recomendações Avançadas & Correções' : 'Oportunidades de Melhoria'}
          </h3>
          <div className="space-y-4">
            {report.suggestions.map((suggestion, idx) => (
              <div key={idx} className={`flex gap-4 p-4 rounded-lg border transition-all bg-white ${
                 suggestion.severity === 'critical' ? 'border-l-4 border-l-red-500 border-y-slate-100 border-r-slate-100' : 
                 'border-slate-100 hover:border-brand-200'
              }`}>
                <div className="mt-1 shrink-0">
                  {getIcon(suggestion.category)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-medium text-slate-900">{suggestion.title}</h4>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium uppercase ${
                      suggestion.severity === 'critical' ? 'bg-red-100 text-red-700' :
                      suggestion.severity === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-50 text-blue-700'
                    }`}>
                      {suggestion.severity}
                    </span>
                  </div>
                  <p className="text-slate-600 text-sm">{suggestion.description}</p>
                  
                  {isPro && (
                    <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-400">
                       <span className="font-semibold text-brand-600 cursor-pointer hover:underline">Ver documentação técnica &rarr;</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

const MetricCard = ({ title, score, icon }: { title: string, score: number, icon: React.ReactNode }) => (
  <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col items-center justify-center text-center">
    <div className={`mb-2 p-2 rounded-full ${score >= 70 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
      {icon}
    </div>
    <span className="text-slate-500 text-xs font-medium uppercase mb-1">{title}</span>
    <span className={`text-2xl font-bold ${score >= 70 ? 'text-slate-800' : 'text-slate-800'}`}>{score}/100</span>
    <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
      <div 
        className={`h-full rounded-full ${score >= 90 ? 'bg-green-500' : score >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`} 
        style={{ width: `${score}%` }}
      />
    </div>
  </div>
);

const TechItem = ({ label, value }: { label: string, value: string }) => (
  <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-100">
    <span className="text-slate-500 text-sm">{label}</span>
    <span className="text-slate-900 font-medium">{value}</span>
  </div>
);