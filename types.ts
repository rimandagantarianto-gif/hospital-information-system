export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female';
  condition: string;
  lastVisit: string;
  admissionStatus: 'Inpatient' | 'Outpatient' | 'Discharged';
  fhirResource: string; // Simulated raw FHIR JSON string
  clinicalNotes: string;
}

export interface FinancialRecord {
  month: string;
  revenue: number;
  expenses: number;
  payroll: number;
  patientCount: number;
}

export enum ViewState {
  DASHBOARD = 'DASHBOARD',
  CLINICAL = 'CLINICAL',
  FINANCIAL = 'FINANCIAL',
  SEARCH = 'SEARCH'
}

export interface AiResponse {
  text: string;
  loading: boolean;
  error: string | null;
}
