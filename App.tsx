import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import ClinicalView from './components/ClinicalView';
import FinancialView from './components/FinancialView';
import SearchView from './components/SearchView';
import { ViewState } from './types';
import { MOCK_FINANCIALS, MOCK_PATIENTS } from './constants';
import { Activity, Users, AlertOctagon } from 'lucide-react';

const DashboardView: React.FC<{ setView: (v: ViewState) => void }> = ({ setView }) => {
  const totalRev = MOCK_FINANCIALS.reduce((acc, cur) => acc + cur.revenue, 0);
  const totalPatients = MOCK_PATIENTS.length;

  return (
    <div className="space-y-6">
      <header className="mb-8">
        <h2 className="text-3xl font-bold text-slate-800">Welcome back, Dr. Administrator</h2>
        <p className="text-slate-500 mt-2">Here is your daily hospital operational overview.</p>
      </header>

      <div className="grid grid-cols-3 gap-6">
        <div onClick={() => setView(ViewState.FINANCIAL)} className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-2xl shadow-lg shadow-blue-200 text-white cursor-pointer hover:scale-[1.02] transition-transform">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <Activity size={24} />
            </div>
            <span className="text-blue-100 text-sm font-medium">YTD Revenue</span>
          </div>
          <h3 className="text-3xl font-bold mb-1">
            {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumSignificantDigits: 3 }).format(totalRev)}
          </h3>
          <p className="text-blue-100 text-sm">Target achieved: 94%</p>
        </div>

        <div onClick={() => setView(ViewState.CLINICAL)} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 cursor-pointer hover:border-blue-300 transition-colors">
          <div className="flex justify-between items-start mb-4">
             <div className="p-3 bg-orange-100 rounded-xl text-orange-600">
               <Users size={24} />
             </div>
             <span className="text-slate-400 text-sm font-medium">Active Patients</span>
          </div>
          <h3 className="text-3xl font-bold text-slate-800 mb-1">{totalPatients}</h3>
          <p className="text-slate-500 text-sm">4 Critical attention needed</p>
        </div>

        <div onClick={() => setView(ViewState.SEARCH)} className="bg-slate-900 p-6 rounded-2xl shadow-lg text-white cursor-pointer hover:scale-[1.02] transition-transform">
           <h3 className="text-xl font-bold mb-2">Need information?</h3>
           <p className="text-slate-400 text-sm mb-4">Use the AI Search module to find patient records using natural language.</p>
           <div className="w-full py-2 bg-slate-800 rounded-lg text-center text-sm font-medium text-slate-300">
             Open Smart Search
           </div>
        </div>
      </div>
    </div>
  );
};

const DisclaimerModal: React.FC<{ onClose: () => void }> = ({ onClose }) => (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
    <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl p-6 border-t-4 border-red-500">
      <div className="flex items-center gap-3 text-red-600 mb-4">
        <AlertOctagon size={32} />
        <h2 className="text-xl font-bold">Important Medical Disclaimer</h2>
      </div>
      <p className="text-slate-600 mb-6 text-sm leading-relaxed">
        **SCHOA (Smart Clinical & Operational Assistant)** is a prototype for educational and administrative demonstration purposes only.
        <br /><br />
        <strong>AI-generated summaries and insights are NOT medical diagnoses.</strong> 
        <br /><br />
        This system should never be used as a substitute for professional medical advice, diagnosis, or treatment. Always verify information with a certified healthcare professional.
      </p>
      <button 
        onClick={onClose}
        className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-colors"
      >
        I Understand & Accept
      </button>
    </div>
  </div>
);

function App() {
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.DASHBOARD);
  const [showDisclaimer, setShowDisclaimer] = useState(true);

  // Disclaimer auto-show logic on first load could go here, defaulting to true for now.

  const renderContent = () => {
    switch (currentView) {
      case ViewState.DASHBOARD:
        return <DashboardView setView={setCurrentView} />;
      case ViewState.CLINICAL:
        return <ClinicalView />;
      case ViewState.FINANCIAL:
        return <FinancialView />;
      case ViewState.SEARCH:
        return <SearchView />;
      default:
        return <DashboardView setView={setCurrentView} />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900">
      <Sidebar currentView={currentView} setView={setCurrentView} />
      
      <main className="flex-1 ml-64 p-8 overflow-hidden h-screen">
        {renderContent()}
      </main>

      {showDisclaimer && <DisclaimerModal onClose={() => setShowDisclaimer(false)} />}
    </div>
  );
}

export default App;
