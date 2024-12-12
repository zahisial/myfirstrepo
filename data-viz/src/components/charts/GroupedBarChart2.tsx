/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import React, { useRef, useEffect, useState, useCallback } from "react"
import * as d3 from "d3"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion"
import { useTranslation } from 'react-i18next'
import Legend from "./Legend"

interface ProjectData {
  [x: string]: any
  year: string
  month: string
  name: string
  value: number
}

interface GroupedBarChartProps {
  data: ProjectData[]
  subData: any
  unitTypeChart: string
  cardTitle: string
}

// Add the convertCurrency function
const convertCurrency = (amount: number): string => {
    const suffixes = ["", "K", "M", "B", "T"];
    const isNegative = amount < 0;
    if (isNegative) {
        amount = Math.abs(amount);
    }
    let magnitude = Math.floor(Math.log10(amount) / 3);
    if (magnitude >= suffixes.length) {
        magnitude = suffixes.length - 1;
    }
    const valueInSuffix = amount / Math.pow(10, magnitude * 3);
    const roundedValue = valueInSuffix.toFixed(2);
    return (isNegative ? '-' : '') + roundedValue + suffixes[magnitude];
};

// Update the formatLabeled function to use convertCurrency
const formatLabeled = (value: number, unitType: string = '') => {
  if (unitType === 'AED') {
    return convertCurrency(value) + unitType;
  }
  // Keep existing format for other unit types
  const formattedValue = new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0
  }).format(value);
  return `${formattedValue}${unitType}`;
};

export default function GroupedBarChart({ data, subData, unitTypeChart }: GroupedBarChartProps) {
  const { t } = useTranslation()
  const svgRef = useRef<SVGSVGElement | null>(null)
  const tooltipRef = useRef<HTMLDivElement | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const [colors, setColors] = useState<string[]>([])
  console.log(data)
  const monthOrder = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']

  // Filter the data in the first useEffect for colors
  useEffect(() => {
    const filteredData = data.filter(item => item.year !== 'range' && item.year !== 'total');
    const colorScale = d3.scaleOrdinal()
      .domain(filteredData.map(d => d.name))
      .range([
        '#00ffff',   // cyan
        '#ff4d4d',   // bright red
        '#00ff00',   // lime green
        '#ff9933',   // bright orange
        '#8a2be2',   // blue violet
        '#ffff00',   // yellow
        '#4d94ff',   // bright blue
        '#ff531a',   // bright red-orange
        '#00ff99',   // bright mint
        '#ff66b3',   // bright rose
        '#66ffcc',   // bright turquoise
        '#ffa07a',   // light salmon
        '#99ff33',   // bright lime
        '#da70d6',   // orchid
        '#66ffff',   // bright cyan
        '#9933ff',   // bright purple
        '#ff3399',   // hot pink
        '#32cd32',   // lime green
        '#ff6600',   // dark orange
        '#00cc99',   // seafoam green
        '#dda0dd',   // plum
        '#6666ff',   // periwinkle
        '#ffd700',   // gold
        '#20b2aa',   // light sea green
        '#ff69b4',   // hot pink
        '#7b68ee',   // medium slate blue
        '#ffa500',   // orange
        '#48d1cc',   // medium turquoise
        '#ff1493',   // deep pink
        '#4169e1'    // royal blue
      ]);
    
    // Create a Set of unique names to ensure each gets a different color
    const uniqueNames = Array.from(new Set(filteredData.map(d => d.name)));
    const chartColors = uniqueNames.map(name => colorScale(name) as string);
    setColors(chartColors);
  }, [data]);

  // Tooltip functions
  //@ts-ignore
  const showTooltip = useCallback((event: MouseEvent, d: any, year: string, maxValue: number) => {
    const tooltip = d3.select(tooltipRef.current);
    const [x, y] = d3.pointer(event, svgRef.current);
    
    tooltip.transition()
      .duration(200)
      .style('opacity', .9);
    
    tooltip.html(`
      <div class="font-bold mb-1">${year} - ${t(d.month)}</div>
      <div class="flex items-center gap-2">
        <div class="w-3 h-3 rounded-full" style="background: ${colors[data.findIndex(item => item.name === d.name)]}"></div>
        <span>${d.name}</span>
      </div>
      <div class="mt-1">
        ${t('Value')}: ${formatLabeled(d.value, unitTypeChart)}
      </div>
    `)
    .style('left', `${x}px`)
    .style('top', `${y - 10}px`);
  }, [colors, data, t, unitTypeChart]);

  const moveTooltip = useCallback((event: MouseEvent) => {
    const [x, y] = d3.pointer(event, svgRef.current);
    const tooltip = d3.select(tooltipRef.current);
    tooltip
      .style('left', `${x}px`)
      .style('top', `${y - 10}px`);
  }, []);

  const hideTooltip = useCallback(() => {
    const tooltip = d3.select(tooltipRef.current);
    tooltip.transition()
      .duration(500)
      .style('opacity', 0);
  }, []);

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const minSize = 400
        setDimensions({
          width: Math.max(containerRef.current.clientWidth, minSize),
          height: 400
        })
      }
    }

    updateDimensions()
    window.addEventListener('resize', updateDimensions)
    return () => window.removeEventListener('resize', updateDimensions)
  }, [])

  useEffect(() => {
    if (!data || data.length === 0 || !dimensions.width || !dimensions.height) return;

    const filteredData = data.filter(item => item.year !== 'range' && item.year !== 'total');

    const margin = { top: 40, right: 30, bottom: 60, left: 60 };
    const width = dimensions.width;
    const height = dimensions.height;

    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Group data by year-month
    const timeGroups = d3.group(filteredData, d => `${d.year}-${d.month}`);
    const timeKeys = Array.from(timeGroups.keys()).sort((a, b) => a.localeCompare(b));
    
    // Get unique names for stacking
    const names = Array.from(new Set(filteredData.map(d => d.name)));

    // Prepare data for stacking
    const stackedData = timeKeys.map(timeKey => {
      const timeData = timeGroups.get(timeKey) || [];
      const result: any = { timeKey };
      names.forEach(name => {
        const match = timeData.find(d => d.name === name);
        result[name] = match ? match.value : 0;
      });
      return result;
    });

    // Create the stack generator
    const stack = d3.stack()
      .keys(names)
      .order(d3.stackOrderNone)
      .offset(d3.stackOffsetNone);

    const series = stack(stackedData);
    const maxValue = d3.max(series, layer => d3.max(layer, d => d[1])) || 0;

    // Define scales
    const x = d3.scaleBand()
      .domain(timeKeys)
      .range([0, width - margin.left - margin.right])
      .padding(0.6);

    const y = d3.scaleLinear()
      .domain([0, maxValue])
      .range([height - margin.top - margin.bottom, 0])
      .nice();

    // Create the stacked bars
    series.forEach((layer, i) => {
      svg.selectAll(`.bar-${i}`)
        .data(layer)
        .join("rect")
        .attr("class", `bar-${i}`)
        .attr("x", d => {
          //@ts-ignore
          const xPos = x(d.data.timeKey)!;
          const barWidth = x.bandwidth() * 0.6;
          const offset = (x.bandwidth() - barWidth) / 2;
          return xPos + offset;
        })
        .attr("y", d => y(d[1]))
        .attr("height", d => y(d[0]) - y(d[1]))
        .attr("width", x.bandwidth() * 0.6)
        .attr("fill", colors[i])
        .attr("opacity", 0.9)
        .on("mouseover", (event, d) => {
          const tooltip = d3.select(tooltipRef.current);
          const [mouseX, mouseY] = d3.pointer(event, svgRef.current);
          const value = d[1] - d[0];
          const name = names[i];
          
          tooltip.transition()
            .duration(200)
            .style('opacity', .9);
            
          tooltip.html(`
            <div class="font-bold mb-1">${d.data.timeKey}</div>
            <div class="text-sm mb-1">${t(name)}</div>
            <div class="flex items-center gap-2">
              <div class="w-3 h-3 rounded-full" style="background: ${colors[i]}"></div>
              <span>${formatLabeled(value, unitTypeChart)}</span>
            </div>
          `)
            .style('left', `${mouseX}px`)
            .style('top', `${mouseY}px`);
        })
        .on("mousemove", (event) => {
          const [mouseX, mouseY] = d3.pointer(event, svgRef.current);
          const tooltip = d3.select(tooltipRef.current);
          tooltip
            .style('left', `${mouseX}px`)
            .style('top', `${mouseY}px`);
        })
        .on("mouseout", () => {
          const tooltip = d3.select(tooltipRef.current);
          tooltip.transition()
            .duration(500)
            .style('opacity', 0);
        });
    });

    // Add axes
    svg.append("g")
      .attr("transform", `translate(0,${height - margin.top - margin.bottom})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", ".15em")
      .attr("transform", "rotate(-45)");

    svg.append("g")
      .call(d3.axisLeft(y)
      .tickFormat(d => formatLabeled(+d, unitTypeChart || '')));

  }, [data, dimensions, colors, t, unitTypeChart]);

  // Inside the GroupedBarChart component, before the return statement
  // Add this function to organize data by year and month
  const organizeDataByYear = (data: ProjectData[]) => {
    // Group data by year
    const groupedByYear = d3.group(data, d => d.year)
    
    // Convert to array of year groups
    return Array.from(groupedByYear).map(([year, values]) => ({
      year,
      items: values.map(d => ({
        name: d.month,
        value: d.value
      }))
    }))
  }

  return (
    <div ref={containerRef} className="relative w-full h-full">
      <svg ref={svgRef} className="w-full h-full" />
      <div
        ref={tooltipRef}
        className="absolute p-2 text-white transition-opacity duration-200 bg-black rounded shadow-lg opacity-0 pointer-events-none bg-opacity-80"
        style={{
          left: 0,
          top: 0,
          zIndex: 10,
        }}
      />
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1" className="border-none">
          <AccordionTrigger className="text-lg font-semibold text-gray-800 dark:text-white">
            {t('Chart Legend')}
          </AccordionTrigger>
          <AccordionContent>
            <div className="ml-4">
              {/* Group by year-month and display each section */}
              {Array.from(d3.group(
                data.filter(item => item.year !== 'range' && item.year !== 'total'),
                d => `${d.year}-${d.month}`
              )).map(([yearMonth, yearMonthData]) => (
                <div key={yearMonth} className="mb-8">
                  {/* Year-Month Header */}
                  <div className="pb-1 mb-3 font-semibold border-b">
                    {yearMonth}
                  </div>
                  
                  {/* Legend items for this year-month */}
                  <Legend 
                    data={yearMonthData.map(item => ({ 
                      name: item.name,
                      value: item.value 
                    }))}
                    colors={colors}
                    unitTypeChart={unitTypeChart}
                    formatValue={formatLabeled}
                    translate={t}
                  />
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}