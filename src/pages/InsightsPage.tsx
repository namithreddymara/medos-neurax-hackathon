import React from 'react';
import { motion } from 'framer-motion';
import { 
  AlertTriangle, 
  CheckCircle2, 
  Info, 
  ArrowLeft, 
  FileText, 
  Pill, 
  Receipt,
  Mail,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { MedicalRecord } from '../types';
import { cn } from '../utils';

interface InsightsPageProps {
  record: MedicalRecord;
  onBack: () => void;
  onAdvocacy: () => void;
}

export const InsightsPage: React.FC<InsightsPageProps> = ({ record, onBack, onAdvocacy }) => {
  const analysis = record.analysis;
  if (!analysis) return null;

  return (
    <div className="pt-24 pb-12 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-slate-500 hover:text-blue-600 font-bold mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </button>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column: Summary & Main Content */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
                <FileText className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">AI Analysis Insights</h1>
                <p className="text-slate-500">{record.fileName} • {record.date}</p>
              </div>
            </div>

            <div className="prose prose-slate max-w-none">
              <h3 className="text-lg font-bold text-slate-900 mb-3">Executive Summary</h3>
              <p className="text-slate-600 leading-relaxed bg-slate-50 p-6 rounded-2xl border border-slate-100">
                {analysis.summary}
              </p>
            </div>
          </div>

          {/* Medical Term Explanations */}
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Info className="w-5 h-5 text-blue-500" />
              Medical Language Simplified
            </h3>
            <div className="space-y-4">
              {analysis.explanations.map((item, i) => (
                <div key={i} className="p-6 bg-blue-50/30 rounded-2xl border border-blue-50">
                  <p className="font-bold text-blue-900 mb-1">{item.term}</p>
                  <p className="text-slate-600 text-sm">{item.simpleExplanation}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Billing Discrepancies if any */}
          {analysis.billingDiscrepancies && analysis.billingDiscrepancies.length > 0 && (
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Receipt className="w-5 h-5 text-amber-500" />
                Billing Audit Results
              </h3>
              <div className="space-y-4">
                {analysis.billingDiscrepancies.map((error, i) => (
                  <div key={i} className="p-6 bg-amber-50/50 rounded-2xl border border-amber-100">
                    <div className="flex justify-between items-start mb-2">
                      <p className="font-bold text-slate-900">{error.item}</p>
                      <span className="px-2 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded-lg">Potential Error</span>
                    </div>
                    <p className="text-slate-600 text-sm mb-4">{error.issue}</p>
                    <div className="flex items-center gap-2 text-amber-700 text-sm font-bold">
                      <ChevronRight className="w-4 h-4" />
                      Action: {error.suggestedAction}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Medications if any */}
          {analysis.medications && analysis.medications.length > 0 && (
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Pill className="w-5 h-5 text-indigo-500" />
                Medication Breakdown
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                {analysis.medications.map((med, i) => (
                  <div key={i} className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="font-bold text-slate-900 mb-1">{med.name}</p>
                    <p className="text-xs text-slate-500 mb-3">{med.dosage} • {med.frequency}</p>
                    <div className="space-y-2">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Purpose</p>
                      <p className="text-sm text-slate-600">{med.purpose}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Risks & Actions */}
        <div className="space-y-8">
          {/* Risk Alerts */}
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              Detected Risks
            </h3>
            <div className="space-y-4">
              {analysis.risks.map((risk, i) => (
                <div key={i} className={cn(
                  "p-6 rounded-2xl border",
                  risk.level === 'high' ? 'bg-red-50 border-red-100' : 'bg-amber-50 border-amber-100'
                )}>
                  <div className="flex items-center gap-2 mb-2">
                    <div className={cn(
                      "w-2 h-2 rounded-full",
                      risk.level === 'high' ? 'bg-red-500' : 'bg-amber-500'
                    )} />
                    <p className={cn(
                      "font-bold text-sm uppercase tracking-wider",
                      risk.level === 'high' ? 'text-red-700' : 'text-amber-700'
                    )}>{risk.level} Risk</p>
                  </div>
                  <p className="font-bold text-slate-900 mb-1">{risk.title}</p>
                  <p className="text-slate-600 text-sm">{risk.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended Actions */}
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              Recommended Actions
            </h3>
            <div className="space-y-3">
              {analysis.recommendedActions.map((action, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3 h-3" />
                  </div>
                  <p className="text-sm text-slate-700 font-medium">{action}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 space-y-3">
              <button 
                onClick={onAdvocacy}
                className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold text-sm shadow-lg shadow-blue-100 flex items-center justify-center gap-2"
              >
                <Mail className="w-4 h-4" /> Generate Advocacy Email
              </button>
              <button className="w-full py-4 bg-slate-50 text-slate-600 rounded-2xl font-bold text-sm border border-slate-100 flex items-center justify-center gap-2">
                <ExternalLink className="w-4 h-4" /> Find Nearby Clinics
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
