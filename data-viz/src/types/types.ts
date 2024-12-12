/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Feature as GeoJSONFeature, Geometry as GeoJSONGeometry, GeoJsonProperties as GeoJSONProperties } from 'geojson';
import { TFunction } from 'i18next';

export interface Metric {
  id?: number;
  title: string;
  value: number | string;
  change: number;
  period: string;
  mapData?: boolean;
  subData?: { name: string; value: number }[];
  isArray?: boolean;
  organicSum?: number | null;
  childMetrics: { key: string; title: string; value?: number }[];
}

export interface ApiResponse {
  metrics: {
    [key: string]: {
      [metricKey: string]: number | string | any[];
    };
    total: {
      [metricKey: string]: number;
    };
  };
  subData?: SubData[]; // Add this line
}

export interface ChartData {
  id: number;
  name: string;
  date: string;
  value: any;
  apiResponse: ApiResponse | null;
}



export interface CardApiData {
  hideTitle?: boolean;
  nonFilter: any;
  childMetrics?: any;
  subDataSeries: any;
  title: string;
  value: number | string;
  change: number;
  period: string;
  mapData?: boolean;
  subData?: any;
  apiResponse: ApiResponse | any;
  visualType: string;
  subDataArray?: any;
  totalValue?: any;
  organicSum?: any; // Update to use the refined OrganicSum type
  key?: string;
  totalLands?: {
    total: number;
    available: number;
  } | any;
  forceCalcTitle?: any;
  unitType?: string; // Add this line
  unitTypeChart?: string;
  showGrowth?: boolean;
}


export interface Feature<G = Geometry, P = GeoJsonProperties> {
  type: "Feature";
  geometry: any;
  properties: any;
}

export interface Geometry {
  type: string;
  coordinates: number[] | number[][] | number[][][];
}

export interface GeoJsonProperties {
  [key: string]: any;
}

// Add this if it doesn't exist
export interface MonthData {
  // Define the structure of MonthData here
  // For example:
  month: string;
  value: number;
  // Add any other properties that MonthData should have
}

// Update this interface for the districtsData
export interface DistrictsData {
  results: {
    features: Feature<GeoJSON.Geometry | null, GeoJsonProperties>[];
  };
}

// Add a new type for nullable DistrictsData
export type NullableDistrictsData = DistrictsData | null;

// Custom types for districtsData
export type CustomGeometry = Geometry;
export type CustomGeoJsonProperties = GeoJsonProperties;
export type CustomFeature<G extends CustomGeometry, P extends CustomGeoJsonProperties> = Feature<G, P>;

// Add this new interface
export interface SubData {
  [key: string]: any;
  name: string;
  value: number;
}

interface DistrictProperties {
  Name: string;
  AreaId: number;
  NAME_EN: string;
}

export interface SubLevelData {
  [x: string]: string;
  name: string;
  //@ts-ignore
  value: number;
 // Example additional property
  // Add other required properties here
}

export interface DataPoint {
  date: Date;
  volume: number;
  value: number;
}

export interface CandlestickData {
  date: string | number;
  open: number;
  high: number;
  low: number;
  close: number;
}

export interface CardData {
  title: string;
  value: number;
  subData: SubData[];
  totalLands?: {
    total: number;
    available: number;
  };
}

export type Frequency = "yearly" | "monthly" | "all";

export interface TreemapChartProps {
  cardData: CardData;
  t: TFunction<"translation", undefined>;
  frequency: Frequency;
}

export type OrganicSum = 
  | { achieved: string; targeted: string }
  | { vacant: number; occupied: number } // Add this case for vacant/occupied
  | Array<{ UnitTypeId: number; id: number; label_en: string; label_ar: string; value: number }>
  | number;  // Also handle cases where it's just a number


export interface HistoricalData {
  id: number;
  name: string;
  date: string;
  value: any;
  apiResponse: ApiResponse | null;
}

export type TimeRanges = '3months' | '6months' | '12months' | '24months' | 'all';



