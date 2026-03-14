import React, { useState } from 'react';
import { 
  Mail, 
  Send, 
  Copy, 
  Check, 
  MapPin, 
  Search, 
  Hospital, 
  Pill, 
  ShieldAlert,
  Loader2
} from 'lucide-react';
import { useMedicalRecords } from '../hooks/useMedicalRecords';
import { generateAdvocacyEmail, searchNearbyClinics } from '../services/geminiService';
import { cn } from '../utils';

export const AdvocacyPage: React.FC = () => {
  const { records } = useMedicalRecords();
  const [selectedRecordId, setSelectedRecordId] = useState<string>('');
  const [recipientType, setRecipientType] = useState<'hospital' | 'pharmacy' | 'insurance'>('hospital');
  const [generatedEmail, setGeneratedEmail] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [location, setLocation] = useState('');
  const [clinics, setClinics] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleGenerateEmail = async () => {
    const record = records.find(r => r.id === selectedRecordId);
    if (!record || !record.analysis) return;

    setIsGenerating(true);
    try {
      const email = await generateAdvocacyEmail(record.analysis, recipientType);
      setGeneratedEmail(email);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSearchClinics = async () => {
    if (!location) return;
    setIsSearching(true);
    try {
      const results = await searchNearbyClinics(location);
      setClinics(results);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSearching(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedEmail);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="pt-24 pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-12">
        <h1 className="text-3xl font-bold text-slate-900 mb-4">Patient Advocacy Tools</h1>
        <p className="text-slate-600">Empowering you to communicate effectively with healthcare providers and find the care you need.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* Email Generator */}
        <div className="space-y-8">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Mail className="w-6 h-6 text-blue-500" />
              Professional Email Generator
            </h3>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Select Medical Record</label>
                <select 
                  value={selectedRecordId}
                  onChange={(e) => setSelectedRecordId(e.target.value)}
                  className="w-full bg-slate-50 border-slate-100 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 transition-all"
                >
                  <option value="">Choose a record...</option>
                  {records.filter(r => r.analysis).map(r => (
                    <option key={r.id} value={r.id}>{r.fileName} ({r.date})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Recipient Type</label>
                <div className="grid grid-cols-3 gap-3">
                  {(['hospital', 'pharmacy', 'insurance'] as const).map((type) => (
                    <button
                      key={type}
                      onClick={() => setRecipientType(type)}
                      className={cn(
                        "py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border",
                        recipientType === type 
                          ? "bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-100" 
                          : "bg-white text-slate-500 border-slate-100 hover:border-blue-200"
                      )}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleGenerateEmail}
                disabled={!selectedRecordId || isGenerating}
                className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                Generate Advocacy Draft
              </button>
            </div>
          </div>

          {generatedEmail && (
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex justify-between items-center mb-6">
                <h4 className="font-bold text-slate-900">Generated Draft</h4>
                <button 
                  onClick={copyToClipboard}
                  className="flex items-center gap-2 text-blue-600 text-sm font-bold hover:bg-blue-50 px-3 py-1 rounded-lg transition-colors"
                >
                  {isCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {isCopied ? 'Copied!' : 'Copy Text'}
                </button>
              </div>
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 whitespace-pre-wrap text-sm text-slate-700 leading-relaxed font-mono">
                {generatedEmail}
              </div>
            </div>
          )}
        </div>

        {/* Clinic Search */}
        <div className="space-y-8">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <MapPin className="w-6 h-6 text-emerald-500" />
              Find Nearby Care
            </h3>
            
            <div className="flex gap-3 mb-8">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input 
                  type="text" 
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Enter city or zip code..."
                  className="w-full bg-slate-50 border-slate-100 rounded-xl pl-12 pr-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500 transition-all"
                />
              </div>
              <button 
                onClick={handleSearchClinics}
                disabled={isSearching || !location}
                className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all disabled:opacity-50"
              >
                {isSearching ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Search'}
              </button>
            </div>

            <div className="space-y-4">
              {clinics.length > 0 ? (
                clinics.map((clinic, i) => (
                  <div key={i} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-emerald-600 shadow-sm shrink-0">
                      <Pill className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">{clinic.maps?.title || 'Medical Provider'}</p>
                      <p className="text-xs text-slate-500 mb-2">{clinic.maps?.uri || 'Address not available'}</p>
                      <a 
                        href={clinic.maps?.uri} 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-xs font-bold text-emerald-600 flex items-center gap-1 hover:underline"
                      >
                        View on Maps <MapPin className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-slate-300" />
                  </div>
                  <p className="text-slate-400 text-sm">Enter a location to find nearby clinics.</p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-amber-50 p-8 rounded-[2.5rem] border border-amber-100">
            <div className="flex items-center gap-3 mb-4">
              <ShieldAlert className="w-6 h-6 text-amber-600" />
              <h4 className="font-bold text-amber-900">Patient Rights Tip</h4>
            </div>
            <p className="text-amber-800 text-sm leading-relaxed">
              Under the No Surprises Act, you have the right to a "Good Faith Estimate" 
              explaining how much your medical care will cost before you receive it. 
              Always ask for one when scheduling non-emergency services.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
