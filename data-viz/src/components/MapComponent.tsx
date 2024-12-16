/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

declare global {
  interface Window {
    mapboxglInitialized: boolean;
  }
}

import { useRef, useEffect, useState, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import "./mapBoxgl.css";
import { createRoot } from 'react-dom/client';
import EnhancedLocationCard from './EnhancedLocationCard';
import { Feature, Point, FeatureCollection, Geometry, GeoJsonProperties } from 'geojson';
import { useTranslation } from 'react-i18next';
import Loading from './Loading';
import { Feature as CustomFeature, Geometry as CustomGeometry, GeoJsonProperties as CustomGeoJsonProperties } from '../types/types';
// @ts-ignore
import { CardApiData } from '../types/types';
import React from 'react';
import { Switch } from "../components/ui/switch";
import { Label } from "../components/ui/label";

const ALL_DISTRICTS_COLOR = 'rgba(210,189,156, 0.1)';
const DISTRICT_BORDER_COLOR = 'rgba(210,189,156, 1)';
const SELECTED_DISTRICT_COLOR = 'rgba(231, 215, 190, 0.8)';
const DEFAULT_STYLE = 'mapbox://styles/lateefyusufzai/cm1rvwr4000zb01qr7g690cjc';
const SATELLITE_STYLE = 'mapbox://styles/mapbox/satellite-streets-v12';

if (!window.mapboxglInitialized) {
  mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

  mapboxgl.setRTLTextPlugin(
    'https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-rtl-text/v0.2.3/mapbox-gl-rtl-text.js',
    null,
    true
  );
  
  window.mapboxglInitialized = true;
}

// This is a hack to get around the map updating it's bounds when the style is changed to/from sattelite view
// since we need to perform the same initializing functions to show the area boundries and icons as we do on
// first map initialize but don't want to update the bounds of the map after the first time.
let updateBounds = true;

interface DashboardProps {  
  selectedDistrict: string;
  selectedSector: string;
  selectedCardData: CardApiData | CardApiData[] | null;
  districtsData: { results: { features: CustomFeature<CustomGeometry, CustomGeoJsonProperties>[] } } | null;
  onNavigate: (sectorUrl: string, districtId: string) => void;
}

interface FeatureProperties {
  NAME_EN: string;
  NAME_AR?: string;
  LABEL?: string;
  FID?: string;
  Population?: number;
  Notification?: number;
  Notification_Message?: string;
  SHAPE_STAr?: string | number;
  AreaId: number;
}

interface MapComponentProps {
  selectedDistrict: string;
  selectedSector: string;
  selectedCardData: CardApiData | CardApiData[] | null;
  districtsData: { results: { features: CustomFeature<CustomGeometry, CustomGeoJsonProperties>[] } } | null;
  onNavigate: (sectorUrl: string, districtId: string) => void;
  mapStyle: string;
  onMapStyleChange: (style: string) => void;
}

interface MapData {
  features: Feature[];
}

export interface CardApiData {
  mapData?: MapData;
}

type GeoJSONData = {
  type: string;
  features: Feature[];
};

interface Padding {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

export default function MapComponent({
  selectedDistrict,
  selectedSector,
  selectedCardData,
  districtsData,
  onNavigate,
  mapStyle,
  onMapStyleChange,
}: MapComponentProps) {
  const { i18n } = useTranslation();

  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const rotationIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const userInteractedRef = useRef<boolean>(false);
  const rotationGracePeriodRef = useRef<boolean>(false);
  const [mapLoaded, setMapLoaded] = useState<boolean>(false);
  const [layersLoaded, setLayersLoaded] = useState<boolean>(false);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const [fujairahAreaData, setFujairahAreaData] = useState<FeatureCollection | null>(null);
  const [styleLoaded, setStyleLoaded] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [mapInstance, setMapInstance] = useState<mapboxgl.Map | null>(null);
  const mapInitializedRef = useRef(false);
  const [interactionTimeout, setInteractionTimeout] = useState<NodeJS.Timeout | null>(null);

  const rotateCamera = useCallback(() => {
    if (!mapRef.current || userInteractedRef.current) return;
  
    const currentBearing = mapRef.current.getBearing();
    const newBearing = (currentBearing + 1) % 360;
    rotationGracePeriodRef.current = true;
    mapRef.current.easeTo({
      bearing: newBearing,
      duration: 250,
      easing: (t) => t,
    });
    setTimeout(() => {
      rotationGracePeriodRef.current = false;
    }, 100);
  }, []);

  const startRotation = useCallback(() => {
    if (!rotationIntervalRef.current) {
      rotationIntervalRef.current = setInterval(rotateCamera, 250);
    }
  }, [rotateCamera]);

  const stopRotation = useCallback((event: string) => {
    if (rotationGracePeriodRef.current && event === 'rotatestart') return;
    userInteractedRef.current = true;
    if (rotationIntervalRef.current) {
      clearInterval(rotationIntervalRef.current);
      rotationIntervalRef.current = null;
    }
  }, []);

  const initializeLayers = useCallback((map: mapboxgl.Map, featureCollection: FeatureCollection) => {
    if (!featureCollection) {
      return;
    }

    const textField = i18n.language === 'ar' ? 'NAME_AR' : 'NAME_EN';

    try {
      if (!map.getSource('fujairah-areas')) {
        map.addSource('fujairah-areas', {
          type: 'geojson',
          data: featureCollection
        });
      } else {
        (map.getSource('fujairah-areas') as mapboxgl.GeoJSONSource).setData(featureCollection);
      }

      if (!map.getLayer('fujairah-areas-fill')) {
        map.addLayer({
          id: 'fujairah-areas-fill',
          type: 'fill',
          source: 'fujairah-areas',
          paint: {
            'fill-color': 'rgba(255,229,153, 0.3)',
            'fill-opacity': 0.8
          }
        });
      }

      if (!map.getLayer('fujairah-areas-outline')) {
        map.addLayer({
          id: 'fujairah-areas-outline',
          type: 'line',
          source: 'fujairah-areas',
          paint: {
            'line-color': DISTRICT_BORDER_COLOR,
            'line-width': 1.5
          }
        });
      }

      if (!map.getLayer('fujairah-areas-labels')) {
        map.addLayer({
          id: 'fujairah-areas-labels',
          type: 'symbol',
          source: 'fujairah-areas',
          layout: {
            'text-field': ['get', textField],
            'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],
            'text-size': 12,
            'text-offset': [0, 0],
            'text-anchor': 'center',
            'text-variable-anchor': ['top', 'bottom', 'left', 'right'],
            'text-radial-offset': 0.5,
            'text-justify': 'auto',
            'icon-image': 'notification-icon',
            'icon-size': 0.5,
            'icon-offset': [-20, -10],
            'icon-anchor': 'left',
            'icon-optional': true,
            'icon-allow-overlap': true,
            'text-allow-overlap': false,
            'icon-ignore-placement': true,
            'text-ignore-placement': false,
            'symbol-sort-key': ['get', 'Population'],
            'text-writing-mode': ['horizontal'],
            'text-max-width': 100
          },
          paint: {
            'text-color': '#ffffff',
            'text-halo-color': '#000000',
            'text-halo-width': 1,
            'text-opacity': 0.8,
            'icon-opacity': [
              'case',
              ['>', ['get', 'Notification'], 0], 1,
              0
            ]
          }
        });
      }

      setLayersLoaded(true);
    } catch (error) {
    }
  }, [i18n.language]);

  const addMarkers = useCallback((map: mapboxgl.Map, cardData: CardApiData[]) => {
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    if (cardData && cardData.length > 0 && cardData[0]?.mapData) {
      const mapData = cardData[0].mapData;
      if (typeof mapData === 'object' && 'features' in (mapData as MapData)) {
        (mapData as MapData).features.forEach((feature: Feature) => {
          const el = document.createElement('div');
          el.className = 'marker';
          el.style.backgroundImage = 'url(https://docs.mapbox.com/mapbox-gl-js/assets/custom_marker.png)';
          el.style.width = '32px';
          el.style.height = '32px';
          el.style.backgroundSize = '100%';

          const marker = new mapboxgl.Marker(el)
            .setLngLat((feature.geometry as Point).coordinates as [number, number])
            .setPopup(new mapboxgl.Popup({ offset: 25 })
              .setHTML(`<h3>${feature.properties?.Name}</h3>`))
            .addTo(map);

          markersRef.current.push(marker);
        });
      }
    }
  }, []);

  const updateDistrictVisibility = useCallback((map: mapboxgl.Map, selectedDistrict: string, padding: Padding = { top: 0.4, bottom: 0.4, left: 0.1, right: 0.5 }) => {
    if (!fujairahAreaData || !styleLoaded || !map.isStyleLoaded()) {
      return;
    }

    stopRotation('districtSelected');

    const popups = document.getElementsByClassName('mapboxgl-popup');
    while (popups[0]) {
      popups[0].remove();
    }

    const mapWidth = map.getContainer().clientWidth;
    const mapHeight = map.getContainer().clientHeight;

    const calculatedPadding = {
      top: mapHeight * padding.top,
      bottom: mapHeight * padding.bottom,
      left: mapWidth * padding.left,
      right: mapWidth * padding.right,
    };

    if (selectedDistrict === '-1') {
      map.setFilter('fujairah-areas-labels', null);
      map.setPaintProperty('fujairah-areas-fill', 'fill-color', ALL_DISTRICTS_COLOR);

      const bounds = new mapboxgl.LngLatBounds();
      fujairahAreaData.features.forEach((feature) => {
        if (feature.geometry.type === 'MultiPolygon') {
          feature.geometry.coordinates.forEach((polygon) => {
            polygon.forEach((ring) => {
              ring.forEach((coord) => {
                bounds.extend(coord as [number, number]);
              });
            });
          });
        }
      });

      map.fitBounds(bounds, {
        padding: calculatedPadding,
        duration: 1000,
      });

      userInteractedRef.current = true;
    } else {
      map.setFilter('fujairah-areas-labels', ['==', ['get', 'AreaId'], parseInt(selectedDistrict)]);

      const selectedFeature = fujairahAreaData.features.find(
        (feature) => feature.properties?.AreaId === parseInt(selectedDistrict)
      );

      if (selectedFeature && selectedFeature.geometry.type === 'MultiPolygon') {
        const bounds = new mapboxgl.LngLatBounds();
        selectedFeature.geometry.coordinates.forEach((polygon) => {
          polygon.forEach((ring) => {
            ring.forEach((coord) => {
              bounds.extend(coord as [number, number]);
            });
          });
        });

        map.fitBounds(bounds, {
          padding: calculatedPadding,
          duration: 1000,
        });

        const expression = [
          'case',
          ['==', ['get', 'AreaId'], parseInt(selectedDistrict)],
          SELECTED_DISTRICT_COLOR,
          ALL_DISTRICTS_COLOR
        ];
        map.setPaintProperty('fujairah-areas-fill', 'fill-color', expression);
      }
    }

    map.triggerRepaint();
  }, [fujairahAreaData, styleLoaded, stopRotation]);

  const setupMapInteractions = (map: mapboxgl.Map) => {
    map.on('click', 'fujairah-areas-fill', (e) => {
      if (e.features && e.features.length > 0) {
        const feature = e.features[0];
        const coordinates = e.lngLat;
        const properties = feature.properties as FeatureProperties;

        if (properties) {
          const popupContent = document.createElement('div');
          const root = createRoot(popupContent);
          root.render(
            <EnhancedLocationCard
              properties={properties}
              onSectorSelect={(sector) => {
              }}
              onNavigate={onNavigate}
            />
          );

          new mapboxgl.Popup()
            .setLngLat(coordinates)
            .setDOMContent(popupContent)
            .addTo(map);
        }
      }
    });

    map.on('mouseenter', 'fujairah-areas-fill', () => {
      map.getCanvas().style.cursor = 'pointer';
    });
    map.on('mouseleave', 'fujairah-areas-fill', () => {
      map.getCanvas().style.cursor = '';
    });
  };

  useEffect(() => {
    if (!mapContainer.current || !districtsData) {
      return;
    }

    if (!districtsData.results || !districtsData.results.features) {
      return;
    }

    if (mapRef.current) {
      updateExistingMap(mapRef.current, districtsData);
      return;
    }

    initializeNewMap(districtsData);

  }, [districtsData]);

  useEffect(() => {
    if (!mapInstance || !styleLoaded || !layersLoaded || !fujairahAreaData) return;

    updateDistrictVisibility(mapInstance, selectedDistrict);
    updateFillColor(mapInstance, selectedDistrict);
    addMarkers(mapInstance, Array.isArray(selectedCardData) ? selectedCardData : [selectedCardData].filter(Boolean) as CardApiData[]);
    updateLabels(mapInstance);

  }, [mapInstance, styleLoaded, layersLoaded, fujairahAreaData, selectedDistrict, selectedSector, selectedCardData, i18n.language]);

  const updateMapView = (map: mapboxgl.Map, featureCollection: FeatureCollection) => {
    const bounds = new mapboxgl.LngLatBounds();
    featureCollection.features.forEach((feature) => {
      if (feature.geometry.type === 'MultiPolygon') {
        feature.geometry.coordinates.forEach((polygon) => {
          polygon.forEach((ring) => {
            ring.forEach((coord) => {
              bounds.extend(coord as [number, number]);
            });
          });
        });
      }
    });

    if (!bounds.isEmpty() && updateBounds) {
      setTimeout(() => {
        map.fitBounds(bounds, {
          padding: { top: 50, bottom: 50, left: 50, right: 50 },
          duration: 3000,
          easing: (t) => t,
        });

        map.once('moveend', () => {
          const currentZoom = map.getZoom();
          map.easeTo({
            zoom: currentZoom + 1.3,
            duration: 2500,
            easing: (t) => t,
          });

          map.once('moveend', () => {
            setTimeout(() => {
              userInteractedRef.current = false;
              startRotation();
              setIsLoading(false);
            }, 1000);
          });
        });
      }, 500);
    } else {
      setIsLoading(false);
      startRotation();
    }

    updateBounds = true;
  };

  const updateFillColor = useCallback((map: mapboxgl.Map, selectedDistrict: string) => {
    if (!map.getLayer('fujairah-areas-fill')) {
      return;
    }

    const fillColor = selectedDistrict !== '-1'
      ? [
          'case',
          ['==', ['get', 'AreaId'], parseInt(selectedDistrict)],
          SELECTED_DISTRICT_COLOR,
          ALL_DISTRICTS_COLOR
        ]
      : ALL_DISTRICTS_COLOR;

    map.setPaintProperty('fujairah-areas-fill', 'fill-color', fillColor);
  }, []);

  const updateLabels = (map: mapboxgl.Map) => {
    const textField = i18n.language === 'ar' ? 'NAME_AR' : 'NAME_EN';
    if (map.getLayer('fujairah-areas-labels')) {
      map.setLayoutProperty('fujairah-areas-labels', 'text-field', ['get', textField]);
    }
  };

  function initializeMapAfterStyleLoad(map: mapboxgl.Map, featureCollection: FeatureCollection) {
    setMapLoaded(true);
    setStyleLoaded(true);
    setMapInstance(map);

    const labelsToHide = [
      'state-label', 'country-label', 'water-point-label',
      'water-line-label', 'natural-point-label', 'natural-line-label', 'waterway-label'
    ];
    labelsToHide.forEach(label => {
      if (map.getLayer(label)) {
        map.setLayoutProperty(label, 'visibility', 'none');
      }
    });

    initializeLayers(map, featureCollection);

    if (!map.hasImage('notification-icon')) {
      map.loadImage(
        'https://docs.mapbox.com/mapbox-gl-js/assets/custom_marker.png',
        (error, image) => {
          if (error) {
            return;
          }
          if (!image) {
            return;
          }
          map.addImage('notification-icon', image);
          
          setupMapInteractions(map);
          updateMapView(map, featureCollection);
        }
      );
    } else {
      setupMapInteractions(map);
      updateMapView(map, featureCollection);
    }
  }

  const initializeNewMap = (data: typeof districtsData) => {
    setIsLoading(true);
    
    if (!data || !data.results || !data.results.features) {
      setIsLoading(false);
      return;
    }

    const filteredFeatures = data.results.features.filter(feature => feature.geometry !== null);
    const featureCollection: FeatureCollection = {
      type: 'FeatureCollection',
      features: filteredFeatures as Feature<GeoJSON.Geometry, GeoJSON.GeoJsonProperties>[]
    };
    setFujairahAreaData(featureCollection);

    const map = new mapboxgl.Map({
      container: mapContainer.current!,
      style: mapStyle,
      projection: 'globe',
      zoom: 1,
      center: [30, 15],
      pitch: 55,
      interactive: true,
      localIdeographFontFamily: "'Noto Sans', 'Noto Sans Arabic', sans-serif"
    });
    mapRef.current = map;

    map.on('style.load', function() {
      if (!map.isStyleLoaded()) {
        map.once('idle', () => {
          initializeMapAfterStyleLoad(map, featureCollection);
        });
      } else {
        initializeMapAfterStyleLoad(map, featureCollection);
      }
    });
  };

  const updateExistingMap = (map: mapboxgl.Map, data: typeof districtsData) => {
    if (!data || !data.results || !data.results.features) {
      return;
    }

    const filteredFeatures = data.results.features.filter(feature => feature.geometry !== null);
    const featureCollection: FeatureCollection = {
      type: 'FeatureCollection',
      features: filteredFeatures as Feature<GeoJSON.Geometry, GeoJSON.GeoJsonProperties>[]
    };
    setFujairahAreaData(featureCollection);

    if (map.getSource('fujairah-areas')) {
      (map.getSource('fujairah-areas') as mapboxgl.GeoJSONSource).setData(featureCollection);
    }

    updateDistrictVisibility(map, selectedDistrict);
    updateFillColor(map, selectedDistrict);
    addMarkers(map, Array.isArray(selectedCardData) ? selectedCardData : [selectedCardData].filter(Boolean) as CardApiData[]);
    updateLabels(map);
  };

  useEffect(() => {
    if (!mapInstance) return;

    const handleInteraction = (e: mapboxgl.MapMouseEvent | mapboxgl.MapTouchEvent | mapboxgl.MapWheelEvent) => {
      stopRotation(e.type as mapboxgl.MapEventType);
    };

    const events = ['wheel', 'mousedown', 'touchstart', 'dragstart'] as const;

    events.forEach((event) => {
      // @ts-ignore
      mapInstance.on(event, handleInteraction as (ev: mapboxgl.MapMouseEvent) => void);
    });

    return () => {
      events.forEach((event) => {
        // @ts-ignore
        mapInstance.off(event, handleInteraction as (ev: mapboxgl.MapMouseEvent) => void);
      });

      if (interactionTimeout) {
        clearTimeout(interactionTimeout);
      }
    };
  }, [mapInstance, stopRotation, interactionTimeout]);

  useEffect(() => {
    if (!mapInstance || !fujairahAreaData) return;

    const currentZoom = mapInstance.getZoom();
    const currentCenter = mapInstance.getCenter();
    const currentPitch = mapInstance.getPitch();
    const currentBearing = mapInstance.getBearing();

    updateBounds = false;

    mapInstance.setStyle(mapStyle);
    
    mapInstance.once('style.load', () => {
      mapInstance.jumpTo({
        center: currentCenter,
        zoom: currentZoom,
        pitch: currentPitch,
        bearing: currentBearing
      });

      mapInstance.stop();

      if (fujairahAreaData) {
        initializeLayers(mapInstance, fujairahAreaData);
        updateDistrictVisibility(mapInstance, selectedDistrict);
        updateFillColor(mapInstance, selectedDistrict);
        if (selectedCardData) {
          addMarkers(mapInstance, Array.isArray(selectedCardData) ? selectedCardData : [selectedCardData].filter(Boolean));
        }
        updateLabels(mapInstance);
      }
    });
  }, [mapStyle]);

  return (
    <div className="relative w-screen h-[100svh]">
      <div ref={mapContainer} className="w-full h-full" />
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <Loading />
        </div>
      )}
    </div>
  );
}
