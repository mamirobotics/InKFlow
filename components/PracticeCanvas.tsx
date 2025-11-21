import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Eraser, Download, Undo } from 'lucide-react';

export const PracticeCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lineWidth, setLineWidth] = useState(3);
  const [inkColor, setInkColor] = useState('#1a1a1a');
  const lastPos = useRef<{ x: number; y: number } | null>(null);

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.fillStyle = '#fdfbf7'; // Paper color
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    }
  }, []);

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDrawing(true);
    const pos = getPos(e);
    lastPos.current = pos;
    
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (ctx && pos) {
        ctx.beginPath();
        ctx.moveTo(pos.x, pos.y);
        // Draw a dot for single tap
        ctx.fillStyle = inkColor;
        ctx.arc(pos.x, pos.y, lineWidth / 2, 0, Math.PI * 2);
        ctx.fill();
    }
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || !lastPos.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    const currentPos = getPos(e);

    if (ctx && currentPos) {
      ctx.beginPath();
      ctx.moveTo(lastPos.current.x, lastPos.current.y);
      
      // Simple pressure simulation based on speed could go here, 
      // but for stability we stick to consistent strokes with slight smoothing
      ctx.lineWidth = lineWidth;
      ctx.strokeStyle = inkColor;
      ctx.lineTo(currentPos.x, currentPos.y);
      ctx.stroke();
      
      lastPos.current = currentPos;
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    lastPos.current = null;
  };

  const getPos = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    
    let clientX, clientY;
    if ('touches' in e) {
       clientX = e.touches[0].clientX;
       clientY = e.touches[0].clientY;
    } else {
       clientX = (e as React.MouseEvent).clientX;
       clientY = (e as React.MouseEvent).clientY;
    }

    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (canvas && ctx) {
      ctx.fillStyle = '#fdfbf7';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  };

  const downloadCanvas = () => {
     const canvas = canvasRef.current;
     if (canvas) {
         const link = document.createElement('a');
         link.download = 'my-practice.png';
         link.href = canvas.toDataURL();
         link.click();
     }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-serif text-ink-900">Practice Desk</h2>
        <p className="text-ink-700 italic">Freehand practice on digital parchment</p>
      </div>

      <div className="bg-white p-1 rounded-lg shadow-lg border border-stone-200">
         {/* Toolbar */}
         <div className="bg-stone-100 p-3 rounded-t-md flex flex-wrap items-center justify-between gap-4 border-b border-stone-200">
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase text-stone-500">Nib Width</span>
                    <input 
                        type="range" 
                        min="1" 
                        max="20" 
                        value={lineWidth} 
                        onChange={(e) => setLineWidth(parseInt(e.target.value))}
                        className="w-24 accent-stone-800"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase text-stone-500">Ink</span>
                    <div className="flex gap-1">
                        {['#1a1a1a', '#1e3a8a', '#7f1d1d', '#fdfbf7'].map(c => (
                            <button 
                                key={c}
                                onClick={() => setInkColor(c)}
                                className={`w-6 h-6 rounded-full border border-stone-300 ${inkColor === c ? 'ring-2 ring-stone-500 ring-offset-1' : ''}`}
                                style={{ backgroundColor: c }}
                                aria-label={c === '#fdfbf7' ? 'Eraser' : 'Color'}
                            />
                        ))}
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-2">
                <button onClick={clearCanvas} className="p-2 hover:bg-stone-200 rounded text-stone-700" title="Clear">
                    <Eraser size={20} />
                </button>
                <button onClick={downloadCanvas} className="p-2 hover:bg-stone-200 rounded text-stone-700" title="Save">
                    <Download size={20} />
                </button>
            </div>
         </div>

         {/* Canvas Area */}
         <div className="relative w-full h-[500px] overflow-hidden touch-none cursor-crosshair bg-[#fdfbf7]">
             {/* Background guidelines - simplified css pattern */}
             <div className="absolute inset-0 pointer-events-none opacity-10" 
                  style={{ 
                      backgroundImage: 'linear-gradient(#000 1px, transparent 1px)', 
                      backgroundSize: '100% 40px',
                      marginTop: '20px'
                  }}>
             </div>
             <canvas
                ref={canvasRef}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
                className="w-full h-full block"
             />
         </div>
      </div>
      
      <div className="text-center text-sm text-stone-500">
          Tip: Use a stylus for better control on touch devices.
      </div>
    </div>
  );
};
