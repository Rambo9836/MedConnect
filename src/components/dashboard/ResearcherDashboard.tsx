import React, { useState } from 'react';
import { FileText, Users, Search, TrendingUp, Plus, X } from 'lucide-react';
import { useData } from '../../contexts/DataContext';

const ResearcherDashboard: React.FC = () => {
  const { clinicalTrials, patientMatches, createClinicalTrial } = useData();
  const [showCreateStudy, setShowCreateStudy] = useState(false);
  const [creating, setCreating] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    phase: 'Phase I',
    sponsor: '',
    location: '',
    eligibilityCriteria: '',
    primaryEndpoint: '',
    estimatedEnrollment: '',
    startDate: '',
    estimatedCompletionDate: '',
    contactName: '',
    contactEmail: '',
    contactPhone: ''
  });

  const myStudies = clinicalTrials.map(trial => ({
    ...trial,
    participants: trial.currentEnrollment,
    targetParticipants: trial.estimatedEnrollment
  }));

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleCreateStudy = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    
    try {
      await createClinicalTrial(formData);
      setShowCreateStudy(false);
      setFormData({
        title: '',
        description: '',
        phase: 'Phase I',
        sponsor: '',
        location: '',
        eligibilityCriteria: '',
        primaryEndpoint: '',
        estimatedEnrollment: '',
        startDate: '',
        estimatedCompletionDate: '',
        contactName: '',
        contactEmail: '',
        contactPhone: ''
      });
      alert('Clinical trial created successfully!');
    } catch (error) {
      alert('Failed to create clinical trial. Please try again.');
    } finally {
      setCreating(false);
    }
  };

  const handleRequestContact = async (patientId: string) => {
    const message = prompt('Please enter a message for the patient:');
    if (message) {
      try {
        // This would send a notification to the patient
        alert('Contact request sent! The patient will be notified and can accept or decline your request.');
      } catch (error) {
        alert('Failed to send contact request. Please try again.');
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Research Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Manage your studies and connect with potential participants
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">Active Studies</h3>
              <p className="text-sm text-gray-600">{myStudies.length} Studies</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Users className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">Participants</h3>
              <p className="text-sm text-gray-600">
                {myStudies.reduce((sum, study) => sum + study.participants, 0)} Total
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Search className="h-8 w-8 text-purple-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">Available Patients</h3>
              <p className="text-sm text-gray-600">{patientMatches.length} Potential</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <TrendingUp className="h-8 w-8 text-orange-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">Recruitment</h3>
              <p className="text-sm text-gray-600">
                {myStudies.length > 0 ? Math.round(
                  (myStudies.reduce((sum, study) => sum + study.participants, 0) /
                    myStudies.reduce((sum, study) => sum + study.targetParticipants, 0)) * 100
                ) : 0}% Complete
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Your Studies */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Your Studies</h2>
            <p className="text-sm text-gray-600 mt-1">
              Manage your ongoing clinical trials
            </p>
          </div>
          <div className="p-6">
            {myStudies.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">No studies created yet</p>
                <button
                  onClick={() => setShowCreateStudy(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Create Your First Study
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {myStudies.map((study) => (
                  <div key={study.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-lg font-medium text-gray-900">{study.title}</h3>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        study.status === 'recruiting'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {study.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {study.phase}
                      </span>
                      <span className="text-sm text-gray-600">
                        {study.participants}/{study.targetParticipants} participants
                      </span>
                    </div>
                    <div className="mt-3">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{
                            width: `${study.targetParticipants > 0 ? (study.participants / study.targetParticipants) * 100 : 0}%`
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Potential Participants */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Potential Participants</h2>
            <p className="text-sm text-gray-600 mt-1">
              Patients matching your study criteria
            </p>
          </div>
          <div className="p-6">
            {patientMatches.length === 0 ? (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No patients available yet</p>
                <p className="text-sm text-gray-500 mt-2">
                  Patients will appear here as they join the platform
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {patientMatches.map((patient) => (
                  <div
                    key={patient.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">
                          Patient {patient.patientId}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {patient.age} years old, {patient.location}
                        </p>
                      </div>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {patient.matchScore}% Match
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-sm text-gray-600">
                          {patient.condition} - {patient.stage}
                        </span>
                      </div>
                      <button 
                        onClick={() => handleRequestContact(patient.id)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        Request Contact
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Quick Actions</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <button 
                onClick={() => setShowCreateStudy(true)}
                className="w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center">
                  <Plus className="h-5 w-5 text-blue-600 mr-3" />
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Create New Study</h3>
                    <p className="text-sm text-gray-600">Set up a new clinical trial</p>
                  </div>
                </div>
              </button>

              <button className="w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center">
                  <Search className="h-5 w-5 text-green-600 mr-3" />
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Search Patients</h3>
                    <p className="text-sm text-gray-600">Find matching participants</p>
                  </div>
                </div>
              </button>

              <button className="w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center">
                  <Users className="h-5 w-5 text-purple-600 mr-3" />
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Manage Communities</h3>
                    <p className="text-sm text-gray-600">Engage with patient communities</p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                </div>
                <div>
                  <p className="text-sm text-gray-900">Platform launched - ready for participants</p>
                  <p className="text-xs text-gray-500">Today</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                </div>
                <div>
                  <p className="text-sm text-gray-900">Research dashboard activated</p>
                  <p className="text-xs text-gray-500">Today</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-2 h-2 bg-purple-600 rounded-full mt-2"></div>
                </div>
                <div>
                  <p className="text-sm text-gray-900">Study creation tools ready</p>
                  <p className="text-xs text-gray-500">Today</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Create Study Modal */}
      {showCreateStudy && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Create New Clinical Trial</h3>
              <button
                onClick={() => setShowCreateStudy(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <form onSubmit={handleCreateStudy} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Study Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    required
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter study title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phase *
                  </label>
                  <select
                    name="phase"
                    required
                    value={formData.phase}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Phase I">Phase I</option>
                    <option value="Phase II">Phase II</option>
                    <option value="Phase III">Phase III</option>
                    <option value="Phase IV">Phase IV</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sponsor *
                  </label>
                  <input
                    type="text"
                    name="sponsor"
                    required
                    value={formData.sponsor}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Sponsoring organization"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location *
                  </label>
                  <input
                    type="text"
                    name="location"
                    required
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Study locations"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estimated Enrollment *
                  </label>
                  <input
                    type="number"
                    name="estimatedEnrollment"
                    required
                    value={formData.estimatedEnrollment}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Number of participants"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Primary Endpoint *
                  </label>
                  <input
                    type="text"
                    name="primaryEndpoint"
                    required
                    value={formData.primaryEndpoint}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Primary study endpoint"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    required
                    value={formData.startDate}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estimated Completion Date *
                  </label>
                  <input
                    type="date"
                    name="estimatedCompletionDate"
                    required
                    value={formData.estimatedCompletionDate}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Study Description *
                </label>
                <textarea
                  name="description"
                  required
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Detailed description of the study"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Eligibility Criteria *
                </label>
                <textarea
                  name="eligibilityCriteria"
                  required
                  value={formData.eligibilityCriteria}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter each criterion on a new line"
                />
              </div>

              <div className="border-t pt-6">
                <h4 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contact Name *
                    </label>
                    <input
                      type="text"
                      name="contactName"
                      required
                      value={formData.contactName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Principal investigator"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contact Email *
                    </label>
                    <input
                      type="email"
                      name="contactEmail"
                      required
                      value={formData.contactEmail}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="contact@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contact Phone *
                    </label>
                    <input
                      type="tel"
                      name="contactPhone"
                      required
                      value={formData.contactPhone}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="+1-555-0123"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-4 pt-6 border-t">
                <button
                  type="button"
                  onClick={() => setShowCreateStudy(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {creating ? 'Creating...' : 'Create Study'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResearcherDashboard;