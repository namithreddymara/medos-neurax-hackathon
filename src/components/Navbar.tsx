import React from 'react';
import { 
  LayoutDashboard, 
  FileSearch, 
  ShieldCheck, 
  MessageSquareText, 
  Info,
  Menu,
  X,
  Stethoscope,
  User,
  Languages
} from 'lucide-react';
import { cn } from '../utils';
import { useLanguage } from '../contexts/LanguageContext';
import { Language } from '../translations';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const { language, setLanguage, t } = useLanguage();
  const userName = JSON.parse(localStorage.getItem('medos_profile') || '{}').name;

  const navItems = [
    { id: 'landing', label: t('nav.home'), icon: Stethoscope },
    { id: 'dashboard', label: t('nav.dashboard'), icon: LayoutDashboard },
    { id: 'scanner', label: t('nav.scanner'), icon: FileSearch },
    { id: 'advocacy', label: t('nav.advocacy'), icon: MessageSquareText },
    { id: 'privacy', label: t('nav.privacy'), icon: ShieldCheck },
    { id: 'profile', label: userName ? t('nav.profile') : t('nav.register'), icon: User },
  ];

  const languages: { id: Language; label: string }[] = [
    { id: 'en', label: 'EN' },
    { id: 'hi', label: 'HI' },
    { id: 'te', label: 'TE' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-blue-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab('landing')}>
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
              <ShieldCheck className="text-white w-6 h-6" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-emerald-600">
              MedOS Pro
            </span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
                  activeTab === item.id 
                    ? "bg-blue-50 text-blue-600" 
                    : "text-slate-600 hover:bg-slate-50 hover:text-blue-600"
                )}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </button>
            ))}
            
            <div className="ml-4 flex items-center gap-1 bg-slate-50 p-1 rounded-lg border border-slate-100">
              <Languages className="w-4 h-4 text-slate-400 ml-1 mr-1" />
              {languages.map((lang) => (
                <button
                  key={lang.id}
                  onClick={() => setLanguage(lang.id)}
                  className={cn(
                    "px-2 py-1 rounded text-[10px] font-black transition-all",
                    language === lang.id
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-slate-400 hover:text-slate-600"
                  )}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </div>

          {/* Mobile Toggle */}
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-slate-600">
              {isOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-blue-100 animate-in slide-in-from-top duration-300">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsOpen(false);
                }}
                className={cn(
                  "flex items-center gap-3 w-full px-4 py-3 rounded-lg text-base font-medium",
                  activeTab === item.id 
                    ? "bg-blue-50 text-blue-600" 
                    : "text-slate-600 hover:bg-slate-50"
                )}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </button>
            ))}
            
            <div className="pt-4 mt-4 border-t border-slate-100 px-4 flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-400">
                <Languages className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-widest">Language</span>
              </div>
              <div className="flex gap-2">
                {languages.map((lang) => (
                  <button
                    key={lang.id}
                    onClick={() => setLanguage(lang.id)}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-xs font-black transition-all",
                      language === lang.id
                        ? "bg-blue-600 text-white shadow-md"
                        : "bg-slate-50 text-slate-400"
                    )}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
