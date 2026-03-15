import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { LandingPage } from './pages/LandingPage';
import { Dashboard } from './pages/Dashboard';
import { ScannerPage } from './pages/ScannerPage';
import { InsightsPage } from './pages/InsightsPage';
import { AdvocacyPage } from './pages/AdvocacyPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { ProfilePage } from './pages/ProfilePage';
import { MedicalRecord, UserProfile } from './types';
import { motion, AnimatePresence } from 'framer-motion';
import { ChatBot } from './components/ChatBot';
import { useMedicalRecords } from './hooks/useMedicalRecords';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';

const AppContent = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('landing');
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null);
  const { records } = useMedicalRecords();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('medos_profile');
    return saved ? JSON.parse(saved) : null;
  });

  const handleSaveProfile = (profile: UserProfile) => {
    setUserProfile(profile);
    localStorage.setItem('medos_profile', JSON.stringify(profile));
  };

  const handleAnalysisComplete = (record: MedicalRecord) => {
    setSelectedRecord(record);
    setActiveTab('insights');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'landing':
        return <LandingPage onStart={() => setActiveTab('scanner')} />;
      case 'dashboard':
        return <Dashboard />;
      case 'scanner':
        return <ScannerPage onAnalysisComplete={handleAnalysisComplete} />;
      case 'insights':
        return selectedRecord ? (
          <InsightsPage 
            record={selectedRecord} 
            onBack={() => setActiveTab('dashboard')} 
            onAdvocacy={() => setActiveTab('advocacy')}
          />
        ) : <Dashboard />;
      case 'advocacy':
        return <AdvocacyPage />;
      case 'privacy':
        return <PrivacyPage />;
      case 'profile':
        return <ProfilePage profile={userProfile} onSave={handleSaveProfile} />;
      default:
        return <LandingPage onStart={() => setActiveTab(userProfile ? 'scanner' : 'profile')} />;
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>

      <ChatBot records={records} />

      <footer className="bg-slate-50 border-t border-slate-100 py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">M</span>
              </div>
              <span className="text-lg font-bold text-slate-900">MedOS Pro</span>
            </div>
            <div className="flex gap-8 text-sm font-medium text-slate-500">
              <button onClick={() => setActiveTab('privacy')} className="hover:text-blue-600">{t('footer.privacy_policy')}</button>
              <button className="hover:text-blue-600">{t('footer.terms')}</button>
              <button className="hover:text-blue-600">{t('footer.contact')}</button>
            </div>
            <p className="text-slate-400 text-sm">
              {t('footer.copyright')}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}
