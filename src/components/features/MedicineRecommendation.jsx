import React, { useState } from 'react';
import { Stethoscope } from 'lucide-react';
import { Card, Button, ModelExplanation } from '../common/UI';


const MedicineRecommendation = () => {
  const [symptoms, setSymptoms] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);

  const getRecommendation = async () => {
    if (!symptoms) return;
    setAnalyzing(true);
    setResult(null);
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: `Clinical advisor: ${symptoms}` }] }] })
      });
      const data = await response.json();
      setResult(data.candidates?.[0]?.content?.parts?.[0]?.text || "Failed.");
    } catch (e) { setResult("Server Error."); } finally { setAnalyzing(false); }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center"><h2 className="text-3xl font-extrabold text-slate-900">Virtual Triage Assistant</h2></div>
      <Card className="space-y-6">
        <textarea className="w-full h-40 bg-slate-50 border border-slate-200 rounded-2xl p-6 outline-none" placeholder="Describe symptoms..." value={symptoms} onChange={e => setSymptoms(e.target.value)} />
        <Button variant="primary" onClick={getRecommendation} loading={analyzing}>Start Consultation</Button>
      </Card>
      {result && <Card className="bg-blue-50/50 border-blue-100 text-sm whitespace-pre-line">{result}</Card>}
      <ModelExplanation title="Triage Assistant" icon={Stethoscope} color="blue" steps={[{ name: "Tokenization", desc: "Parses clinical markers." }, { name: "Knowledge", desc: "Cross-checks pharmacology." }, { name: "Safety", desc: "Safety filters." }]} technicalDesc="Fine-tuned Medical LLM." />
    </div>
  );
};

export default MedicineRecommendation;