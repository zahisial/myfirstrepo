export interface DataPoint {
  name: string;
  [key: string]: string | number | null;
}

export interface GraphCardProps {
  title: string;
  data: DataPoint[];
  dataKeys: string[];
  colors: string[];
  chartType?: 'line' | 'bar';
  backgroundColor?: string;
  textColor?: string;
  showPercentage?: boolean;
  height?: number;
}

export type SectorData<T> = {
  [key: string]: {
    [key: string]: T;
  };
};
