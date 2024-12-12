/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { useRef, useEffect, useState, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import "./mapBoxgl.css";
import { createRoot } from 'react-dom/client';
import EnhancedLocationCard from './EnhancedLocationCard';
import { Feature, Point, FeatureCollection, Geometry, GeoJsonProperties } from 'geojson';
import { useTranslation } from 'react-i18next';
import Loading from './Loading'; // Import the Loading component from your codebase
import { Feature as CustomFeature, Geometry as CustomGeometry, GeoJsonProperties as CustomGeoJsonProperties } from '../types/types';
// @ts-ignore
import { CardApiData } from '../types/types';
import React from 'react';
import { Switch } from "../components/ui/switch";
import { Label } from "../components/ui/label";

// Define color constants
const ALL_DISTRICTS_COLOR = 'rgba(210,189,156, 0.1)';
const DISTRICT_BORDER_COLOR = 'rgba(210,189,156, 1)';
const SELECTED_DISTRICT_COLOR = 'rgba(231, 215, 190, 0.8)';
const DEFAULT_STYLE = 'mapbox://styles/lateefyusufzai/cm1rvwr4000zb01qr7g690cjc';
const SATELLITE_STYLE = 'mapbox://styles/mapbox/satellite-streets-v12';

// Replace the hardcoded access token with the environment variable
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

// Add a check to ensure the token is set
if (!mapboxgl.accessToken) {
  //console.error("Mapbox access token is not set!");
}

mapboxgl.setRTLTextPlugin(
  'https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-rtl-text/v0.2.3/mapbox-gl-rtl-text.js',
  null,
  true // Lazy load the plugin
);

interface DashboardProps {  
  selectedDistrict: string;
  selectedSector: string;
  selectedCardData: CardApiData | CardApiData[] | null;
  districtsData: { results: { features: CustomFeature<CustomGeometry, CustomGeoJsonProperties>[] } } | null;
  onNavigate: (sectorUrl: string, districtId: string) => void; // Add this prop
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
  onNavigate: (sectorUrl: string, districtId: string) => void; // Add this prop
  mapStyle: string; // Add this prop
  onMapStyleChange: (style: string) => void; // Add this prop
}

interface MapData {
  features: Feature[];
  // Add other properties if needed
}

export interface CardApiData {
  // ... other properties ...
  mapData?: MapData;
}

// Define the type for your GeoJSON data
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
  // ... component code ...

  const { i18n } = useTranslation();

  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const rotationIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const userInteractedRef = useRef<boolean>(false);
  const rotationGracePeriodRef = useRef<boolean>(false);
  const [bearing, setBearing] = useState<number>(0);
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
    setBearing(newBearing);
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
    // console.log("Initializing layers. featureCollection:", featureCollection);
    if (!featureCollection) {
      //console.warn("featureCollection is null, skipping layer initialization");
      return;
    }

    const textField = i18n.language === 'ar' ? 'NAME_AR' : 'NAME_EN';

    try {
      if (!map.getSource('fujairah-areas')) {
        // console.log("Adding 'fujairah-areas' source");
        map.addSource('fujairah-areas', {
          type: 'geojson',
          data: featureCollection
        });
      } else {
        // console.log("Updating 'fujairah-areas' source");
        (map.getSource('fujairah-areas') as mapboxgl.GeoJSONSource).setData(featureCollection);
      }

      if (!map.getLayer('fujairah-areas-fill')) {
        // console.log("Adding 'fujairah-areas-fill' layer");
        map.addLayer({
          id: 'fujairah-areas-fill',
          type: 'fill',
          source: 'fujairah-areas',
          paint: {
            // 'fill-color': 'rgba(37,99,235, 0.3)',
            'fill-color': 'rgba(255,229,153, 0.3)',
            'fill-opacity': 0.8
          }
        });
      }

      if (!map.getLayer('fujairah-areas-outline')) {
        // console.log("Adding 'fujairah-areas-outline' layer");
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
        // console.log("Adding 'fujairah-areas-labels' layer");
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

      // console.log("Layers initialized successfully");
      setLayersLoaded(true);
    } catch (error) {
      //console.error("Error initializing layers:", error);
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
      // console.warn("Map not ready for updates", {
      //   fujairahAreaData: !!fujairahAreaData,
      //   styleLoaded,
      //   mapStyleLoaded: map.isStyleLoaded()
      // });
      return;
    }

    // Stop rotation regardless of the selected district
    stopRotation('districtSelected');

    // Close any open popups before zooming
    const popups = document.getElementsByClassName('mapboxgl-popup');
    while (popups[0]) {
      popups[0].remove();
    }

    const mapWidth = map.getContainer().clientWidth;
    const mapHeight = map.getContainer().clientHeight;

    // Calculate padding as a percentage of the map's dimensions
    const calculatedPadding = {
      top: mapHeight * padding.top,
      bottom: mapHeight * padding.bottom,
      left: mapWidth * padding.left,
      right: mapWidth * padding.right,
    };

    if (selectedDistrict === '-1') {
      map.setFilter('fujairah-areas-labels', null);
      map.setPaintProperty('fujairah-areas-fill', 'fill-color', ALL_DISTRICTS_COLOR);

      // Fit to bounds of all features
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

      // Do not resume rotation
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
                //console.log('Sector selected:', sector);
              }}
              onNavigate={onNavigate} // Pass the navigation function
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
      //console.warn("Missing required data for map initialization");
      return;
    }

    if (!districtsData.results || !districtsData.results.features) {
      //console.error("Invalid districtsData:", districtsData);
      return;
    }

    if (mapRef.current) {
      // console.log("Map already initialized, updating data");
      updateExistingMap(mapRef.current, districtsData);
      return;
    }

    // console.log("Initializing new map");
    initializeNewMap(districtsData);

  }, [districtsData]);

  useEffect(() => {
    if (!mapInstance || !styleLoaded || !layersLoaded || !fujairahAreaData) return;

    updateDistrictVisibility(mapInstance, selectedDistrict);
    updateFillColor(mapInstance, selectedDistrict);
    addMarkers(mapInstance, Array.isArray(selectedCardData) ? selectedCardData : [selectedCardData].filter(Boolean) as CardApiData[]);
    updateLabels(mapInstance);

  }, [mapInstance, styleLoaded, layersLoaded, fujairahAreaData, selectedDistrict, selectedSector, selectedCardData, i18n.language]);

  // Helper functions
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

    if (!bounds.isEmpty()) {
      setTimeout(() => {
        //console.log("Initial zoom level:", map.getZoom());
        map.fitBounds(bounds, {
          padding: { top: 50, bottom: 50, left: 50, right: 50 },
          duration: 3000,
          easing: (t) => t,
        });

        map.once('moveend', () => {
          const currentZoom = map.getZoom();
          //console.log("Zoom level after fitBounds:", currentZoom);
          map.easeTo({
            zoom: currentZoom + 1.3,
            // zoom: Math.max(currentZoom - 1, 0), // Zoom out by 1 level, but not below 0
            duration: 2500,
            easing: (t) => t,
          });

          map.once('moveend', () => {
            //console.log("Final zoom level:", map.getZoom());
            setTimeout(() => {
              userInteractedRef.current = false;
              startRotation();
              setIsLoading(false);
            }, 1000);
          });
        });
      }, 500);
    } else {
      //console.log("Bounds empty, current zoom level:", map.getZoom());
      setIsLoading(false);
      startRotation();
    }
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

    // console.log("Initializing layers");
    initializeLayers(map, featureCollection);

    if (!map.hasImage('notification-icon')) {
      // console.log("Loading notification icon");
      map.loadImage(
        'https://docs.mapbox.com/mapbox-gl-js/assets/custom_marker.png',
        (error, image) => {
          if (error) {
            console.error("Error loading notification icon:", error);
            return;
          }
          if (!image) {
            console.warn("Notification icon image is null");
            return;
          }
          map.addImage('notification-icon', image);
          
          // console.log("Setting up map interactions");
          setupMapInteractions(map);
          // console.log("Updating map view");
          updateMapView(map, featureCollection);
        }
      );
    } else {
      // console.log("Notification icon already loaded");
      setupMapInteractions(map);
      updateMapView(map, featureCollection);
    }
  }

  const initializeNewMap = (data: typeof districtsData) => {
    // console.log("Setting up new map. districtsData:", data);
    setIsLoading(true);
    
    if (!data || !data.results || !data.results.features) {
      // console.error("Invalid districtsData:", data);
      setIsLoading(false);
      return;
    }

    const filteredFeatures = data.results.features.filter(feature => feature.geometry !== null);
    // console.log("Filtered features:", filteredFeatures);
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
    // console.log("Map instance created successfully");
    mapRef.current = map;

    map.on('style.load', function() {
      // console.log("Map style load event fired");
      if (!map.isStyleLoaded()) {
        console.warn("Style reported as loaded, but isStyleLoaded() returns false. Waiting for idle event.");
        map.once('idle', () => {
          // console.log("Map idle event fired, proceeding with initialization");
          initializeMapAfterStyleLoad(map, featureCollection);
        });
      } else {
        // console.log("Style fully loaded, proceeding with initialization");
        initializeMapAfterStyleLoad(map, featureCollection);
      }
    });

    map.on('load', () => {
      // console.log("Map fully loaded");
    });

    // Add other event listeners here
  };

  const updateExistingMap = (map: mapboxgl.Map, data: typeof districtsData) => {
    // console.log("Updating existing map with new data");
    
    if (!data || !data.results || !data.results.features) {
      console.error("Invalid districtsData for update:", data);
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

    // Update the handleInteraction function signature
    const handleInteraction = (e: mapboxgl.MapMouseEvent | mapboxgl.MapTouchEvent | mapboxgl.MapWheelEvent) => {
      stopRotation(e.type as mapboxgl.MapEventType);
    };

    const events = ['wheel', 'mousedown', 'touchstart', 'dragstart'] as const;

    events.forEach((event) => {
      // Update the type assertion for the event listener
      // @ts-ignore
      mapInstance.on(event, handleInteraction as (ev: mapboxgl.MapMouseEvent) => void);
    });

    return () => {
      events.forEach((event) => {
        // Update the type assertion for removing the event listener
        // @ts-ignore
        mapInstance.off(event, handleInteraction as (ev: mapboxgl.MapMouseEvent) => void);
      });

      // Clear any existing timeout on cleanup
      if (interactionTimeout) {
        clearTimeout(interactionTimeout);
      }
    };
  }, [mapInstance, stopRotation, interactionTimeout]);

  // Add this effect to handle style changes
  useEffect(() => {
    if (!mapInstance || !fujairahAreaData) return;

    // Store current camera position and bearing
    const currentZoom = mapInstance.getZoom();
    const currentCenter = mapInstance.getCenter();
    const currentPitch = mapInstance.getPitch();
    const currentBearing = mapInstance.getBearing();

    mapInstance.setStyle(mapStyle);
    
    // Re-add layers after style change
    mapInstance.once('style.load', () => {
      // Restore camera position and bearing with no animation
      mapInstance.jumpTo({
        center: currentCenter,
        zoom: currentZoom,
        pitch: currentPitch,
        bearing: currentBearing
      });

      // Stop any ongoing animations
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
