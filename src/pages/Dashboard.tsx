import React from 'react';
import { 
  Activity, 
  AlertTriangle, 
  Pill, 
  Zap,
  Clock,
  ChevronRight,
  Shield,
  FileText,
  Download,
  Utensils,
  CheckCircle2
} from 'lucide-react';
import { useMedicalRecords } from '../hooks/useMedicalRecords';
import { cn } from '../utils';

export const Dashboard: React.FC = () => {
  const { records } = useMedicalRecords();
  const userName = JSON.parse(localStorage.getItem('medos_profile') || '{}').name;

  const activeMedications = records.flatMap(r => r.analysis?.medications || []);
  const riskAlerts = records.flatMap(r => r.analysis?.risks || []);
  const nutritionPlans = records
    .filter(r => r.analysis?.nutritionPlan)
    .map(r => r.analysis!.nutritionPlan!);

  const handleExportData = () => {
    const data = {
      profile: JSON.parse(localStorage.getItem('medos_profile') || '{}'),
      records: records
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `medos_pro_export_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const stats = [
    { label: 'Recovery', value: '92%', icon: Activity, color: 'text-emerald-500', bg: 'bg-emerald-50' },
  ];

  return (
    <div className="pt-24 pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">
            Hi {userName || 'there'},
          </h1>
          <p className="text-slate-500 font-medium">Welcome back. Your clinical intelligence is up to date.</p>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={handleExportData}
            className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-black text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm"
          >
            <Download className="w-4 h-4" /> Export Data
          </button>
          <div className="flex items-center gap-4 bg-slate-900 p-3 pl-5 rounded-[2rem] shadow-xl">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400">
              <Clock className="w-5 h-5" />
            </div>
            <div className="pr-4">
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Last Sync</p>
              <p className="text-sm font-bold text-white">Today, 09:41 AM</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {/* Health Score Card */}
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 rounded-[2.5rem] text-white shadow-2xl shadow-blue-200 flex flex-col items-center justify-center text-center relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-white/20 transition-colors" />
          <div className="relative w-24 h-24 mb-4">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <circle className="text-white/20 stroke-current" strokeWidth="8" cx="50" cy="50" r="40" fill="transparent" />
              <circle className="text-white stroke-current" strokeWidth="8" strokeDasharray="251.2" strokeDashoffset="40" strokeLinecap="round" cx="50" cy="50" r="40" fill="transparent" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-black">84</span>
            </div>
          </div>
          <p className="text-sm font-black uppercase tracking-widest opacity-80">Health Score</p>
          <p className="text-[10px] font-bold uppercase mt-1 text-blue-100">Optimal Range</p>
        </div>

        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col justify-between hover:shadow-xl hover:shadow-slate-100 transition-all group">
            <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform", stat.bg)}>
              <stat.icon className={cn("w-7 h-7", stat.color)} />
            </div>
            <div>
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
              <p className="text-3xl font-black text-slate-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Nutrition Plan Section */}
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Utensils className="w-5 h-5 text-emerald-500" />
                AI Nutrition Plan
              </h3>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Based on records</span>
            </div>
            
            {nutritionPlans.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-2">Dietary Focus</p>
                    <p className="text-lg font-bold text-slate-900">{nutritionPlans[0].dietaryFocus}</p>
                  </div>
                  <div className="space-y-3">
                    <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest">Recommended Foods</p>
                    <div className="flex flex-wrap gap-2">
                      {nutritionPlans[0].allowedFoods.map((food, i) => (
                        <span key={i} className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-medium">
                          {food}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-3">
                    <p className="text-xs font-bold text-red-600 uppercase tracking-widest">Foods to Avoid</p>
                    <div className="flex flex-wrap gap-2">
                      {nutritionPlans[0].restrictedFoods.map((food, i) => (
                        <span key={i} className="px-3 py-1 bg-red-50 text-red-700 rounded-lg text-xs font-medium">
                          {food}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Meal Suggestions</p>
                    <ul className="space-y-3">
                      {nutritionPlans[0].mealSuggestions.map((meal, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm text-slate-700">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                          {meal}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
                    <p className="text-xs font-bold text-blue-700 uppercase tracking-widest mb-1">Hydration Advice</p>
                    <p className="text-sm text-blue-900">{nutritionPlans[0].hydrationAdvice}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 bg-slate-50 rounded-[2rem] border border-dashed border-slate-200">
                <Utensils className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500 font-medium">Upload a medical record to generate your AI nutrition plan.</p>
              </div>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Medications */}
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Pill className="w-5 h-5 text-indigo-500" />
                  Active Medications
                </h3>
                <button className="text-blue-600 text-sm font-bold">View All</button>
              </div>
              <div className="space-y-4">
                {activeMedications.length > 0 ? (
                  activeMedications.slice(0, 3).map((med, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                      <div>
                        <p className="font-bold text-slate-900">{med.name}</p>
                        <p className="text-xs text-slate-500">{med.dosage} • {med.frequency}</p>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-slate-400">
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-400 text-sm text-center py-4 italic">No active medications found.</p>
                )}
              </div>
            </div>

            {/* Risk Alerts */}
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-500" />
                  Risk Alerts
                </h3>
                <span className="px-2 py-1 bg-amber-50 text-amber-600 text-xs font-bold rounded-lg">
                  {riskAlerts.length} Active
                </span>
              </div>
              <div className="space-y-4">
                {riskAlerts.length > 0 ? (
                  riskAlerts.slice(0, 3).map((risk, i) => (
                    <div key={i} className="flex items-start gap-4 p-4 bg-amber-50/50 rounded-2xl border border-amber-100">
                      <div className={cn(
                        "w-2 h-2 rounded-full mt-2 shrink-0",
                        risk.level === 'high' ? 'bg-red-500' : 'bg-amber-500'
                      )} />
                      <div>
                        <p className="font-bold text-slate-900 text-sm">{risk.title}</p>
                        <p className="text-xs text-slate-600 line-clamp-1">{risk.description}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Shield className="w-6 h-6 text-emerald-500" />
                    </div>
                    <p className="text-slate-500 text-sm">No risks detected</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar / Recent Records */}
        <div className="space-y-8">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-6">Recent Records</h3>
            <div className="space-y-4">
              {records.length > 0 ? (
                records.slice(0, 5).map((record, i) => (
                  <div key={i} className="group cursor-pointer">
                    <div className="flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-colors">
                      <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-100 transition-colors">
                        <FileText className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-slate-900 text-sm truncate">{record.fileName}</p>
                        <p className="text-xs text-slate-500 capitalize">{record.type.replace('_', ' ')} • {record.date}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <p className="text-slate-400 text-sm">No records uploaded yet.</p>
                </div>
              )}
            </div>
            <button className="w-full mt-6 py-3 border-2 border-dashed border-slate-200 rounded-2xl text-slate-500 font-bold text-sm hover:border-blue-300 hover:text-blue-500 transition-all">
              + Upload New
            </button>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-50 rounded-full -mr-12 -mt-12 group-hover:bg-amber-100 transition-colors" />
            <Zap className="w-8 h-8 text-amber-500 mb-4 relative" />
            <h3 className="text-lg font-black text-slate-900 mb-2 relative">Daily Health Tip</h3>
            <p className="text-sm text-slate-500 leading-relaxed mb-4 relative">
              Based on your recent lab reports, increasing your Vitamin D intake could help improve your energy levels during the winter months.
            </p>
            <button className="text-xs font-black text-blue-600 uppercase tracking-widest hover:text-blue-700 transition-colors">Learn More</button>
          </div>

          <div className="bg-slate-900 p-10 rounded-[3rem] text-white shadow-2xl shadow-slate-200 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/10 rounded-full -mr-20 -mt-20 blur-3xl group-hover:bg-blue-500/20 transition-all" />
            <Shield className="w-10 h-10 text-blue-400 mb-6" />
            <h3 className="text-2xl font-black mb-4 tracking-tight">Patient Advocacy</h3>
            <p className="text-slate-400 text-sm mb-8 leading-relaxed font-medium">
              Need to contact your provider about a billing error or prescription risk? 
              Our AI can generate professional drafts for you.
            </p>
            <button className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black text-sm shadow-xl shadow-blue-900/20 transition-all active:scale-95">
              Generate Advocacy Email
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
