export interface MedicalRecord {
  id: string;
  date: string;
  type: 'prescription' | 'lab_report' | 'hospital_bill' | 'other';
  fileName: string;
  content: string; // Raw text extracted or OCR'd
  analysis?: MedicalAnalysis;
}

export interface UserProfile {
  name: string;
  email: string;
  age?: number;
  bloodType?: string;
  allergies?: string[];
  emergencyContact?: string;
}

export interface MedicalAnalysis {
  summary: string;
  risks: RiskAlert[];
  explanations: MedicalTermExplanation[];
  billingDiscrepancies?: BillingError[];
  medications?: Medication[];
  recommendedActions: string[];
  nutritionPlan?: NutritionPlan;
}

export interface NutritionPlan {
  dietaryFocus: string;
  allowedFoods: string[];
  restrictedFoods: string[];
  mealSuggestions: string[];
  hydrationAdvice: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface RiskAlert {
  level: 'low' | 'medium' | 'high';
  title: string;
  description: string;
}

export interface MedicalTermExplanation {
  term: string;
  simpleExplanation: string;
}

export interface BillingError {
  item: string;
  issue: string;
  suggestedAction: string;
}

export interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  purpose: string;
  sideEffects: string[];
}

export interface HealthStats {
  sleep: number[];
  energy: number[];
  recovery: number[];
  dates: string[];
}
