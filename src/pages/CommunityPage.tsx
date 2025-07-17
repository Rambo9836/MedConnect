import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Users, MessageCircle, Calendar, Search, Plus, Lock, Globe } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';

const CommunityPage: React.FC = () => {
  const { communityId } = useParams();
  const { communities, joinCommunity, leaveCommunity } = useData();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [showJoinModal, setShowJoinModal] = useState(false);

  const selectedCommunity = communityId 
    ? communities.find(c => c.id === communityId)
    : null;

  const filteredCommunities = communities.filter(community =>
    community.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    community.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleJoinCommunity = async (id: string) => {
    try {
      await joinCommunity(id);
      setShowJoinModal(false);
      // Show success message
    } catch (error) {
      console.error('Failed to join community:', error);
    }
  };

  if (selectedCommunity) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Community Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <h1 className="text-3xl font-bold text-gray-900">{selectedCommunity.name}</h1>
                {selectedCommunity.isPrivate ? (
                  <Lock className="h-5 w-5 text-yellow-600" />
                ) : (
                  <Globe className="h-5 w-5 text-green-600" />
                )}
              </div>
              <p className="text-gray-600 mb-4">{selectedCommunity.description}</p>
              <div className="flex items-center space-x-6 text-sm text-gray-500">
                <span className="flex items-center">
                  <Users className="h-4 w-4 mr-1" />
                  {selectedCommunity.memberCount} members
                </span>
                <span>{selectedCommunity.category}</span>
                <span>
                  Last activity: {new Date(selectedCommunity.lastActivity).toLocaleDateString()}
                </span>
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => handleJoinCommunity(selectedCommunity.id)}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Join Community
              </button>
              <Link
                to="/community"
                className="border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 transition-colors"
              >
                Back to Communities
              </Link>
            </div>
          </div>
          
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mt-4">
            {selectedCommunity.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Community Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Post Creation */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Share with the community</h3>
              <textarea
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="Share your experience, ask a question, or offer support..."
              />
              <div className="flex justify-between items-center mt-4">
                <div className="flex space-x-2">
                  <button className="text-blue-600 hover:text-blue-800 text-sm">
                    Add Photo
                  </button>
                  <button className="text-blue-600 hover:text-blue-800 text-sm">
                    Add Document
                  </button>
                </div>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
                  Post
                </button>
              </div>
            </div>

            {/* Sample Posts */}
            <div className="space-y-4">
              {[
                {
                  id: 1,
                  author: 'Sarah M.',
                  time: '2 hours ago',
                  content: 'Just finished my third round of treatment. The side effects are manageable and I\'m feeling optimistic about the results. Thank you all for your support!',
                  likes: 12,
                  comments: 5
                },
                {
                  id: 2,
                  author: 'Dr. Johnson',
                  time: '5 hours ago',
                  content: 'New research published this week shows promising results for immunotherapy combinations. I\'ve shared the link in our resources section.',
                  likes: 8,
                  comments: 3
                }
              ].map((post) => (
                <div key={post.id} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Users className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{post.author}</h4>
                      <p className="text-sm text-gray-500">{post.time}</p>
                    </div>
                  </div>
                  <p className="text-gray-700 mb-4">{post.content}</p>
                  <div className="flex items-center space-x-6 text-sm text-gray-500">
                    <button className="flex items-center space-x-1 hover:text-blue-600">
                      <span>👍</span>
                      <span>{post.likes}</span>
                    </button>
                    <button className="flex items-center space-x-1 hover:text-blue-600">
                      <MessageCircle className="h-4 w-4" />
                      <span>{post.comments}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Community Rules */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Community Guidelines</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Be respectful and supportive</li>
                <li>• No medical advice - consult professionals</li>
                <li>• Protect privacy - no personal information</li>
                <li>• Stay on topic</li>
                <li>• Report inappropriate content</li>
              </ul>
            </div>

            {/* Moderators */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Moderators</h3>
              <div className="space-y-3">
                {selectedCommunity.moderators.map((mod, index) => (
                  <div key={mod} className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <Users className="h-4 w-4 text-green-600" />
                    </div>
                    <span className="text-sm text-gray-700">Moderator {index + 1}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Resources */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Resources</h3>
              <div className="space-y-3">
                <a href="#" className="block text-blue-600 hover:text-blue-800 text-sm">
                  Treatment Guidelines
                </a>
                <a href="#" className="block text-blue-600 hover:text-blue-800 text-sm">
                  Support Groups
                </a>
                <a href="#" className="block text-blue-600 hover:text-blue-800 text-sm">
                  Clinical Trial Database
                </a>
                <a href="#" className="block text-blue-600 hover:text-blue-800 text-sm">
                  Nutrition Guide
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Communities</h1>
        <p className="text-gray-600 mb-6">
          Connect with others who share similar experiences and conditions
        </p>
        
        {/* Search and Create */}
        <div className="flex space-x-4">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Search communities..."
            />
          </div>
          {user?.userType === 'researcher' && (
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Create Community</span>
            </button>
          )}
        </div>
      </div>

      {/* Community Categories */}
      <div className="mb-8">
        <div className="flex space-x-4 overflow-x-auto pb-2">
          {['All', 'Cancer Support', 'Research', 'Treatment', 'Nutrition', 'Mental Health'].map((category) => (
            <button
              key={category}
              className="px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors whitespace-nowrap"
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Communities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCommunities.map((community) => (
          <div key={community.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center space-x-2">
                <h3 className="text-xl font-semibold text-gray-900">{community.name}</h3>
                {community.isPrivate ? (
                  <Lock className="h-4 w-4 text-yellow-600" />
                ) : (
                  <Globe className="h-4 w-4 text-green-600" />
                )}
              </div>
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                {community.category}
              </span>
            </div>
            
            <p className="text-gray-600 mb-4 line-clamp-3">{community.description}</p>
            
            <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
              <span className="flex items-center">
                <Users className="h-4 w-4 mr-1" />
                {community.memberCount} members
              </span>
              <span className="flex items-center">
                <MessageCircle className="h-4 w-4 mr-1" />
                Active
              </span>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {community.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
            
            <div className="flex space-x-3">
              <Link
                to={`/community/${community.id}`}
                className="flex-1 bg-blue-600 text-white text-center py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                View Community
              </Link>
              <button
                onClick={() => handleJoinCommunity(community.id)}
                className="px-4 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 transition-colors"
              >
                Join
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredCommunities.length === 0 && (
        <div className="text-center py-12">
          <Users className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No communities found</h3>
          <p className="mt-1 text-sm text-gray-500">
            Try adjusting your search terms or browse all communities.
          </p>
        </div>
      )}
    </div>
  );
};

export default CommunityPage;