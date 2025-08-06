import { useState } from 'react';
import { APP_CONFIG } from './constants';
import ErrorBoundary from './components/ErrorBoundary';
import CampaignForm from './components/CampaignForm';
import CampaignList from './components/CampaignList';
import CampaignAnalytics from './components/CampaignAnalytics';
import ROICalculator from './components/ROICalculator';
import SignupForm from './components/SignupForm';

function App() {
  const [refresh, setRefresh] = useState(false);
  const [isSignedUp, setIsSignedUp] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  
  const toggleRefresh = () => {
    setRefresh(prev => !prev);
    console.log('Refresh toggled');
  };

  const handleSignup = (userData: { email: string; password: string; name: string; company: string }) => {
    console.log('User signed up:', userData);
    setUserEmail(userData.email);
    setIsSignedUp(true);
  };

  if (!isSignedUp) {
    return (
      <ErrorBoundary>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
          <div className="container mx-auto px-4 py-8 max-w-7xl">
            {/* Header */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-800 bg-clip-text text-transparent mb-3">
                {APP_CONFIG.name}
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                {APP_CONFIG.description}
              </p>
            </div>

            {/* Signup Form */}
            <div className="max-w-md mx-auto">
              <div className="backdrop-blur-sm bg-white/80 rounded-3xl shadow-xl border border-white/20 p-8">
                <SignupForm onSignup={handleSignup} />
              </div>
            </div>
          </div>
        </div>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-800 bg-clip-text text-transparent mb-3">
              {APP_CONFIG.name}
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Welcome back, {userEmail}!
            </p>
          </div>

          {/* Main Content */}
          <div className="space-y-8">
            {/* ROI Calculator */}
            <div className="backdrop-blur-sm bg-white/80 rounded-3xl shadow-xl border border-white/20 p-8 hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-500 transform hover:-translate-y-1 hover:scale-[1.02]">
              <ROICalculator />
            </div>
            
            {/* Campaign Form */}
            <div className="backdrop-blur-sm bg-white/80 rounded-3xl shadow-xl border border-white/20 p-8 hover:shadow-2xl hover:shadow-green-500/10 transition-all duration-500 transform hover:-translate-y-1 hover:scale-[1.02]">
              <CampaignForm onAdd={toggleRefresh} />
            </div>
            
            {/* Campaign List */}
            <div className="backdrop-blur-sm bg-white/80 rounded-3xl shadow-xl border border-white/20 p-8 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 transform hover:-translate-y-1 hover:scale-[1.02]">
              <CampaignList refresh={refresh} />
            </div>
            
            {/* Analytics */}
            <div className="backdrop-blur-sm bg-white/80 rounded-3xl shadow-xl border border-white/20 p-8 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500 transform hover:-translate-y-1 hover:scale-[1.02]">
              <CampaignAnalytics />
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}

export default App;

// Remove this entire section:
// const CampaignList: React.FC<CampaignListProps> = ({ refresh }) => {
//   return (
//     <div>
//       <h2 className="text-2xl font-semibold mb-4">Campaign List</h2>
//       <p>Refresh state: {refresh ? 'Yes' : 'No'}</p>
//       {/* TODO: Render campaigns here */}
//     </div>
//   );
// };
// 
// export { CampaignList };

// In your component
const handleSignup = (userData: { email: string; password: string }) => {
  console.log('User signed up:', userData);
  // Here you would typically send to your backend
  // Then redirect to campaign creation
};

<SignupForm onSignup={handleSignup} />
// export { CampaignList };




