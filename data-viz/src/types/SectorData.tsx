export type SectorData<T> = {
    [key: string]: {
      [key: string]: T;
    };
  };