import React, { useState } from 'react';
import { MOCK_FINANCIALS } from '../constants';
import { analyzeFinancials } from '../services/geminiService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, DollarSign, Users, Briefcase, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const FinancialView: React.FC = () => {
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumSignificantDigits: 3 }).format(val);
  };

  const handleAnalyze = async () => {
    setLoading(true);
    const result = await analyzeFinancials(MOCK_FINANCIALS);
    setAnalysis(result);
    setLoading(false);
  };

  const latestMonth = MOCK_FINANCIALS[MOCK_FINANCIALS.length - 1];

  return (
    <div className="h-full flex flex-col space-y-6 overflow-y-auto pb-8">
      <header>
        <h2 className="text-2xl font-bold text-slate-800">Financial & Operational Hub</h2>
        <p className="text-slate-500">Real-time revenue cycle management and payroll automation.</p>
      </header>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-green-100 p-2 rounded-lg text-green-600"><DollarSign size={20} /></div>
            <span className="text-sm font-semibold text-slate-500">Monthly Revenue</span>
          </div>
          <div className="text-xl font-bold text-slate-800">{formatCurrency(latestMonth.revenue)}</div>
          <span className="text-xs text-green-600 font-medium flex items-center gap-1">
            <TrendingUp size={12} /> +12% vs last month
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-red-100 p-2 rounded-lg text-red-600"><Briefcase size={20} /></div>
            <span className="text-sm font-semibold text-slate-500">Expenses</span>
          </div>
          <div className="text-xl font-bold text-slate-800">{formatCurrency(latestMonth.expenses)}</div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-blue-100 p-2 rounded-lg text-blue-600"><Users size={20} /></div>
            <span className="text-sm font-semibold text-slate-500">Patient Volume</span>
          </div>
          <div className="text-xl font-bold text-slate-800">{latestMonth.patientCount}</div>
          <span className="text-xs text-slate-400">Total visits this month</span>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-purple-100 p-2 rounded-lg text-purple-600"><Briefcase size={20} /></div>
            <span className="text-sm font-semibold text-slate-500">Payroll Cost</span>
          </div>
          <div className="text-xl font-bold text-slate-800">{formatCurrency(latestMonth.payroll)}</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Chart Section */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 min-h-[400px]">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Revenue vs Expenses (Last 5 Months)</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MOCK_FINANCIALS}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="month" stroke="#64748b" />
                <YAxis 
                   stroke="#64748b" 
                   tickFormatter={(val) => `${val / 1000000000}B`} 
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                  formatter={(val: number) => formatCurrency(val)}
                />
                <Legend />
                <Bar dataKey="revenue" name="Revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expenses" name="Expenses" fill="#f43f5e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Insight Section */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col">
          <div className="p-5 border-b border-slate-100 flex justify-between items-center">
             <div className="flex items-center gap-2 text-indigo-600">
                <Sparkles size={20} />
                <h3 className="font-bold">CFO AI Insights</h3>
             </div>
             <button 
                onClick={handleAnalyze}
                disabled={loading}
                className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
             >
                {loading ? 'Analyzing...' : 'Run Analysis'}
             </button>
          </div>
          
          <div className="flex-1 p-6 bg-slate-50 overflow-y-auto max-h-[400px]">
             {loading ? (
                <div className="space-y-3 animate-pulse">
                  <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                  <div className="h-4 bg-slate-200 rounded w-full"></div>
                  <div className="h-4 bg-slate-200 rounded w-5/6"></div>
                </div>
             ) : analysis ? (
               <div className="prose prose-sm prose-slate max-w-none">
                 <ReactMarkdown>{analysis}</ReactMarkdown>
               </div>
             ) : (
               <div className="text-center text-slate-400 mt-10">
                 <p>Click "Run Analysis" to generate strategic financial insights using Gemini.</p>
               </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialView;
