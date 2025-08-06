import { useState } from 'react';
import { calculateROI, formatCurrency, formatPercentage } from '../utils/formatters';

export default function ROICalculator() {
  const [cost, setCost] = useState('');
  const [revenue, setRevenue] = useState('');
  const [roi, setROI] = useState<number | null>(null);

  const handleCalculate = () => {
    const costNum = parseFloat(cost);
    const revenueNum = parseFloat(revenue);
    
    if (!isNaN(costNum) && !isNaN(revenueNum) && costNum > 0) {
      const calculatedROI = calculateROI(revenueNum, costNum);
      setROI(calculatedROI);
    } else {
      setROI(null);
    }
  };

  const handleClear = () => {
    setCost('');
    setRevenue('');
    setROI(null);
  };

  return (
    <div>
      <div className="flex items-center mb-6">
        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mr-4 shadow-lg hover:shadow-purple-500/25 transition-all duration-300 hover:scale-110 animate-pulse">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 002 2z" />
          </svg>
        </div>
        <h2 className="text-3xl font-bold text-gray-900">ROI Calculator</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="space-y-6">
          <div>
            <label htmlFor="calc-cost" className="block text-sm font-semibold text-gray-700 mb-2">
              Cost (₹)
            </label>
            <input
              type="number"
              id="calc-cost"
              value={cost}
              onChange={(e) => setCost(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 bg-white/50 hover:bg-white/70 hover:shadow-lg hover:shadow-purple-500/10 focus:shadow-xl focus:shadow-purple-500/20 transform hover:-translate-y-0.5"
              placeholder="Enter cost amount"
              min="0"
              step="0.01"
            />
          </div>

          <div>
            <label htmlFor="calc-revenue" className="block text-sm font-semibold text-gray-700 mb-2">
              Revenue (₹)
            </label>
            <input
              type="number"
              id="calc-revenue"
              value={revenue}
              onChange={(e) => setRevenue(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-white/50"
              placeholder="Enter revenue amount"
              min="0"
              step="0.01"
            />
          </div>

          <div className="flex space-x-4">
            <button
              onClick={handleCalculate}
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-6 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl hover:shadow-purple-500/30 transform hover:-translate-y-1 hover:scale-105 active:scale-95 motion-safe:animate-pulse"
            >
              Calculate ROI
            </button>
            <button
              onClick={handleClear}
              className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 font-semibold"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Result Section */}
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Calculation Result</h3>
          
          {roi !== null ? (
            <div className="space-y-4">
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <div className="text-sm text-gray-600 mb-1">Investment Cost</div>
                <div className="text-xl font-bold text-red-600">
                  {formatCurrency(parseFloat(cost) || 0)}
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <div className="text-sm text-gray-600 mb-1">Revenue Generated</div>
                <div className="text-xl font-bold text-green-600">
                  {formatCurrency(parseFloat(revenue) || 0)}
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <div className="text-sm text-gray-600 mb-1">Profit/Loss</div>
                <div className={`text-xl font-bold ${(parseFloat(revenue) || 0) - (parseFloat(cost) || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency((parseFloat(revenue) || 0) - (parseFloat(cost) || 0))}
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl p-4 shadow-lg">
                <div className="text-sm text-blue-100 mb-1">Return on Investment (ROI)</div>
                <div className="text-3xl font-bold">
                  {formatPercentage(roi)}
                </div>
                <div className="text-sm text-blue-100 mt-2">
                  {roi >= 0 ? '📈 Profitable Investment' : '📉 Loss Making Investment'}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-gray-400 text-lg mb-2">💡</div>
              <div className="text-gray-500">
                Enter cost and revenue values, then click "Calculate ROI" to see the results.
              </div>
              <div className="text-sm text-gray-400 mt-2">
                ROI = ((Revenue - Cost) / Cost) × 100
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}






