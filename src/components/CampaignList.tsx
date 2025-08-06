import React, { useEffect } from 'react';
import { useCampaigns } from '../hooks/useCampaigns';
import { formatCurrency, formatPercentage, formatDate } from '../utils/formatters';
import Loading from './Loading';

interface CampaignListProps {
  refresh: boolean;
}

const CampaignList: React.FC<CampaignListProps> = ({ refresh }) => {
  const { campaigns, loading, error, deleteCampaign, fetchCampaigns } = useCampaigns();

  useEffect(() => {
    if (refresh) {
      fetchCampaigns();
    }
  }, [refresh, fetchCampaigns]);

  const handleDelete = async (id: number, name: string) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      await deleteCampaign(id);
    }
  };

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <Loading text="Loading campaigns..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="text-red-600 text-center">
          Error loading campaigns: {error}
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Campaign List</h2>
      {campaigns.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No campaigns found. Add your first campaign above!</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Campaign
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cost
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Revenue
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ROI
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {campaigns.map((campaign, index) => (
                <tr key={campaign.id} className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 transform hover:-translate-y-0.5`}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{campaign.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <span className="text-red-600 font-medium">
                      {formatCurrency(campaign.cost)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <span className="text-green-600 font-medium">
                      {formatCurrency(campaign.revenue)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <span className={`font-semibold ${campaign.roi >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatPercentage(campaign.roi)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500">
                    {formatDate(campaign.timestamp)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleDelete(campaign.id, campaign.name)}
                      className="text-red-600 hover:text-red-900 transition-all duration-300 hover:bg-red-50 px-3 py-1 rounded-lg hover:shadow-lg hover:shadow-red-500/20 transform hover:scale-110 active:scale-95"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CampaignList;














