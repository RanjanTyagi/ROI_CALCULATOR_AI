export interface Campaign {
  id: number;
  name: string;
  cost: number;
  revenue: number;
  roi: number;
  timestamp: string;
  created_at?: string;
  updated_at?: string;
}
