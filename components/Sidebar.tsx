import React from 'react';
import { ViewState } from '../types';
import { LayoutDashboard, Stethoscope, LineChart, Search, Activity } from 'lucide-react';

interface SidebarProps {
  currentView: ViewState;
  setView: (view: ViewState) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView }) => {
  const menuItems = [
    { id: ViewState.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
    { id: ViewState.CLINICAL, label: 'Clinical AI', icon: Stethoscope },
    { id: ViewState.FINANCIAL, label: 'Finance & Ops', icon: LineChart },
    { id: ViewState.SEARCH, label: 'Smart Search', icon: Search },
  ];

  return (
    <div className="w-64 bg-slate-900 text-white h-screen fixed left-0 top-0 flex flex-col shadow-xl z-20">
      <div className="p-6 border-b border-slate-700 flex items-center gap-3">
        <div className="bg-blue-500 p-2 rounded-lg">
          <Activity size={24} className="text-white" />
        </div>
        <div>
          <h1 className="font-bold text-lg tracking-wider">SCHOA</h1>
          <p className="text-xs text-slate-400">Hospital OS v1.0</p>
        </div>
      </div>
      
      <nav className="flex-1 p-4 space-y-2 mt-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon size={20} />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-6 border-t border-slate-800">
        <div className="bg-slate-800 rounded-lg p-4">
          <p className="text-xs text-slate-400 mb-1">System Status</p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-xs font-semibold text-green-400">FHIR Connected</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
