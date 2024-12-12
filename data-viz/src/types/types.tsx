export type Metric = Record<string, unknown>;

export interface ApiResponse {
  metrics: Record<string, unknown>;
  status: number;
  data: unknown;
  message?: string;
}

// Define the structure for each month's data
export interface MonthData {
  value: number;
  // Add other properties if they exist in the month data
}

// Define the structure for the metrics object
export interface Metrics {
  [key: string]: MonthData;
}

// Define the structure for the entire API response
export interface ApiData {
  metrics: Metrics;
  // Add other properties if they exist in the API response
}

// Sankey Chart Types
export interface SankeyNode {
  name: string;
}

export interface SankeyLink {
  source: number;
  target: number;
  value: number;
}

export interface SankeyData {
  nodes: SankeyNode[];
  links: SankeyLink[];
}

export interface MetricKey {
  key: string;
  label: string;
  visualType?: 'number' | 'percentage' | 'currency' | 'graph';
  format?: (value: number) => string;
  color?: string;
  icon?: React.ReactNode;
}

