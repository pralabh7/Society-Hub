import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import API_BASE_URL from '../apiConfig';
import ReactMarkdown from 'react-markdown';

function AIRecommender() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const getAdvice = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setResult(""); 
    try {
      const response = await fetch(`${API_BASE_URL}/api/recommend`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ interests: input }),
      });
      const data = await response.json();
      setResult(data.recommendation);
    } catch (err) {
      setResult("Server connection lost. Please try again after a quick chai break!");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-200 font-sans selection:bg-indigo-500/30">
      {/* Background Ambient Glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full"></div>
      </div>

      <nav className="p-6">
        <Link to="/" className="text-slate-400 hover:text-white transition-colors flex items-center gap-2 text-sm font-medium">
          ← Back to Hub
        </Link>
      </nav>

      <div className="max-w-3xl mx-auto px-6 pt-10 pb-20">
        <header className="text-center mb-12">
          <div className="inline-block px-4 py-1.5 mb-4 rounded-full border border-indigo-500/30 bg-indigo-500/5 text-indigo-400 text-xs font-bold uppercase tracking-widest">
            AI-Powered Mentor
          </div>
          <h1 className="text-5xl font-black text-white mb-4 tracking-tight">
            Find Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Perfect Tribe</span>
          </h1>
          <p className="text-slate-400 text-lg">
            Describe your interests, and our AI senior will guide you to the right MANIT society.
          </p>
        </header>

        <div className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 shadow-2xl">
          <div className="relative">
            <textarea 
              className="w-full bg-slate-900/50 border border-slate-700 rounded-2xl p-6 text-white placeholder:text-slate-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all resize-none text-lg"
              placeholder="Ex: I love photography and coding. Which Society should I join?"
              rows="5"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          </div>
          
          <button 
            onClick={getAdvice}
            disabled={loading || !input.trim()}
            className={`mt-6 w-full py-4 rounded-2xl font-bold text-sm uppercase tracking-widest transition-all shadow-lg flex items-center justify-center gap-3
              ${loading || !input.trim() 
                ? 'bg-slate-700 text-slate-500 cursor-not-allowed' 
                : 'bg-indigo-600 hover:bg-indigo-500 text-white hover:shadow-indigo-500/25'}`}
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Analyzing Profile...
              </>
            ) : "Ask for Advice"}
          </button>
        </div>

{/* Result Animation Section */}
{result && (
  <div className="mt-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
    <div className="flex items-center gap-3 mb-4">
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-xs shadow-lg">🎓</div>
      <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">Senior's Recommendation</h3>
    </div>
    <div className="bg-gradient-to-br from-indigo-500/10 to-transparent border border-indigo-500/20 p-8 rounded-3xl relative overflow-hidden">
      <div className="absolute top-4 right-6 text-6xl text-indigo-500/10 font-serif leading-none">“</div>
      
      <div className="text-xl text-slate-200 leading-relaxed relative z-10">
        {/* CRITICAL: Make sure there are NO extra quotes or braces around {result} */}
        <ReactMarkdown 
          components={{
            strong: ({node, ...props}) => <span className="text-cyan-400 font-extrabold" {...props} />,
            em: ({node, ...props}) => <span className="text-indigo-300 italic font-medium px-1 bg-indigo-500/10 rounded" {...props} />,
            p: ({node, ...props}) => <p className="mb-4 last:mb-0" {...props} />
          }}
        >
          {result}
        </ReactMarkdown>
      </div>
    </div>
  </div>
)}
      </div>
    </div>
  );
}

export default AIRecommender;