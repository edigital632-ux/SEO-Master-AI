import React, { useState } from 'react';
import { Lock, Check, CreditCard } from 'lucide-react';

interface PaywallModalProps {
  isOpen: boolean;
  onUnlock: () => void;
}

export const PaywallModal: React.FC<PaywallModalProps> = ({ isOpen, onUnlock }) => {
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handlePaymentSim = () => {
    setIsLoading(true);
    // Simulate API payment processing
    setTimeout(() => {
      setIsLoading(false);
      onUnlock();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in duration-300">
        <div className="bg-brand-600 p-6 text-center">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="text-white w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-1">Limite Gratuito Atingido</h2>
          <p className="text-brand-100 text-sm">Você já analisou 2 sites gratuitamente.</p>
        </div>
        
        <div className="p-6">
          <p className="text-slate-600 text-center mb-6">
            Para continuar analisando URLs ilimitadas e acessar relatórios detalhados de concorrentes, atualize para o plano Pro.
          </p>

          <div className="space-y-3 mb-8">
            <div className="flex items-center gap-3 text-sm text-slate-700">
              <Check className="w-5 h-5 text-green-500 shrink-0" />
              <span>Análises ilimitadas</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-700">
              <Check className="w-5 h-5 text-green-500 shrink-0" />
              <span>Exportação PDF Premium</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-700">
              <Check className="w-5 h-5 text-green-500 shrink-0" />
              <span>Sugestões avançadas de correção</span>
            </div>
          </div>

          <button 
            onClick={handlePaymentSim}
            disabled={isLoading}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-70"
          >
            {isLoading ? (
              <>Processando...</>
            ) : (
              <>
                <CreditCard className="w-4 h-4" />
                Desbloquear Acesso Pro - R$ 29,90
              </>
            )}
          </button>
          
          <p className="text-xs text-center text-slate-400 mt-4">
            Pagamento único. Acesso vitalício.
          </p>
        </div>
      </div>
    </div>
  );
};