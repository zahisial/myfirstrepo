export interface District {
  type: string;
  geometry: GeoJSON.Geometry;
  properties: {
    Name: string;
    AreaId: number;
    NAME_EN: string;
  };
}