import React, { useState, useEffect } from 'react';
import { CALLIGRAPHY_STYLES, CalligraphyStyle } from '../types';
import { generateCalligraphySample, getStyleHistory } from '../services/gemini';
import { Loader2, Wand2, Info } from 'lucide-react';

export const Generator: React.FC = () => {
  const [inputText, setInputText] = useState('InkFlow');
  const [selectedStyle, setSelectedStyle] = useState<CalligraphyStyle>(CALLIGRAPHY_STYLES[0]);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [styleInfo, setStyleInfo] = useState<string>('');
  const [infoLoading, setInfoLoading] = useState(false);

  useEffect(() => {
    // Fetch history when style changes
    let isMounted = true;
    const fetchInfo = async () => {
      setInfoLoading(true);
      const info = await getStyleHistory(selectedStyle.name);
      if (isMounted) {
        setStyleInfo(info);
        setInfoLoading(false);
      }
    };
    fetchInfo();
    return () => { isMounted = false; };
  }, [selectedStyle]);

  const handleGenerate = async () => {
    if (!inputText.trim()) return;
    setLoading(true);
    try {
      const img = await generateCalligraphySample(inputText, selectedStyle.name);
      setGeneratedImage(img);
    } catch (e) {
      alert('Failed to generate image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-serif text-ink-900">Style Generator</h2>
        <p className="text-ink-700 italic">Visualize your text in historical forms</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Controls */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-paper-200 space-y-6">
          <div>
            <label className="block text-sm font-medium text-ink-700 mb-2">Text to Calligraph</label>
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="w-full p-3 bg-paper-50 border border-paper-200 rounded focus:ring-2 focus:ring-stone-400 focus:outline-none font-serif text-lg"
              placeholder="Enter text..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-ink-700 mb-2">Select Style</label>
            <div className="grid grid-cols-1 gap-2">
              {CALLIGRAPHY_STYLES.map((style) => (
                <button
                  key={style.id}
                  onClick={() => setSelectedStyle(style)}
                  className={`text-left px-4 py-3 rounded transition-all flex items-center justify-between ${
                    selectedStyle.id === style.id
                      ? 'bg-stone-800 text-white'
                      : 'bg-paper-50 hover:bg-paper-100 text-ink-800'
                  }`}
                >
                  <span className="font-serif">{style.name}</span>
                  <span className={`text-xs ${selectedStyle.id === style.id ? 'text-stone-300' : 'text-stone-500'}`}>
                    {style.era}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-paper-100 p-4 rounded border border-paper-200 text-sm text-ink-800 leading-relaxed">
             <div className="flex items-center gap-2 mb-2 text-stone-600">
               <Info size={16} />
               <span className="font-bold uppercase tracking-wider text-xs">Historical Context</span>
             </div>
             {infoLoading ? (
               <span className="animate-pulse">Consulting the archives...</span>
             ) : (
               styleInfo
             )}
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full py-4 bg-ink-900 text-white font-serif text-lg rounded shadow hover:bg-ink-800 disabled:opacity-70 flex items-center justify-center gap-3 transition-colors"
          >
            {loading ? <Loader2 className="animate-spin" /> : <Wand2 />}
            {loading ? 'Inking...' : 'Generate Exemplar'}
          </button>
        </div>

        {/* Preview */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-paper-200 flex flex-col items-center justify-center min-h-[400px]">
          {generatedImage ? (
            <div className="space-y-4 w-full">
              <div className="aspect-square w-full relative bg-paper-50 rounded overflow-hidden border-8 border-double border-stone-200 shadow-inner">
                <img
                  src={generatedImage}
                  alt="Generated Calligraphy"
                  className="w-full h-full object-contain p-4"
                />
              </div>
              <div className="flex justify-center">
                 <a href={generatedImage} download="inkflow_sample.png" className="text-sm text-stone-500 hover:text-stone-900 underline underline-offset-4">
                   Download Reference
                 </a>
              </div>
            </div>
          ) : (
            <div className="text-center text-stone-400 space-y-2">
              <div className="w-16 h-16 border-2 border-dashed border-stone-300 rounded-full mx-auto flex items-center justify-center">
                <span className="font-serif text-2xl italic">?</span>
              </div>
              <p>Select a style and generate to see the result</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
