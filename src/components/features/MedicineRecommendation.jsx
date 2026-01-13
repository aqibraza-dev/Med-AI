import React, { useState } from 'react';
import { Stethoscope, Ban, AlertCircle, Lock } from 'lucide-react';
import { Card, Button, ModelExplanation } from '../common/UI';

const MedicineRecommendation = () => {
  // Toggle this to true/false to see the effect
  const isInactive = true; 

  const [symptoms, setSymptoms] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);

  const getRecommendation = async () => {
    if (!symptoms) return;
    setAnalyzing(true);
    setResult(null);
    try {
      // API Logic...
      const response = await fetch('API_URL', { /*...*/ });
      const data = await response.json();
      setResult(data.candidates?.[0]?.content?.parts?.[0]?.text || "Failed.");
    } catch (e) { setResult("Server Error."); } finally { setAnalyzing(false); }
  };

  return (
    // 1. Add 'relative' to the parent container so the overlay stays inside
    <div className="max-w-4xl mx-auto space-y-8 relative">
      
      {/* --- INACTIVE OVERLAY START --- */}
      {isInactive && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-10/60 backdrop-blur-[1px] rounded-3xl transition-all duration-500">
          <div className="bg-white p-8 rounded-2xl shadow-2xl border border-slate-100 max-w-sm text-center space-y-4 animate-in fade-in zoom-in-95 duration-300">
            <div className="mx-auto w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
              <Ban className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-800">
              Module Temporarily Offline
            </h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              The Medicine Recommendation Model is currently undergoing scheduled maintenance to improve accuracy.
            </p>
            <div className="pt-2">
              <button className="px-5 py-2 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors">
                Notify me when active
              </button>
            </div>
          </div>
        </div>
      )}
      {/* --- INACTIVE OVERLAY END --- */}

      <div className="text-center">
        <h2 className="text-3xl font-extrabold text-slate-900">Medicine Recommendation</h2>
      </div>

      <Card className="space-y-6">
        <textarea 
          disabled={isInactive} // Good practice to actually disable inputs behind the blur
          className="w-full h-40 bg-slate-50 border border-slate-200 rounded-2xl p-6 outline-none focus:ring-2 focus:ring-blue-500 transition-all disabled:opacity-20 disabled:cursor-not-allowed" 
          placeholder="Describe symptoms..." 
          value={symptoms} 
          onChange={e => setSymptoms(e.target.value)} 
        />
        <Button 
          variant="primary" 
          onClick={getRecommendation} 
          loading={analyzing}
          disabled={isInactive}
        >
          Check
        </Button>
      </Card>

      {result && (
        <Card className="bg-blue-50/50 border-blue-100 text-sm whitespace-pre-line">
          {result}
        </Card>
      )}

      <ModelExplanation 
        title="Medicine Recommendation Architecture" 
        icon={Stethoscope} 
        color="blue" 
        steps={[
          { name: "Tokenization", desc: "Parses clinical markers." }, 
          { name: "Knowledge", desc: "Cross-checks pharmacology." }, 
          { name: "Safety", desc: "Safety filters." }
        ]} 
        technicalDesc="Fine-tuned Medical LLM." 
      />
    </div>
  );
};

export default MedicineRecommendation;
