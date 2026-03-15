import React from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  Zap, 
  Search, 
  FileText, 
  Mail, 
  Lock, 
  ArrowRight,
  CheckCircle2
} from 'lucide-react';
import { cn } from '../utils';
import { useLanguage } from '../contexts/LanguageContext';

interface LandingPageProps {
  onStart: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  const { t } = useLanguage();
  const features = [
    {
      title: t('landing.feature_1_title'),
      desc: t('landing.feature_1_desc'),
      icon: FileText,
      color: "bg-blue-500"
    },
    {
      title: t('landing.feature_2_title'),
      desc: t('landing.feature_2_desc'),
      icon: Shield,
      color: "bg-emerald-500"
    },
    {
      title: t('landing.feature_3_title'),
      desc: t('landing.feature_3_desc'),
      icon: Search,
      color: "bg-amber-500"
    },
    {
      title: t('landing.feature_4_title'),
      desc: t('landing.feature_4_desc'),
      icon: Mail,
      color: "bg-indigo-500"
    }
  ];

  const steps = [
    t('landing.step_1'),
    t('landing.step_2'),
    t('landing.step_3'),
    t('landing.step_4'),
    t('landing.step_5'),
    t('landing.step_6')
  ];

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 lg:py-28">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-400/20 blur-[140px] rounded-full animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-400/20 blur-[140px] rounded-full animate-pulse" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 backdrop-blur-md text-blue-600 text-[10px] font-black uppercase tracking-[0.2em] mb-8 border border-blue-100 shadow-sm">
              <Zap className="w-3.5 h-3.5 fill-blue-600" /> {t('landing.privacy_badge')}
            </div>
            <h1 className="text-6xl md:text-8xl font-black text-slate-900 mb-8 tracking-tighter leading-[0.9]">
              {t('landing.hero_title_1')} <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-600">
                {t('landing.hero_title_2')}
              </span>
            </h1>
            <p className="text-xl text-slate-500 max-w-2xl mx-auto mb-12 leading-relaxed font-medium">
              {t('landing.hero_subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <button
                onClick={onStart}
                className="px-10 py-5 bg-slate-900 text-white rounded-2xl font-bold text-lg shadow-2xl shadow-slate-200 hover:bg-blue-600 hover:shadow-blue-200 transition-all flex items-center gap-3 group active:scale-95"
              >
                {t('landing.get_started')}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <div className="flex items-center gap-3 text-slate-400 text-sm font-bold bg-white/50 backdrop-blur-sm px-6 py-4 rounded-2xl border border-slate-100">
                <Lock className="w-4 h-4 text-emerald-500" /> {t('landing.local_private')}
              </div>
            </div>
          </motion.div>

          {/* Floating Stats / Trust Badges */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {[
              { label: t('landing.trust_1_label'), sub: t('landing.trust_1_sub') },
              { label: t('landing.trust_2_label'), sub: t('landing.trust_2_sub') },
              { label: t('landing.trust_3_label'), sub: t('landing.trust_3_sub') },
              { label: t('landing.trust_4_label'), sub: t('landing.trust_4_sub') }
            ].map((item, i) => (
              <div key={i} className="bg-white/40 backdrop-blur-sm border border-white/60 p-4 rounded-2xl text-center">
                <p className="text-sm font-black text-slate-900 uppercase tracking-wider">{item.label}</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase">{item.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
            <div className="max-w-xl">
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">{t('landing.intelligence_title')}</h2>
              <p className="text-lg text-slate-500 font-medium">{t('landing.intelligence_subtitle')}</p>
            </div>
            <div className="flex gap-2">
              <div className="w-12 h-1 bg-blue-600 rounded-full" />
              <div className="w-4 h-1 bg-slate-200 rounded-full" />
              <div className="w-4 h-1 bg-slate-200 rounded-full" />
            </div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -10 }}
                className="group bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100 hover:shadow-2xl hover:shadow-blue-100 transition-all duration-500"
              >
                <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-8 text-white shadow-xl group-hover:scale-110 transition-transform", f.color)}>
                  <f.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-4 tracking-tight">{f.title}</h3>
                <p className="text-slate-500 font-medium leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold text-slate-900 mb-8">{t('landing.how_it_works')}</h2>
              <div className="space-y-6">
                {steps.map((step, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold shrink-0">
                      {i + 1}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg text-slate-700 font-medium">{step}</span>
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-600 to-emerald-600 p-1 rounded-[2.5rem] shadow-2xl">
              <div className="bg-white rounded-[2.25rem] p-8 aspect-square flex flex-col items-center justify-center text-center">
                <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-6">
                  <Lock className="w-12 h-12 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">{t('landing.privacy_arch_title')}</h3>
                <p className="text-slate-600">
                  {t('landing.privacy_arch_desc')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
