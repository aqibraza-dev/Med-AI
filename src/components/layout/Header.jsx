import React from 'react';
import { Activity } from 'lucide-react';

export const Header = ({ activeTab, setActiveTab }) => (
  <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100 px-6 py-4">
    <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab('home')}>
        <div className="bg-emerald-600 p-2 rounded-lg"><Activity className="text-white w-6 h-6" /></div>
        <h1 className="text-2xl font-bold text-slate-900">MedAI<span className="text-blue-600">Pro</span></h1>
      </div>
      <div className="flex bg-slate-50 p-1 rounded-2xl border border-slate-200 overflow-x-auto max-w-full">
        {['home', 'cancer', 'diabetes', 'medicine'].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={`px-5 py-2 rounded-xl text-xs font-bold uppercase transition-all ${activeTab === tab ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>
            {tab}
          </button>
        ))}
      </div>
    </div>
  </nav>
);