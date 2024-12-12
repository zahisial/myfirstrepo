/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState, useEffect, useCallback } from "react";
import Loading, { MapLoading } from "../components/Loading";
import TopBar from "../components/TopBar";
import LeftPanel from "../components/LeftPanel";
import RightPanel from "../components/RightPanel";
import MapComponent from "../components/MapComponent";
import DashRightPanel from "../components/DashRightPanel";
import DashLeftPanel from "../components/DashLeftPanel";
import { createDataFetcher } from "../utils/api";
import { District } from "../types/District";

import {
  ApiResponse,
  Feature,
  Geometry,
  GeoJsonProperties,
} from "../types/types";
// @ts-ignore
import { CardApiData } from "../types/types";
import {
  CustomFeature,
  CustomGeometry,
  CustomGeoJsonProperties,
} from "../types/types";
import { SECTOR_KEYS } from "../data/sectorsKeys";
import { InfoIcon, TriangleAlert } from "lucide-react";
import { useNavigate, useParams } from 'react-router-dom';

export interface CardApiData {
  apiResponse: ApiResponse | null;
  visualType: string;
}

// Add TimeRanges type near the top with other types
type TimeRanges = '3months' | '6months' | '12months' | '24months' | 'all';

const sectors = Object.values(SECTOR_KEYS)
  .filter((sector) => sector.id !== 0)
  .map((sector) => sector.name);
const fetchDistricts = createDataFetcher<{
  results: { features: Feature<Geometry, GeoJsonProperties>[] };
}>();
const fetchDashboardData = createDataFetcher<ApiResponse>();

// Add these constants at the top of the file, after imports
const DEFAULT_STYLE = 'mapbox://styles/lateefyusufzai/cm1rvwr4000zb01qr7g690cjc';
const SATELLITE_STYLE = 'mapbox://styles/mapbox/satellite-streets-v12';

export default function Dashboard() {
  const [selectedSector, setSelectedSector] = useState<string>("All Sectors");
  const [selectedDistrict, setSelectedDistrict] = useState<string>("-1");
  const [selectedCardData, setSelectedCardData] = useState<
    CardApiData | CardApiData[] | null
  >(null);
  const [showExpandedRightPanel, setShowExpandedRightPanel] = useState(false);
  const [mapData, setMapData] = useState(false);
  const [districts, setDistricts] = useState<District[]>([]);
  const [isRightPanelExpanded, setIsRightPanelExpanded] = useState(false);
  const [districtsData, setDistrictsData] = useState<{
    results: {
      features: CustomFeature<CustomGeometry, CustomGeoJsonProperties>[];
    };
  } | null>(null);
  const [isDistrictsLoading, setIsDistrictsLoading] = useState<boolean>(true);
  const [isMapLoading, setIsMapLoading] = useState(false);
  const [dashboardData, setDashboardData] = useState<ApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<TimeRanges>('3months');
  const [mapStyle, setMapStyle] = useState(DEFAULT_STYLE);

  const fetchSectorData = useCallback(async (sector: string) => {
    try {
      const sectorData = Object.values(SECTOR_KEYS).find(
        (s) => s.name === sector
      );
      if (sectorData) {
        const endDate = new Date();
        const startDate = new Date();
        
        let url = sectorData.api;
        console.log(`Selected Time Range: ${timeRange}`);
        
        if (timeRange !== 'all') {
          switch (timeRange) {
            case '3months':
              startDate.setMonth(endDate.getMonth() - 3);
              console.log('3 Months Range:', {
                startDate: startDate.toISOString(),
                endDate: endDate.toISOString()
              });
              break;
            case '6months':
              startDate.setMonth(endDate.getMonth() - 6);
              console.log('6 Months Range:', {
                startDate: startDate.toISOString(),
                endDate: endDate.toISOString()
              });
              break;
            case '12months':
              startDate.setMonth(endDate.getMonth() - 12);
              console.log('12 Months Range:', {
                startDate: startDate.toISOString(),
                endDate: endDate.toISOString()
              });
              break;
            case '24months':
              startDate.setMonth(endDate.getMonth() - 24);
              console.log('24 Months Range:', {
                startDate: startDate.toISOString(),
                endDate: endDate.toISOString()
              });
              break;
          }
          
          const fromDate = `${startDate.getFullYear()}-${String(startDate.getMonth() + 1).padStart(2, '0')}`;
          const toDate = `${endDate.getFullYear()}-${String(endDate.getMonth() + 1).padStart(2, '0')}`;
          url += `${url.includes('?') ? '&' : '?'}from=${fromDate}&to=${toDate}`;
          console.log('Formatted URL:', {
            baseUrl: sectorData.api,
            finalUrl: url,
            fromDate,
            toDate
          });
        } else {
          console.log('All Data Range Selected - No date filtering applied');
          console.log('Using base URL:', url);
        }

        const response = await fetchDashboardData(url);
        console.log("API Response:", response);
        return response;
      }
    } catch (error) {
      console.error("Error fetching sector data:", error);
      setError(`Failed to load data for ${sector}`);
    }
  }, [timeRange]);

  const [isOrange, setIsOrange] = useState(false);

  const textColorClass = isOrange ? "text-orange-500" : "text-white";

  const loadData = useCallback(async () => {
    setIsDistrictsLoading(true);
    try {
      const [districtsResponse, dashboardResponse] = await Promise.all([
        fetchDistricts("/districts/"),
        fetchDashboardData("/dashboard/"), // Remove the hardcoded date range for 24-month data
      ]);

      if (
        districtsResponse &&
        districtsResponse.results &&
        Array.isArray(districtsResponse.results.features)
      ) {
        const filteredDistricts = districtsResponse.results.features.filter(
          (district) =>
            !district.properties.Name.includes("Not Identified") &&
            district.properties.AreaId !== 0
        );
        setDistricts([
          {
            type: "Feature",
            geometry: { type: "MultiPolygon", coordinates: [] },
            // @ts-ignore
            properties: {
              Name: "All Districts",
              AreaId: -1,
              NAME_EN: "All Districts",
            },
          },
          ...filteredDistricts,
        ]);
        setDistrictsData(districtsResponse);
      }

      if (dashboardResponse) {
        // @ts-ignore
        const { range: rangeData, ...dashboardDataWithoutRange } = dashboardResponse;
        setDashboardData(dashboardDataWithoutRange);
      }
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setIsDistrictsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const navigate = useNavigate();
  const { sector: urlSector, district: urlDistrict } = useParams();

  useEffect(() => {
    if (urlSector === 'allsector') {
      setSelectedSector("All Sectors");
    } else if (urlSector) {
      const sectorData = Object.values(SECTOR_KEYS).find(s => s.api === `/${urlSector}/`);
      if (sectorData) {
        setSelectedSector(sectorData.name);
      }
    }
    if (urlDistrict) {
      setSelectedDistrict(urlDistrict);
    }
  }, [urlSector, urlDistrict]);

  const handleSectorChange = async (sector: string) => {
    setSelectedSector(sector);
    setSelectedCardData(null);
    setShowExpandedRightPanel(false);

    const sectorUrl = sector === "All Sectors" ? "allsector" : 
      Object.values(SECTOR_KEYS).find(s => s.name === sector)?.api.replace(/\//g, '') || 
      sector.toLowerCase().replace(/ /g, '-');

    navigate(`/dashboard/${sectorUrl}/${selectedDistrict}`, { replace: true });

    await fetchSectorData(sector);
  };

  const handleDistrictChange = (districtId: string) => {
    setSelectedDistrict(districtId);
    setSelectedCardData(null);
    setShowExpandedRightPanel(false);

    const sectorUrl = selectedSector === "All Sectors" ? "allsector" : 
      Object.values(SECTOR_KEYS).find(s => s.name === selectedSector)?.api.replace(/\//g, '') || 
      selectedSector.toLowerCase().replace(/ /g, '-');

    navigate(`/dashboard/${sectorUrl}/${districtId}`, { replace: true });
  };

  const handleCardClick = (cardData: CardApiData) => {
    setSelectedCardData(cardData);
    // Use optional chaining to safely access mapData
    setMapData(!!cardData.mapData);
    setShowExpandedRightPanel(!cardData.mapData);
  };

  const showDefaultPanels =
    selectedSector === "All Sectors" && selectedDistrict === "-1";
  const showMap = import.meta.env.VITE_REACT_APP_SHOW_MAP === "true"; // Add this line to read the environment variable
  const expandRightPanel = () => {
    setShowExpandedRightPanel(true);
    setIsRightPanelExpanded(true);
  };

  const handleDateRangeChange = async (range: string) => {
    try {
      const response = await fetchDashboardData(`/dashboard/?${range}`);
      if (response) {
        // Create new object without the 'range' property
        // @ts-ignore
        const { range: rangeData, ...dashboardDataWithoutRange } = response;
        setDashboardData(dashboardDataWithoutRange);
        //console.log("Dashboard data without range:", dashboardDataWithoutRange);
      }
    } catch (error) {
      //console.error("Error fetching dashboard data:", error);
      setError("Failed to load dashboard data");
    }
  };

  const handleNavigation = (sectorUrl: string, districtId: string) => {
    navigate(`/dashboard/${sectorUrl}/${districtId}`, { replace: true });
  };

  // Add TimeRanges change handler
  const handleTimeRangeChange = async (newRange: TimeRanges) => {
    setTimeRange(newRange);
    if (selectedSector !== "All Sectors") {
      await fetchSectorData(selectedSector);
    }
  };

  const handleMapStyleChange = (newStyle: string) => {
    setMapStyle(newStyle);
  };

  if (isDistrictsLoading) {
    return <Loading fullScreen />;
  }

  return (
    <div className="relative w-full min-h-screen overflow-hidden text-white bg-gradient-to-r from-[#0c0f1e] via-[#070c14] to-indigo-900">
      <div className="fixed top-0 left-0 right-0 z-50">
        <TopBar
          selectedSector={selectedSector}
          selectedDistrict={selectedDistrict}
          onSectorChange={handleSectorChange}
          onDistrictChange={handleDistrictChange}
          availableSectors={sectors}
          districts={districts}
          mapStyle={mapStyle}
          onMapStyleChange={handleMapStyleChange}
          DEFAULT_STYLE={DEFAULT_STYLE}
          SATELLITE_STYLE={SATELLITE_STYLE}
        />
      </div>
      <div className="relative z-20 w-full pt-12">
        <main className="flex flex-row justify-between h-full">
          <div className="relative w-full">
            <div className="absolute top-0 start-0 w-[35%] space-y-6 z-[1] xl:w-[20%]">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-900 to-transparent opacity-90 z-0 h-[100vh]">
                <div className="absolute inset-0 z-10 backdrop-blur-md">
                  <div
                    className={`relative  z-20 p-6 md:p-s-0 space-y-6 ${showDefaultPanels ? "flex flex-col" : ""
                      }`}
                  >
                    {showDefaultPanels ? (
                      <DashLeftPanel
                        selectedDistrict={selectedDistrict}
                        selectedSector={selectedSector}
                      />
                    ) : (
                      <LeftPanel
                        sector={selectedSector}
                        district={selectedDistrict}
                        onCardClick={(cardData: CardApiData) =>
                          handleCardClick(cardData)
                        }
                        expandRightPanel={expandRightPanel}
                        districts={districts}
                        TimeRanges={timeRange}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className={`relative w-full h-full`}>
              {isMapLoading ? (
                <MapLoading />
              ) : (
                  districtsData && ( // Update this line to check the showMap variable
                  <MapComponent
                    selectedSector={selectedSector}
                    selectedDistrict={selectedDistrict}
                    selectedCardData={selectedCardData}
                    districtsData={
                      districtsData as {
                        results: {
                          features: CustomFeature<
                            CustomGeometry,
                            CustomGeoJsonProperties
                          >[];
                        };
                      }
                    }
                    onNavigate={handleNavigation} // Pass the navigation handler
                    mapStyle={mapStyle}
                    onMapStyleChange={handleMapStyleChange}
                  />
                )
              )}
            </div>
            <div
              className={`absolute  top-[0px] end-0 z-[1] ${mapData
                ? "w-[35%] xl:w-[20%]"
                : showExpandedRightPanel && !showDefaultPanels
                  ? "w-[60%] top-0 xl:w-[60%]"
                  : "w-[35%] top-0 xl:w-[20%]"
                }`}
            >
              <div
                className={`absolute inset-0 bg-gradient-to-l from-indigo-900 to-transparent opacity-90  z-0 h-[100vh]  ${mapData
                  ? "w-[35%] xl:w-[20%] bg-gradient-to-l from-indigo-900 to-transparent opacity-90  z-0 h-[100vh]"
                  : showExpandedRightPanel && !showDefaultPanels
                    ? "bg-gradient-to-l from-indigo-900 to-transparent opacity-90  z-0 h-[100vh]"
                    : 'bg-gradient-to-l from-indigo-900 to-transparent opacity-90  z-0 h-[100vh]"'
                  }`}
              >
                <div className="absolute inset-0 z-10 backdrop-blur-3xl">
                  <div
                    className={`relative  z-20 p-6 md:p-e-0 space-y-6 ${showDefaultPanels ? "flex flex-col " : ""
                      }`}
                  >
                    {showDefaultPanels ? (
                      <DashRightPanel
                        sector={selectedSector}
                        district={selectedDistrict}
                        dashboardData={dashboardData}
                        onDateRangeChange={handleDateRangeChange}
                      />
                    ) : (
                      <RightPanel
                        cardData={
                          Array.isArray(selectedCardData)
                            ? null
                            : selectedCardData
                        }
                        isExpanded={isRightPanelExpanded}
                        sector={selectedSector}
                        TimeRanges={timeRange}
                        onTimeRangeChange={handleTimeRangeChange}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

const getSectorEndpoint = (sector: string): string | null => {
  const sectorData = Object.values(SECTOR_KEYS).find((s) => s.name === sector);
  return sectorData ? sectorData.api : null;
};

