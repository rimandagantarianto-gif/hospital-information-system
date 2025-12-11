import React, { useState } from 'react';
import { Search, Sparkles, ArrowRight, User } from 'lucide-react';
import { MOCK_PATIENTS } from '../constants';
import { semanticSearchPatients } from '../services/geminiService';
import { Patient } from '../types';

const SearchView: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Patient[]>([]);
  const [explanation, setExplanation] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setHasSearched(true);
    setResults([]);
    setExplanation(null);

    const { matchedIds, explanation: aiExplanation } = await semanticSearchPatients(query, MOCK_PATIENTS);
    
    const matchedPatients = MOCK_PATIENTS.filter(p => matchedIds.includes(p.id));
    setResults(matchedPatients);
    setExplanation(aiExplanation);
    setLoading(false);
  };

  const suggestions = [
    "Patients with high blood pressure",
    "Who is scheduled for surgery?",
    "Patients needing respiratory care",
    "Show me diabetic patients"
  ];

  return (
    <div className="max-w-4xl mx-auto h-full flex flex-col pt-10">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-slate-800 mb-2">Smart Patient Retrieval</h2>
        <p className="text-slate-500">Use natural language to query patient records, diagnoses, and notes.</p>
      </div>

      {/* Search Input */}
      <div className="bg-white p-2 rounded-2xl shadow-xl border border-slate-200 mb-8 relative z-10">
        <form onSubmit={handleSearch} className="flex items-center">
          <div className="pl-4 text-slate-400">
            <Search size={24} />
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask anything... e.g., 'Find all patients with chronic conditions'"
            className="flex-1 p-4 text-lg outline-none text-slate-700 bg-transparent placeholder-slate-300"
          />
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? 'Searching...' : <><Sparkles size={18} /> Search</>}
          </button>
        </form>
      </div>

      {/* Suggestions */}
      {!hasSearched && (
        <div className="flex flex-wrap justify-center gap-3">
          {suggestions.map((s, idx) => (
            <button
              key={idx}
              onClick={() => setQuery(s)}
              className="px-4 py-2 bg-white border border-slate-200 rounded-full text-slate-600 text-sm hover:border-blue-300 hover:text-blue-600 transition-colors"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Results Area */}
      {hasSearched && (
        <div className="space-y-6 pb-10 animate-fade-in-up">
          {/* Explanation */}
          {explanation && (
             <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-xl flex items-start gap-3">
               <Sparkles className="text-indigo-500 mt-1 flex-shrink-0" size={20} />
               <div>
                 <h4 className="font-semibold text-indigo-900 text-sm uppercase tracking-wide mb-1">AI Logic</h4>
                 <p className="text-indigo-800 text-sm">{explanation}</p>
               </div>
             </div>
          )}

          {/* List */}
          <div className="grid gap-4">
            {results.length > 0 ? (
              results.map((p) => (
                <div key={p.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between group">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-500">
                      <User size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800 text-lg">{p.name}</h3>
                      <div className="flex items-center gap-3 text-sm text-slate-500">
                        <span>ID: {p.id}</span>
                        <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                        <span className="text-blue-600 font-medium">{p.condition}</span>
                      </div>
                    </div>
                  </div>
                  <button className="text-slate-400 group-hover:text-blue-600 transition-colors">
                    <ArrowRight size={24} />
                  </button>
                </div>
              ))
            ) : (
              !loading && (
                <div className="text-center p-10 text-slate-400">
                  No patients found matching your criteria.
                </div>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchView;
