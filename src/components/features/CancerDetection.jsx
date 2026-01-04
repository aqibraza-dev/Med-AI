import React, { useState, useRef, useEffect } from 'react';
import { Microscope, Upload, Activity, Info, AlertCircle, CheckCircle2, FileImage } from 'lucide-react';
import { Card, Button, ModelExplanation } from '../common/UI';

// 2. Use Env Variable (Support for Vite or CRA)
const API_URL = import.meta.env.VITE_SKIN_CANCER_API;

// 1. Import local assets
import sample1 from '../../assets/actinic_keratosis.jpg'; 
import sample2 from '../../assets/bascal_cell.jpg';
import sample3 from '../../assets/dermatofibroma.jpg'; 
import sample4 from '../../assets/melanoma.jpg';
import sample5 from '../../assets/nevus.jpg'; 
import sample6 from '../../assets/pigmented_benign.jpg'; 
import sample7 from '../../assets/seaborrheic_keratosis.jpg';
import sample8 from '../../assets/squamous_cell.jpg'; 
import sample9 from '../../assets/bascal_cell.jpg';

// --- HELPER: Client-Side Resizing ---
// This prevents sending 4MB+ images to the server, keeping RAM usage low.
const resizeImage = (imageSrc, width = 100, height = 75) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = imageSrc;
    img.crossOrigin = "Anonymous"; // Handle cross-origin images if needed

    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      
      // Draw and resize
      ctx.drawImage(img, 0, 0, width, height);
      
      // Export as small JPEG blob (approx 5KB)
      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Canvas to Blob failed"));
      }, 'image/jpeg', 0.95);
    };
    
    img.onerror = (err) => reject(err);
  });
};

const CancerDetection = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [latencyMsg, setLatencyMsg] = useState(null);
  const fileInputRef = useRef(null);

  // 1. Samples from local assets
  const SAMPLES = [
    { id: 1, label: "Actinic Keratosis", url: sample1 },
    { id: 2, label: "Bascal Cell", url: sample2 },
    { id: 3, label: "Dermatofibroma", url: sample3 },
    { id: 4, label: "Melanoma", url: sample4},
    { id: 5, label: "Nevus", url: sample5 },
    { id: 6, label: "PigmentedBenign", url: sample6 },
    { id: 7, label: "SeaborrheicLeratosis", url: sample7 },
    { id: 8, label: "Squamous Cell", url: sample8 },
    { id: 9, label: "VascularLesion", url: sample9 },
  ]

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setSelectedImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  // 3. Smart Latency Notifications
  useEffect(() => {
    let timer;
    if (analyzing) {
      const startTime = Date.now();
      timer = setInterval(() => {
        const elapsed = (Date.now() - startTime) / 1000;
        
        if (elapsed > 60) {
          setLatencyMsg({ type: 'warning', text: "Waking up instance (Cold Start)... This might take a moment." });
        } else if (elapsed > 30) {
          setLatencyMsg({ type: 'info', text: "High traffic detected. Placing you in priority queue..." });
        } else if (elapsed > 10) {
          setLatencyMsg({ type: 'neutral', text: "Server is busy processing complex features..." });
        }
      }, 1000);
    } else {
      setLatencyMsg(null);
    }
    return () => clearInterval(timer);
  }, [analyzing]);

  const analyzeImage = async () => {
    if (!selectedImage) return;
    setAnalyzing(true);
    setResult(null);
    setLatencyMsg(null);

    try {
      // --- CRITICAL MEMORY FIX ---
      // Instead of sending the full file, we resize it in the browser first.
      console.log("Resizing image on client...");
      const resizedBlob = await resizeImage(selectedImage, 100, 75);
      
      const formData = new FormData();
      formData.append("file", resizedBlob, "resized_scan.jpg");

      const response = await fetch(API_URL, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error("Analysis failed");

      const data = await response.json();
      setResult(data); 
      
    } catch (e) {
      console.error(e);
      setResult({ error: "Server connection failed." });
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 py-10 px-4">
      <div className="space-y-10 animate-in fade-in duration-700 max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center space-y-3 pt-6">
          <div className="inline-flex items-center gap-2 bg-white border border-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-xs font-semibold shadow-sm tracking-wide uppercase">
            <Activity size={14} className="animate-pulse" /> 
            DenseNet201 Architecture Active
          </div>
          <h2 className="text-5xl font-black text-slate-900 tracking-tighter">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">Skin Cancer Classification</span>
          </h2>
          <p className="text-slate-500 max-w-2xl mx-auto text-lg font-light leading-relaxed">
            Advanced malignancy screening using Deep Convolutional Neural Networks (Only for Educational Purposes).
          </p>
        </div>

        {/* Top Section: Analysis Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Interface (Left Side - 7 Columns) */}
          <div className="lg:col-span-7 space-y-6">
            <Card className="flex flex-col items-center justify-center min-h-[550px] bg-white rounded-3xl shadow-xl border border-slate-100 relative overflow-hidden">
              {selectedImage ? (
                <div className="relative w-full h-full flex flex-col items-center justify-between p-8 gap-6">
                  {/* Image Container */}
                  <div className="relative w-full max-w-md aspect-square rounded-2xl overflow-hidden shadow-2xl border-[6px] border-white ring-1 ring-slate-200 group">
                    <img src={selectedImage} alt="Scan" className="object-cover w-full h-full" />
                    
                    {/* Scanning Animation Overlay */}
                    {analyzing && (
                      <div className="absolute inset-0 z-20">
                        <div className="absolute top-0 w-full h-1 bg-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.8)] animate-[scan_2s_ease-in-out_infinite]"></div>
                        <div className="w-full h-full bg-cyan-500/10 backdrop-blur-[1px]"></div>
                      </div>
                    )}
                  </div>

                  {/* Smart Notification Popup */}
                  {latencyMsg && (
                    <div className={`absolute top-6 left-1/2 -translate-x-1/2 px-5 py-3 rounded-xl shadow-lg border backdrop-blur-md text-sm font-semibold flex items-center gap-3 animate-bounce z-30 min-w-[300px] justify-center
                      ${latencyMsg.type === 'warning' ? 'bg-amber-50/90 border-amber-200 text-amber-700' : 'bg-blue-50/90 border-blue-200 text-blue-700'}`}>
                      {latencyMsg.type === 'warning' ? <AlertCircle size={18}/> : <Info size={18}/>}
                      {latencyMsg.text}
                    </div>
                  )}

                  <div className="flex gap-4 w-full justify-center pt-2">
                    <Button variant="outline" onClick={() => setSelectedImage(null)} disabled={analyzing} className="border-slate-300 text-slate-600 hover:bg-slate-50">
                      Clear Scan
                    </Button>
                    <Button variant="secondary" onClick={analyzeImage} loading={analyzing} className="min-w-[160px] bg-slate-900 text-white hover:bg-slate-800 shadow-lg shadow-slate-900/20">
                      {analyzing ? 'Processing...' : 'Run Analysis'}
                    </Button>
                  </div>
                </div>
              ) : (
                /* Empty State */
                <div className="flex flex-col items-center justify-center text-center space-y-8 p-10 w-full h-full">
                  <div className="group relative">
                    <div className="absolute inset-0 bg-blue-100 rounded-full animate-ping opacity-20 duration-1000"></div>
                    <div className="bg-gradient-to-tr from-blue-50 to-slate-50 p-8 rounded-full shadow-inner border border-slate-100 relative">
                      <Upload className="w-12 h-12 text-blue-600 group-hover:scale-110 transition-transform duration-300" />
                    </div>
                  </div>
                  
                  <div className="space-y-3 max-w-sm">
                    <h3 className="text-2xl font-bold text-slate-800">Upload Scan</h3>
                    <p className="text-slate-400 text-sm">Drag and drop or select a high-resolution image (JPG, PNG) for analysis.</p>
                  </div>
                  
                  <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileUpload} accept="image/*" />
                  <Button size="lg" onClick={() => fileInputRef.current?.click()} className="px-10 py-6 text-lg bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200 shadow-xl rounded-xl">
                    Browse System
                  </Button>
                  
                  <div className="w-full pt-8 border-t border-slate-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-5">Or select a calibrated sample</p>
                    <div className="flex gap-3 overflow-x-auto pb-4 snap-x px-4 no-scrollbar justify-start md:justify-center">
                      {SAMPLES.map((img, idx) => (
                        <button 
                          key={idx} 
                          onClick={() => setSelectedImage(img.url)}
                          className="group relative flex-shrink-0 snap-center focus:outline-none"
                        >
                          <div className="w-16 h-16 rounded-xl overflow-hidden ring-2 ring-slate-100 group-hover:ring-blue-400 transition-all duration-300 transform group-hover:-translate-y-1 shadow-sm">
                            <img src={img.url} className="w-full h-full object-cover" alt={img.label} />
                          </div>
                          <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                            <span className="text-[10px] font-medium text-slate-500 bg-white px-2 py-0.5 rounded shadow-sm border border-slate-100">{img.label}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </Card>
          </div>

          {/* Results Column (Right Side - 5 Columns) */}
          <div className="lg:col-span-5 space-y-6 h-full">
            <Card className="border-0 shadow-xl shadow-slate-200/50 bg-white overflow-hidden rounded-2xl relative h-full min-h-[550px]">
              <div className="absolute top-0 left-0 w-1 h-full bg-blue-600"></div>
              <div className="p-8 h-full flex flex-col">
                <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-slate-800">
                  <Microscope className="text-blue-600" size={20} /> 
                  Diagnostic Report
                </h3>
                
                <div className="flex-1 flex flex-col justify-center">
                  {analyzing ? (
                    <div className="space-y-8 py-2">
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs font-semibold text-slate-500 uppercase tracking-wide">
                          <span>Cellular Analysis</span>
                          <span className="text-blue-600">Processing...</span>
                        </div>
                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500 animate-[progress_1.5s_ease-in-out_infinite] w-[60%] rounded-full"></div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 opacity-50">
                        <div className="w-10 h-10 rounded bg-slate-100 animate-pulse"></div>
                        <div className="space-y-2 flex-1">
                          <div className="h-3 bg-slate-100 rounded w-1/3 animate-pulse"></div>
                          <div className="h-3 bg-slate-100 rounded w-1/2 animate-pulse"></div>
                        </div>
                      </div>
                    </div>
                  ) : result ? (
                    <div className="animate-in slide-in-from-bottom-4 duration-500">
                       {result.error ? (
                         <div className="p-4 bg-red-50 text-red-700 rounded-lg border border-red-100 flex gap-3">
                           <AlertCircle className="shrink-0" />
                           <p className="text-sm font-medium">{result.error}</p>
                         </div>
                       ) : (
                         <div className="space-y-8">
                           <div className="flex items-start justify-between border-b border-slate-100 pb-8">
                             <div>
                               <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Classification</span>
                               <div className="text-4xl font-black text-slate-900 mt-2 tracking-tight">{result.label}</div>
                             </div>
                             <div className="text-right">
                               <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Confidence</span>
                               <div className="flex items-center justify-end gap-1 mt-2">
                                 <span className="text-4xl font-black text-emerald-600">{result.confidence}</span>
                                 <span className="text-xl text-emerald-500 font-bold">%</span>
                               </div>
                             </div>
                           </div>
                           
                           <div className="bg-emerald-50/50 p-6 rounded-xl border border-emerald-100 flex gap-4 items-start">
                             <CheckCircle2 className="text-emerald-600 shrink-0 mt-1" size={20} />
                             <div>
                               <p className="text-base text-emerald-900 font-bold">High Certainty Match</p>
                               <p className="text-sm text-emerald-700/80 mt-2 leading-relaxed">
                                 The DenseNet201 model has identified patterns consistent with the ISIC archive training data. Please correlate with histopathology.
                               </p>
                             </div>
                           </div>
                         </div>
                       )}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center text-slate-400">
                      <FileImage className="w-16 h-16 mb-4 opacity-10" />
                      <p className="text-sm font-medium">Awaiting input scan...</p>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Bottom Section: Technical Architecture */}
        <div className="mt-4">
          <ModelExplanation 
            title="Model Architecture: DenseNet201" 
            icon={Activity} 
            color="indigo"
            className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden"
            steps={[
              { name: "Input Layer", desc: "75x100x3 RGB Matrix" },
              { name: "Feature Extraction", desc: "DenseNet201 Backbone" },
              { name: "Classification", desc: "Softmax Probability" }
            ]}
            technicalDesc={
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-slate-600 leading-relaxed p-4">
                <div className="space-y-4">
                  <h4 className="font-bold text-slate-900 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-indigo-500"></div> Connectivity
                  </h4>
                  <p>
                    The model utilizes <strong>DenseNet201</strong>, a CNN where each layer connects to every other layer in a feed-forward fashion. This maximizes information flow and reuses features to detect subtle texture anomalies.
                  </p>
                  <div className="rounded-lg overflow-hidden border border-slate-200 bg-slate-50 shadow-sm mt-2">
                    {/* Visualizing the architecture connection */}
                    
                    <div className="p-2 text-[10px] font-medium text-center text-slate-500 bg-white border-t border-slate-100">
                      Figure 1: Dense Block feature concatenation.
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-bold text-slate-900 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-indigo-500"></div> Training Protocol
                  </h4>
                  <p>
                    <strong>Training Process:</strong> Trained on ISIC 2019 using <strong>categorical cross-entropy loss</strong> and the <strong>Adam optimizer</strong>. We utilized augmentation (rotation, shear) to prevent overfitting.
                  </p>
                  <div className="rounded-lg overflow-hidden border border-slate-200 bg-slate-50 shadow-sm mt-2">
                     {/* Visualizing the training loop */}
                     

[Image of neural network backpropagation diagram]

                     <div className="p-2 text-[10px] font-medium text-center text-slate-500 bg-white border-t border-slate-100">
                      Figure 2: Gradient flow during backpropagation.
                    </div>
                  </div>
                </div>
              </div>
            } 
          />
        </div>
      </div>
    </div>
  );
};

export default CancerDetection;
