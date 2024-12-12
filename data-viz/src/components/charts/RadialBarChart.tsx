/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import React, { useRef, useEffect, useState, useCallback } from 'react'
import * as d3 from 'd3'
import { SubData } from '../../types/types'
import { useTranslation } from 'react-i18next'
import { Arc } from 'd3-shape';  // Make sure to import Arc type
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

interface RadialBarChartProps {
  cardData: {
    title: string;
    value: number;
    subData: SubData[];
    unitTypeChart?: string; // Make sure this is defined
  };
  frequency: "yearly" | "monthly";
}

export default function RadialBarChart({
  cardData,
  frequency,
}: RadialBarChartProps) {
  const { t } = useTranslation();
  const svgRef = useRef<SVGSVGElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [colors, setColors] = useState<string[]>([]);

  // Define tooltip functions with useCallback
  const showTooltip = useCallback((event: MouseEvent, d: SubData) => {
    const tooltip = d3.select(tooltipRef.current);
    const tooltipWidth = tooltipRef.current?.offsetWidth || 0;
    const tooltipHeight = tooltipRef.current?.offsetHeight || 0;
    
    // Get mouse position relative to the container
    const [mouseX, mouseY] = d3.pointer(event, containerRef.current);
    
    // Add offset to position tooltip near cursor but not directly under it
    const xOffset = 10;
    const yOffset = 10;
    
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
    .style('left', `${mouseX + xOffset}px`)
    .style('top', `${mouseY + yOffset}px`);
  }, [t, cardData.unitTypeChart]);

  const moveTooltip = useCallback((event: MouseEvent) => {
    const tooltip = d3.select(tooltipRef.current);
    const [mouseX, mouseY] = d3.pointer(event, containerRef.current);
    
    // Add same offset as in showTooltip
    const xOffset = 10;
    const yOffset = 10;
    
    tooltip
      .style('left', `${mouseX + xOffset}px`)
      .style('top', `${mouseY + yOffset}px`);
  }, []);

  const hideTooltip = useCallback(() => {
    const tooltip = d3.select(tooltipRef.current);
    tooltip.transition()
      .duration(500)
      .style('opacity', 0);
  }, []);

  useEffect(() => {
    if (!cardData?.subData || !svgRef.current) return;

    // Clear existing SVG content
    d3.select(svgRef.current).selectAll("*").remove();

    // Get container dimensions
    const containerElement = svgRef.current?.parentElement;
    if (!containerElement) return;

    const width = containerElement.clientWidth;
    const height = containerElement.clientHeight;
    
    // Create SVG with proper centering
    const svg = d3.select(svgRef.current)
      .attr("width", "100%")
      .attr("height", "100%")
      .attr("viewBox", `-${width/2} -${height/2} ${width} ${height}`)
      .append("g");
    
    const outerRadius = Math.min(width, height) / 2.5; // Adjusted to prevent cutoff
    const dynamicInnerRadius = outerRadius * 0.25;

    const data = cardData.subData.map(item => ({
      ...item,
      value: item.value
    }));

    const x = d3
      .scaleBand()
      .range([0, 2 * Math.PI])
      .align(0)
      .domain(data.map((d) => d.name));

    const y = d3
      .scaleRadial()
      .range([dynamicInnerRadius, outerRadius])
      .domain([0, d3.max(data, (d) => d.value) || 0]);
    const colorScale = d3.scaleOrdinal(d3.schemeCategory10);
    const chartColors = data.map((_, i) =>
      colorScale(i.toString())
    );
    setColors(chartColors);

    const color = (d: any) => colorScale(d.name);

    const arc = d3
      .arc<SubData>()
      .innerRadius(dynamicInnerRadius)
      .outerRadius((d) => y(d.value))
      .startAngle((d) => x(d.name) ?? 0)
      .endAngle((d) => (x(d.name) ?? 0) + (x.bandwidth() ?? 0))
      .padAngle(0.01)
      .padRadius(dynamicInnerRadius);

    // Add the bars
    svg.selectAll("path")
      .data(data)
      .join("path")
      .attr("fill", (d, i) => chartColors[i])
      .attr("d", arc as unknown as string)
      .on("mouseover", showTooltip)
      .on("mousemove", moveTooltip)
      .on("mouseout", hideTooltip);

    // Add the labels
    svg.selectAll("g")
      .data(data)
      .join("g")
      .attr("text-anchor", (d: any) =>
        (x(d.name)! + x.bandwidth() / 2 + Math.PI) % (2 * Math.PI) < Math.PI
          ? "end"
          : "start"
      )
      .attr(
        "transform",
        (d: any) =>
          `rotate(${
            ((x(d.name)! + x.bandwidth() / 2) * 180) / Math.PI - 90
          }) translate(${y(d.value) + 10},0)`
      )
      .append("text")
      .text((d: any) => {
        console.log('Creating label for:', d.name, 'Value:', d.value);
        const formattedValue = formatLabeled(d.value, cardData.unitTypeChart);
        return `${t(d.name)}: ${formattedValue}`;
      })
      .attr("transform", (d: any) =>
        (x(d.name)! + x.bandwidth() / 2 + Math.PI) % (2 * Math.PI) < Math.PI
          ? "rotate(180)"
          : "rotate(0)"
      )
      .style("font-size", "10px")
      .style("fill", "white")
      .attr("alignment-baseline", "middle")
      .on("mouseover", showTooltip)
      .on("mousemove", moveTooltip)
      .on("mouseout", hideTooltip);

    // Add resize handler
    const handleResize = () => {
      const newWidth = containerElement.clientWidth;
      const newHeight = containerElement.clientHeight;
      
      d3.select(svgRef.current)
        .attr("width", "100%")
        .attr("height", "100%")
        .attr("viewBox", `-${newWidth/2} -${newHeight/2} ${newWidth} ${newHeight}`);
        
      // Update scales and redraw elements as needed
      // ... update your scales and redraw logic ...
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      d3.select(svgRef.current).selectAll("*").remove();
    };
  }, [cardData, frequency, showTooltip, moveTooltip, hideTooltip, t]);

  if (
    !cardData ||
    !cardData.subData ||
    !Array.isArray(cardData.subData) ||
    cardData.subData.length === 0
  ) {
    return <div>No data available for the chart</div>;
  }

  return (
    <div className="relative flex flex-col items-center w-full h-full" ref={containerRef}>
      <div className="relative w-full aspect-square">
        <svg 
          ref={svgRef}
          className="w-full h-full"
          style={{ overflow: 'visible' }}
        />
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
      <Accordion type="single" collapsible className="w-full ">
        <AccordionItem value="item-1" className="border-none">
          <AccordionTrigger className="text-lg font-semibold text-gray-800 dark:text-white">
            {t('Chart Legend')}
          </AccordionTrigger>
          <AccordionContent>
            <div className="ml-4 ">
              <Legend 
                data={cardData.subData} 
                colors={colors}
                unitTypeChart={cardData.unitTypeChart}
                formatValue={formatLabeled}
                translate={t}  // Pass the t function here
              />
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
