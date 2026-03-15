import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, 
  Camera, 
  FileUp, 
  X, 
  Loader2, 
  CheckCircle2, 
  AlertCircle,
  FileText,
  Stethoscope,
  Receipt,
  ClipboardList,
  ShieldCheck
} from 'lucide-react';
import { analyzeMedicalDocument } from '../services/geminiService';
import { useMedicalRecords } from '../hooks/useMedicalRecords';
import { MedicalRecord } from '../types';
import { cn } from '../utils';
import { useLanguage } from '../contexts/LanguageContext';

interface ScannerPageProps {
  onAnalysisComplete: (record: MedicalRecord) => void;
}

export const ScannerPage: React.FC<ScannerPageProps> = ({ onAnalysisComplete }) => {
  const { t, language } = useLanguage();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedType, setSelectedType] = useState<MedicalRecord['type']>('prescription');
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { saveRecord } = useMedicalRecords();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);
    setUploadProgress(10);

    try {
      setUploadProgress(30);
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        const dataUrl = e.target?.result as string;
        setUploadProgress(50);

        let documentText = "";
        if (file.type === "text/plain") {
          documentText = await file.text();
        } else {
          documentText = `Medical ${selectedType} document: ${file.name}`;
        }

        setUploadProgress(70);
        try {
          const analysis = await analyzeMedicalDocument(documentText, selectedType, language, {
            data: dataUrl,
            mimeType: file.type || 'application/pdf'
          });

          const newRecord: MedicalRecord = {
            id: Math.random().toString(36).substr(2, 9),
            date: new Date().toLocaleDateString(),
            type: selectedType,
            fileName: file.name,
            content: documentText,
            analysis
          };

          setUploadProgress(100);
          setTimeout(() => {
            saveRecord(newRecord);
            onAnalysisComplete(newRecord);
            setIsUploading(false);
          }, 500);
        } catch (analysisErr: any) {
          console.error("Analysis Error:", analysisErr);
          setError(analysisErr.message || "AI analysis failed. The document might be too complex or the format is unsupported.");
          setIsUploading(false);
        }
      };

      if (file.type === "text/plain") {
        reader.readAsText(file);
      } else {
        reader.readAsDataURL(file);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to analyze document. Please try again.");
      setIsUploading(false);
    }
  };

  const docTypes = [
    { id: 'prescription', label: t('scanner.types.prescription'), icon: Stethoscope, color: 'text-blue-500', bg: 'bg-blue-50' },
    { id: 'lab_report', label: t('scanner.types.lab_report'), icon: ClipboardList, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { id: 'hospital_bill', label: t('scanner.types.hospital_bill'), icon: Receipt, color: 'text-amber-500', bg: 'bg-amber-50' },
    { id: 'other', label: t('scanner.types.other'), icon: FileText, color: 'text-slate-500', bg: 'bg-slate-50' },
  ];

  return (
    <div className="pt-24 pb-12 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-black text-slate-900 mb-6 tracking-tighter leading-tight">{t('scanner.title')}</h1>
        <p className="text-lg text-slate-500 font-medium max-w-2xl mx-auto">{t('scanner.subtitle')}</p>
      </div>

      <div className="bg-white rounded-[3rem] border border-slate-100 shadow-2xl overflow-hidden">
        <div className="p-10 md:p-16">
          <div className="mb-12">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-8">{t('scanner.select_type')}</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {docTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setSelectedType(type.id as any)}
                  className={cn(
                    "flex flex-col items-center gap-4 p-8 rounded-[2rem] border-2 transition-all group",
                    selectedType === type.id 
                      ? "border-blue-500 bg-blue-50/30 shadow-lg shadow-blue-100" 
                      : "border-slate-100 hover:border-blue-200 hover:bg-slate-50"
                  )}
                >
                  <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform", type.bg)}>
                    <type.icon className={cn("w-7 h-7", type.color)} />
                  </div>
                  <span className="text-sm font-black text-slate-700 uppercase tracking-wider">{type.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="mb-12">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-8">{t('scanner.upload_scan')}</h3>
            
            <AnimatePresence mode="wait">
              {!isUploading ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="grid md:grid-cols-2 gap-8"
                >
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="group cursor-pointer border-2 border-dashed border-slate-200 rounded-[2.5rem] p-16 flex flex-col items-center justify-center text-center hover:border-blue-400 hover:bg-blue-50/30 transition-all active:scale-95"
                  >
                    <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-blue-100">
                      <Upload className="w-10 h-10 text-blue-600" />
                    </div>
                    <h4 className="text-xl font-black text-slate-900 mb-2">{t('scanner.upload_file')}</h4>
                    <p className="text-sm text-slate-400 font-bold uppercase tracking-widest">PDF, JPG, PNG or Text</p>
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      className="hidden" 
                      onChange={handleFileUpload}
                      accept=".pdf,.jpg,.jpeg,.png,.txt"
                    />
                  </div>

                  <div className="group cursor-pointer border-2 border-dashed border-slate-200 rounded-[2.5rem] p-16 flex flex-col items-center justify-center text-center hover:border-emerald-400 hover:bg-emerald-50/30 transition-all active:scale-95">
                    <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-emerald-100">
                      <Camera className="w-10 h-10 text-emerald-600" />
                    </div>
                    <h4 className="text-xl font-black text-slate-900 mb-2">{t('scanner.camera_scan')}</h4>
                    <p className="text-sm text-slate-400 font-bold uppercase tracking-widest">Use device camera</p>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-slate-50 rounded-[2.5rem] p-16 flex flex-col items-center justify-center text-center"
                >
                  <div className="relative w-32 h-32 mb-10">
                    <svg className="w-full h-full" viewBox="0 0 100 100">
                      <circle
                        className="text-slate-200 stroke-current"
                        strokeWidth="6"
                        cx="50"
                        cy="50"
                        r="44"
                        fill="transparent"
                      ></circle>
                      <circle
                        className="text-blue-600 stroke-current transition-all duration-500 ease-out"
                        strokeWidth="6"
                        strokeDasharray={276.32}
                        strokeDashoffset={276.32 - (276.32 * uploadProgress) / 100}
                        strokeLinecap="round"
                        cx="50"
                        cy="50"
                        r="44"
                        fill="transparent"
                      ></circle>
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
                    </div>
                  </div>
                  <h4 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">
                    {uploadProgress < 100 ? t('scanner.analyzing') : t('scanner.finalizing')}
                  </h4>
                  <p className="text-slate-500 font-medium max-w-xs mx-auto leading-relaxed">
                    {uploadProgress < 50 ? t('scanner.extracting') : 
                     uploadProgress < 80 ? t('scanner.identifying') :
                     t('scanner.almost_there')}
                  </p>
                  <div className="mt-10 w-full max-w-xs bg-slate-200 h-3 rounded-full overflow-hidden shadow-inner">
                    <div 
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 h-full transition-all duration-500" 
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {error && (
            <div className="flex items-center gap-3 p-4 bg-red-50 text-red-600 rounded-2xl border border-red-100">
              <AlertCircle className="w-5 h-5" />
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}
        </div>

        <div className="bg-slate-50 p-8 border-t border-slate-100 flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-blue-600 shadow-sm">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <p className="text-sm text-slate-600">
            <span className="font-bold text-slate-900">{t('scanner.privacy_note')}</span> {t('scanner.privacy_desc')}
          </p>
        </div>
      </div>
    </div>
  );
};
