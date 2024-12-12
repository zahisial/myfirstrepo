/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { useTranslation } from "react-i18next";
import { Loader2, ArrowUpIcon, ArrowDownIcon, CircleOff, ArrowRightIcon, EqualIcon, ArrowDown } from "lucide-react";
import { ApiResponse, CardApiData, Frequency, SubData } from "../types/types";
import SubLevel from "../components/charts/SubLevel";
import HappinessChart from "../components/charts/happinessChart";
import { SegmentedControl } from "./SegmentedControl";
import BarComparisonChart from "./charts/barComparisonChart";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { t, TFunction } from "i18next";
import PackedBubbleChart from "./charts/PackedBubbleChart";
import RadialBarChart from "./charts/RadialBarChart";
import StackedBarChart from "./charts/StackedBarChart";
import LandChart from "./charts/landChart";
import GroupedBarChart2 from "./charts/GroupedBarChart2";
import DivergingBarChart from "./charts/DivergingBarChart";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../components/ui/accordion";
import { type } from "os";
import { displayValue } from "./LeftPanel";
import TimeRangeSelector from './TimeRangeSelector';
import { TimeRanges } from '../types/types'; // Ensure this path is correct
import SimpleBarChart from "./charts/SimpleBarChart";
interface HistoricalData {
  date: string;
  value: number;
  growth: number;
}
/* eslint-disable @typescript-eslint/ban-ts-comment */
interface DisplayValueProps {
  value: string | number;
  organicSum?: number | { [key: string]: number } | null;
  subDataSeries?: { name: string; value: number }[];
  subData?: { name: string; value: number }[];
  totalLands?: { [key: string]: number };
  forceCalcTitle?: boolean;
  hideTitle?: boolean;
  unitType?: string;
  unitTypeChart?: string; // Add this line
  showGrowth?: boolean;
}

interface RightPanelProps {
  cardData: CardApiData | null;
  isExpanded: boolean;
  sector: string;
  TimeRanges: TimeRanges;
  onTimeRangeChange: (range: TimeRanges) => void;
}

// Add this helper function at the top of your file or in a separate utils file
function toTitleCase(str: string): string {
  return str
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

// Update the type definition to include the month property
type DataItem = {
  year: string;
  month: string; // Add this line
  name: string;
  value: number;
};

// Update the findPreviousMonthValue function to be more flexible
const findPreviousMonthValue = (
  array: DataItem[],
  currentItem: DataItem
): number => {
  const months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
  const currentMonthIndex = months.indexOf(currentItem.month);
  
  // If it's the first month, return 0 or handle as needed
  if (currentMonthIndex === 0) return 0;
  
  const previousMonth = months[currentMonthIndex - 1];
  
  const previousItem = array.find(item => 
    item.year === currentItem.year && 
    item.month === previousMonth && 
    item.name === currentItem.name
  );
  
  return previousItem?.value ?? 0;
};

// Update the calculateGrowth function to handle different scenarios
const calculateGrowth = (currentValue: number, previousValue: number): number => {
  if (previousValue === 0) {
    // If previous value is 0, and current value is not 0, return 100% increase
    return currentValue !== 0 ? 100 : 0;
  }
  
  // Calculate percentage change
  return ((currentValue - previousValue) / Math.abs(previousValue)) * 100;
};

export default function RightPanel({
  cardData,
  isExpanded,
  sector,
  TimeRanges,
  onTimeRangeChange,
}: RightPanelProps) {
  const { t } = useTranslation();

  // Update formatValue to accept t as an argument
  const formatValue = useCallback((value: string | number | undefined | null, name: string): string => {
    if (value === undefined || value === null) {
      return t('N/A');
    }
    if (typeof value === 'string') {
      return value;
    }
    // For numeric values, preserve decimal places if they exist
    if (typeof value === 'number') {
      if (cardData?.unitTypeChart === '%') {
        return value.toFixed(2)+cardData.unitTypeChart;
      }
      // Check if the value has decimal places
      return Number.isInteger(value) ? 
        value.toLocaleString('en-US') : 
        value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
    return String(value);
  }, [t, cardData]);

  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [historicalData, setHistoricalData] = useState<HistoricalData[]>([]);


  const [tableDataFrequency, setTableDataFrequency] = useState<
    "yearly" | "monthly"
  >("yearly");
  const [subDataSeries, setSubDataSeries] = useState<DataItem[]>([]);
  const [chartDataFrequency, setChartDataFrequency] = useState<
    "yearly" | "all"
  >("all");

  // useEffect(() => {
  //   if (cardData && cardData.apiResponse) {

  //   }
  // }, [cardData]);
  // Determine chart types based on visualType and actual data

  const isHappinessChart = cardData?.visualType === "happiness";
  const isPackedBubbleChart = cardData?.visualType === "packedBubbleChart";
  const isRadialBarChart = cardData?.visualType === "radialBarChart";
  const isBarComparisonChart = cardData?.visualType === "barComparisonChart";
  const isSubLevel = cardData?.visualType === "subLevel";
  const isStackedBarChart = cardData?.visualType === "stackedBarChart"
  const isLandChart = cardData?.visualType === "landChart";
  const isGroupedBarChart2 = cardData?.visualType === "groupedBarChart2";
  const isDivergingBarChart = cardData?.visualType === "divergingBarChart";
  const isSimpleBarChart = cardData?.visualType === "simpleBarChart";


  const processApiResponse = useCallback(() => {
    if (!cardData || !cardData.apiResponse) {
      setError("No data available");  
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      if (!cardData.apiResponse.metrics) {
        throw new Error("metrics property is missing in apiResponse");
      }
      const allDates = Object.keys(cardData.apiResponse.metrics).sort();

      const metricKey = cardData.key || "";

      // @ts-ignore
      const chartProcessedData = processHistoricalData(
        cardData.apiResponse,
        metricKey,
        chartDataFrequency,
        cardData.subDataArray
      );
      setChartData(chartProcessedData as ChartData[]);
      
      // @ts-ignore
      const tableProcessedData = processHistoricalData(
        cardData.apiResponse,
        metricKey,
        tableDataFrequency,
        cardData.subDataArray
      );
      setHistoricalData(tableProcessedData as HistoricalData[]);

      // Directly set the subDataSeries instead of appending
      setSubDataSeries(cardData.subDataSeries || []);
    } catch (err) {
      setError(`Failed to process metrics data: ${(err as Error).message}`);
    } finally {
      setIsLoading(false);
    }
  }, [cardData, TimeRanges, chartDataFrequency, tableDataFrequency]);

  useEffect(() => {
    if (isExpanded && cardData) {
      // Reset the states when cardData changes
      setSubDataSeries([]); // Clear previous data
      setChartData([]); // Clear previous chart data
      setHistoricalData([]); // Clear previous historical data
      
      processApiResponse();
      if (cardData.childMetrics) {
        cardData.childMetrics.forEach(
          (childMetric: { key: string; subDataArray: boolean }) => {
            const childChartData = processHistoricalData(
              cardData.apiResponse,
              childMetric.key,
              chartDataFrequency as Frequency,
              childMetric.subDataArray
            ).map(
              (data) =>
                ({
                  id: data.id,
                  name: data.name,
                  date: data.date,
                  value: data.value,
                  apiResponse: data.apiResponse,
                } as ChartData)
            );
            setChartData((prevData) => [...prevData, ...childChartData]);
          }
        );
      }
    }
  }, [isExpanded, cardData, processApiResponse, chartDataFrequency]);

  // Add this console log to check the cardData
  console.log("Card Data in RightPanel:", cardData);

  if (!isExpanded) {
    return (
      <div className="w-64 p-4 bg-indigo-800">
        <p className="text-white">{t("Select a card to view details")}</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center w-full h-screen bg-gray-100 dark:bg-gray-900">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full p-4">
        <p>{t(error)}</p>
      </div>
    );
  }

  if (!cardData || !cardData.apiResponse) {
    return (
      <div className="w-full p-4 dark:text-red-100">
        <p>{t("Fetching data available")}</p>
      </div>
    );
  }


  const filteredSubData =
    cardData?.subData?.filter((item:any) => item.value !== 0) || [];
  
  const mySeries = cardData?.subDataSeries
  // const totalData = mySeries.filter(item => item?.year === "total");
  const filteredSubData1 = mySeries?.filter((item:any) => item.year === "2024" && item.month === "09");

  // Add this helper function before the return statement
  const hasMonthData = subDataSeries.some(item => item.month && item.month !== "");

  return (
    <div className="w-full pb-14 p-4 space-y-4 overflow-y-auto bg-gradient-to-l from-indigo-900 to-transparent max-h-[calc(100vh-4rem)]">
      <h2 className="mb-4 text-2xl font-bold text-gray-800 dark:text-white">
        {t("Detailed Analysis")}
      </h2>

      <Card className="mb-4 dark:bg-gray-900">
        <CardHeader>
          {cardData.title && (
            <CardTitle className="text-lg text-gray-800 dark:text-white">
              {t(cardData.title)}
            </CardTitle>
          )}
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {(() => {
                const displayedValue = displayValue({
                  value: cardData.value,
                  organicSum: cardData.organicSum,
                  subDataSeries: cardData.subDataSeries,
                  subData: cardData.subData,
                  totalLands: cardData.totalLands,
                  forceCalcTitle: cardData.forceCalcTitle,
                  hideTitle: cardData.hideTitle,
                  unitType: cardData.unitType,
                  // @ts-ignore
                  unitTypeChart: cardData.unitTypeChart, // Make sure this is passed
                  showGrowth: cardData.showGrowth
                }, t);
                
                const isNegative = 
                  (typeof displayedValue === 'number' && displayedValue < 0) || 
                  (typeof displayedValue === 'string' && displayedValue.startsWith('-'));
                
                return (
                  <>
                    {!cardData.hideTitle && (
                      <p className="text-2xl font-bold text-gray-800 dark:text-white">
                        {isNegative ? displayedValue.toString() : displayedValue}
                        {cardData.unitType && ` ${cardData.unitType}`}
                      </p>
                    )}
                    {isNegative && <ArrowDown className="w-6 h-6 ml-2 text-red-500" />}
                  </>
                );
              })()}
            </div>
            <div>
              <TimeRangeSelector 
                value={TimeRanges}
                onChange={(value: TimeRanges) => onTimeRangeChange(value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {
        isSimpleBarChart && filteredSubData.length > 0 ? (
          <Card className="bg-white shadow-lg dark:bg-gray-900">
            <CardHeader className="flex flex-row items-center justify-between">
              {/* <CardTitle className="text-lg text-gray-800 dark:text-white">
                {t(cardData.title)}
              </CardTitle> */}
            </CardHeader>
            <CardContent>
              <SimpleBarChart
                 cardData={{
                  title: cardData.title || "",
                  value: Number(cardData.value) || 0,
                  subData: cardData.nonFilter ? mySeries : filteredSubData,
                  unitTypeChart: cardData.unitTypeChart
                }}
                frequency={chartDataFrequency as "yearly" | "monthly"}
              />
            </CardContent>
          </Card>

        ) : null

      }
      {isSubLevel && filteredSubData.length > 0 ? (
        <Card className="bg-white shadow-lg dark:bg-gray-900">
          <CardHeader className="flex flex-row items-center justify-between">
            {/* <CardTitle className="text-lg text-gray-800 dark:text-white">
              Add here chart description for the user
            </CardTitle> */}
          </CardHeader>
          <CardContent>
            <SubLevel
              cardData={{
                title: cardData.title || "",
                value: Number(cardData.value) || 0,
                subData: cardData.nonFilter ? mySeries : filteredSubData
              }}
              t={t}
              frequency={chartDataFrequency as "yearly" | "monthly"}
            />
          </CardContent>
        </Card>
      ) : null}

      {isPackedBubbleChart && filteredSubData.length > 0 ? (
        <Card className="bg-white shadow-lg dark:bg-gray-900">
          <CardHeader className="flex flex-row items-center justify-between">
            {/* <CardTitle className="text-lg text-gray-800 dark:text-white">
              Add here chart description for the user
            </CardTitle> */}
          </CardHeader>
          <CardContent>
            <PackedBubbleChart
              cardData={{
                title: cardData.title || "",

                value: Number(cardData.value) || 0,
                subData: cardData.nonFilter ? filteredSubData : filteredSubData1
              }}
              t={t}
              frequency={chartDataFrequency as "yearly" | "monthly"}
            />
          </CardContent>
        </Card>
      ) : null}

      {isLandChart && filteredSubData.length > 0 ? (
        <Card className="bg-white shadow-lg dark:bg-gray-900">
          <CardHeader className="flex flex-row items-center justify-between">
            {/* <CardTitle className="text-lg text-gray-800 dark:text-white">
              Add here chart description for the user
            </CardTitle> */}
          </CardHeader>
          <CardContent>
            <LandChart
              cardData={{
                title: cardData.title || "",

                value: Number(cardData.value) || 0,
                subData: filteredSubData,
              }}
              t={t}
              frequency={chartDataFrequency as "yearly" | "monthly"}
            />
          </CardContent>
        </Card>
      ) : null}

      {isRadialBarChart && filteredSubData.length > 0 ? (
        <Card className="bg-white shadow-lg dark:bg-gray-900">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg text-gray-800 dark:text-white">
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 ">
            <RadialBarChart
              cardData={{
                title: cardData.title || "",
                value: Number(cardData.value) || 0,
                subData: filteredSubData,
                unitTypeChart: cardData.unitTypeChart
              }}
              frequency={chartDataFrequency as "yearly" | "monthly"}
            />
          </CardContent>
        </Card>
      ) : null}
      
      {isBarComparisonChart && filteredSubData.length > 0 ? (
        <Card className="bg-white shadow-lg dark:bg-gray-900">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg text-gray-800 dark:text-white">
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 ">
            <BarComparisonChart
              cardData={{
                title: cardData.title || "",
                value: Number(cardData.value) || 0,
                subData: filteredSubData,
                displayValue: displayValue({
                  value: cardData.value,
                  organicSum: cardData.organicSum,
                  subDataSeries: cardData.subDataSeries,
                  subData: cardData.subData,
                  totalLands: cardData.totalLands,
                  forceCalcTitle: cardData.forceCalcTitle,
                  hideTitle: cardData.hideTitle,
                  unitType: cardData.unitType,
                  // @ts-ignore
                  unitTypeChart: cardData.unitTypeChart,
                }, t),
                unitTypeChart: cardData.unitTypeChart
              }}
              frequency={chartDataFrequency as "yearly" | "monthly"}
            />
          </CardContent>
        </Card>
      ) : null}

      {isHappinessChart ? (
        <Card className="bg-white shadow-lg dark:bg-gray-900">
          <CardHeader className="flex flex-row items-center justify-between">
            {/* <CardTitle className="text-lg text-gray-800 dark:text-white">
              Add here chart description for the user
            </CardTitle> */}
            {/* <SegmentedControl
                options={frequencyOptions}
                value={chartDataFrequency}
                onChange={(value) => setChartDataFrequency(value as 'yearly' | 'all')}
                className="text-xs"
                type="primaryText"
              /> */}
          </CardHeader>
          <CardContent>
            <HappinessChart
              cardData={{
                title: cardData.title || "",
                value: Number(cardData.value) || 0,
                subData: cardData.subData
                  ? cardData.subData.filter(
                      (item: any) => item.name !== "Total Survey Count"
                    )
                  : [],
              }}
              t={t}
              frequency={chartDataFrequency}
            />
          </CardContent>
        </Card>
      ) : null}

      {isStackedBarChart ? (
        <Card className="bg-white shadow-lg dark:bg-gray-900">
          <CardHeader className="flex flex-row items-center justify-between">
            {/* <CardTitle className="text-lg text-gray-800 dark:text-white">
              Add here chart description for the user
            </CardTitle> */}
          </CardHeader>
          <CardContent>
            <StackedBarChart
              //@ts-ignore
              cardData={{
                title: cardData.title || "",

                value: Number(cardData.value) || 0,

                  subData: cardData.subDataSeries,
                  unitTypeChart: cardData.unitTypeChart || ''
              }}
              t={t}
              frequency={chartDataFrequency as "yearly" | "monthly"}
            />
          </CardContent>
        </Card>
      ) : null}
     
      {isGroupedBarChart2 ? (
        <Card className="bg-white shadow-lg dark:bg-gray-900">
          <CardHeader className="flex flex-row items-center justify-between">
            {/* <CardTitle className="text-lg text-gray-800 dark:text-white">
              Add here chart description for the user
            </CardTitle> */}
          </CardHeader>
          <CardContent>
            <GroupedBarChart2 
              data={cardData.subDataSeries}
              subData={cardData.nonFilter ? filteredSubData : filteredSubData1}
              unitTypeChart={cardData.unitTypeChart || ''}
              cardTitle={cardData.title || ''}
            />
          </CardContent>
        </Card>
      ) : null}
     
      {isDivergingBarChart ? (
        <Card className="bg-white shadow-lg dark:bg-gray-900">
          <CardHeader className="flex flex-row items-center justify-between">
            {/* <CardTitle className="text-lg text-gray-800 dark:text-white">
              Add here chart description for the user
            </CardTitle> */}
          </CardHeader>
          <CardContent>
            <DivergingBarChart data={cardData.subDataSeries} />
          </CardContent>
        </Card>
      ) : null}
     
      {!cardData.subDataArray &&
        (cardData.organicSum !== null || cardData.value !== 0) && (
          <Card className="bg-white shadow-lg dark:bg-gray-900">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger className="px-6 ">
                  <CardHeader className="flex flex-row items-center justify-between p-0">
                    <CardTitle className="text-lg text-gray-800 dark:text-white">
                      {t("Historical Data")}
                    </CardTitle>
                  </CardHeader>
                </AccordionTrigger>
                <AccordionContent>
                  <CardContent>
                    {historicalData.filter((row) => row.value !== 0).length ===
                    0 ? (
                      <div className="text-center">
                        {t(
                          "Data for this section is currently being updated. Please check back soon for more information."
                        )}
                      </div>
                    ) : (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>{t("Date")}</TableHead>
                            <TableHead>{t(cardData.title)}</TableHead>
                            <TableHead>{t("Growth")}</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {historicalData
                            .filter((row) => row.value !== 0)
                            .map((row, index, array) => {
                              const currentYear = row.date.split("-")[0];
                              const previousYear =
                                index > 0
                                  ? array[index - 1].date.split("-")[0]
                                  : null;
                              const showYear = currentYear !== previousYear;

                              return (
                                <TableRow key={index}>
                                  <TableCell>
                                    {showYear ? currentYear : ""}
                                    {row.date.split("-").slice(1).join("-")}
                                  </TableCell>
                                  <TableCell>
                                    {row.value.toLocaleString()}
                                  </TableCell>
                                  <TableCell>
                                    <div className="flex items-center">
                                      {row.growth > 0 ? (
                                        <ArrowUpIcon className="w-4 h-4 mr-1 text-green-500" />
                                      ) : row.growth < 0 ? (
                                        <ArrowDownIcon className="w-4 h-4 mr-1 text-red-500" />
                                      ) : null}
                                      {row.growth.toFixed(2)}%
                                    </div>
                                  </TableCell>
                                </TableRow>
                              );
                            })}
                        </TableBody>
                      </Table>
                    )}
                  </CardContent>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </Card>
        )}
      {cardData.subDataArray && (
        <Card className="bg-white shadow-lg dark:bg-gray-900">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger className="px-6">
                <CardHeader className="flex flex-row items-center justify-between p-0">
                  <CardTitle className="text-lg text-gray-800 dark:text-white">
                    {t("Historical Data")}
                  </CardTitle>
                </CardHeader>
              </AccordionTrigger>
              <AccordionContent>
                <CardContent>
                  {subDataSeries.length === 0 ? (
                    <div className="text-center">
                      {t(
                        "Data for this section is currently being updated. Please check back soon for more information."
                      )}
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>{t("Year")}</TableHead>
                          <TableHead>{t("Month")}</TableHead>
                          <TableHead>{t("Category")}</TableHead>
                          <TableHead>{t("Value")}</TableHead>
                          {cardData.showGrowth && <TableHead>{t("Growth")}</TableHead>}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {subDataSeries
                          // Filter out range and total entries
                          .filter(item => item.year !== 'range' && item.year !== 'total')
                          // Remove duplicates based on year, month, and name combination
                          .filter((item, index, self) => 
                            index === self.findIndex((t) => (
                              t.year === item.year && 
                              t.month === item.month && 
                              t.name === item.name
                            ))
                          )
                          // Sort by date (newest first) and then by category
                          .sort((a, b) => {
                            const dateA = new Date(`${a.year}-${a.month}-01`);
                            const dateB = new Date(`${b.year}-${b.month}-01`);
                            if (dateB.getTime() !== dateA.getTime()) {
                              return dateB.getTime() - dateA.getTime();
                            }
                            // Secondary sort by category name if dates are equal
                            return a.name.localeCompare(b.name);
                          })
                          .map((item, index, array) => {
                            const previousValue = findPreviousMonthValue(array, item);
                            const growth = calculateGrowth(item.value, previousValue);
                            
                            const showDate = index === 0 || 
                              array[index - 1].year !== item.year || 
                              array[index - 1].month !== item.month;
                            
                            const isSameValue = item.value === previousValue;
                            
                            return (
                              <TableRow key={`${item.year}-${item.month}-${item.name}`}>
                                <TableCell>
                                  {showDate ? item.year : ''}
                                </TableCell>
                                <TableCell>
                                  {showDate ? item.month : ''}
                                </TableCell>
                                <TableCell>{item.name}</TableCell>
                                <TableCell>{formatValue(item.value, item.name)}</TableCell>
                                {cardData.showGrowth && (
                                  <TableCell>
                                    <div className="flex items-center">
                                      {isSameValue ? (
                                        <span className="flex items-center dark:text-gray-600 text-black">
                                          <CircleOff className="w-4 h-4" />
                                        </span>
                                      ) : growth !== 0 && (
                                        <>
                                          {growth > 0 ? (
                                            <ArrowUpIcon className="w-4 h-4 mr-1 text-green-500" />
                                          ) : (
                                            <ArrowDownIcon className="w-4 h-4 mr-1 text-red-500" />
                                          )}
                                          <span className={growth > 0 ? 'text-green-500' : 'text-red-500'}>
                                            {/* {Math.abs(growth).toFixed(2)}% */}
                                          </span>
                                        </>
                                      )}
                                    </div>
                                  </TableCell>
                                )}
                              </TableRow>
                            );
                          })}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </Card>
      )}

    </div>
  );
}

// Helper function to process historical data
interface ChartData {
  id: string;
  name: string;
  date: string;
  value: number;
  growth: number;
  apiResponse: any; // Replace 'any' with the correct type if known
}
// Update the processHistoricalData function to return ChartData[]
const processHistoricalData = (
  apiResponse: ApiResponse | null,
  key: string,
  p0: Frequency,
  subDataArray: boolean /* ... */
): ChartData[] => {
  // ... (implementation)
  return []; // Placeholder return statement to satisfy the function return type requirement
};

// Update the ZoomableSunburst component props
interface ZoomableSunburstProps {
  cardData: {
    title: string;
    value: number;
    subData: SubData[];
  };
  t: TFunction;
  frequency: "yearly" | "monthly";
}

// Example function for processing data in the right panel
function processDataForRightPanel(data: DataItem[]) {
  // Process the data
  const processedData = data.map((item) => {
    // ... processing logic ...
    return item;
  });

  //console.log("Processed data for right panel:", processedData); // Log the processed data
  return processedData;
}

function processDataForSurfacePlot(data: DataItem[]): number[][] {
  const years = [...new Set(data.map(item => item.year))].sort();
  const months = [...new Set(data.map(item => item.month))].sort();

  return years.map(year => 
    months.map(month => {
      const item = data.find(d => d.year === year && d.month === month);
      return item ? item.value : 0;
    })
  );
}

function generateXLabels(data: DataItem[]): string[] {
  return [...new Set(data.map(item => item.month))].sort();
}

function generateYLabels(data: DataItem[]): string[] {
  return [...new Set(data.map(item => item.year))].sort();
}




