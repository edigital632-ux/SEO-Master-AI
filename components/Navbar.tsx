import React from 'react';
import { Activity, Lock } from 'lucide-react';

export const Navbar: React.FC = () => {
  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center cursor-pointer" onClick={() => window.location.reload()}>
            <div className="bg-brand-600 p-2 rounded-lg">
              <Activity className="h-6 w-6 text-white" />
            </div>
            <span className="ml-3 text-xl font-bold text-slate-900 tracking-tight">
              SEO Master <span className="text-brand-600">AI</span>
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex text-sm text-slate-500">
              <span className="flex items-center gap-1">
                <Lock className="w-3 h-3" /> Auditoria Segura
              </span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};