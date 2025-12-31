import React from 'react';
import { Zap, Microscope, Stethoscope } from 'lucide-react';
import { Card, Button } from '../common/UI';

export const HomePage = ({ onAction }) => (
  <div className="py-20 text-center space-y-12">
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-6xl font-black text-slate-900 leading-tight">Clinical Grade <span className="text-emerald-600 underline">Intelligence</span></h1>
      <p className="text-xl text-slate-500">Multimodal AI diagnostics for the next generation of patient care.</p>
      <div className="flex justify-center gap-4">
        <Button variant="secondary" onClick={() => onAction('diabetes')}>Predict Diabetes</Button>
        <Button variant="outline" onClick={() => onAction('cancer')}>Visual Oncology</Button>
      </div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
      {[
        { t: "Predictive Analytics", i: Zap, c: "emerald", tab: 'diabetes' },
        { t: "Deep Learning Vision", i: Microscope, c: "blue", tab: 'cancer' },
        { t: "Intelligent Triage", i: Stethoscope, c: "blue", tab: 'medicine' }
      ].map((f, i) => (
        <Card key={i} className="cursor-pointer group hover:bg-slate-50" onClick={() => onAction(f.tab)}>
          <div className={`p-4 rounded-full w-fit mx-auto mb-4 bg-slate-50 text-slate-600 group-hover:bg-blue-600 group-hover:text-white transition-all`}><f.i /></div>
          <h3 className="font-bold">{f.t}</h3>
          <p className="text-xs text-slate-400 mt-2">Clinical Module v1.0</p>
        </Card>
      ))}
    </div>
  </div>
);