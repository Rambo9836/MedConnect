import React, { useState } from 'react';
import { User, Mail, Phone, Calendar, Shield, Save, Edit, Camera } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const ProfilePage: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.patientProfile?.emergencyContact?.phone || '',
    dateOfBirth: user?.patientProfile?.dateOfBirth || '',
    gender: user?.patientProfile?.gender || '',
    conditions: user?.patientProfile?.conditions?.join(', ') || '',
    medications: user?.patientProfile?.medications?.join(', ') || '',
    allergies: user?.patientProfile?.allergies?.join(', ') || '',
    // Researcher fields
    title: user?.researcherProfile?.title || '',
    institution: user?.researcherProfile?.institution || '',
    specialization: user?.researcherProfile?.specialization || '',
    licenseNumber: user?.researcherProfile?.licenseNumber || '',
    // Privacy settings
    shareWithResearchers: user?.privacySettings?.shareWithResearchers || false,
    allowCommunityMessages: user?.privacySettings?.allowCommunityMessages || false,
    showInSearch: user?.privacySettings?.showInSearch || false,
    dataRetentionPeriod: user?.privacySettings?.dataRetentionPeriod || 365
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const updatedData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        profileComplete: true,
        ...(user?.userType === 'patient' && {
          patientProfile: {
            ...user.patientProfile,
            dateOfBirth: formData.dateOfBirth,
            gender: formData.gender,
            conditions: formData.conditions.split(',').map(c => c.trim()).filter(Boolean),
            medications: formData.medications.split(',').map(m => m.trim()).filter(Boolean),
            allergies: formData.allergies.split(',').map(a => a.trim()).filter(Boolean),
            emergencyContact: {
              ...user.patientProfile?.emergencyContact,
              phone: formData.phone
            }
          }
        }),
        ...(user?.userType === 'researcher' && {
          researcherProfile: {
            ...user.researcherProfile,
            title: formData.title,
            institution: formData.institution,
            specialization: formData.specialization,
            licenseNumber: formData.licenseNumber
          }
        }),
        privacySettings: {
          shareWithResearchers: formData.shareWithResearchers,
          allowCommunityMessages: formData.allowCommunityMessages,
          showInSearch: formData.showInSearch,
          dataRetentionPeriod: formData.dataRetentionPeriod
        }
      };

      await updateProfile(updatedData);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-8">
          <div className="flex items-center space-x-6">
            <div className="relative">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center">
                {user.profilePicture ? (
                  <img
                    src={user.profilePicture}
                    alt="Profile"
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <User className="h-12 w-12 text-blue-600" />
                )}
              </div>
              <button className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors">
                <Camera className="h-4 w-4" />
              </button>
            </div>
            <div className="text-white">
              <h1 className="text-3xl font-bold">
                {user.firstName} {user.lastName}
              </h1>
              <p className="text-blue-100 capitalize">{user.userType}</p>
              <p className="text-blue-200 text-sm">
                Member since {new Date(user.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Profile Content */}
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Profile Information</h2>
            <div className="flex space-x-3">
              {isEditing ? (
                <>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={loading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
                  >
                    <Save className="h-4 w-4" />
                    <span>{loading ? 'Saving...' : 'Save Changes'}</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <Edit className="h-4 w-4" />
                  <span>Edit Profile</span>
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-gray-900">{user.firstName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-gray-900">{user.lastName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <p className="text-gray-900">{user.email}</p>
                </div>
              </div>

              {user.userType === 'patient' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date of Birth
                    </label>
                    {isEditing ? (
                      <input
                        type="date"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <p className="text-gray-900">
                          {user.patientProfile?.dateOfBirth 
                            ? new Date(user.patientProfile.dateOfBirth).toLocaleDateString()
                            : 'Not provided'
                          }
                        </p>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Gender
                    </label>
                    {isEditing ? (
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    ) : (
                      <p className="text-gray-900 capitalize">
                        {user.patientProfile?.gender || 'Not provided'}
                      </p>
                    )}
                  </div>
                </>
              )}

              {user.userType === 'researcher' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Title
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="text-gray-900">{user.researcherProfile?.title}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Institution
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="institution"
                        value={formData.institution}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="text-gray-900">{user.researcherProfile?.institution}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Specialization
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="specialization"
                        value={formData.specialization}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="text-gray-900">{user.researcherProfile?.specialization}</p>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Medical Information (Patients) or Professional Info (Researchers) */}
            <div className="space-y-4">
              {user.userType === 'patient' ? (
                <>
                  <h3 className="text-lg font-semibold text-gray-900">Medical Information</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Conditions
                    </label>
                    {isEditing ? (
                      <textarea
                        name="conditions"
                        value={formData.conditions}
                        onChange={handleInputChange}
                        rows={3}
                        placeholder="Enter conditions separated by commas"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="text-gray-900">
                        {user.patientProfile?.conditions?.join(', ') || 'None listed'}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Current Medications
                    </label>
                    {isEditing ? (
                      <textarea
                        name="medications"
                        value={formData.medications}
                        onChange={handleInputChange}
                        rows={3}
                        placeholder="Enter medications separated by commas"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="text-gray-900">
                        {user.patientProfile?.medications?.join(', ') || 'None listed'}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Allergies
                    </label>
                    {isEditing ? (
                      <textarea
                        name="allergies"
                        value={formData.allergies}
                        onChange={handleInputChange}
                        rows={2}
                        placeholder="Enter allergies separated by commas"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="text-gray-900">
                        {user.patientProfile?.allergies?.join(', ') || 'None listed'}
                      </p>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <h3 className="text-lg font-semibold text-gray-900">Professional Information</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      License Number
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="licenseNumber"
                        value={formData.licenseNumber}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="text-gray-900">
                        {user.researcherProfile?.licenseNumber || 'Not provided'}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Verification Status
                    </label>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.researcherProfile?.verificationStatus === 'verified'
                        ? 'bg-green-100 text-green-800'
                        : user.researcherProfile?.verificationStatus === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {user.researcherProfile?.verificationStatus || 'Unverified'}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Privacy Settings */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <div className="flex items-center space-x-2 mb-6">
              <Shield className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">Privacy Settings</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Share data with researchers
                    </label>
                    <p className="text-xs text-gray-500">
                      Allow researchers to view your anonymized data
                    </p>
                  </div>
                  {isEditing ? (
                    <input
                      type="checkbox"
                      name="shareWithResearchers"
                      checked={formData.shareWithResearchers}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  ) : (
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      user.privacySettings?.shareWithResearchers
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {user.privacySettings?.shareWithResearchers ? 'Enabled' : 'Disabled'}
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Allow community messages
                    </label>
                    <p className="text-xs text-gray-500">
                      Let other community members send you messages
                    </p>
                  </div>
                  {isEditing ? (
                    <input
                      type="checkbox"
                      name="allowCommunityMessages"
                      checked={formData.allowCommunityMessages}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  ) : (
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      user.privacySettings?.allowCommunityMessages
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {user.privacySettings?.allowCommunityMessages ? 'Enabled' : 'Disabled'}
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Show in search results
                    </label>
                    <p className="text-xs text-gray-500">
                      Make your profile discoverable in searches
                    </p>
                  </div>
                  {isEditing ? (
                    <input
                      type="checkbox"
                      name="showInSearch"
                      checked={formData.showInSearch}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  ) : (
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      user.privacySettings?.showInSearch
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {user.privacySettings?.showInSearch ? 'Enabled' : 'Disabled'}
                    </span>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Data retention period (days)
                  </label>
                  {isEditing ? (
                    <select
                      name="dataRetentionPeriod"
                      value={formData.dataRetentionPeriod}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value={90}>90 days</option>
                      <option value={180}>180 days</option>
                      <option value={365}>1 year</option>
                      <option value={730}>2 years</option>
                      <option value={-1}>Indefinite</option>
                    </select>
                  ) : (
                    <p className="text-gray-900">
                      {user.privacySettings?.dataRetentionPeriod === -1 
                        ? 'Indefinite' 
                        : `${user.privacySettings?.dataRetentionPeriod} days`
                      }
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;