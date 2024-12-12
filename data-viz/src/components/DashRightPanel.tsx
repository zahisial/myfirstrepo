/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { useTranslation } from 'react-i18next'
import { ApiResponse } from '../types/types'
import { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"

interface DashRightPanelProps {
  sector: string
  district: string
  dashboardData: ApiResponse | null
  onDateRangeChange?: (range: string) => void
}

export interface DashRightPanelCardData {
  id: string
  title: string
  value: string | number
  change: number
  period: string
  trend?: number[]
}

export default interface CardData {
  title: string
  value: string | number
  subValue?: string
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>
  borderColor?: string
  totalLands?: {
    total: number;
    available: number;
  };
}

const lineColors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#0088fe']

function DashCard({ data }: { data: any }) {
  const { t } = useTranslation()
  
  const chartRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (chartRef.current) {
      drawChart()
    }
  }, [data.value])

  const drawChart = () => {
    const svg = d3.select(chartRef.current)
    svg.selectAll("*").remove()

    const width = 150
    const height = 50
    const margin = { top: 10, right: 10, bottom: 10, left: 10 }

    // Create more data points for a smoother curve
    const dataPoints = [0, Number(data.value) / 3, Number(data.value) / 2, data.value as number]

    const xScale = d3.scaleLinear()
      .domain([0, dataPoints.length - 1])
      .range([margin.left, width - margin.right])

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(dataPoints) || 0])
      .range([height - margin.bottom, margin.top])

    const line = d3.line<number>()
      .x((d, i) => xScale(i))
      .y(d => yScale(d))
      .curve(d3.curveNatural) // Use natural curve interpolation

    svg.append("path")
      .datum(dataPoints)
      .attr("fill", "none")
      .attr("stroke", lineColors[0])
      .attr("stroke-width", 2)
      .attr("d", line)
  }

  return (
    <Card className="bg-transparent border-none">
      <CardHeader className="flex flex-row items-center justify-between p-3 space-y-0">
        <CardTitle className="text-sm font-medium text-white uppercase">{t(data.title)}</CardTitle>
      </CardHeader>
      <CardContent className="p-2">
        <div className="pb-4 border-b border-slate-200">
          <div className="flex flex-row justify-between gap-4">
            <p className="w-1/3 text-2xl font-bold text-white">
              {typeof data.value === 'number' ? data.value.toLocaleString() : data.value}
            </p>
            <div className="w-2/3 h-8">
              <svg ref={chartRef} width="100%" height="100%" />
            </div>
          </div>
          {/* {change !== 0 && (
            <div className="flex items-center">
              <span className={`text-sm ${change >= 0 ? 'text-green-500' : 'text-red-500'}`} aria-label={`${Math.abs(change)}% ${change >= 0 ? t('increase') : t('decrease')} ${t('this')} ${t(period)}`}>
                {change >= 0 ? '↑' : '↓'} {Math.abs(change)}% {t('this')} {t(period)}
              </span>
            </div>
          )} */}
        </div>
      </CardContent>
    </Card>
  )
}

export default function DashRightPanel({ sector, district, dashboardData, onDateRangeChange }: DashRightPanelProps) {
  const { t, i18n } = useTranslation();
  const [selectedRange, setSelectedRange] = useState("Last 3 Months");

  // Add useEffect to trigger initial 3-month range when component mounts
  useEffect(() => {
    const defaultRange = dateRanges.find(r => r.value === "3");
    if (defaultRange && onDateRangeChange) {
      console.log('Setting default range (3 months):', defaultRange);
      onDateRangeChange(defaultRange.query);
    }
  }, []); // Empty dependency array means this runs once on mount

  useEffect(() => {
    if (dashboardData) {
      console.log('Current API Response Data:', {
        endpoint: window.location.pathname,
        data: dashboardData
      });
    }
  }, [dashboardData]);

  if (!dashboardData) {
    return <div className="w-64 p-4 text-white">{t('Fetching data available')}</div>
  }

  const DashRightPanelCardData: DashRightPanelCardData[] = Object.entries(dashboardData).map(([key, value]) => ({
    id: key,
    title: t(key.replace(/_/g, ' ').replace('total completed', 'total completed projects')),
    value: value,
    change: 0,
    period: 'month',
    trend: []
  }))

  // Log all titles of the cards
  console.log('Card Titles:', DashRightPanelCardData.map(card => ({
    original: card.id,
    translated: card.title
  })));

  // console.log('Processed DashRightPanelCardData:', DashRightPanelCardData)

  const dateRanges = (() => {
    const today = new Date();
    console.log('Initializing date ranges, today:', today);
    
    const formatYearMonth = (date: Date) => {
      const formatted = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      console.log('Formatted date:', formatted, 'from:', date);
      return formatted;
    };

    const getDateRange = (monthsBack: number) => {
      const toDate = new Date();
      const fromDate = new Date();
      fromDate.setMonth(fromDate.getMonth() - monthsBack);
      
      const query = `from=${formatYearMonth(fromDate)}&to=${formatYearMonth(toDate)}`;
      console.log(`Generated ${monthsBack}-month range:`, query);
      return query;
    };

    const ranges = [
      { value: "3", label: "Last 3 Months", query: getDateRange(3) },
      { value: "6", label: "Last 6 Months", query: getDateRange(6) },
      { value: "12", label: "Last 12 Months", query: getDateRange(12) },
      { value: "24", label: "Last 24 Months", query: getDateRange(24) },
      { value: "36", label: "All Data", query: "" }  // Empty query string for all data
    ];

    console.log('Generated date ranges:', ranges);
    return ranges;
  })();

  return (
    
    <div className="flex flex-col justify-center space-y-4 mt-80 xl:mt-0">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-white">{t("Data visualization")}</h1>
        <h2 className="text-2xl text-white">{t(selectedRange)}</h2>
      </div>
      <div className="flex flex-col items-start gap-4">
        <span className="text-sm text-white">
          {t("Comparing with")} {t(selectedRange)}
        </span>
        <Select 
          defaultValue="3"
          dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}
          onValueChange={(value) => {
            const range = dateRanges.find(r => r.value === value);
            setSelectedRange(range?.label || "");
            console.log('Selected dropdown value:', value);
            console.log('Found range object:', range);
            console.log('Date range query:', range?.query);
            console.log('Full API endpoint:', `/dashboard/?${range?.query}`);
            onDateRangeChange?.(range?.query || "");
          }}
        >
          <SelectTrigger 
            className={`w-[180px] text-white bg-transparent ${
              i18n.language === 'ar' ? 'text-right' : 'text-left'
            }`}
          >
            <SelectValue placeholder={t("Select time range")} />
          </SelectTrigger>
          <SelectContent 
            className={i18n.language === 'ar' ? 'text-right' : 'text-left'}
          >
            {dateRanges.map((range) => (
              <SelectItem 
                key={range.value} 
                value={range.value}
                className={i18n.language === 'ar' ? 'text-right' : 'text-left'}
              >
                {t(range.label)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {DashRightPanelCardData.map((card, index) => (
        <DashCard
          key={card.id}
          data={card}
        />
      ))}
    </div>
  )
}
