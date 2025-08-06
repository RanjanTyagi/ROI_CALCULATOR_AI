import { useCampaigns } from '../hooks/useCampaigns';
import { formatCurrency, formatPercentage } from '../utils/formatters';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import Loading from './Loading';

export default function CampaignAnalytics() {
  const { campaigns, loading, error } = useCampaigns();

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <Loading text="Loading analytics..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="text-red-600 text-center">
          Error loading analytics: {error}
        </div>
      </div>
    );
  }

  if (campaigns.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Analytics</h2>
        <div className="text-center py-8 text-gray-500">
          <p>Add some campaigns to see analytics!</p>
        </div>
      </div>
    );
  }

  // Calculate summary stats
  const totalCost = campaigns.reduce((sum, c) => sum + c.cost, 0);
  const totalRevenue = campaigns.reduce((sum, c) => sum + c.revenue, 0);
  const averageROI = campaigns.reduce((sum, c) => sum + c.roi, 0) / campaigns.length;

  // Prepare chart data
  const chartData = campaigns
    .slice()
    .reverse()
    .map((campaign, index) => ({
      name: campaign.name.length > 10 ? campaign.name.substring(0, 10) + '...' : campaign.name,
      roi: campaign.roi,
      cost: campaign.cost,
      revenue: campaign.revenue,
      index: index + 1,
    }));

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-sm font-medium text-gray-500">Total Campaigns</h3>
          <p className="text-2xl font-bold text-gray-900">{campaigns.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-sm font-medium text-gray-500">Total Cost</h3>
          <p className="text-2xl font-bold text-red-600">{formatCurrency(totalCost)}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-sm font-medium text-gray-500">Total Revenue</h3>
          <p className="text-2xl font-bold text-green-600">{formatCurrency(totalRevenue)}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-sm font-medium text-gray-500">Average ROI</h3>
          <p className={`text-2xl font-bold ${averageROI >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {formatPercentage(averageROI)}
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ROI Over Time */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">ROI Over Time</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="index" />
              <YAxis />
              <Tooltip 
                formatter={(value: number) => [formatPercentage(value), 'ROI']}
                labelFormatter={(label) => `Campaign ${label}`}
              />
              <Line 
                type="monotone" 
                dataKey="roi" 
                stroke="#2563eb" 
                strokeWidth={2}
                dot={{ fill: '#2563eb' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Cost vs Revenue */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Cost vs Revenue</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip 
                formatter={(value: number) => [formatCurrency(value)]}
              />
              <Bar dataKey="cost" fill="#ef4444" name="Cost" />
              <Bar dataKey="revenue" fill="#10b981" name="Revenue" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}