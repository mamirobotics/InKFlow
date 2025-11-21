import React, { useState, useRef } from 'react';
import { critiqueCalligraphy } from '../services/gemini';
import { Upload, Camera, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

export const Tutor: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [critique, setCritique] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [styleGoal, setStyleGoal] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setCritique(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedImage) return;
    setLoading(true);
    try {
      const feedback = await critiqueCalligraphy(selectedImage, styleGoal || 'General Calligraphy');
      setCritique(feedback);
    } catch (error) {
      console.error(error);
      alert('Analysis failed. Please check your API key and internet connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-serif text-ink-900">Master's Critique</h2>
        <p className="text-ink-700 italic">Upload your work for AI-powered analysis</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Upload Section */}
        <div className="space-y-6">
          <div 
            className={`border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center min-h-[300px] transition-colors ${selectedImage ? 'border-stone-300 bg-white' : 'border-stone-400 bg-paper-100 hover:bg-paper-200'}`}
          >
            {selectedImage ? (
              <div className="relative w-full h-full flex flex-col items-center">
                <img src={selectedImage} alt="Upload" className="max-h-64 object-contain shadow-md" />
                <button 
                  onClick={() => setSelectedImage(null)}
                  className="mt-4 text-sm text-red-600 hover:underline"
                >
                  Remove Image
                </button>
              </div>
            ) : (
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-stone-200 rounded-full flex items-center justify-center mx-auto text-stone-500">
                  <Camera size={32} />
                </div>
                <p className="text-stone-600 font-medium">Upload a photo of your practice</p>
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="px-6 py-2 bg-stone-800 text-white rounded hover:bg-stone-700 transition-colors flex items-center gap-2 mx-auto"
                >
                  <Upload size={16} /> Select File
                </button>
              </div>
            )}
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept="image/*" 
              className="hidden" 
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-bold text-stone-700">What style were you attempting?</label>
            <input 
              type="text" 
              value={styleGoal}
              onChange={(e) => setStyleGoal(e.target.value)}
              placeholder="e.g. Copperplate, Gothic, Modern Brush..."
              className="w-full p-3 border border-stone-300 rounded bg-white focus:ring-2 focus:ring-stone-500 focus:outline-none"
            />
          </div>

          <button
            onClick={handleAnalyze}
            disabled={!selectedImage || loading}
            className="w-full py-3 bg-ink-900 text-white font-serif text-lg rounded shadow disabled:opacity-50 hover:bg-ink-800 transition-all flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" /> : <CheckCircle2 />}
            {loading ? 'Analyzing strokes...' : 'Request Critique'}
          </button>
        </div>

        {/* Result Section */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-stone-200 min-h-[300px]">
           <h3 className="text-xl font-serif mb-4 border-b border-stone-100 pb-2">Professor's Notes</h3>
           
           {loading ? (
             <div className="flex flex-col items-center justify-center h-64 space-y-4 text-stone-400">
               <Loader2 className="animate-spin w-8 h-8" />
               <p className="italic">Examining ink flow...</p>
             </div>
           ) : critique ? (
             <div className="prose prose-stone max-w-none text-stone-800 leading-relaxed animate-in fade-in duration-500">
                {/* Simple Markdown rendering for the critique */}
                {critique.split('\n').map((line, i) => (
                  <p key={i} className={line.startsWith('**') ? 'font-bold mt-4' : 'mb-2'}>
                    {line.replace(/\*\*/g, '')}
                  </p>
                ))}
             </div>
           ) : (
             <div className="flex flex-col items-center justify-center h-64 text-stone-400">
               <AlertCircle className="w-12 h-12 mb-2 opacity-20" />
               <p>Upload an image to receive feedback.</p>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};
