import { Patient, FinancialRecord } from './types';

export const MOCK_PATIENTS: Patient[] = [
  {
    id: "P-1001",
    name: "Budi Santoso",
    age: 45,
    gender: "Male",
    condition: "Type 2 Diabetes",
    lastVisit: "2023-10-15",
    admissionStatus: "Outpatient",
    clinicalNotes: "Patient reports increased thirst and frequent urination. Fasting blood glucose 180 mg/dL. HbA1c 8.2%. Complains of tingling in feet (neuropathy). Medication adherence is poor due to cost concerns.",
    fhirResource: JSON.stringify({
      resourceType: "Patient",
      id: "P-1001",
      name: [{ family: "Santoso", given: ["Budi"] }],
      gender: "male",
      birthDate: "1979-05-20",
      condition: [{ code: "E11.9", display: "Type 2 diabetes mellitus without complications" }]
    }, null, 2)
  },
  {
    id: "P-1002",
    name: "Siti Aminah",
    age: 62,
    gender: "Female",
    condition: "Hypertension",
    lastVisit: "2023-10-20",
    admissionStatus: "Inpatient",
    clinicalNotes: "Admitted for hypertensive crisis. BP 190/110. complaining of severe headache and blurred vision. ECG shows LVH. Administered IV labetalol. Monitoring renal function.",
    fhirResource: JSON.stringify({
      resourceType: "Patient",
      id: "P-1002",
      name: [{ family: "Aminah", given: ["Siti"] }],
      gender: "female",
      birthDate: "1962-02-12",
      condition: [{ code: "I10", display: "Essential (primary) hypertension" }]
    }, null, 2)
  },
  {
    id: "P-1003",
    name: "Rahmat Hidayat",
    age: 28,
    gender: "Male",
    condition: "Post-Op Appendectomy",
    lastVisit: "2023-10-22",
    admissionStatus: "Inpatient",
    clinicalNotes: "Post-operative day 2. Incision site clean, no sign of infection. Pain managed with oral analgesics. Tolerating soft diet. Bowel sounds present. Plan for discharge tomorrow if stable.",
    fhirResource: JSON.stringify({
      resourceType: "Patient",
      id: "P-1003",
      name: [{ family: "Hidayat", given: ["Rahmat"] }],
      gender: "male",
      birthDate: "1995-11-05",
      procedure: [{ code: "47.0", display: "Appendectomy" }]
    }, null, 2)
  },
  {
    id: "P-1004",
    name: "Linda Kusuma",
    age: 34,
    gender: "Female",
    condition: "Asthma Exacerbation",
    lastVisit: "2023-10-25",
    admissionStatus: "Outpatient",
    clinicalNotes: "Presented with wheezing and shortness of breath triggered by dust. O2 Sat 94% on room air. Nebulizer treatment given. Prescribed corticosteroid inhaler. Review technique.",
    fhirResource: JSON.stringify({
      resourceType: "Patient",
      id: "P-1004",
      name: [{ family: "Kusuma", given: ["Linda"] }],
      gender: "female",
      birthDate: "1989-08-30",
      condition: [{ code: "J45", display: "Asthma" }]
    }, null, 2)
  }
];

export const MOCK_FINANCIALS: FinancialRecord[] = [
  { month: 'Jun', revenue: 1200000000, expenses: 850000000, payroll: 400000000, patientCount: 450 },
  { month: 'Jul', revenue: 1350000000, expenses: 900000000, payroll: 410000000, patientCount: 520 },
  { month: 'Aug', revenue: 1100000000, expenses: 880000000, payroll: 405000000, patientCount: 410 },
  { month: 'Sep', revenue: 1450000000, expenses: 950000000, payroll: 420000000, patientCount: 580 },
  { month: 'Oct', revenue: 1600000000, expenses: 1050000000, payroll: 450000000, patientCount: 650 },
];
