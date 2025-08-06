import { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import { Campaign } from '../types/Campaign';

interface CampaignInput {
  name: string;
  cost: number;
  revenue: number;
  roi: number;
}

interface CampaignResult {
  success: boolean;
  error?: string;
}

export const useCampaigns = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCampaigns = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('campaigns')
        .select('id, name, cost, revenue, roi, timestamp')
        .order('timestamp', { ascending: false })
        .limit(100); // Limit initial load

      if (error) throw error;
      
      setCampaigns(data || []);
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch campaigns');
    } finally {
      setLoading(false);
    }
  };

  const addCampaign = async (campaign: CampaignInput): Promise<CampaignResult> => {
    try {
      console.log('Adding campaign:', campaign);
      const { data, error } = await supabase
        .from('campaigns')
        .insert([{
          name: campaign.name,
          cost: campaign.cost,
          revenue: campaign.revenue,
          roi: campaign.roi,
          timestamp: new Date().toISOString()
        }])
        .select();

      if (error) {
        console.error('Insert error:', error);
        throw error;
      }
      
      console.log('Campaign added successfully:', data);
      
      // Immediately update local state instead of refetching
      if (data && data[0]) {
        setCampaigns(prev => [data[0], ...prev]);
      }
      
      return { success: true };
    } catch (err) {
      console.error('Add campaign error:', err);
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Failed to add campaign' 
      };
    }
  };

  const deleteCampaign = async (id: number): Promise<CampaignResult> => {
    try {
      const { error } = await supabase
        .from('campaigns')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      // Immediately update local state instead of refetching
      setCampaigns(prev => prev.filter(campaign => campaign.id !== id));
      
      return { success: true };
    } catch (err) {
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Failed to delete campaign' 
      };
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  return {
    campaigns,
    loading,
    error,
    fetchCampaigns,
    addCampaign,
    deleteCampaign,
  };
};











