import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const Toast: React.FC = () => {
  const { toast } = useStore();

  if (!toast) return null;

  const isSuccess = toast.type === 'success';
  const isError = toast.type === 'error';

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 pointer-events-none animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className={`px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 text-xs font-semibold backdrop-blur-md pointer-events-auto border ${
        isSuccess
          ? 'bg-stone-900/95 text-white border-emerald-500/30'
          : isError
          ? 'bg-rose-900/95 text-white border-rose-500/30'
          : 'bg-stone-900/95 text-white border-stone-700/30'
      }`}>
        {isSuccess && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
        {isError && <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />}
        {!isSuccess && !isError && <Info className="w-4 h-4 text-amber-400 shrink-0" />}
        
        <span>{toast.message}</span>
      </div>
    </div>
  );
};
