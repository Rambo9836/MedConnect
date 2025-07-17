import React, { useState } from 'react';
import { Search, Filter, MapPin, Calendar, Users } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';

const SearchPage: React.FC = () => {
  const { user } = useAuth();
  const { searchCommunities, searchTrials, searchPatients, communities, clinicalTrials, patientMatches } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState(user?.userType === 'patient' ? 'trials' : 'patients');
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = () => {
    // Search functionality is handled by the data context
    console.log('Searching for:', searchQuery);
  };

  const getSearchResults = () => {
    if (!searchQuery.trim()) {
      switch (activeTab) {
        case 'trials':
          return clinicalTrials;
        case 'patients':
          return patientMatches;
        case 'communities':
          return communities;
        default:
          return [];
      }
    }

    switch (activeTab) {
      case 'trials':
        return searchTrials(searchQuery);
      case 'patients':
        return searchPatients(searchQuery);
      case 'communities':
        return searchCommunities(searchQuery);
      default:
        return [];
    }
  };

  const results = getSearchResults();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          {user?.userType === 'patient' ? 'Find Clinical Trials & Communities' : 'Find Patients & Communities'}
        </h1>
        
        {/* Search Bar */}
        <div className="flex space-x-4">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              placeholder={`Search for ${activeTab}...`}
            />
          </div>
          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Search
          </button>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors flex items-center space-x-2"
          >
            <Filter className="h-4 w-4" />
            <span>Filters</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {user?.userType === 'patient' && (
            <button
              onClick={() => setActiveTab('trials')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'trials'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Clinical Trials
            </button>
          )}
          {user?.userType === 'researcher' && (
            <button
              onClick={() => setActiveTab('patients')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'patients'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Patients
            </button>
          )}
          <button
            onClick={() => setActiveTab('communities')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'communities'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Communities
          </button>
        </nav>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Filters</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Enter location"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Condition
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500">
                <option value="">All conditions</option>
                <option value="breast-cancer">Breast Cancer</option>
                <option value="lung-cancer">Lung Cancer</option>
                <option value="colon-cancer">Colon Cancer</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {activeTab === 'trials' ? 'Phase' : 'Age Range'}
              </label>
              {activeTab === 'trials' ? (
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500">
                  <option value="">All phases</option>
                  <option value="phase-1">Phase I</option>
                  <option value="phase-2">Phase II</option>
                  <option value="phase-3">Phase III</option>
                </select>
              ) : (
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="e.g., 18-65"
                />
              )}
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      <div className="space-y-6">
        {results.length === 0 ? (
          <div className="text-center py-12">
            <Search className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No results found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your search terms or filters.
            </p>
          </div>
        ) : (
          results.map((item: any) => (
            <div key={item.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              {activeTab === 'trials' && (
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
                      <p className="text-gray-600 mb-2">{item.description}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          {item.location}
                        </span>
                        <span className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {item.phase}
                        </span>
                        <span className="flex items-center">
                          <Users className="h-4 w-4 mr-1" />
                          {item.currentEnrollment}/{item.estimatedEnrollment} enrolled
                        </span>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      item.status === 'recruiting'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Sponsored by {item.sponsor}</span>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
                      Learn More
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'patients' && (
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        Patient {item.patientId}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>{item.age} years old</span>
                        <span>{item.gender}</span>
                        <span className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          {item.location}
                        </span>
                      </div>
                      <p className="text-gray-600 mt-2">
                        {item.condition} {item.stage && `- ${item.stage}`}
                      </p>
                    </div>
                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                      {item.matchScore}% Match
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">
                      Last active: {new Date(item.lastActive).toLocaleDateString()}
                    </span>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
                      Request Contact
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'communities' && (
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.name}</h3>
                      <p className="text-gray-600 mb-2">{item.description}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span className="flex items-center">
                          <Users className="h-4 w-4 mr-1" />
                          {item.memberCount} members
                        </span>
                        <span>{item.category}</span>
                        <span>
                          Last activity: {new Date(item.lastActivity).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      item.isPrivate
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {item.isPrivate ? 'Private' : 'Public'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex flex-wrap gap-2">
                      {item.tags.slice(0, 3).map((tag: string) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
                      Join Community
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SearchPage;