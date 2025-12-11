import React, { useState } from 'react';
import { Patient } from '../types';
import { MOCK_PATIENTS } from '../constants';
import { summarizeClinicalNotes } from '../services/geminiService';
import { FileText, Bot, User, AlertTriangle, CheckCircle2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const ClinicalView: React.FC = () => {
  const [selectedPatient, setSelectedPatient] = useState<Patient>(MOCK_PATIENTS[0]);
  const [summary, setSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerateSummary = async () => {
    setLoading(true);
    setSummary(null);
    const result = await summarizeClinicalNotes(
      selectedPatient.name,
      selectedPatient.clinicalNotes,
      selectedPatient.fhirResource
    );
    setSummary(result);
    setLoading(false);
  };

  return (
    <div className="h-full flex flex-col space-y-6">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Clinical Documentation Assistant</h2>
          <p className="text-slate-500">AI-powered EMR summarization and H&P drafting.</p>
        </div>
      </header>

      <div className="flex-1 grid grid-cols-12 gap-6 min-h-0">
        {/* Patient List */}
        <div className="col-span-3 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
          <div className="p-4 bg-slate-50 border-b border-slate-200 font-semibold text-slate-700">
            Patient Queue
          </div>
          <div className="overflow-y-auto flex-1 p-2 space-y-2">
            {MOCK_PATIENTS.map((p) => (
              <button
                key={p.id}
                onClick={() => { setSelectedPatient(p); setSummary(null); }}
                className={`w-full text-left p-3 rounded-lg transition-colors border ${
                  selectedPatient.id === p.id
                    ? 'bg-blue-50 border-blue-200 ring-1 ring-blue-300'
                    : 'bg-white border-transparent hover:bg-slate-50 hover:border-slate-200'
                }`}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className="font-bold text-slate-800">{p.name}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                    p.admissionStatus === 'Inpatient' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                  }`}>
                    {p.admissionStatus}
                  </span>
                </div>
                <div className="text-xs text-slate-500 truncate">{p.condition}</div>
                <div className="text-[10px] text-slate-400 mt-1">ID: {p.id}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Clinical Details */}
        <div className="col-span-5 flex flex-col space-y-4 overflow-y-auto pr-2">
          {/* Patient Card */}
          <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-slate-100 p-2 rounded-full">
                <User size={24} className="text-slate-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800">{selectedPatient.name}</h3>
                <p className="text-sm text-slate-500">{selectedPatient.gender}, {selectedPatient.age} years old</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm mb-4">
              <div className="p-3 bg-slate-50 rounded-lg">
                <span className="block text-xs text-slate-400 font-semibold uppercase">Condition</span>
                <span className="font-medium text-slate-700">{selectedPatient.condition}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg">
                <span className="block text-xs text-slate-400 font-semibold uppercase">Last Visit</span>
                <span className="font-medium text-slate-700">{selectedPatient.lastVisit}</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                <FileText size={16} />
                <h3>Current Clinical Notes</h3>
              </div>
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-600 leading-relaxed min-h-[150px]">
                {selectedPatient.clinicalNotes}
              </div>
            </div>

            <div className="mt-4">
              <details className="text-xs text-slate-400 cursor-pointer">
                <summary>View Raw FHIR Resource</summary>
                <pre className="mt-2 bg-slate-900 text-green-400 p-3 rounded-lg overflow-x-auto">
                  {selectedPatient.fhirResource}
                </pre>
              </details>
            </div>
          </div>
        </div>

        {/* AI Action Panel */}
        <div className="col-span-4 flex flex-col h-full overflow-hidden">
          <div className="bg-white rounded-xl shadow-lg border border-blue-100 flex flex-col h-full overflow-hidden">
            <div className="p-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Bot size={20} />
                <span className="font-semibold">Gemini Assistant</span>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 bg-slate-50">
              {loading ? (
                <div className="flex flex-col items-center justify-center h-full space-y-3 opacity-60">
                  <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-sm text-blue-700 font-medium animate-pulse">Analyzing FHIR data...</p>
                </div>
              ) : summary ? (
                <div className="prose prose-sm prose-slate max-w-none">
                  <ReactMarkdown>{summary}</ReactMarkdown>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 text-center p-6">
                  <FileText size={48} className="mb-3 opacity-20" />
                  <p className="text-sm">Click "Generate Summary" to create an After Visit Summary and H&P Draft from patient data.</p>
                </div>
              )}
            </div>

            <div className="p-4 bg-white border-t border-slate-100">
              {summary && (
                <div className="mb-3 flex items-start gap-2 bg-amber-50 border border-amber-200 p-2 rounded text-[10px] text-amber-800">
                  <AlertTriangle size={12} className="mt-0.5" />
                  <p>AI generated content. Not a diagnosis. Physician review required.</p>
                </div>
              )}
              <button
                onClick={handleGenerateSummary}
                disabled={loading}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-medium rounded-lg flex items-center justify-center gap-2 transition-colors shadow-md"
              >
                {loading ? 'Processing...' : (
                  <>
                    <CheckCircle2 size={18} />
                    Generate Clinical Documents
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClinicalView;
