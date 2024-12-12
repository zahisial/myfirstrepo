export interface GeoJSONFeature {
  type: "Feature";
  properties: {
    Notification: number;
    Notification_Message: string;
    Name: string;
    [key: string]: any;
  };
  geometry: {
    type: string;
    coordinates: number[][][];
  };
}

export interface GeoJSONData {
  type: "FeatureCollection";
  name: string;
  features: GeoJSONFeature[];
}

export interface EnhancedLocationCardProps {
  properties: {
    NAME_EN: string;
    NAME_AR?: string;
    FID?: string;
    Population?: number;
    Notification?: number;
    Notification_Message?: string;
    SHAPE_STAr?: string | number;
  };
}
