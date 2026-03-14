import React from 'react';
import { ShieldCheck, Lock, Database, EyeOff, ServerOff, CheckCircle2 } from 'lucide-react';

export const PrivacyPage: React.FC = () => {
  const [showConfirm, setShowConfirm] = React.useState(false);
  const principles = [
    {
      title: "Local-First Storage",
      desc: "Your medical records are stored directly on your device using IndexedDB and LocalStorage. We don't have a central database of your documents.",
      icon: Database
    },
    {
      title: "No Cloud Persistence",
      desc: "When you upload a document for analysis, the text is processed by AI and the results are returned to your device. We do not store these files in the cloud.",
      icon: ServerOff
    },
    {
      title: "Zero Tracking",
      desc: "We don't use invasive tracking pixels or sell your health data to third parties. Your health journey is private and belongs to you.",
      icon: EyeOff
    },
    {
      title: "Encrypted Sessions",
      desc: "All communication between your browser and the AI engine is encrypted using industry-standard TLS protocols.",
      icon: Lock
    }
  ];

  const handleDeleteAll = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <div className="pt-24 pb-12 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center mx-auto mb-6 text-blue-600 shadow-lg shadow-blue-100">
          <ShieldCheck className="w-10 h-10" />
        </div>
        <h1 className="text-4xl font-bold text-slate-900 mb-4">Privacy & Security</h1>
        <p className="text-slate-600 max-w-2xl mx-auto">
          At MedOS Pro, we believe health data privacy is a fundamental human right. 
          Our architecture is designed to give you total control.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-16">
        {principles.map((p, i) => (
          <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 text-blue-600">
              <p.icon className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">{p.title}</h3>
            <p className="text-slate-600 leading-relaxed text-sm">{p.desc}</p>
          </div>
        ))}
      </div>

      <div className="bg-slate-900 rounded-[3rem] p-12 text-white relative overflow-hidden mb-12">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[80px] rounded-full" />
        <div className="relative z-10">
          <h2 className="text-2xl font-bold mb-8">Technical Safeguards</h2>
          <div className="space-y-6">
            {[
              "End-to-end encryption for AI processing",
              "Client-side data sanitization before analysis",
              "No permanent storage of uploaded PDF/Image files",
              "Open-source transparency for core processing logic",
              "Regular security audits of AI integration patterns"
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4">
                <CheckCircle2 className="text-emerald-400 w-5 h-5 shrink-0" />
                <span className="text-slate-300 font-medium">{item}</span>
              </div>
            ))}
          </div>
          <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-slate-400 text-sm">Last Updated: March 2026</p>
            <button className="px-6 py-3 bg-white text-slate-900 rounded-xl font-bold text-sm hover:bg-slate-100 transition-colors">
              Download Privacy Whitepaper
            </button>
          </div>
        </div>
      </div>

      <div className="bg-red-50 rounded-[2.5rem] p-10 border border-red-100">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-xl">
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Data Control & Deletion</h3>
            <p className="text-slate-600">
              You have absolute control over your data. Since all your medical records and profile information are stored locally on this device, 
              you can wipe everything instantly. This action is irreversible.
            </p>
          </div>
          
          {!showConfirm ? (
            <button 
              onClick={() => setShowConfirm(true)}
              className="px-8 py-4 bg-red-600 text-white rounded-2xl font-bold hover:bg-red-700 transition-all shadow-lg shadow-red-100 shrink-0"
            >
              Delete All My Data
            </button>
          ) : (
            <div className="flex flex-col gap-3 shrink-0">
              <p className="text-red-600 font-bold text-sm text-center">Are you absolutely sure?</p>
              <div className="flex gap-2">
                <button 
                  onClick={handleDeleteAll}
                  className="px-6 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-all text-sm"
                >
                  Yes, Delete All
                </button>
                <button 
                  onClick={() => setShowConfirm(false)}
                  className="px-6 py-3 bg-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-300 transition-all text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
