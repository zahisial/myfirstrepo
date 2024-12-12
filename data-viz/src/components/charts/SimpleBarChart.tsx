/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import React, { useRef, useEffect, useState, useCallback } from 'react'
import * as d3 from 'd3'
import { SubData } from '../../types/types'
import { useTranslation } from 'react-i18next'
import Legend from './Legend';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";


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
    return `${value.toFixed(2)}%`;
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

interface RadialBarChartProps {
  cardData: {
    title: string;
    value: number;
    subData: SubData[];
    unitTypeChart?: string; // Make sure this is defined
  };
  frequency: "yearly" | "monthly";
}

export default function SimpleBarChart({
  cardData,
  frequency,
}: RadialBarChartProps) {
  console.log('RadialBarChart received cardData:', cardData);
  const { t } = useTranslation(); // Add this line to get the t function
  const svgRef = useRef<SVGSVGElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [colors, setColors] = useState<string[]>([]);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "decimal",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);
  };

  useEffect(() => {
    if (cardData?.subData) {
      const colorScale = d3.scaleOrdinal(d3.schemeCategory10);
      const newColors = cardData.subData.map((_, index) => colorScale(index.toString()));
      setColors(newColors);
    }
  }, [cardData?.subData]);

  // Define tooltip functions outside useEffect
  const showTooltip = useCallback((event: MouseEvent, d: SubData) => {
    if (!svgRef.current) return;
    
    const svgBounds = svgRef.current.getBoundingClientRect();
    const x = event.clientX - svgBounds.left + 10;
    const y = event.clientY - svgBounds.top + 10;
    
    const tooltip = d3.select(tooltipRef.current);
    
    tooltip.transition()
      .duration(200)
      .style('opacity', .9);
    
    tooltip.html(`
      <div style="font-weight: bold; margin-bottom: 5px;">
        ${t(d.name)}
      </div>
      <div>
        ${t('Value')}: ${formatLabeled(d.value, cardData.unitTypeChart)}
      </div>
    `)
    .style('left', `${x}px`)
    .style('top', `${y}px`);
  }, [t, cardData.unitTypeChart]);

  const moveTooltip = useCallback((event: MouseEvent) => {
    if (!svgRef.current) return;
    
    // Get SVG element's bounding rectangle
    const svgBounds = svgRef.current.getBoundingClientRect();
    
    // Calculate position relative to the viewport
    const x = event.clientX - svgBounds.left + 10; // Add 10px offset to not overlap cursor
    const y = event.clientY - svgBounds.top + 10;
    
    const tooltip = d3.select(tooltipRef.current);
    tooltip
      .style('left', `${x}px`)
      .style('top', `${y}px`);
  }, []);

  const hideTooltip = useCallback(() => {
    const tooltip = d3.select(tooltipRef.current);
    tooltip.transition()
      .duration(500)
      .style('opacity', 0);
  }, []);

  // Add resize effect
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const minSize = 400;
        setDimensions({
          width: Math.max(containerRef.current.clientWidth, minSize),
          height: containerRef.current.clientHeight
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Add this color scale function near the top of your component
  const getBarColor = (value: number, maxValue: number) => {
    const ratio = value / maxValue;
    if (ratio >= 0.8) return '#22c55e';  // Green for high values
    if (ratio >= 0.5) return '#f97316';  // Orange for medium values
    return '#ef4444';  // Red for low values
  };

  // Draw chart
  useEffect(() => {
    if (!cardData || !cardData.subData || !dimensions.width || !dimensions.height) return;

    const margin = { top: 20, right: 20, bottom: 120, left: 60 };
    const width = dimensions.width - margin.left - margin.right;
    const height = dimensions.height - margin.top - margin.bottom;

    // Clear existing SVG content
    d3.select(svgRef.current).selectAll("*").remove();

    // Create SVG
    const svg = d3.select(svgRef.current)
      .attr("width", "100%")
      .attr("height", "100%")
      .attr("viewBox", `0 0 ${dimensions.width} ${dimensions.height}`)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Scales for vertical bars
    const x = d3.scaleBand()
      .range([0, width])
      .domain(cardData.subData.map(d => d.name))
      .padding(0.7);

    const y = d3.scaleLinear()
      .range([height, 0])
      .domain([0, d3.max(cardData.subData, d => d.value) || 0])
      .nice();

    // Add X axis with rotated labels
    svg.append("g")
      .attr("transform", `translate(0,${dimensions.height - margin.bottom})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", ".15em")
      .attr("transform", "rotate(-45)")
      .style("fill", "white")
      .style("font-size", "12px");

    // Add Y axis
    svg.append("g")
      .call(d3.axisLeft(y))
      .selectAll("text")
      .style("fill", "white")
      .style("font-size", "12px");

    // Find the maximum value
    const maxValue = d3.max(cardData.subData, d => d.value) || 0;

    // Draw vertical bars with dynamic colors
    svg.selectAll("rect")
      .data(cardData.subData)
      .join("rect")
      .attr("x", d => x(d.name) || 0)
      .attr("y", d => y(d.value))
      .attr("width", x.bandwidth() * 0.8)
      .attr("transform", d => `translate(${x.bandwidth() * 0.1}, 0)`)
      .attr("height", d => height - y(d.value))
      .attr("fill", (_, i) => colors[i])
      .on("mouseover", showTooltip)
      .on("mousemove", moveTooltip)
      .on("mouseout", hideTooltip);

    // Optional: Add value labels on top of each bar
    svg.selectAll(".value-label")
      .data(cardData.subData)
      .join("text")
      .attr("class", "value-label")
      .attr("x", d => (x(d.name) || 0) + x.bandwidth() / 2)
      .attr("y", d => y(d.value) - 5)
      .attr("text-anchor", "middle")
      .style("fill", "white")
      .style("font-size", "12px")
      .text(d => formatLabeled(d.value, cardData.unitTypeChart));

  }, [cardData, dimensions, showTooltip, moveTooltip, hideTooltip, frequency]);

  return (
    <div className="relative flex flex-col items-center w-full" ref={containerRef}>
      <div className="relative w-full min-h-[400px] max-w-[700px] aspect-square">
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
      </div>
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1" className="border-none">
          <AccordionTrigger className="text-lg font-semibold text-gray-800 dark:text-white">
            {t('Chart Legend')}
          </AccordionTrigger>
          <AccordionContent>
            <div className="ml-4">
              <Legend 
                data={cardData.subData} 
                colors={colors}
                unitTypeChart={cardData.unitTypeChart}
                formatValue={formatLabeled}
                translate={t}
              />
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
