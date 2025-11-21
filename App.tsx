import React, { useState } from 'react';
import { AppView } from './types';
import { Generator } from './components/Generator';
import { PracticeCanvas } from './components/PracticeCanvas';
import { Tutor } from './components/Tutor';
import { PenTool, BookOpen, GraduationCap, Feather } from 'lucide-react';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.GENERATOR);

  return (
    <div className="min-h-screen flex flex-col bg-paper-50">
      {/* Header */}
      <header className="bg-white border-b border-stone-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-ink-900 rounded-full flex items-center justify-center text-white">
              <Feather size={20} />
            </div>
            <div>
              <h1 className="text-2xl font-serif font-bold text-ink-900 leading-none">InkFlow</h1>
              <span className="text-xs text-stone-500 tracking-widest uppercase">The Scholar</span>
            </div>
          </div>
          
          <nav className="hidden md:flex space-x-1">
            {[
              { id: AppView.GENERATOR, label: 'Study', icon: BookOpen },
              { id: AppView.PRACTICE, label: 'Practice', icon: PenTool },
              { id: AppView.TUTOR, label: 'Tutor', icon: GraduationCap },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                  currentView === item.id
                    ? 'bg-stone-100 text-ink-900'
                    : 'text-stone-500 hover:text-ink-900 hover:bg-stone-50'
                }`}
              >
                <item.icon size={16} />
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Mobile Nav - Bottom */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-stone-200 flex justify-around p-3 z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
         {[
              { id: AppView.GENERATOR, label: 'Study', icon: BookOpen },
              { id: AppView.PRACTICE, label: 'Practice', icon: PenTool },
              { id: AppView.TUTOR, label: 'Tutor', icon: GraduationCap },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`flex flex-col items-center gap-1 text-xs font-medium ${
                  currentView === item.id ? 'text-ink-900' : 'text-stone-400'
                }`}
              >
                <item.icon size={20} className={currentView === item.id ? 'stroke-[2.5px]' : 'stroke-2'} />
                {item.label}
              </button>
            ))}
      </div>

      {/* Main Content */}
      <main className="flex-grow p-4 sm:p-8 pb-24 md:pb-8">
        <div className="max-w-6xl mx-auto">
          {currentView === AppView.GENERATOR && <Generator />}
          {currentView === AppView.PRACTICE && <PracticeCanvas />}
          {currentView === AppView.TUTOR && <Tutor />}
        </div>
      </main>

      <footer className="hidden md:block bg-white border-t border-stone-200 py-6 text-center text-stone-400 text-sm font-serif">
        <p>&copy; {new Date().getFullYear()} InkFlow Calligraphy. Art meets Intelligence.</p>
      </footer>
    </div>
  );
};

export default App;
