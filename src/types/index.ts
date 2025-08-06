export * from './Campaign';

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  loading: boolean;
}

export interface ChartDataPoint {
  name: string;
  value: number;
  timestamp: string;
}