export interface Community {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  category: string;
  isPrivate: boolean;
  tags: string[];
  createdAt: string;
  lastActivity: string;
  moderators: string[];
  rules?: string[];
  resources?: CommunityResource[];
}

export interface CommunityResource {
  id: string;
  title: string;
  type: 'article' | 'video' | 'document' | 'link';
  url: string;
  description: string;
  addedBy: string;
  addedAt: string;
}

export interface ClinicalTrial {
  id: string;
  title: string;
  description: string;
  phase: string;
  status: 'recruiting' | 'active' | 'completed' | 'suspended';
  sponsor: string;
  location: string;
  eligibilityCriteria: string[];
  primaryEndpoint: string;
  estimatedEnrollment: number;
  currentEnrollment: number;
  startDate: string;
  estimatedCompletionDate: string;
  contactInfo: ContactInfo;
  conditions?: string[];
  interventions?: string[];
}

export interface ContactInfo {
  name: string;
  email: string;
  phone: string;
}

export interface PatientMatch {
  id: string;
  patientId: string;
  age: number;
  gender: string;
  condition: string;
  stage?: string;
  location: string;
  matchScore: number;
  eligibleStudies: string[];
  lastActive: string;
}

export interface ResearcherMatch {
  id: string;
  researcherId: string;
  name: string;
  institution: string;
  specialization: string;
  activeStudies: number;
  location: string;
  matchScore: number;
  verificationStatus: 'verified' | 'pending' | 'unverified';
}

export interface SearchFilters {
  condition?: string;
  location?: string;
  ageRange?: [number, number];
  gender?: string;
  studyPhase?: string;
  category?: string;
}