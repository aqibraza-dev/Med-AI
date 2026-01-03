import React from 'react';
import { RefreshCw, Cpu, Network } from 'lucide-react';

export const Card = ({ children, className = "" }) => (
  <div className={`bg-white border border-slate-200 shadow-sm rounded-2xl p-6 transition-all duration-300 hover:shadow-md ${className}`}>
    {children}
  </div>
);

export const Button = ({ children, onClick, variant = "primary", className = "", disabled = false, loading = false }) => {
  const variants = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white shadow-sm",
    secondary: "bg-emerald-600 hover:bg-emerald-700 text-white",
    outline: "border border-slate-300 hover:border-emerald-500 hover:text-emerald-600 text-slate-600",
    danger: "bg-red-500 hover:bg-red-600 text-white"
  };

  return (
    <button 
      onClick={onClick} 
      disabled={disabled || loading}
      className={`px-6 py-2.5 rounded-xl font-medium flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${className}`}
    >
      {loading && <RefreshCw className="w-4 h-4 animate-spin" />}
      {children}
    </button>
  );
};

export const ModelExplanation = ({ title, icon: Icon, color, steps, technicalDesc }) => (
  <div className="mt-16 pt-12 border-t border-slate-100 animate-in fade-in slide-in-from-bottom-8 duration-1000">
    <div className="flex items-center gap-3 mb-8">
      <div className={`p-2 rounded-lg ${color === 'emerald' ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600'}`}>
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-2xl font-bold text-slate-900">{title}</h3>
    </div>
    
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {steps.map((step, idx) => (
            <div key={idx} className="relative p-5 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="absolute top-4 right-4 text-4xl font-black text-slate-200/50 italic">{idx + 1}</span>
              <h4 className="font-bold text-slate-800 mb-2 relative z-10">{step.name}</h4>
              <p className="text-xs text-slate-500 leading-relaxed relative z-10">{step.desc}</p>
            </div>
          ))}
        </div>
        <Card className="bg-slate-50/50 border-none">
          <p className="text-sm text-slate-600 leading-relaxed italic">
            <Cpu className="w-4 h-4 inline mr-2 text-slate-400" />
            <strong>Technical Architecture:</strong> {technicalDesc}
          </p>
        </Card>
      </div>
      
      <div className="bg-slate-900 rounded-2xl p-6 flex flex-col items-center justify-center text-center space-y-4 shadow-xl">
         <Network className="w-16 h-16 text-emerald-400 opacity-80" />
         <div className="space-y-1">
           <p className="text-white font-bold">Neural Net / Pipeline</p>
           <p className="text-slate-400 text-[10px] uppercase tracking-widest">Active Processing Layers</p>
         </div>
         <div className="flex gap-1">
           {[...Array(5)].map((_, i) => (
             <div key={i} className="w-1.5 h-8 bg-emerald-500/30 rounded-full animate-pulse" style={{ animationDelay: `${i * 0.2}s` }}></div>
           ))}
         </div>
      </div>
    </div>
  </div>
);