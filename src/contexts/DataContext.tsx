import React, { createContext, useContext, useState } from 'react';
import { Community, ClinicalTrial, PatientMatch, ResearcherMatch } from '../types/data';

interface DataContextType {
  communities: Community[];
  clinicalTrials: ClinicalTrial[];
  patientMatches: PatientMatch[];
  researcherMatches: ResearcherMatch[];
  userDocuments: UserDocument[];
  contactRequests: ContactRequest[];
  searchCommunities: (query: string, filters?: any) => Community[];
  searchTrials: (query: string, filters?: any) => ClinicalTrial[];
  searchPatients: (query: string, filters?: any) => PatientMatch[];
  joinCommunity: (communityId: string) => Promise<void>;
  leaveCommunity: (communityId: string) => Promise<void>;
  requestContact: (targetId: string, message: string) => Promise<void>;
  uploadDocument: (file: File, type: string) => Promise<void>;
  deleteDocument: (documentId: string) => Promise<void>;
  createClinicalTrial: (trialData: any) => Promise<void>;
  respondToContactRequest: (requestId: string, response: 'accept' | 'decline') => Promise<void>;
}

interface UserDocument {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadDate: string;
  url: string;
}

interface ContactRequest {
  id: string;
  fromUserId: string;
  fromUserName: string;
  fromUserType: 'researcher' | 'patient';
  toUserId: string;
  message: string;
  status: 'pending' | 'accepted' | 'declined';
  createdAt: string;
  studyTitle?: string;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [communities] = useState<Community[]>([
    {
      id: '1',
      name: 'Breast Cancer Support',
      description: 'A supportive community for breast cancer patients and survivors',
      memberCount: 0, // Start with 0 members
      category: 'Cancer Support',
      isPrivate: false,
      tags: ['breast-cancer', 'support', 'survivors'],
      createdAt: '2024-01-15T00:00:00Z',
      lastActivity: '2024-03-15T10:30:00Z',
      moderators: ['mod1', 'mod2']
    },
    {
      id: '2',
      name: 'Lung Cancer Research Updates',
      description: 'Latest research and clinical trial information for lung cancer',
      memberCount: 0, // Start with 0 members
      category: 'Research',
      isPrivate: false,
      tags: ['lung-cancer', 'research', 'clinical-trials'],
      createdAt: '2024-02-01T00:00:00Z',
      lastActivity: '2024-03-14T15:45:00Z',
      moderators: ['mod3']
    },
    {
      id: '3',
      name: 'Immunotherapy Experiences',
      description: 'Share experiences and support for immunotherapy treatments',
      memberCount: 0, // Start with 0 members
      category: 'Treatment',
      isPrivate: false,
      tags: ['immunotherapy', 'treatment', 'side-effects'],
      createdAt: '2024-01-20T00:00:00Z',
      lastActivity: '2024-03-15T09:15:00Z',
      moderators: ['mod4', 'mod5']
    }
  ]);

  const [clinicalTrials, setClinicalTrials] = useState<ClinicalTrial[]>([
    {
      id: 'NCT001',
      title: 'Novel Immunotherapy for Advanced Breast Cancer',
      description: 'A Phase II study evaluating the efficacy of a new immunotherapy combination in patients with advanced breast cancer.',
      phase: 'Phase II',
      status: 'recruiting',
      sponsor: 'BioMed Research Institute',
      location: 'Multiple locations',
      eligibilityCriteria: [
        'Age 18-75 years',
        'Confirmed diagnosis of advanced breast cancer',
        'ECOG performance status 0-1',
        'Adequate organ function'
      ],
      primaryEndpoint: 'Overall response rate',
      estimatedEnrollment: 150,
      currentEnrollment: 0, // Start with 0 participants
      startDate: '2024-01-15',
      estimatedCompletionDate: '2025-12-31',
      contactInfo: {
        name: 'Dr. Sarah Johnson',
        email: 'sarah.johnson@biomed.org',
        phone: '+1-555-0123'
      }
    },
    {
      id: 'NCT002',
      title: 'Targeted Therapy for HER2+ Breast Cancer',
      description: 'Phase III randomized controlled trial comparing new targeted therapy with standard of care.',
      phase: 'Phase III',
      status: 'recruiting',
      sponsor: 'Cancer Research Foundation',
      location: 'US and Canada',
      eligibilityCriteria: [
        'Age 21-70 years',
        'HER2-positive breast cancer',
        'No prior targeted therapy',
        'Measurable disease'
      ],
      primaryEndpoint: 'Progression-free survival',
      estimatedEnrollment: 300,
      currentEnrollment: 0, // Start with 0 participants
      startDate: '2023-09-01',
      estimatedCompletionDate: '2026-03-31',
      contactInfo: {
        name: 'Dr. Michael Chen',
        email: 'michael.chen@crf.org',
        phone: '+1-555-0456'
      }
    }
  ]);

  const [patientMatches] = useState<PatientMatch[]>([
    // Start with empty array - patients will be added as they join
  ]);

  const [researcherMatches] = useState<ResearcherMatch[]>([
    {
      id: 'R001',
      researcherId: 'researcher_001',
      name: 'Dr. Emily Rodriguez',
      institution: 'Memorial Cancer Center',
      specialization: 'Breast Cancer Oncology',
      activeStudies: 3,
      location: 'Houston, TX',
      matchScore: 92,
      verificationStatus: 'verified'
    }
  ]);

  const [userDocuments, setUserDocuments] = useState<UserDocument[]>([]);
  const [contactRequests, setContactRequests] = useState<ContactRequest[]>([]);

  const searchCommunities = (query: string, filters?: any): Community[] => {
    return communities.filter(community => 
      community.name.toLowerCase().includes(query.toLowerCase()) ||
      community.description.toLowerCase().includes(query.toLowerCase()) ||
      community.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
    );
  };

  const searchTrials = (query: string, filters?: any): ClinicalTrial[] => {
    return clinicalTrials.filter(trial =>
      trial.title.toLowerCase().includes(query.toLowerCase()) ||
      trial.description.toLowerCase().includes(query.toLowerCase())
    );
  };

  const searchPatients = (query: string, filters?: any): PatientMatch[] => {
    return patientMatches.filter(patient =>
      patient.condition.toLowerCase().includes(query.toLowerCase()) ||
      patient.location.toLowerCase().includes(query.toLowerCase())
    );
  };

  const joinCommunity = async (communityId: string): Promise<void> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Update member count when someone joins
    const communityIndex = communities.findIndex(c => c.id === communityId);
    if (communityIndex !== -1) {
      communities[communityIndex].memberCount += 1;
    }
    
    console.log(`Joined community ${communityId}`);
  };

  const leaveCommunity = async (communityId: string): Promise<void> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Update member count when someone leaves
    const communityIndex = communities.findIndex(c => c.id === communityId);
    if (communityIndex !== -1 && communities[communityIndex].memberCount > 0) {
      communities[communityIndex].memberCount -= 1;
    }
    
    console.log(`Left community ${communityId}`);
  };

  const requestContact = async (targetId: string, message: string): Promise<void> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Create a new contact request
    const newRequest: ContactRequest = {
      id: Math.random().toString(36).substr(2, 9),
      fromUserId: 'current-researcher-id', // In real app, this would be the current user's ID
      fromUserName: 'Dr. Research Smith',
      fromUserType: 'researcher',
      toUserId: targetId,
      message: message,
      status: 'pending',
      createdAt: new Date().toISOString(),
      studyTitle: 'Novel Cancer Treatment Study'
    };
    
    setContactRequests(prev => [...prev, newRequest]);
    console.log(`Contact request sent to ${targetId}: ${message}`);
  };

  const uploadDocument = async (file: File, type: string): Promise<void> => {
    // Simulate file upload
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newDocument: UserDocument = {
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      type: file.type,
      size: file.size,
      uploadDate: new Date().toISOString(),
      url: URL.createObjectURL(file) // In real app, this would be a server URL
    };
    
    setUserDocuments(prev => [...prev, newDocument]);
  };

  const deleteDocument = async (documentId: string): Promise<void> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    setUserDocuments(prev => prev.filter(doc => doc.id !== documentId));
  };

  const createClinicalTrial = async (trialData: any): Promise<void> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const newTrial: ClinicalTrial = {
      id: `NCT${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      title: trialData.title,
      description: trialData.description,
      phase: trialData.phase,
      status: 'recruiting',
      sponsor: trialData.sponsor,
      location: trialData.location,
      eligibilityCriteria: trialData.eligibilityCriteria.split('\n').filter((criteria: string) => criteria.trim()),
      primaryEndpoint: trialData.primaryEndpoint,
      estimatedEnrollment: parseInt(trialData.estimatedEnrollment),
      currentEnrollment: 0,
      startDate: trialData.startDate,
      estimatedCompletionDate: trialData.estimatedCompletionDate,
      contactInfo: {
        name: trialData.contactName,
        email: trialData.contactEmail,
        phone: trialData.contactPhone
      }
    };
    
    setClinicalTrials(prev => [...prev, newTrial]);
  };

  const respondToContactRequest = async (requestId: string, response: 'accept' | 'decline'): Promise<void> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setContactRequests(prev => 
      prev.map(request => 
        request.id === requestId 
          ? { ...request, status: response === 'accept' ? 'accepted' : 'declined' }
          : request
      )
    );
  };

  const value = {
    communities,
    clinicalTrials,
    patientMatches,
    researcherMatches,
    userDocuments,
    contactRequests,
    searchCommunities,
    searchTrials,
    searchPatients,
    joinCommunity,
    leaveCommunity,
    requestContact,
    uploadDocument,
    deleteDocument,
    createClinicalTrial,
    respondToContactRequest
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};