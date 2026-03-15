import React from 'react';
import { ShieldCheck, Lock, Database, EyeOff, ServerOff, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export const PrivacyPage: React.FC = () => {
  const { t } = useLanguage();
  const [showConfirm, setShowConfirm] = React.useState(false);
  const principles = [
    {
      title: t('privacy.local_storage'),
      desc: t('privacy.local_storage_desc'),
      icon: Database
    },
    {
      title: t('privacy.no_cloud'),
      desc: t('privacy.no_cloud_desc'),
      icon: ServerOff
    },
    {
      title: t('privacy.zero_tracking'),
      desc: t('privacy.zero_tracking_desc'),
      icon: EyeOff
    },
    {
      title: t('privacy.encrypted_sessions'),
      desc: t('privacy.encrypted_sessions_desc'),
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
        <h1 className="text-4xl font-bold text-slate-900 mb-4">{t('privacy.principles_title')}</h1>
        <p className="text-slate-600 max-w-2xl mx-auto">
          {t('privacy.principles_subtitle')}
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
          <h2 className="text-2xl font-bold mb-8">{t('privacy.safeguards_title')}</h2>
          <div className="space-y-6">
            {[
              t('privacy.safeguard_1'),
              t('privacy.safeguard_2'),
              t('privacy.safeguard_3'),
              t('privacy.safeguard_4'),
              t('privacy.safeguard_5')
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4">
                <CheckCircle2 className="text-emerald-400 w-5 h-5 shrink-0" />
                <span className="text-slate-300 font-medium">{item}</span>
              </div>
            ))}
          </div>
          <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-slate-400 text-sm">{t('privacy.last_updated')}</p>
            <button className="px-6 py-3 bg-white text-slate-900 rounded-xl font-bold text-sm hover:bg-slate-100 transition-colors">
              {t('privacy.download_whitepaper')}
            </button>
          </div>
        </div>
      </div>

      <div className="bg-red-50 rounded-[2.5rem] p-10 border border-red-100">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-xl">
            <h3 className="text-2xl font-bold text-slate-900 mb-2">{t('privacy.data_control_title')}</h3>
            <p className="text-slate-600">
              {t('privacy.data_control_desc')}
            </p>
          </div>
          
          {!showConfirm ? (
            <button 
              onClick={() => setShowConfirm(true)}
              className="px-8 py-4 bg-red-600 text-white rounded-2xl font-bold hover:bg-red-700 transition-all shadow-lg shadow-red-100 shrink-0"
            >
              {t('privacy.delete_all')}
            </button>
          ) : (
            <div className="flex flex-col gap-3 shrink-0">
              <p className="text-red-600 font-bold text-sm text-center">{t('privacy.confirm_delete')}</p>
              <div className="flex gap-2">
                <button 
                  onClick={handleDeleteAll}
                  className="px-6 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-all text-sm"
                >
                  {t('privacy.yes_delete')}
                </button>
                <button 
                  onClick={() => setShowConfirm(false)}
                  className="px-6 py-3 bg-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-300 transition-all text-sm"
                >
                  {t('privacy.cancel')}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
