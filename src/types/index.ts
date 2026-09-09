/**
 * BIS Sahayak AI - Type Definitions
 * Problem Statement 26107: AI-powered Intelligent Assistant for Indian Standards & BIS Services
 */

export type ReliabilityLevel = 'VERIFIED' | 'NEEDS_VERIFICATION' | 'NOT_VERIFIED';

export type LanguageCode = 'en' | 'hi' | 'or' | 'bn' | 'te' | 'ta' | 'mr';

export interface BISClause {
  clauseNumber: string;
  clauseTitle: string;
  requirement: string;
  page?: number;
  mandatory: boolean;
}

export interface BISTestRequirement {
  testName: string;
  clauseRef: string;
  purpose: string;
  parameters: string;
  sampleSize?: string;
  page?: number;
}

export interface BISLaboratory {
  id: string;
  name: string;
  city: string;
  state: string;
  category: 'Central' | 'Regional' | 'Branch' | 'NABL-Recognized';
  recognizedStandards: string[];
  recognitionStatus: 'Valid / Active' | 'Needs Verification with Portal';
  accreditationScope: string;
  officialSource: string;
  verificationDate: string;
  contactEmail?: string;
  address?: string;
}

export interface BISStandard {
  id: string;
  standardNumber: string; // e.g. "IS 17526:2021"
  title: string;
  year: number;
  edition?: string;
  amendmentNumber?: string;
  category: string; // e.g. "Mechanical / Domestic Utensils", "Electrical", "Food & Water"
  keywords: string[];
  productsCovered: string[];
  scopeSummary: string;
  certificationScheme: 'Scheme I (ISI Mark)' | 'Scheme II (Registration - CRS)' | 'Scheme IV (CoC)' | 'Hallmarking Scheme';
  qcoMandatory: boolean; // Quality Control Order status
  qcoNotificationNumber?: string;
  qcoEffectiveDate?: string;
  documentType: 'Gazette Quality Control Order' | 'Indian Standard Specification' | 'Product Manual' | 'Technical Regulation';
  publicationDate: string;
  effectiveDate: string;
  clauses: BISClause[];
  testRequirements: BISTestRequirement[];
  eligibleLaboratories: string[];
  status: 'Current' | 'Under Revision' | 'Superseded';
  supersededBy?: string;
  supersededWarning?: string;
  version: string;
  lastUpdated: string;
  sourceUrl: string;
  sourceDocument: string;
  verificationStatus: 'Verified Official BIS' | 'Needs Verification' | 'Demo Data';
}

export interface ProductUnderstanding {
  identifiedProduct: string;
  intent: 'Find Standard' | 'Certification Process' | 'Testing Requirement' | 'Hallmarking' | 'Consumer Query' | 'General Information';
  identifiedMaterial?: string;
  identifiedUse?: string;
  electricalStatus?: 'Electrical' | 'Non-Electrical' | 'Not Specified';
  commercialStatus?: 'Commercial' | 'Domestic' | 'Both';
  mfgImportStatus?: 'Manufacturing in India' | 'Importing to India' | 'Consumer Verification';
  confidenceNotes?: string;
}

export interface DecomposedTask {
  taskTitle: string; // e.g. "1. Applicable Standard", "2. Mandatory / QCO Status", "3. Testing Requirements", "4. Authorized Laboratory", "5. Certification Process"
  finding: string;
  confidence: ReliabilityLevel;
  sourceRef?: string;
}

export interface StructuredAIResponse {
  // 11. Visually structured 7 sections
  understandingText: string;
  answer: string;
  applicableStandardDetails?: {
    standardNumber: string;
    title: string;
    status: 'Current' | 'Under Revision' | 'Superseded';
    supersededWarning?: string;
    amendment?: string;
    edition?: string;
  };
  requirementsSummary?: {
    keyClauses: string[];
    testingParameters: string[];
  };
  importantNotes?: string[];
  nextSteps?: string[];
  
  productUnderstanding?: ProductUnderstanding;
  potentiallyApplicableStandards: {
    standardNumber: string;
    title: string;
    whyItMayApply: string;
    relevantScope: string;
    status: 'Current' | 'Under Revision' | 'Superseded';
    supersededWarning?: string;
    sourceDoc: string;
    clauseRef?: string;
    edition?: string;
    pageRef?: number;
  }[];
  certificationGuidance?: {
    schemeName: string;
    isMandatoryByQCO: boolean;
    qcoReference?: string;
    legalMandateText: string;
    keySteps: string[];
  };
  testingGuidance?: {
    requiredTests: string[];
    samplePreparation?: string;
    relevantLabs: string[];
  };
  // 2. Comprehensive Source Cards
  sources: {
    documentName: string;
    standardNumber?: string;
    clause?: string;
    section?: string;
    page?: number | string;
    version?: string;
    documentType?: string;
    lastUpdated?: string;
    retrievalDate?: string;
    officialPortalUrl?: string;
    isAuthoritative: boolean;
    isDemoData?: boolean;
    excerpt?: string;
  }[];
  reliabilityLevel: ReliabilityLevel;
  reliabilityReason: string;
  evidenceReasoning?: string; // For "Why am I seeing this answer?" transparency view
  decomposedTasks?: DecomposedTask[]; // 12. Complex question multi-part breakdown
  followUpQuestions?: string[];
  disclaimer: string;
  isDemoData?: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  timestamp: string;
  rawText?: string;
  structuredResponse?: StructuredAIResponse;
  isError?: boolean;
  errorMessage?: string;
}

export interface SavedItem {
  id: string;
  type: 'standard' | 'answer' | 'guide';
  title: string;
  referenceCode: string;
  dateSaved: string;
  snippet: string;
  metadata?: Record<string, unknown>;
}

export interface AdminDocument {
  id: string;
  standardNumber: string;
  title: string;
  category: string;
  version: string;
  edition: string;
  amendment: string;
  lastUpdated: string;
  indexStatus: 'Indexed' | 'Pending' | 'Re-indexing Required';
  status: 'Current' | 'Under Revision' | 'Superseded';
  supersededBy?: string;
  totalClauses: number;
  qcoStatus: string;
  sourceType: string;
  verificationStatus: 'Verified Official BIS' | 'Needs Verification' | 'Demo Data';
}
