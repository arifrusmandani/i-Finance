import { useState } from 'react';
import { FiSearch, FiMail, FiPhone, FiClock, FiAlertCircle, FiX, FiAlertTriangle } from 'react-icons/fi';

interface Member {
  user_id: number;
  family_user_id: number;
  email: string;
  name: string;
  phone: string;
  last_login: string;
  is_active: boolean;
  relationship: string;
  is_verified: boolean;
}

const dummyMembers: Member[] = [
  {
    user_id: 4,
    family_user_id: 5,
    email: "user3@gmail.com",
    name: "Kang Mas",
    phone: "089812341333",
    last_login: "2025-05-26T07:27:00.447938",
    is_active: true,
    relationship: "spouse",
    is_verified: true
  },
  {
    user_id: 1,
    family_user_id: 2,
    email: "ibu@gmail.com",
    name: "Ibu Siti",
    phone: "089812341334",
    last_login: "2025-05-25T15:30:00.447938",
    is_active: true,
    relationship: "mother",
    is_verified: false
  },
  {
    user_id: 2,
    family_user_id: 3,
    email: "ayah@gmail.com",
    name: "Bapak Ahmad",
    phone: "089812341335",
    last_login: "2025-05-24T10:15:00.447938",
    is_active: true,
    relationship: "father",
    is_verified: true
  },
  {
    user_id: 3,
    family_user_id: 4,
    email: "kakak@gmail.com",
    name: "Kakak Rina",
    phone: "089812341336",
    last_login: "2025-05-20T08:45:00.447938",
    is_active: false,
    relationship: "sister",
    is_verified: true
  },
  {
    user_id: 5,
    family_user_id: 6,
    email: "adik@gmail.com",
    name: "Adik Budi",
    phone: "089812341337",
    last_login: "2025-05-26T09:20:00.447938",
    is_active: true,
    relationship: "brother",
    is_verified: false
  },
  {
    user_id: 6,
    family_user_id: 7,
    email: "nenek@gmail.com",
    name: "Nenek Aminah",
    phone: "089812341338",
    last_login: "2025-05-15T14:10:00.447938",
    is_active: true,
    relationship: "grandmother",
    is_verified: true
  }
];

export default function Members() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRelationship, setInviteRelationship] = useState('');
  const [isInviting, setIsInviting] = useState(false);
  const [showAcceptConfirmation, setShowAcceptConfirmation] = useState<number | null>(null);

  const handleAcceptMember = async (memberId: number) => {
    try {
      // Here you would typically make an API call to accept the member
      console.log('Accepting member:', memberId);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Close confirmation dialog
      setShowAcceptConfirmation(null);
    } catch (error) {
      console.error('Failed to accept member:', error);
    }
  };

  const handleInvite = async () => {
    if (!inviteEmail || !inviteRelationship) return;
    
    setIsInviting(true);
    try {
      // Here you would typically make an API call to send the invitation
      console.log('Sending invitation to:', inviteEmail, 'as', inviteRelationship);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Reset form and close modal
      setInviteEmail('');
      setInviteRelationship('');
      setIsInviteModalOpen(false);
    } catch (error) {
      console.error('Failed to send invitation:', error);
    } finally {
      setIsInviting(false);
    }
  };

  const filteredMembers = dummyMembers.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'active' ? member.is_active : !member.is_active);
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-4 md:p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Family Members</h1>
        <p className="text-gray-600 dark:text-gray-400">Manage your family members and their roles</p>
      </div>

      {/* Search and Filter Section */}
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search members..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-4">
          <select
            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'inactive')}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <button 
            onClick={() => setIsInviteModalOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center gap-2"
          >
            <FiMail />
            Invite Member
          </button>
        </div>
      </div>

      {/* Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMembers.map((member) => (
          <div
            key={member.user_id}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${member.name}`}
                  alt={member.name}
                  className="w-16 h-16 rounded-full border-2 border-blue-500"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{member.name}</h3>
                    {member.is_verified ? (
                      <span className="text-blue-500" title="Verified">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </span>
                    ) : (
                      <span className="text-yellow-500 flex items-center gap-1" title="Pending Acceptance">
                        <FiAlertCircle className="w-5 h-5" />
                        <span className="text-xs font-medium">Pending</span>
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                      {member.relationship.charAt(0).toUpperCase() + member.relationship.slice(1)}
                    </span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      member.is_active 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                    }`}>
                      {member.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <FiMail className="text-gray-400" />
                  <span className="text-sm">{member.email}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <FiPhone className="text-gray-400" />
                  <span className="text-sm">{member.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <FiClock className="text-gray-400" />
                  <span className="text-sm">
                    Last login: {new Date(member.last_login).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    ID: {member.user_id}
                  </p>
                  <div className="flex items-center gap-2">
                    {!member.is_verified && (
                      <button 
                        onClick={() => setShowAcceptConfirmation(member.user_id)}
                        className="px-3 py-1 text-sm text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors duration-200 flex items-center gap-1"
                        title="Accept Member"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        Accept
                      </button>
                    )}
                    <button 
                      className="px-3 py-1 text-sm text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors duration-200 flex items-center gap-1"
                      title={member.is_verified ? "Remove from Family" : "Reject Member"}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      {member.is_verified ? "Remove" : "Reject"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Accept Confirmation Modal */}
      {showAcceptConfirmation !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Accept Family Member</h3>
              <button 
                onClick={() => setShowAcceptConfirmation(null)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="bg-yellow-50 dark:bg-yellow-900/30 p-4 rounded-lg">
                <div className="flex items-start gap-3">
                  <FiAlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-yellow-800 dark:text-yellow-200 mb-1">Important Notice</h4>
                    <p className="text-sm text-yellow-700 dark:text-yellow-300">
                      By accepting this member, they will have access to:
                    </p>
                    <ul className="mt-2 text-sm text-yellow-700 dark:text-yellow-300 list-disc list-inside space-y-1">
                      <li>View all family transactions</li>
                      <li>Add new transactions</li>
                      <li>Share financial information</li>
                      <li>Access family financial reports</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowAcceptConfirmation(null)}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleAcceptMember(showAcceptConfirmation)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Accept Member
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Invite Modal */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Invite Family Member</h3>
              <button 
                onClick={() => setIsInviteModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="Enter email address"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Relationship
                </label>
                <div className="relative">
                  <select
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                    value="spouse"
                    disabled
                  >
                    <option value="spouse">Spouse</option>
                  </select>
                  <div className="absolute inset-0 flex items-center justify-end pr-3 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                </div>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Currently, you can only invite your spouse to join the family group.
                </p>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  The invited member will be able to view and share transactions with the family group after accepting the invitation.
                </p>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setIsInviteModalOpen(false)}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleInvite}
                  disabled={!inviteEmail || isInviting}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isInviting ? (
                    <>
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Sending...
                    </>
                  ) : (
                    <>
                      <FiMail className="w-4 h-4" />
                      Send Invitation
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 