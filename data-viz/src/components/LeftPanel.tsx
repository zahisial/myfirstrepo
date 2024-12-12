/* eslint-disable react-refresh/only-export-components */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

"use client";

import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from "react";
import { Card, CardContent } from "../components/ui/card";
import { ArrowDown, ArrowUp, ArrowRightCircle, BarChart2 } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import { useTranslation } from "react-i18next";
import { calculateMetrics } from "../utils/metricCalculations";
import { fetchData } from "../utils/api";
import CardSkeleton from "./CardSkeleton";
import { SECTOR_KEYS, SectorData } from "../data/sectorsKeys";
import { CardApiData, OrganicSum } from "../types/types";
import { useNavigate, useParams, useLocation, Link } from 'react-router-dom';
import { GraphIcon, NumberIcon } from "./Icons";
import { TFunction } from "i18next";

type MetricWithVisualType = Metric & {
  eapiResponse: ApiResponse | null;
  visualType: string;
};

interface MetricCardProps {
  title: string;
  value: number | string;
  change: number;
  period: string;
  mapData?: boolean;
  subData?: { name: string; value: number }[];
  isActive: boolean;
  onClick: () => void;
  subDataArray?: boolean;
  organicSum?: number | null;
  subDataSeries?: { name: string; value: number }[];
  totalLands?: any;
  forceCalcTitle?: boolean;
  hideTitle?: boolean; // Add this line
  unitType?: string; // Add this line
  unitTypeChart?: string; // Add this line
  showGrowth?: boolean; // Add this line
}

interface District {
  properties: {
    Name: string;
    AreaId: number;
  };
}

interface Metric {
  id?: number;
  title: string;
  value: number | string;
  change: number;
  period: string;
  mapData?: boolean;
  subData?: { name: string; value: number }[];
  subDataArray?: boolean;
  organicSum?: number | null;
  subDataSeries?: { name: string; value: number }[];
  totalLands?: { total_lands: number; total_lands_available: number };
  forceCalcTitle?: boolean;
  hideTitle?: boolean;
  unitType?: string; // Add this line
  unitTypeChart?: string; // Add this line
  showGrowth?: boolean; // Add this line
}

interface ApiResponse {
  [key: string]: unknown;
}

// Add new type at the top with other interfaces
type TimeRanges = '3months' | '6months' | '12months' | '24months' | 'all';

// Add timeRanges to LeftPanelProps
interface LeftPanelProps {
  sector: string;
  district: string;
  onCardClick: (cardData: CardApiData) => void;
  expandRightPanel: () => void;
  districts: District[] | undefined;
  TimeRanges: TimeRanges; // Add this line
}

interface DisplayValueProps {
  title: string;
  value: number | string;
  organicSum?: number | null | { [key: string]: number };
  subDataSeries?: { name: string; value: number }[];
  subData?: { name: string; value: number }[];
  totalLands?: { total: number; available: number };
  forceCalcTitle?: boolean;
  hideTitle?: boolean;
  unitType?: string; // Add this line
}

export const displayValue = (
  {
    title,
    value,
    organicSum,
    subDataSeries,
    subData,
    totalLands,
    forceCalcTitle,
    hideTitle,
    unitType,
  }: DisplayValueProps,
  t: TFunction
): string => {
  if (hideTitle) {
    return '';
  }

  let displayedValue: string;

  if (forceCalcTitle) {
    const total = typeof value === 'number' ? value : 0;
    displayedValue = Math.floor(total).toLocaleString();
  } else if (organicSum) {
    if (Array.isArray(organicSum)) {
      const total = organicSum.reduce(
        (sum, item) => sum + (Number(item.value) || 0),
        0
      );
      displayedValue = Math.floor(total).toLocaleString();
    } else if (typeof organicSum === "object" && organicSum !== null) { // Add null check
      displayedValue = Object.entries(organicSum)
        .map(
          ([key, value]) =>
            `${t(key.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase()))}: ${
              typeof value === "number"
                ? Math.floor(value).toLocaleString()
                : value ? t(value) : t('N/A') // Add null check
            }`
        )
        .join(", ");
    } else {
      displayedValue = typeof organicSum === "number"
        ? Math.floor(organicSum).toLocaleString()
        : organicSum ? t(organicSum) : t('N/A'); // Add null check
    }
  } else if (
    organicSum === null &&
    subDataSeries &&
    subDataSeries.length > 0 &&
    subDataSeries.length < 3
  ) {
    displayedValue = subDataSeries
      .map((item, index) => {
        if (!item) return ''; // Add null check
        if (index === 0) {
          const formattedValue =
            typeof item.value === "number"
              ? Math.floor(item.value).toLocaleString()
              : item.value ? t(item.value) : t('N/A'); // Add null check
          return `${t('Total')}: ${formattedValue}`;
        }
        const formattedKey = index === 1 ? t('Available') : t(item.name || 'Unknown');
        return `${formattedKey}: ${
          typeof item.value === "number"
            ? Math.floor(item.value).toLocaleString()
            : item.value ? t(item.value) : t('N/A') // Add null check
        }`;
      })
      .filter(Boolean)
      .join(", ");
  } else if (value === undefined || value === null) {
    if (subData && subData.length > 0) {
      displayedValue = subData
        .map(
          (item) =>
            `${t(item.name)}: ${
              typeof item.value === "number"
                ? Math.floor(item.value).toLocaleString()
                //@ts-ignore
                
                : t(item.value.toString())
            }`
        )
        .join(", ");
    } else {
      displayedValue = t('N/A');
    }
  } else if (typeof value === "string" && value.includes("%")) {
    displayedValue = t(value);
  } else if (typeof value === "number") {
    if (totalLands?.total && totalLands?.available) {
      displayedValue = `${t('Total')}: ${totalLands.total}, ${t('Available')}: ${totalLands.available}`;
    } else {
      displayedValue = Math.floor(value).toLocaleString();
    }
  } else {
    displayedValue = t(value.toString());
  }

  // if (unitType) {
  //   displayedValue += ` ${t(unitType)}`;
  // }

  const isNegative = 
    (typeof displayedValue === 'number' && displayedValue < 0) || 
    (typeof displayedValue === 'string' && displayedValue.includes('-'));

  // console.log('Displayed Value:', displayedValue); // Log the displayed value

  if (isNegative) {
    return `${displayedValue.toString()}`;
  } else {
    return displayedValue.toString();
  }
};

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  change,
  period,
  mapData,
  subData,
  isActive,
  onClick,
  subDataArray,
  organicSum,
  subDataSeries,
  totalLands,
  forceCalcTitle,
  hideTitle, // Add this line
  unitType, // Add this line
  unitTypeChart
}) => {
  const { t, i18n } = useTranslation();

  // Log the title in both Arabic and English
  // console.log('Title in English:', title);
  // console.log('Title in Arabic:', i18n.language === 'ar' ? t(title) : title);

  const isPositive = change >= 0;
  const Arrow = isPositive ? ArrowUp : ArrowDown;

  const displayedValue = displayValue({ title, value, organicSum, subDataSeries, subData, totalLands, forceCalcTitle, hideTitle, unitType }, t); // Add hideTitle here
  const isNegative = 
    (typeof value === 'number' && value < 0) || 
    (typeof value === 'string' && value.includes('-'));

  return (
    <Card
      className={`w-full max-w-sm mx-auto p-2 text-white transition-all duration-300 cursor-pointer mb-2 border-cyan-900 ${
        isActive
          ? "bg-indigo-900 scale-105 z-10  border-cyan-800"
          : "bg-indigo-700 scale-100 p-2"
      }`}
      onClick={onClick}
    >
      <CardContent className="p-0">
        <div className="flex flex-row items-center justify-between mb-1">
          <h3 className="text-sm font-medium text-white md:text-xs">
            {t(title)}
          </h3>
        </div>
        <div className="flex flex-col items-start justify-between">
          <div className="flex items-center mb-2">
            <p className="text-sm font-medium md:text-xs">
              {isNegative ? displayedValue.toString() : displayedValue}
              {unitType && ` ${t(unitType)}`} {/* //Add this line */}
            </p>
            {isNegative && <ArrowDown className="w-4 h-4 ml-1 text-red-500" />}
          </div>
          <div className="flex flex-row justify-end w-full">
            <div className="items-center justify-start ">
              {!mapData && subDataArray && (
                <div className="flex justify-start">
                  <GraphIcon />
                </div>
              )}
              <Arrow
                className={`w-4 h-4 hidden ${
                  isPositive ? "text-green-500" : "text-red-500"
                } me-1`}
              />
              <span
                className={`${
                  isPositive ? "text-green-500 hidden" : "text-red-500"
                } text-xs me-2 hidden`}
              >
                {t("{{change}}%", { change: Math.abs(change).toFixed(2) })}
              </span>
              <span className="hidden text-xs text-gray-400">{t(period)}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const LeftPanel: React.FC<LeftPanelProps> = ({
  sector,
  district,
  onCardClick,
  expandRightPanel,
  districts = [],
  TimeRanges
}) => {
  const { t } = useTranslation();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [emblaRef, emblaApi] = useEmblaCarousel({
    axis: "y",
    loop: false,
    align: "start",
  });
  const carouselRef = useRef<HTMLDivElement>(null);
  const [metricsData, setMetricsData] = useState<Metric[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [apiResponse, setApiResponse] = useState<ApiResponse | null>(null);
  const navigate = useNavigate();
  const { cardKey: urlCardKey } = useParams();
  const location = useLocation();

  const getDistrictName = useCallback(
    (districtId: string) => {
      if (!districts || districts.length === 0) {
        return districtId === "-1" ? t("All Districts") : t("Unknown District");
      }
      const foundDistrict = districts.find(
        (d) => d.properties.AreaId.toString() === districtId
      );
      return foundDistrict
        ? foundDistrict.properties.Name
        : t("Unknown District");
    },
    [districts, t]
  );

  const fetchSectorData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setActiveIndex(null);
    const sectorData = Object.values(SECTOR_KEYS).find(
      (s) => s.name === sector
    );
    if (sectorData) {
      try {
        // Calculate date range based on selected TimeRanges
        const endDate = new Date();
        const startDate = new Date();
        
        // Move to the end of the previous month
        endDate.setDate(0); // This moves to the last day of previous month
        startDate.setDate(0); // Also start from the last day of previous month
        
        switch (TimeRanges) {
          case '3months':
            startDate.setMonth(startDate.getMonth() - 2); // -2 because we already moved back 1 month
            break;
          case '6months':
            startDate.setMonth(startDate.getMonth() - 5);
            break;
          case '12months':
            startDate.setMonth(startDate.getMonth() - 11);
            break;
          case '24months':
            startDate.setMonth(startDate.getMonth() - 23);
            break;
          case 'all':
            // Don't add date parameters for all data
            break;
        }
        
        // Construct URL with parameters
        const districtParam = district !== "-1" ? `AreaId=${district}` : "";
        let url = `${sectorData.api}${districtParam ? `?${districtParam}` : ""}`;
        
        // Only add date parameters if not 'all'
        if (TimeRanges !== 'all') {
          // Set to first day of respective months
          startDate.setDate(1);
          endDate.setDate(1);
          
          const fromDate = `${startDate.getFullYear()}-${String(startDate.getMonth() + 1).padStart(2, '0')}`;
          const toDate = `${endDate.getFullYear()}-${String(endDate.getMonth() + 1).padStart(2, '0')}`;
          const dateParams = `from=${fromDate}&to=${toDate}`;
          const separator = districtParam ? "&" : "?";
          url += `${separator}${dateParams}`;
        }
        
        const response: ApiResponse = await fetchData(url);
        setApiResponse(response);
        const calculatedMetrics = calculateMetrics(
          sectorData,
          response
        ) as Metric[];

        const metricsWithIdAndSubDataArray = calculatedMetrics.map((metric, index) => {
          const metricKey = sectorData.metricKeys?.find((mk) => mk.title === metric.title);
          const cardData = response.metrics as any;
          
          // Safely access the subDataArray, ensuring metricKey and cardData exist
          const subDataArray =
            metricKey?.subDataArray ||
            (metricKey && Array.isArray(cardData?.[metricKey.key]) ? cardData[metricKey.key] : []);
          
          return {
            ...metric,
            id: index,
            subDataArray,
            organicSum: (metricKey && cardData?.total?.[metricKey.key]) || null,
            subData: metric.subData || [],
            unitType: metricKey?.unitType, // Add this line
          };
        });
        
        

        setMetricsData(metricsWithIdAndSubDataArray);
      } catch (error) {
        setError(`Failed to load data for ${sector}`);
        setMetricsData([]);
      } finally {
        setIsLoading(false);
      }
    } else {
      setError(`No endpoint found for ${sector}`);
      setMetricsData([]);
      setIsLoading(false);
    }
  }, [sector, district, TimeRanges]); // Add TimeRanges to dependencies

  useEffect(() => {
    fetchSectorData();
  }, [fetchSectorData, district]);

  // useEffect(() => {
  //   if (!emblaApi) return;

  //   const onSelect = () => {
  //     setActiveIndex(emblaApi.selectedScrollSnap());
  //   };

  //   emblaApi.on("select", onSelect);
  //   emblaApi.on("reInit", onSelect);

  //   return () => {
  //     emblaApi.off("select", onSelect);
  //     emblaApi.off("reInit", onSelect);
  //   };
  // }, [emblaApi]);

  const scrollToIndex = useCallback(
    (index: number) => {
      if (emblaApi) {
        emblaApi.scrollTo(index);
        setActiveIndex(index);
      }
    },
    [emblaApi]
  );

  useEffect(() => {
    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();
      if (emblaApi) {
        if (event.deltaY > 0) {
          emblaApi.scrollNext();
        } else {
          emblaApi.scrollPrev();
        }
      }
    };

    const currentCarouselRef = carouselRef.current;
    if (currentCarouselRef) {
      currentCarouselRef.addEventListener("wheel", handleWheel, {
        passive: false,
      });
    }

    return () => {
      if (currentCarouselRef) {
        currentCarouselRef.removeEventListener("wheel", handleWheel);
      }
    };
  }, [emblaApi]);

  const handleCardClick = useCallback(
    (item: Metric, index: number) => {
      scrollToIndex(index);
      setActiveIndex(index);

      console.log('Item being passed to RightPanel:', item);
      // console.log('subData in item:', item.subData);
  
      const sectorData = Object.values(SECTOR_KEYS).find((s) => s.name === sector);
      const metricKey = sectorData?.metricKeys?.find((mk) => mk.title === item.title);
      
      const cardData: CardApiData = {
        title: item.title,
        value: item.value,
        change: item.change,
        period: item.period,
        mapData: item.mapData,
        subData: item.subData || [],
        apiResponse: apiResponse,
        visualType: metricKey?.visualType || "number",
        unitType: metricKey?.unitType,
        unitTypeChart: metricKey?.unitTypeChart,
        subDataArray: metricKey?.subDataArray || [],
        organicSum: item.organicSum,
        subDataSeries: item.subDataSeries || [],
        totalLands: item.totalLands,
        forceCalcTitle: item.forceCalcTitle,
        nonFilter: undefined,
        hideTitle: item.hideTitle,
        showGrowth: metricKey?.showGrowth
      };
  
      onCardClick(cardData);
      expandRightPanel();

      // Update URL with the card key
      const cardKey = metricKey?.key || item.title.toLowerCase().replace(/ /g, '-');
      const sectorUrl = sectorData ? sectorData.api.replace(/\//g, '') : sector.toLowerCase().replace(/ /g, '-');
      const newUrl = `/dashboard/${sectorUrl}/${district}/${cardKey}`;
      
      if (location.pathname !== newUrl) {
        navigate(newUrl, { replace: true });
      }
    },
    [sector, district, onCardClick, apiResponse, expandRightPanel, scrollToIndex, navigate, location.pathname]
  );
  

  useEffect(() => {
    if (!isLoading && metricsData.length > 0) {
      let initialCardIndex = -1;

      if (urlCardKey) {
        initialCardIndex = metricsData.findIndex(metric => {
          const sectorData = Object.values(SECTOR_KEYS).find((s) => s.name === sector);
          const metricKey = sectorData?.metricKeys?.find((mk) => mk.title === metric.title);
          return metricKey?.key === urlCardKey || metric.title.toLowerCase().replace(/ /g, '-') === urlCardKey;
        });
      }

      // If no card key in URL or not found, default to the first card
      if (initialCardIndex === -1) {
        initialCardIndex = 0;
      }

      if (initialCardIndex !== activeIndex) {
        handleCardClick(metricsData[initialCardIndex], initialCardIndex);
      }
    }
  }, [isLoading, metricsData, urlCardKey, sector, district, handleCardClick, activeIndex]);

  useEffect(() => {}, [sector]);

  if (isLoading) {
    return <CardSkeleton />;
  }

  if (error) {
    return <div className="">{t(error)}</div>;
  }

  if (!metricsData || metricsData.length === 0) {
    return (
      <div className="text-white">
        {t("Please choose sector first:")}
        <ul>
          <li>{t("Real Estate")}</li>
          <li>{t("Construction")}</li>
          <li>{t("Economy")}</li>
          <li>{t("Health & Hygiene")}</li>
          <li>{t("Community & Engagement")}</li>
        </ul>
      </div>
    );
  }
  console.log("METRICS DATA -- ", metricsData);

  return (
    <>
      <div>
        <h1 className="text-2xl font-bold text-white">{t(sector)}</h1>
        <h2 className="text-sm font-bold text-white">
          <Link to="/dashboard" className="hover:text-cyan-400 transition-colors">
            {t("Dashboard")}
          </Link>
          {" / "}
          {t(sector)}          / {t(getDistrictName(district))}
         
        
        </h2>
      </div>
      <div className="relative w-full max-w-sm mx-auto xl:h-[100svh] md:h-[100svh]">
        <div className="absolute inset-0 flex flex-col">
          <div className="flex-grow overflow-hidden" ref={emblaRef}>
            <div
              className="flex flex-col items-center h-full"
              ref={carouselRef}
            >
              <div className="flex-shrink-0 w-full h-[10svh]"></div>
              {metricsData.map((metric, index) => (
                <div
                  key={metric.title}
                  className={`flex-shrink-0 transition-all duration-300 ${
                    index === activeIndex
                      ? "scale-102 z-10 w-[95%]"
                      : "w-[85%] scale-100 opacity-100"
                  }`}
                  onClick={() => handleCardClick(metric, index)}
                >
                  <MetricCard
                    title={metric.title}
                    value={metric.value}
                    change={metric.change}
                    period={metric.period}
                    mapData={metric.mapData}
                    subData={metric.subData}
                    isActive={index === activeIndex}
                    onClick={() => handleCardClick(metric, index)}
                    subDataArray={metric.subDataArray}
                    organicSum={metric.organicSum}
                    subDataSeries={metric.subDataSeries}
                    totalLands={metric.totalLands}
                    forceCalcTitle={metric.forceCalcTitle}
                    hideTitle={metric.hideTitle} // Add this line
                    unitType={metric.unitType} // Add this line
                    unitTypeChart={metric.unitTypeChart} // Add this line
                    showGrowth={metric.showGrowth}
                  />
                </div>
              ))}
              <div className="flex-shrink-0 w-full h-[50svh]"></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LeftPanel;

function setName(name: string) {
  throw new Error("Function not implemented.");
}
