/* eslint-disable @typescript-eslint/no-explicit-any */
/*
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { OrigamiIcon } from 'lucide-react';
import { SectorData, MetricKey } from '../data/sectorsKeys';

// Update the MonthData interface
interface MonthData {
  [key: string]: any;
}

export const calculateMetrics = (sector: SectorData, metricsData: Record<string, any>) => {
  if (!sector || typeof sector !== 'object' || !sector.metricKeys) {
    //console.error('Invalid sector in calculateMetrics:', sector);
    return [];
  }

  if (!metricsData || !metricsData.metrics || Object.keys(metricsData.metrics).length === 0) {
    //console.error('No sector data found for', sector.name);
    return [];
  }

  const totalData = metricsData.total || {};

  return sector.metricKeys.map(metricKey => {
    const result = calculateMetric(metricKey, metricsData.metrics, totalData);
    const totalValue = calculateTotalValue(metricKey, metricsData.metrics);
    const subDataSeries = calculateSubDataSeries(metricKey, metricsData.metrics);
    //console.log(`Calculated metric for ${metricKey.key}:`, result);
    return {
      ...metricKey,
      ...result,
      totalValue,
      organicSum: result.value,
      subData: (result as any).subData || [],
      subDataArray: metricKey.subDataArray || false,
      subDataSeries, // This line includes the subDataSeries
    };
  });
};

// Updated function to calculate subDataSeries
const calculateSubDataSeries = (metricKey: MetricKey, metricsData: Record<string, MonthData>) => {
  const { key } = metricKey;
  const subDataSeries: { year: string; month: string; name: string; value: number | string; vacant?: number; occupied?: number }[] = [];

  Object.entries(metricsData).forEach(([date, metrics]) => {
    const [year, month] = date.split('-');
    if (metrics[key]) {
      if (metricKey.foreceSubDataSeries) {
        // Handle foreceSubDataSeries
        const value = metrics[key];
        if (typeof value === 'number' && date !== 'total') {
          subDataSeries.push({ year, month, name: metricKey.title, value });
        }
      } else if (Array.isArray(metrics[key])) {
        metrics[key].forEach((item: any) => {
          if (item.label_en && item.value !== undefined) {
            subDataSeries.push({ year, month, name: item.label_en, value: item.value });
          } else if (item.UnitTypename && item.vacant !== undefined && item.occupied !== undefined) {
            subDataSeries.push({
              year,
              month,
              name: item.UnitTypename,
              value: `Occupied: ${item.occupied}, Vacant: ${item.vacant}`,
              vacant: item.vacant,
              occupied: item.occupied
            });
          }
        });
      } else if (typeof metrics[key] === 'object' && metrics[key] !== null) {
        // Handle the vacant_vs_occupied_general case
        if (key === 'vacant_vs_occupied_general') {
          subDataSeries.push({
            year,
            month,
            name: 'Vacant',
            value: metrics[key].vacant,
            vacant: metrics[key].vacant
          });
          subDataSeries.push({
            year,
            month,
            name: 'Occupied',
            value: metrics[key].occupied,
            occupied: metrics[key].occupied
          });
        } else {
          Object.entries(metrics[key]).forEach(([subKey, value]) => {
            if (typeof value === 'number') {
              subDataSeries.push({ year, month, name: subKey, value });
            }
          });
        }
      }
    }
  });

  return subDataSeries;
};

const calculateMetric = (metricKey: MetricKey, metricsData: Record<string, MonthData>, totalData: Record<string, any>) => {
  const { key, visualType, sumType } = metricKey;
  //console.log('Calculating metric for key:', key);
  //console.log('Metric data:', metricsData);

  if (metricKey.showYears) {
    return processAvgWithDate(metricsData, key, sumType);
  }

  // Filter out "range" when collecting dates
  const dates = Object.keys(metricsData)
    .filter(date => date !== 'range')
    .sort()
    .reverse();
    
  const currentDate = dates[0];
  const currentData = metricsData[currentDate]?.[key];
  const totalLandsData = metricsData[dates[1]]?.["total_lands_available"];
  
  const totalLands = {
    total: totalLandsData?.total || 0,
    available: totalLandsData?.available || 0
  };

  // Check if subDataArray is true or if the data is an array
  const isSubDataArray = metricKey.subDataArray || Array.isArray(currentData);

  if (isSubDataArray) {
    return {
      ...calculateArrayMetric(key, metricsData, dates, visualType, sumType),
      totalLands,
    };
  } else {
    return calculateSimpleMetric(key, metricsData, totalData, dates, sumType);
  }
};

const processAvgWithDate = (metricsData: Record<string, MonthData>, metricKey: string, sumType?: string) => {
  const dates = Object.keys(metricsData).sort().reverse();
  const subData: { name: string; value: number }[] = [];
  const subDataSeries: { year: string; month: string; value: number }[] = [];

  let total = 0;
  let count = 0;

  for (const date of dates) {
    if (date === 'total') continue;
    const [year, month] = date.split('-');
    const dateValue = metricsData[date]?.[metricKey];

    //console.log(`Date: ${date}, ${metricKey}: ${dateValue}`);

    if (dateValue !== undefined) {
      const numericValue = typeof dateValue === 'string' 
        ? parseFloat(dateValue.replace('%', '')) 
        : dateValue;
      
      if (!isNaN(numericValue)) {
        subData.push({ name: date, value: numericValue });
        subDataSeries.push({ year, month, value: numericValue });
        total += numericValue;
        count++;
      }
    }
  }

  const value = count > 0 ? (sumType === 'sumAverage' ? total / count : total) : 0;

  //console.log(`Calculated value: ${value}`);
  //console.log(`subData:`, subData);
  console.log(`subDataSeries: ${metricKey}`, subDataSeries);

  return {
    value: value,
    change: calculateChange(subData[0]?.value, subData[1]?.value),
    period: 'total',
    subDataArray: true,
    subData,
    subDataSeries: subDataSeries,
  };
};

const calculateArrayMetric = (key: string, metricsData: Record<string, MonthData>, dates: string[], visualType: string, sumType?: string) => {
  let total = 0;
  let count = 0;
  let subData: any[] = [];
  let key_types = [
    'condemnation_liver_by_type',
    'carcass_condemnation_by_type',
    'slaughtered_by_type',
    'meat_chopping_by_type',
    'condemnation_by_type',
    'passed_skin_by_type'
  ];

  // Filter out "range", "total""
  const validDates = dates.filter(date => date !== 'range' && date !== 'total');

  if (key_types.includes(key)) {
    const byTypeSum: { [key: string]: number } = {};

    validDates.forEach(date => {
      const yearData = metricsData[date]?.[key];
      if (yearData && typeof yearData === 'object') {
        if (yearData.total !== undefined) {
          total += yearData.total;
        }
        if (yearData.by_type && Array.isArray(yearData.by_type)) {
          yearData.by_type.forEach((item: { id: number; label_en: string; label_ar: string; value: number }) => {
            byTypeSum[item.label_en] = (byTypeSum[item.label_en] || 0) + item.value;
          });
        }
      }
    });

    subData.push({ name: 'total', value: total });
    const byTypeObject: { [key: string]: any } = {};
    Object.entries(byTypeSum).forEach(([label, value]) => {
      byTypeObject[label] = {
        label_en: label,
        value: value
      };
    });
    subData.push({ name: 'by_type', value: byTypeObject });
    count = validDates.length;

    // Process subData only for condemnation_liver_by_type
    subData = processSubLevelData(subData);
  } else if (key === 'total_lands_available') {
    // Use the first valid date
    const yearData = metricsData[validDates[0]]?.[key];
    if (yearData !== undefined) {
      total = yearData;
      count = 1;
    }
  } else if (key === 'total_lands_by_type') {
    // Find the most recent valid date with data
    const mostRecentDate = validDates.find(date => metricsData[date] && metricsData[date][key]);
    console.log('subData for total_lands_by_type_total: 227', mostRecentDate);
  if (mostRecentDate) {
    const yearData = metricsData[mostRecentDate][key];
    if (Array.isArray(yearData)) {
      // Preserve the original structure, including parent-child relationships
      subData = yearData.map(item => {
        const processedItem: any = { ...item };
        if (Array.isArray(item.children)) {

          // Edit 1: Add type annotations to the map function
          processedItem.children = item.children.map((child: any) => ({ ...child }));
          // Edit 2: Add type annotations to the reduce function


          processedItem.value = item.children.reduce((sum: number, child: any) => sum + (child.value || 0), 0);
        }
        return processedItem;
      });
      // Calculate overall total
      total = subData.reduce((sum, item) => sum + (item.value || 0), 0);
      //console.log('subData for total_lands_by_type_total:', total);
    }
  }
  //console.log('subData for total_lands_by_type:', subData);
   
  // Return the entire subData and the total
  return { 
    value: total, 
    change: 0, 
    period: 'total', 
    visualType, 
    subDataArray: true, 
    subData,
      subDataSeries: calculateSubDataSeries({ key } as MetricKey, metricsData)
    };
  } else if (key === 'total_waste_bins_by_type') {
    // Find the most recent date with data
    const mostRecentDate = validDates.find(date => metricsData[date] && metricsData[date][key]);
    if (mostRecentDate) {
      const yearData = metricsData[mostRecentDate][key];
      if (Array.isArray(yearData)) {
        subData = yearData.map(item => ({
          name: item.label_en || item.name,
          value: item.value
        }));
        total = subData.reduce((sum, item) => sum + item.value, 0);
      }
    }

    const subDataSeries = calculateSubDataSeries({ key } as MetricKey, metricsData);

    return {
      value: total,
      change: 0,
      period: 'total',
      visualType,
      subDataArray: true,
      subData,
      subDataSeries,
      totalValue: total,
      organicSum: total
    };
  } else if (key == 'carcass_condemnation_by_type') {
    const sums: { [subKey: string]: number } = {};
    // Find the most recent year's data
    const mostRecentDate = validDates.find(date => metricsData[date] && metricsData[date][key]);
    if (mostRecentDate) {
      const yearData = metricsData[mostRecentDate][key];
      if (Array.isArray(yearData)) {
        yearData.forEach((item: { label_en: string; value: number }) => {
          total += item.value;
          subData.push({ name: item.label_en, value: item.value });
        });
      }
    }
    count = Object.keys(sums).length;
  } else if (key === 'eservice_survey_result' || key === 'website_survey' || key === 'employee_portal_survey') {
    const sums: { [subKey: string]: number } = {};
    const counts: { [subKey: string]: number } = {};

    for (const date of validDates) {
      if (date === 'total') continue;
      const monthData = metricsData[date];
      if (monthData && monthData[key] && typeof monthData[key] === 'object') {
        Object.entries(monthData[key]).forEach(([subKey, value]) => {
          if (typeof value === 'number') {
            sums[subKey] = (sums[subKey] || 0) + value;
            counts[subKey] = (counts[subKey] || 0) + 1;
          }
        });
      }
    }

    Object.entries(sums).forEach(([subKey, sum]) => {
      const average = sum / counts[subKey];
      // Exclude "Total Survey Count" from subData
      if (subKey !== 'total_survey_count') {
        subData.push({ name: subKey, value: average });
        total += average;
      }
    });

    count = Object.keys(sums).length;
  } else if (key === 'vacant_vs_occupied_general') {
    // Find the most recent date with data
    const mostRecentDate = validDates.find(date => metricsData[date] && metricsData[date][key]);
    if (mostRecentDate) {
      const data = metricsData[mostRecentDate][key];
      if (data && typeof data === 'object') {
        subData.push({ name: 'Vacant', value: data.vacant || 0 });
        subData.push({ name: 'Occupied', value: data.occupied || 0 });
      }
    }
    count = 1; // We're only considering the most recent data
  } else if (key === 'vacant_vs_occupied_by_type') {
    const mostRecentDate = validDates.find(date => metricsData[date] && metricsData[date][key]);
    if (mostRecentDate) {
      const data = metricsData[mostRecentDate][key];
      if (Array.isArray(data)) {
        // Count the number of types
        count = data.length;
        total = count; // Set total to the count of types

        data.forEach(item => {
          subData.push({
            name: item.label_en,
            value: item.vacant + item.occupied, // Keep this as the total for each type
            vacant: item.vacant,
            occupied: item.occupied
          });
        });
      }
    }
    return {
      value: total, // This will be the number of types
      organicSum: total, // This will be the number of types
      change: 0,
      period: 'total',
      visualType,
      subDataArray: true,
      subData,
      subDataSeries: calculateSubDataSeries({ key } as MetricKey, metricsData)
    };
  } else {
    for (const date of validDates) {
      const monthData = metricsData[date];
      if (monthData && monthData[key]) {
        if (Array.isArray(monthData[key])) {
          monthData[key].forEach((item: { label_en: string; value: number }) => {
            total += item.value;
            updateSubData(subData, item.label_en, item.value);
          });
        } else if (typeof monthData[key] === 'object') {
          Object.entries(monthData[key]).forEach(([subKey, value]) => {
            if (typeof value === 'number') {
              total += value;
              updateSubData(subData, subKey, value);
            }
          });
        } else if (typeof monthData[key] === 'number') {
          total += monthData[key];
          updateSubData(subData, date, monthData[key]);
        } else {
          console.warn(`Data for key ${key} in ${date} is not a number, array, or object`);
        }
      } else {
        // Handle missing data as zero
        updateSubData(subData, date, 0);
      }
    }
    count = validDates.length;
  }

  // For vacant_vs_occupied_general, we don't calculate a single value
  const value = key === 'vacant_vs_occupied_general' ? undefined : (sumType === 'sumAverage' ? total / count : total);
  return { value, change: 0, period: 'total', visualType, subDataArray: true, subData };
};

// Update the function signature
function updateSubData(subData: any[], name: string, value: number | { [key: string]: any }) {
  const existingIndex = subData.findIndex(item => item.name === name);
  if (existingIndex !== -1) {
    if (typeof value === 'number' && typeof subData[existingIndex].value === 'number') {
      subData[existingIndex].value = (subData[existingIndex].value as number) + value;
    } else {
      subData[existingIndex].value = value;
    }
  } else {
    subData.push({ name, value });
  }
}

const calculateSimpleMetric = (key: string, metricsData: Record<string, MonthData>, totalData: Record<string, any>, dates: string[], sumType?: string) => {
  //console.log(`Calculating metric for key: ${key}`);
  //console.log(`Dates:`, dates);
  console.log(`Metrics data:`, metricsData);

  // Check if the value is already a percentage
  const latestValue = metricsData[dates[0]]?.[key];
  if (sumType === 'sumAverage' && typeof latestValue === 'string' && latestValue.includes('%')) {
    return {
      value: latestValue,
      change: 0,
      period: dates[0],
     
      subDataArray: false
    };
  }

  let total = 0;
  let count = 0;

  // Add this condition for showYears
  if (key === "avg_license_per_commercial_land") {
    console.log("check this cehck again");
    const subData: { name: string; value: number | string }[] = [];
    const subDataSeries: { year: string; month: string; value: number | string }[] = [];

    for (const date of dates) {
      if (date === 'total') continue;
      const [year, month] = date.split('-');
      const dateValue = metricsData[date]?.[key];

      if (dateValue !== undefined) {
        // Remove the '%' sign and convert to number if it's a percentage string
        const numericValue = typeof dateValue === 'string' ? parseFloat(dateValue.replace('%', '')) : dateValue;
        
        subData.push({ name: date, value: numericValue });
        subDataSeries.push({ year, month, value: numericValue });
        
        total += numericValue;
        count++;
      }
    }

    // Sort subData and subDataSeries by date (newest first)
    subData.sort((a, b) => b.name.localeCompare(a.name));
    subDataSeries.sort((a, b) => {
      const dateA = `${a.year}-${a.month}`;
      const dateB = `${b.year}-${b.month}`;
      return dateB.localeCompare(dateA);
    });

    return {
      value: sumType === 'sumAverage' ? total / count : total,
      change: calculateChange(subData[0]?.value as number, subData[1]?.value as number),
      period: 'total',
    
      subDataArray: true,
      subData,
      subDataSeries
    };
  }

  // Existing code continues from here
  for (const date of dates) {
    if (date === 'total') continue;
    const dateValue = metricsData[date]?.[key];

    if (dateValue !== undefined) {
      if (typeof dateValue === 'number') {
        total += dateValue;
        count++;
      } else if (typeof dateValue === 'object' && dateValue !== null) {
        const objectTotal = Object.values(dateValue).reduce((sum: number, val: any) => sum + (typeof val === 'number' ? val : 0), 0);
        total += objectTotal;
        count += Object.keys(dateValue).length;
      }
    }
  }

  let value: number | string = 'N/A';
  if (count > 0) {
    const calculatedValue = sumType === 'sumAverage' ? total / count : total;
    value = Number(calculatedValue.toFixed(2));
  }

  let change = 0;
  if (dates.length >= 2) {
    const currentValue = metricsData[dates[0]]?.[key];
    const previousValue = metricsData[dates[1]]?.[key];
    if (currentValue !== undefined && previousValue !== undefined) {
      const currentTotal = typeof currentValue === 'object' ? Object.values(currentValue).reduce((sum: number, val: any) => sum + (typeof val === 'number' ? val : 0), 0) : (typeof currentValue === 'number' ? currentValue : 0);
      const previousTotal = typeof previousValue === 'object' ? Object.values(previousValue).reduce((sum: number, val: any) => sum + (typeof val === 'number' ? val : 0), 0) : (typeof previousValue === 'number' ? previousValue : 0);
      change = calculateChange(currentTotal, previousTotal);
    }
  }

  return {
    value,
    change,
    period: dates[0],

    subDataArray: false
  };
};

const calculateChange = (currentValue: number, previousValue: number) => {
  if (previousValue === 0) return 0;
  return ((currentValue - previousValue) / previousValue) * 100;
};

const aggregateData = (total: number, count: number, sumType?: string) => {
  return sumType === 'sumAverage' ? total / count : total;
};

const calculateTotalValue = (metricKey: MetricKey, metricsData: Record<string, MonthData>) => {
  const { key } = metricKey;
  if (metricsData.total && metricsData.total[key] !== undefined) {
    return metricsData.total[key];
  }
  // If total value is not available, fall back to calculated value
  const result = calculateMetric(metricKey, metricsData, {});
  return result.value;
};
// Helper function to process subData for chart rendering
const processSubLevelData = (subData: { name: string; value: number | { [key: string]: any } }[]) => {
  const secondItem = subData[1];
  if (secondItem && typeof secondItem.value === 'object') {
    return Object.entries(secondItem.value).map(([key, value]) => ({
      label: key, // Use the key as the label
      value: value.value
    }));
  }
  return [];
};

