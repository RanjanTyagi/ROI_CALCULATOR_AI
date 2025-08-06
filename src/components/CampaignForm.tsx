import { useState, useEffect } from 'react';
import { useCampaigns } from '../hooks/useCampaigns';
import { calculateROI, formatCurrency, formatPercentage } from '../utils/formatters';

interface CampaignFormProps {
  onAdd: () => void;
}

export default function CampaignForm({ onAdd }: CampaignFormProps) {
  const [name, setName] = useState('');
  const [cost, setCost] = useState('');
  const [revenue, setRevenue] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewROI, setPreviewROI] = useState<number | null>(null);
  const [isValid, setIsValid] = useState(false);
  
  const { addCampaign } = useCampaigns();

  // Dynamic ROI calculation and validation
  useEffect(() => {
    const costNum = parseFloat(cost);
    const revenueNum = parseFloat(revenue);
    
    if (!isNaN(costNum) && !isNaN(revenueNum) && costNum > 0) {
      const roi = calculateROI(revenueNum, costNum);
      setPreviewROI(roi);
    } else {
      setPreviewROI(null);
    }

    // Validation
    const nameValid = name.trim().length >= 2;
    const costValid = !isNaN(costNum) && costNum > 0;
    const revenueValid = !isNaN(revenueNum) && revenueNum >= 0;
    
    setIsValid(nameValid && costValid && revenueValid);
    
    // Clear error when user starts typing
    if (error && (name || cost || revenue)) {
      setError(null);
    }
  }, [name, cost, revenue, error]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!isValid) {
      setError('Please fill in all fields correctly');
      return;
    }

    setLoading(true);
    
    const costNum = parseFloat(cost);
    const revenueNum = parseFloat(revenue);
    const roi = calculateROI(revenueNum, costNum);
    
    const result = await addCampaign({
      name: name.trim(),
      cost: costNum,
      revenue: revenueNum,
      roi,
    });

    if (result.success) {
      // Reset form with animation
      setName('');
      setCost('');
      setRevenue('');
      setPreviewROI(null);
      
      // Refresh quick fill templates by re-rendering
      const templateButtons = document.querySelectorAll('[data-template]');
      templateButtons.forEach(btn => {
        btn.classList.add('animate-pulse');
        setTimeout(() => btn.classList.remove('animate-pulse'), 1000);
      });
      
      console.log('Campaign added successfully, triggering refresh');
      onAdd();
      
      // Success feedback
      const successMessage = document.createElement('div');
      successMessage.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-bounce';
      successMessage.textContent = '✅ Campaign added successfully!';
      document.body.appendChild(successMessage);
      setTimeout(() => document.body.removeChild(successMessage), 3000);
    } else {
      setError(result.error || 'Failed to add campaign');
    }
    
    setLoading(false);
  };

  const handleQuickFill = (template: string) => {
    switch (template) {
      case 'social':
        setName('Social Media Campaign');
        setCost('5000');
        setRevenue('8000');
        break;
      case 'email':
        setName('Email Marketing');
        setCost('2000');
        setRevenue('6000');
        break;
      case 'ppc':
        setName('Google Ads Campaign');
        setCost('10000');
        setRevenue('15000');
        break;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center mb-6">
        <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mr-4 shadow-lg hover:shadow-green-500/25 transition-all duration-300 hover:scale-110 animate-bounce">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </div>
        <h2 className="text-3xl font-bold text-gray-900">Add New Campaign</h2>
      </div>

      {/* Quick Fill Templates */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Quick Fill Templates:</h3>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => handleQuickFill('social')}
            className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm hover:bg-blue-200 transition-all duration-200 transform hover:scale-105"
          >
            📱 Social Media
          </button>
          <button
            type="button"
            onClick={() => handleQuickFill('email')}
            className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-sm hover:bg-green-200 transition-all duration-200 transform hover:scale-105"
          >
            📧 Email Marketing
          </button>
          <button
            type="button"
            onClick={() => handleQuickFill('ppc')}
            className="px-3 py-1 bg-purple-100 text-purple-700 rounded-lg text-sm hover:bg-purple-200 transition-all duration-200 transform hover:scale-105"
          >
            🎯 Google Ads
          </button>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
              Campaign Name
              {name.trim().length >= 2 && <span className="text-green-500 ml-1">✓</span>}
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-all duration-300 bg-white/50 hover:bg-white/70 transform hover:-translate-y-0.5 ${
                name.trim().length >= 2 
                  ? 'border-green-300 focus:ring-2 focus:ring-green-500 focus:border-transparent shadow-lg shadow-green-500/10' 
                  : 'border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:shadow-lg hover:shadow-blue-500/10'
              }`}
              placeholder="Enter campaign name"
              disabled={loading}
            />
            <div className="text-xs text-gray-500 mt-1">
              {name.length}/50 characters
            </div>
          </div>

          <div>
            <label htmlFor="cost" className="block text-sm font-semibold text-gray-700 mb-2">
              Cost (₹)
              {!isNaN(parseFloat(cost)) && parseFloat(cost) > 0 && <span className="text-green-500 ml-1">✓</span>}
            </label>
            <input
              type="number"
              id="cost"
              value={cost}
              onChange={(e) => setCost(e.target.value)}
              className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-all duration-300 bg-white/50 hover:bg-white/70 transform hover:-translate-y-0.5 ${
                !isNaN(parseFloat(cost)) && parseFloat(cost) > 0
                  ? 'border-green-300 focus:ring-2 focus:ring-green-500 focus:border-transparent shadow-lg shadow-green-500/10'
                  : 'border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:shadow-lg hover:shadow-blue-500/10'
              }`}
              placeholder="0.00"
              min="0"
              step="0.01"
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="revenue" className="block text-sm font-semibold text-gray-700 mb-2">
              Revenue (₹)
              {!isNaN(parseFloat(revenue)) && parseFloat(revenue) >= 0 && <span className="text-green-500 ml-1">✓</span>}
            </label>
            <input
              type="number"
              id="revenue"
              value={revenue}
              onChange={(e) => setRevenue(e.target.value)}
              className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-all duration-300 bg-white/50 hover:bg-white/70 transform hover:-translate-y-0.5 ${
                !isNaN(parseFloat(revenue)) && parseFloat(revenue) >= 0
                  ? 'border-green-300 focus:ring-2 focus:ring-green-500 focus:border-transparent shadow-lg shadow-green-500/10'
                  : 'border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:shadow-lg hover:shadow-blue-500/10'
              }`}
              placeholder="0.00"
              min="0"
              step="0.01"
              disabled={loading}
            />
          </div>
        </div>

        {/* Live ROI Preview */}
        {previewROI !== null && (
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4 border border-indigo-200 animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-gray-800">Live ROI Preview</h4>
                <p className="text-sm text-gray-600">
                  Profit: {formatCurrency((parseFloat(revenue) || 0) - (parseFloat(cost) || 0))}
                </p>
              </div>
              <div className={`text-2xl font-bold ${previewROI >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatPercentage(previewROI)}
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div 
                className={`h-2 rounded-full transition-all duration-500 ${previewROI >= 0 ? 'bg-green-500' : 'bg-red-500'}`}
                style={{ width: `${Math.min(Math.abs(previewROI), 100)}%` }}
              ></div>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg animate-shake">
            <div className="flex">
              <svg className="w-5 h-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span className="text-red-700 font-medium">{error}</span>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !isValid}
          className={`w-full py-4 px-6 rounded-xl font-semibold text-lg shadow-lg transition-all duration-300 transform ${
            isValid && !loading
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl hover:shadow-blue-500/30 hover:-translate-y-1 hover:scale-105 active:scale-95'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Adding Campaign...
            </div>
          ) : isValid ? (
            '✨ Add Campaign'
          ) : (
            '📝 Fill Required Fields'
          )}
        </button>
      </form>
    </div>
  );
}





