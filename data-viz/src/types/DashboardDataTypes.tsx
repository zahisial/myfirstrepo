/* eslint-disable @typescript-eslint/no-explicit-any */
interface Coordinates {
    type: string;
    coordinates: [number, number];
  }
  
  interface Feature {
    type: "Feature" | string;
    properties: {
      [key: string]: any;
    };
    geometry: Point | MultiPolygon;
  }
  
  interface MapData {
    type: string;
    name: string;
    crs: {
      type: string;
      properties: {
        name: string;
      };
    };
    features: Feature[];
  }
  
  interface GraphData {
    name: string;
    value: number;
  }
  
  interface MetricData {
    value: string | number;
    change: number;
    period: string;
    trend: number[];
    graphs: {
      weekly: GraphData[];
      monthly: GraphData[];
    };
    mapData: GeoJSON.FeatureCollection | null;
    detailLink?: string;
  }
  
  interface DistrictData {
    [key: string]: MetricData;
  }
  
  interface SectorData {
    [district: string]: {
      total_lands_available: {
        value: string;
        change: number;
        period: string;
        trend: number[];
        graphs: {
          weekly: { name: string; value: number }[];
          monthly: { name: string; value: number }[];
        };
        mapData: null;
        detailLink: string;
      };
      // ... other properties
  }
}
  
  interface DashboardData {
    [sector: string]: {
      [district: string]: DistrictData;
    };
  }
  
  interface DistrictData {
    total_lands_available: MetricData;
    total_lands_utilized: MetricData;
    total_lands_unutilized: MetricData;
    total_buildings: MetricData;
    total_floors: MetricData;
    total_units: MetricData;
    total_area: MetricData;
    total_built_up_area: MetricData;
    total_rental: MetricData;
    // Add other metrics as needed
  }
  
  interface MetricData {
    value: string | number;
    change: number;
    period: string;
    trend: number[];
    graphs: {
      weekly: GraphData[];
      monthly: GraphData[];
    };
    mapData: GeoJSON.FeatureCollection | null;
    detailLink?: string;
  }
  
  interface GraphData {
    name: string;
    value: number;
  }
  
  // Add any other necessary types or interfaces here
// GeoJSON types
export interface FeatureCollection {
  type: "FeatureCollection";
  features: Feature[];
}

interface Feature {
    type: "Feature" | string;
    properties: {
      [key: string]: any;
    };
    geometry: Point | MultiPolygon;
  }

interface Point {
    type: "Point";
    coordinates: [number, number];
  }

interface MultiPolygon {
    type: "MultiPolygon";
    coordinates: number[][][][];
  }
export type {  DashboardData, SectorData, DistrictData, GraphData, MapData, Feature, Coordinates, MetricData,    };

