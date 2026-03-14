import { useState, useEffect } from 'react';
import { MedicalRecord } from '../types';

const STORAGE_KEY = 'medos_pro_records';

export const useMedicalRecords = () => {
  const [records, setRecords] = useState<MedicalRecord[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setRecords(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse records", e);
      }
    }
  }, []);

  const saveRecord = (record: MedicalRecord) => {
    const updated = [record, ...records];
    setRecords(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const deleteRecord = (id: string) => {
    const updated = records.filter(r => r.id !== id);
    setRecords(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const updateRecord = (record: MedicalRecord) => {
    const updated = records.map(r => r.id === record.id ? record : r);
    setRecords(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  return { records, saveRecord, deleteRecord, updateRecord };
};
