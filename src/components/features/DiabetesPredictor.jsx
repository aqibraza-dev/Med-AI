import React, { useState, useEffect, useRef } from 'react';
import { Database, User, Heart, Activity, Cpu, RefreshCw, AlertTriangle, Clock, X } from 'lucide-react';
import { Card, Button, ModelExplanation } from '../common/UI';

// 1. Setup Environment Variable for ML Backend
const ML_API_URL = import.meta.env.VITE_ML_API_URL || 'http://localhost:8000/predict';

// Modern Notification Component
const NotificationToast = ({ message, subtext, type, onClose }) => (
  <div className={`fixed top-6 right-6 z-50 flex items-start gap-4 p-4 rounded-xl shadow-2xl border backdrop-blur-md animate-in slide-in-from-right duration-500 max-w-sm ${
    type === 'busy' 
      ? 'bg-amber-50/90 border-amber-200 text-amber-900' 
      : 'bg-indigo-50/90 border-indigo-200 text-indigo-900'
  }`}>
    <div className={`p-2 rounded-full ${type === 'busy' ? 'bg-amber-100' : 'bg-indigo-100'}`}>
      {type === 'busy' ? <Activity className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
    </div>
    <div className="flex-1">
      <h4 className="font-bold text-sm">{message}</h4>
      <p className="text-xs opacity-80 mt-1">{subtext}</p>
    </div>
    <button onClick={onClose} className="p-1 hover:bg-black/5 rounded-full transition-colors">
      <X className="w-4 h-4 opacity-50" />
    </button>
  </div>
);

const DiabetesPredictor = () => {
  const [formData, setFormData] = useState({
    age: 45, bmi: 28.5, waist_to_hip_ratio: 0.85, systolic_bp: 120,
    physical_activity_minutes_per_week: 150, diet_score: 6.5, sleep_hours_per_day: 7.5,
    screen_time_hours_per_day: 3.0, gender: "Female", ethnicity: "Hispanic",
    education_level: "Bachelor", income_level: "Middle", smoking_status: "Never",
    employment_status: "Employed", family_history_diabetes: 1, hypertension_history: 0, cardiovascular_history: 0
  });

  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [notification, setNotification] = useState(null);
  
  // Refs to store timer IDs so we can clear them easily
  const busyTimerRef = useRef(null);
  const sleepTimerRef = useRef(null);

  const handlePredict = async () => {
    setAnalyzing(true);
    setResult(null);
    setNotification(null);

    // 2. Start Timers for Server Delay Logic
    
    // > 10 Seconds: Server is Busy
    busyTimerRef.current = setTimeout(() => {
      setNotification({
        type: 'busy',
        message: 'High Traffic Volume',
        subtext: 'The analysis server is experiencing heavy load. Wrapping up calculations...'
      });
    }, 10000); // 10 sec

    // > 40 Seconds: Server Went to Sleep (Cold Start)
    sleepTimerRef.current = setTimeout(() => {
      setNotification({
        type: 'sleep',
        message: 'Waking Up Server',
        subtext: 'The ML instance went to sleep due to inactivity (this may take a moment)...'
      });
    }, 40000); // 40 sec

    try {
      // 3. Direct API Call using Env Variable (No Gemini Wrapper)
      const response = await fetch(ML_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error("Server Error");

      const data = await response.json();
      setResult(data);

    } catch (error) {
      console.error(error);
      setResult({ 
        risk_assessment: "Error", 
        probability_score: 0, 
        detailed_analysis: "Failed to connect to ML Prediction Node. Please check your connection." 
      });
    } finally {
      // 4. Cleanup: Clear timers and loading state
      clearTimeout(busyTimerRef.current);
      clearTimeout(sleepTimerRef.current);
      setAnalyzing(false);
      // Optional: Clear notification on success after a short delay, or leave it for user to close
      setTimeout(() => setNotification(null), 3000); 
    }
  };

  const updateField = (key, value) => setFormData(prev => ({ ...prev, [key]: value }));

  return (
    <div className="space-y-12 animate-in slide-in-from-bottom-4 duration-700 relative">
      
      {/* Notification Popup */}
      {notification && (
        <NotificationToast 
          {...notification} 
          onClose={() => setNotification(null)} 
        />
      )}

      <div className="text-center space-y-2">
        <h2 className="text-4xl font-black text-slate-900">Metabolic Risk Pipeline</h2>
        <p className="text-slate-500">Full diagnostic suite for Type 2 Diabetes prediction using Ensemble learning.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card className="space-y-8">
            {/* Biometric Section */}
            <div className="space-y-4">
              <h3 className="text-sm font-black text-emerald-600 uppercase tracking-widest flex items-center gap-2"><Database className="w-4 h-4" /> Biometric Metrics</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[{ label: "Age", key: "age" }, { label: "BMI", key: "bmi" }, { label: "W/H Ratio", key: "waist_to_hip_ratio" }, { label: "Systolic BP", key: "systolic_bp" }, { label: "Activity (min)", key: "physical_activity_minutes_per_week" }, { label: "Diet Score", key: "diet_score" }, { label: "Sleep (hrs)", key: "sleep_hours_per_day" }, { label: "Screen (hrs)", key: "screen_time_hours_per_day" }].map(field => (
                  <div key={field.key} className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">{field.label}</label>
                    <input type="number" value={formData[field.key]} onChange={e => updateField(field.key, parseFloat(e.target.value))} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-semibold outline-none focus:ring-2 ring-emerald-500/20" />
                  </div>
                ))}
              </div>
            </div>

            {/* Socio-Demographics */}
            <div className="space-y-4">
              <h3 className="text-sm font-black text-blue-600 uppercase tracking-widest flex items-center gap-2"><User className="w-4 h-4" /> Socio-Demographics</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[{ label: "Gender", key: "gender", options: ["Male", "Female", "Other"] }, { label: "Ethnicity", key: "ethnicity", options: ["White", "Hispanic", "Asian", "Black", "Other"] }, { label: "Education", key: "education_level", options: ["High School", "Bachelor", "Master", "PhD"] }, { label: "Income", key: "income_level", options: ["Low", "Middle", "High"] }, { label: "Smoking", key: "smoking_status", options: ["Never", "Former", "Current"] }, { label: "Employment", key: "employment_status", options: ["Employed", "Unemployed", "Student", "Retired"] }].map(field => (
                  <div key={field.key} className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">{field.label}</label>
                    <select value={formData[field.key]} onChange={e => updateField(field.key, e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-semibold outline-none">
                      {field.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                  </div>
                ))}
              </div>
            </div>

            {/* Medical History */}
            <div className="space-y-4">
              <h3 className="text-sm font-black text-amber-600 uppercase tracking-widest flex items-center gap-2"><Heart className="w-4 h-4" /> Medical History</h3>
              <div className="flex flex-wrap gap-4">
                {[{ label: "Family History", key: "family_history_diabetes" }, { label: "Hypertension", key: "hypertension_history" }, { label: "Cardiovascular", key: "cardiovascular_history" }].map(field => (
                  <label key={field.key} className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl cursor-pointer hover:bg-slate-100 transition-all">
                    <input type="checkbox" checked={formData[field.key] === 1} onChange={e => updateField(field.key, e.target.checked ? 1 : 0)} className="w-4 h-4 rounded text-emerald-600" />
                    <span className="text-xs font-bold text-slate-700">{field.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <Button variant="secondary" className="w-full py-4 text-lg font-bold" onClick={handlePredict} loading={analyzing}>Run Pipeline Prediction</Button>
          </Card>
        </div>

        {/* Results */}
        <div className="space-y-6">
          <Card className={`h-full border-t-8 ${result?.risk_assessment === 'High' ? 'border-t-red-500' : result?.risk_assessment === 'Moderate' ? 'border-t-amber-500' : 'border-t-emerald-500'}`}>
            <h3 className="text-xl font-bold text-slate-900 mb-6">Live Analysis</h3>
            {analyzing ? (
              <div className="space-y-6">
                <div className="flex items-center gap-3"><RefreshCw className="w-5 h-5 text-emerald-500 animate-spin" /><span className="text-sm font-bold text-slate-400">Processing...</span></div>
                <div className="h-40 bg-slate-50 rounded-2xl animate-pulse"></div>
                {/* Fallback msg in box if taking long */}
                {notification && <p className="text-xs text-center text-slate-400 animate-pulse">{notification.message}</p>}
              </div>
            ) : result ? (
              <div className="space-y-8">
                <div className="text-center p-6 bg-slate-50 rounded-3xl">
                  <p className="text-5xl font-black">{(result.probability_score * 100).toFixed(1)}%</p>
                  <div className={`mt-4 inline-block px-4 py-1 rounded-full text-xs font-bold text-white ${result.risk_assessment === 'High' ? 'bg-red-500' : result.risk_assessment === 'Moderate' ? 'bg-amber-500' : 'bg-emerald-500'}`}>
                    {result.risk_assessment} Risk
                  </div>
                </div>
                <p className="text-sm text-slate-500 italic">{result.detailed_analysis}</p>
              </div>
            ) : <div className="text-center py-24 opacity-30"><Activity className="w-16 h-16 mx-auto mb-4" /><p className="text-sm font-bold">Awaiting Data</p></div>}
          </Card>
        </div>
      </div>

      <ModelExplanation 
        title="Diabetes Risk Pipeline" icon={Cpu} color="emerald"
        steps={[{ name: "Validation", desc: "Pydantic-style schema validation." }, { name: "Encoding", desc: "One-Hot and Ordinal encoding." }, { name: "Inference", desc: "Ensemble of decision trees." }]}
        technicalDesc="Scikit-learn Pipeline with StandardScaler and Gradient Boosted Classifier."
      />
    </div>
  );
};

export default DiabetesPredictor;