import React, { useState, useRef } from 'react';
import { Microscope, Upload } from 'lucide-react';
import { Card, Button, ModelExplanation } from '../common/UI';
import { API_URL } from '../../constants/api';

const CancerDetection = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const fileInputRef = useRef(null);

  const SAMPLES = [
    { id: 1, label: "Melanoma", url: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=400" },
    { id: 2, label: "X-Ray", url: "https://images.unsplash.com/photo-1530210124550-912dc1381cb8?auto=format&fit=crop&q=80&w=400" }
  ];

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setSelectedImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = async () => {
    if (!selectedImage) return;
    setAnalyzing(true);
    setResult(null);
    try {
      const base64Data = selectedImage.split(',')[1];
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: "Malignancy screening on image." }, { inlineData: { mimeType: "image/png", data: base64Data } }] }] })
      });
      const data = await response.json();
      setResult(data.candidates?.[0]?.content?.parts?.[0]?.text || "Analysis failed.");
    } catch (e) { setResult("Server error."); } finally { setAnalyzing(false); }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-extrabold text-slate-900">Cancer Detection AI</h2>
        <p className="text-slate-500">Visual screening for malignant lesions using Vision Transformers.</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="flex flex-col items-center justify-center min-h-[400px] border-dashed border-2 bg-slate-50/50">
          {selectedImage ? (
            <div className="relative w-full h-full flex flex-col items-center gap-6">
              <img src={selectedImage} alt="Scan" className="max-h-[320px] rounded-2xl shadow-xl border-4 border-white" />
              <div className="flex gap-4">
                <Button variant="outline" onClick={() => setSelectedImage(null)}>Clear</Button>
                <Button variant="secondary" onClick={analyzeImage} loading={analyzing}>Run Analysis</Button>
              </div>
            </div>
          ) : (
            <div className="text-center space-y-6 p-8">
              <div className="bg-emerald-100 p-6 rounded-3xl inline-block"><Upload className="w-12 h-12 text-emerald-600" /></div>
              <p className="text-lg font-bold">Upload Medical Imaging</p>
              <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileUpload} accept="image/*" />
              <Button onClick={() => fileInputRef.current?.click()}>Browse Scans</Button>
              <div className="flex gap-4 justify-center pt-8 border-t border-slate-200 w-full">
                {SAMPLES.map(img => <img key={img.id} src={img.url} onClick={() => setSelectedImage(img.url)} className="w-16 h-16 rounded-xl object-cover cursor-pointer hover:ring-4 ring-emerald-500/30 transition-all" />)}
              </div>
            </div>
          )}
        </Card>
        <Card className="min-h-[300px]">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><Microscope className="text-blue-600" /> Analysis Report</h3>
          {analyzing ? <div className="space-y-4 py-8 animate-pulse"><div className="h-3 bg-slate-100 rounded-full w-full"></div><div className="h-3 bg-slate-100 rounded-full w-1/2"></div></div> : result ? <div className="text-sm text-slate-600">{result}</div> : <div className="text-slate-400 text-center py-20">Awaiting scan...</div>}
        </Card>
      </div>
      <ModelExplanation title="Vision Oncology Model" icon={Microscope} color="blue" steps={[{ name: "Pixel Mapping", desc: "Isolates ROI." }, { name: "Contrast", desc: "Adjusts for lighting." }, { name: "Inference", desc: "ResNet Transformer." }]} technicalDesc="Vision Transformer architecture." />
    </div>
  );
};

export default CancerDetection;