import React, { useState } from 'react';
import { Header } from './components/layout/Header';
import { HomePage } from './components/layout/HomePage';
import DiabetesPredictor from './components/features/DiabetesPredictor';
import CancerDetection from './components/features/CancerDetection';
import MedicineRecommendation from './components/features/MedicineRecommendation';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      {/* Background Decor */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-emerald-100 rounded-full blur-[120px] -translate-y-1/2"></div>
      </div>

      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'home' && <HomePage onAction={setActiveTab} />}
        {activeTab === 'cancer' && <CancerDetection />}
        {activeTab === 'diabetes' && <DiabetesPredictor />}
        {activeTab === 'medicine' && <MedicineRecommendation />}
      </main>

      <footer className="py-10 border-t mt-20 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
        MedAI Intelligence Systems | Research Build v2.5.4
      </footer>
    </div>
  );
}