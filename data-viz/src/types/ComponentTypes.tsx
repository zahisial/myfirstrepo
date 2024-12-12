import React from 'react';
import { GeoJSONFeature } from './MapTypes';

export interface DistrictSelectorProps {
  onDistrictChange: (district: string) => void;
  value: string;
}

export interface SectorSelectorProps {
  onSectorChange: (sector: string) => void;
  value: string;
}

export interface FetchComponentProps {
  url: string;
  fetchOptions?: RequestInit;
  children: (data: GeoJSONFeature[], loading: boolean) => React.ReactNode;
  errorComponent?: (error: Error) => React.ReactNode;
  filterFunction?: (feature: GeoJSONFeature) => boolean;
}

export interface ProtectedRouteProps {
  children: React.ReactNode;
}
