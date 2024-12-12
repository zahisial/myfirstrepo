/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";
import { SubData } from "../../types/types";
import { TFunction } from "i18next";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";

interface StackedBarChartProps {
  //@ts-ignore
  cardData: {
    [x: string]: string;
    //@ts-ignore
    title: string; value: number; subData: SubData[]
  };
  t: TFunction<"translation", undefined>;
  frequency: "yearly" | "monthly";
}

interface LegendData {
  name: string;
  value: number;
  color: string;
  children?: { name: string; value: number }[];
}

interface DataItem {
  year: string;
  month: string;
  name: string;
  value?: number;
  vacant?: number;
  occupied?: number;
}


// Move formatLabel outside the component
export const formatLabeled = (value: number, unitTypeChart?: string) => {
  console.log('Formatting label. Value:', value, 'unitTypeChart:', unitTypeChart);
  
  if (unitTypeChart === 'days') {
    const days = value / (24 * 60); // Convert minutes to days
    return days.toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    });
  }
  
  if (unitTypeChart === '%') {
    return `${Math.round(value)}%`;
  }
  
  if (Number.isInteger(value) || value > 100) {
    return Math.round(value).toLocaleString('en-US');
  } else {
    return value.toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    });
  }
};

export default function StackedBarChart({
  cardData,
  t,
  frequency,
}: StackedBarChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [colors] = useState<string[]>(['#2563eb', '#f97316']);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const formatNumber = (num: number, isAverage: boolean) => {
    return new Intl.NumberFormat('en-US', { 
      style: 'decimal', 
      minimumFractionDigits: isAverage ? 2 : 0, 
      maximumFractionDigits: isAverage ? 2 : 0 
    }).format(num)
  }

  useEffect(() => {
    if (!containerRef.current || !svgRef.current) return;
    
    // Handle both data formats
    const rawData = Array.isArray(cardData) ? cardData : cardData.subData;
    if (!rawData || !Array.isArray(rawData)) {
      console.log("No valid data available for StackedBarChart");
      return;
    }

    // Filter and prepare data
    const filteredData = rawData.filter(d => d.year !== 'total' && d.year !== 'range');
    
    // Group by date
    const groupedByDate = d3.group(filteredData, d => `${d.year}-${d.month}`);
    const dates = Array.from(groupedByDate.keys()).sort().reverse();

    // Get property types and sort by total values
    const propertyTypes = Array.isArray(cardData) 
      ? ['Occupied', 'Vacant']
      : Array.from(new Set(filteredData.map(d => d.name)))
          .filter(name => {
            const hasData = filteredData.some(d => 
              d.name === name && (
                (d.occupied && d.occupied > 0) || 
                (d.vacant && d.vacant > 0)
              )
            );
            return hasData;
          })
          .sort((a, b) => {
            const totalA = filteredData
              .filter(d => d.name === a)
              .reduce((sum, d) => sum + (d.occupied || 0) + (d.vacant || 0), 0);
            const totalB = filteredData
              .filter(d => d.name === b)
              .reduce((sum, d) => sum + (d.occupied || 0) + (d.vacant || 0), 0);
            return totalB - totalA;
          })
          .slice(0, 15); // Take only top 15 property types

    // Filter out dates that have no data more strictly
    const datesWithData = dates.filter(date => {
      const dateData = groupedByDate.get(date);
      return dateData?.some(item => 
        propertyTypes.includes(item.name) && (
          (item.occupied && item.occupied > 0) || 
          (item.vacant && item.vacant > 0)
        )
      );
    });

    // Adjust dimensions and spacing
    const margin = { top: 20, right: 10, bottom: 40, left: 10 };
    const width = containerRef.current.clientWidth - margin.left - margin.right;
    const barHeight = 10; // Decreased from 30
    const barPadding = 20; // Decreased padding
    const groupPadding = 40; // Decreased group padding
    
    const groupHeight = (barHeight * propertyTypes.length) + groupPadding;
    // Reduce overall height by adjusting the multiplier
    const height = (datesWithData.length * groupHeight * 0.7) + margin.bottom; // Added 0.7 multiplier to reduce height

    // Create scales with adjusted spacing
    const x = d3.scaleBand()
      .domain(datesWithData)
      .range([0, width])
      .padding(0);

    const y = d3.scaleLog()
      .domain([1, d3.max(filteredData, d => {
        if (Array.isArray(cardData)) {
          return d.value || 0;
        }
        return (d.occupied || 0) + (d.vacant || 0);
      }) || 1])
      .range([height - margin.bottom, 0])
      .nice();

    const xSubgroup = d3.scaleBand()
      .domain(propertyTypes)
      .range([0, x.bandwidth()])
      .padding(0.1); // Reduced padding to allow slight overlap

    // Setup SVG
    const svg = d3.select(svgRef.current)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height);

    svg.selectAll("*").remove();

    const g = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Add y-axis with reversed ticks
    g.append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x)
        .tickFormat(d => {
          const [year, month] = d.split('-');
          return `${month}/${year.slice(2)}`;
        }));

    // g.append("g")
    //   .attr("class", "y-axis")
    //   .call(d3.axisLeft(y)
    //     .tickFormat(() => '') // Set tick format to empty string to hide values
    //   );

    // Create date groups
    const dateGroups = g.selectAll("g.date-group")
      .data(datesWithData)
      .join("g")
      .attr("class", "date-group")
      .attr("transform", d => `translate(${x(d)},0)`);

    // Add bars and labels for each property type
    propertyTypes.forEach((type, index) => {
      console.log('Creating bars for type:', type);
      console.log('Bar data:', groupedByDate);
      
      const group = dateGroups.append("g")
        .attr("class", "bar-group");

      // Define helper functions at the start
      const getData = (d: any) => {
        const typeData = groupedByDate.get(d)?.find(item => item.name === type);
        return {
          occupied: typeData?.occupied || 0,
          vacant: typeData?.vacant || 0
        };
      };

      const value = (d: any) => {
        const typeData = groupedByDate.get(d)?.find(item => item.name === type);
        return typeData?.value || 0;
      };

      const hasData = (d: any) => {
        const typeData = groupedByDate.get(d)?.find(item => item.name === type);
        if (Array.isArray(cardData)) {
          return (typeData?.value || 0) > 0;
        } else {
          const occupied = typeData?.occupied || 0;
          const vacant = typeData?.vacant || 0;
          return occupied > 0 || vacant > 0;
        }
      };

      // Only create group if there's data
      const activeGroup = group.filter(d => {
        const data = getData(d);
        return (data.occupied > 0 || data.vacant > 0);
      });

      // Adjust the y-position calculation to create overlap
      const yOffset = index * (barHeight * 0.7); // Multiply by 0.7 to create overlap

      if (Array.isArray(cardData)) {
        // Calculate dynamic bar width based on available space
        const barWidth = Math.min(
          30, // maximum width
          Math.max(
            5, // minimum width
            (x.bandwidth() * 0.8) / propertyTypes.length // 80% of available space divided by number of bars
          )
        );

        activeGroup.filter(d => value(d) > 0)
          .append("rect")
          .attr("class", type.toLowerCase())
          .attr("x", d => xSubgroup(type)!)
          .attr("y", d => y(value(d) + 1) + yOffset)
          .attr("width", barWidth) // Use dynamic width instead of static barHeight
          .attr("height", d => height - margin.bottom - y(value(d) + 1))
          .attr("fill", type === 'Occupied' ? colors[0] : colors[1])
          .style("opacity", 1);
      } else {
        // For existing data format
        // Only create bars for non-zero values
        activeGroup.each(function(d) {
          const data = getData(d);
          const group = d3.select(this);
          
          const total = data.occupied + data.vacant;
          
          // First render occupied bar (bottom)
          if (data.occupied > 0) {
            group.append("rect")
              .attr("class", type.toLowerCase())
              .attr("x", xSubgroup(type)!)
              .attr("y", y(total + 1) + (data.vacant / total) * (height - margin.bottom - y(total + 1))) // Adjust y position
              .attr("width", barHeight)
              .attr("height", (data.occupied / total) * (height - margin.bottom - y(total + 1))) // Proportional height
              .attr("fill", colors[0])
              .style("opacity", 1);
          }

          // Then render vacant bar (top)
          if (data.vacant > 0) {
            group.append("rect")
              .attr("class", "vacant")
              .attr("x", xSubgroup(type)!)
              .attr("y", y(total + 1)) // Start from top
              .attr("width", barHeight)
              .attr("height", (data.vacant / total) * (height - margin.bottom - y(total + 1))) // Proportional height
              .attr("fill", colors[1])
              .style("opacity", 1);
          }
        });
      }

      // Add labels inside the bars
      activeGroup.append("text")
        .attr("x", d => xSubgroup(type)! + (barHeight / 2))
        .attr("y", d => {
          const data = getData(d);
          return y(data.occupied + data.vacant + 1) - 5;
        })
        .attr("text-anchor", "middle")
        .attr("fill", "white")
        .attr("class", "text-sm font-medium")
        .style("pointer-events", "none")
        .each(function(d) {
          const rect = d3.select(this.parentElement).select("rect");
          const width = parseFloat(rect.attr("width"));
          
          const text = d3.select(this);
          const label = t(type);
          
          // Show text if bar width is at least 25px
          if (width < 25) {
            text.style("visibility", "hidden");
          } else {
            text.style("visibility", "visible");
          }
          
          text.text(label);
        });
    });

    // Initialize tooltip
    const tooltip = d3.select(tooltipRef.current);
    
    // Select all rect elements in the SVG
    const bars = g.selectAll("rect")
      .on("mouseover", function(event) {
        const rect = d3.select(this);
        
        // Get the bar group and its index to determine the type
        // @ts-ignore
        const barGroup = this.parentElement;
        const barGroupIndex = Array.from(barGroup.parentElement.children).indexOf(barGroup);
        const type = propertyTypes[barGroupIndex]; // Use the index to get the correct type
        
        // Get the date from the date group
        // @ts-ignore
        const date = this.parentElement.parentElement.__data__;
        
        // Get the data for this specific bar
        const dateData = groupedByDate.get(date);
        const typeData = dateData?.find(d => d.name === type);
        
        console.log('Tooltip Data:', {
          type,
          date,
          dateData,
          typeData,
          fullGroupedByDate: groupedByDate
        });
        
        rect.style("opacity", 1);
        
        const [mouseX, mouseY] = d3.pointer(event, containerRef.current);
        
        tooltip
          .style("display", "block")
          .style("opacity", 1)
          .html(`
            <div class="p-2"></div>
              <div class="font-bold mb-1">${t(type)}</div>
              <div class="text-sm mb-1 text-gray-400">
                ${t('Data for')} ${date}
              </div>
              ${typeData?.occupied !== undefined ? `
                <div class="flex justify-between gap-4 items-center">
                  <div class="flex items-center gap-2">
                    <div class="w-3 h-3 rounded-sm" style="background-color: ${colors[0]};"></div>
                    <span>${t('Occupied')}:</span>
                  </div>
                  <span>${formatNumber(typeData.occupied, false)} (${formatNumber(typeData.occupied / (typeData.occupied + typeData.vacant) * 100, true)}%)</span>
                </div>
              ` : ''}
              ${typeData?.vacant !== undefined ? `
                <div class="flex justify-between gap-4 items-center">
                  <div class="flex items-center gap-2">
                    <div class="w-3 h-3 rounded-sm" style="background-color: ${colors[1]};"></div>
                    <span>${t('Vacant')}:</span>
                  </div>
                  <span>${formatNumber(typeData.vacant, false)} (${formatNumber(typeData.vacant / (typeData.occupied + typeData.vacant) * 100, true)}%)</span>
                </div>
              ` : ''}
              ${typeData?.occupied !== undefined || typeData?.vacant !== undefined ? `
                <div class="flex justify-between gap-4 mt-1 pt-1 border-t">
                  <span>${t('Total')}:</span>
                  <span>${formatNumber(typeData.occupied + typeData.vacant, false)}</span>
                </div>
              ` : ''}
            </div>
          `)
          .style("left", `${mouseX + 10}px`)
          .style("top", `${mouseY - 10}px`);
      })
      .on("mouseout", function() {
        d3.select(this).style("opacity", 1);
        tooltip
          .style("opacity", 0)
          .style("display", "none");
      })
      .on("mousemove", function(event) {
        const [mouseX, mouseY] = d3.pointer(event, containerRef.current);
        tooltip
          .style("left", `${mouseX + 10}px`)
          .style("top", `${mouseY - 10}px`);
      });

  }, [cardData, t, frequency, colors]);

  // Update getLegendData to group by years
  const getLegendData = () => {
    if (!cardData?.subData) return [];

    try {
      const filteredData = cardData.subData.filter(item => 
        item.year !== 'total' && 
        item.year !== 'range'
      );

      console.log('Legend Raw Data:', filteredData);

      // Group by year and month
      const timeGroups = filteredData.reduce((acc: any, curr) => {
        const timeKey = `${curr.year}-${curr.month}`;
        
        if (!acc[timeKey]) {
          acc[timeKey] = {};
        }
        if (!acc[timeKey][curr.name]) {
          acc[timeKey][curr.name] = {
            name: curr.name,
            occupied: 0,
            vacant: 0,
            year: curr.year,
            month: curr.month
          };
        }
        if (curr.occupied > 0) acc[timeKey][curr.name].occupied = curr.occupied;
        if (curr.vacant > 0) acc[timeKey][curr.name].vacant = curr.vacant;
        return acc;
      }, {});

      console.log('Legend Grouped Data:', timeGroups);

      const result = Object.entries(timeGroups)
        .sort(([timeA], [timeB]) => timeB.localeCompare(timeA))
        .map(([timeKey, data]: [string, any]) => {
          const [year, month] = timeKey.split('-');
          return {
            timeKey,
            displayTime: `${month}/${year}`,
            items: Object.values(data)
              .filter((item: any) => item.occupied > 0 || item.vacant > 0)
              .sort((a: any, b: any) => {
                const totalA = (a.occupied || 0) + (a.vacant || 0);
                const totalB = (b.occupied || 0) + (b.vacant || 0);
                return totalB - totalA;
              })
          };
        });

      console.log('Legend Final Data:', result);
      return result;
    } catch (error) {
      console.error("Error calculating legend data:", error);
      return [];
    }
  };

  return (
    <div className="relative flex flex-col items-center w-full h-full" ref={containerRef}>
      <div className="relative w-full">
        <svg ref={svgRef} className="w-full" />
        <div
          ref={tooltipRef}
          className="absolute p-2 text-white bg-black rounded shadow-lg pointer-events-none"
          style={{
            position: 'absolute',
            zIndex: 9999,
            opacity: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            minWidth: '120px',
          }}
        />
      </div>
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1" className="border-none">
          <AccordionTrigger className="text-lg font-semibold text-gray-800 dark:text-white">
            {t('Chart Legend')}
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-8">
              {getLegendData().map((timeGroup) => (
                <div key={timeGroup.timeKey} className="space-y-4">
                  <h3 className="text-lg font-semibold">{timeGroup.displayTime}</h3>
                  <div className="grid grid-cols-3 gap-4">
                    {timeGroup.items.map((item, index) => (
                      // @ts-ignore
                      <div key={`${timeGroup.timeKey}-${index}`} className="flex items-center gap-2">
                        {/* Only show occupied if value > 0 */}
                        {/* @ts-ignore */}
                        {item.occupied > 0 && (
                          // @ts-ignore
                          <>
                            <div className="w-3 h-3" style={{ backgroundColor: colors[0] }} />
                            {/* @ts-ignore */}
                            <span className="text-sm">{formatNumber(item.occupied, false)}</span>
                          </>
                        )}

                        {/* Only show vacant if value > 0 */}
                        {/* @ts-ignore */}
                        {item.vacant > 0 && (
                          <>
                            <div className="w-3 h-3" style={{ backgroundColor: colors[1] }} />
                            {/* @ts-ignore */}
                            <span className="text-sm">{formatNumber(item.vacant, false)}</span>
                          </>
                        )}

                        {/* Only show type name if either value exists */}
                        {/* @ts-ignore */}
                        {(item.occupied > 0 || item.vacant > 0) && (
                          <span className="ml-2 text-sm font-bold">
                            {/* @ts-ignore */}
                            {t(item.name)}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
