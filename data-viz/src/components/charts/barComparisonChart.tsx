/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import React, { useRef, useEffect, useState } from 'react'
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
  
  let formattedValue;
  if (unitTypeChart === '%') {
    // For percentages, round to the nearest integer and add the % sign
    formattedValue = `${Math.round(value)}`;
  } else {
    // For all other cases
    if (Number.isInteger(value) || value > 100) {
      formattedValue = Math.round(value).toLocaleString('en-US');
    } else {
      formattedValue = value.toLocaleString('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
      });
    }
  }
  
  // Capitalize the first letter
  return formattedValue.charAt(0).toUpperCase() + formattedValue.slice(1);
};

interface BarComparisonChartProps {
  cardData: {
    displayValue: any
    title: string;
    value: number;
    subData: SubData[];
    unitTypeChart?: string; // Add this line
  };
  frequency: "yearly" | "monthly";
}

export default function barComparisonChart({
  cardData,
  frequency,
}: BarComparisonChartProps) {
  const { t } = useTranslation();
  const svgRef = useRef<SVGSVGElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [colors, setColors] = useState<string[]>([]);
  const [parsedData, setParsedData] = useState<SubData[]>([]);

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "decimal",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);
  };

  useEffect(() => {
    if (!cardData || !cardData.subData || !Array.isArray(cardData.subData) || cardData.subData.length === 0) {
      console.log("No valid subData available");
      return;
    }
    console.log("tatiltel",cardData.displayValue)

    // Move chart drawing to separate function
    drawChart();
  }, [cardData, frequency, t]);

  // Add resize observer
  useEffect(() => {
    if (!containerRef.current) return;

    const resizeObserver = new ResizeObserver(() => {
      drawChart();
    });

    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, [cardData, frequency, t]);

  const drawChart = () => {
    if (!containerRef.current || !svgRef.current) return;

    // Update size calculations
    const containerWidth = containerRef.current.clientWidth;
    const containerHeight = containerRef.current.clientHeight;
    const aspectRatio = 0.75;
    const width = containerWidth;
    const height = Math.min(containerHeight, containerWidth * aspectRatio);

    const margin = {
      top: Math.max(20, height * 0.05),
      right: Math.max(20, width * 0.05),
      bottom: Math.max(40, height * 0.1),
      left: Math.max(60, width * 0.1)
    };

    // Setup SVG
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    svg.attr('width', width)
       .attr('height', height)
       .attr('viewBox', `0 0 ${width} ${height}`)
       .attr('preserveAspectRatio', 'xMidYMid meet');

    // Setup tooltip functions
    const tooltip = d3
      .select(tooltipRef.current)
      .style("opacity", 0)
      .style("position", "absolute")
      .style("background-color", "rgba(0, 0, 0, 0.8)")
      .style("color", "white")
      .style("border-radius", "5px")
      .style("padding", "10px")
      .style("font-size", "14px")
      .style("pointer-events", "none")
      .style("z-index", "1000");

    const showTooltip = (event: MouseEvent, d: SubData) => {
      const [x, y] = d3.pointer(event, svgRef.current);
      tooltip.transition()
        .duration(200)
        .style('opacity', .9);
      tooltip.html(`
        <div style="font-weight: bold; margin-bottom: 5px; border-bottom: 1px solid white; padding-bottom: 5px;">
          ${t(d.name).charAt(0).toUpperCase() + t(d.name).slice(1)}
        </div>
        <div style="display: flex; justify-content: space-between;">
          <span>${t("Value")}:</span>
          <span>${formatLabeled(d.value, cardData.unitTypeChart)+'%'}</span>
        </div>
      `)
        .style('left', `${x + 10}px`)
        .style('top', `${y - 10}px`);
    };

    const moveTooltip = (event: MouseEvent) => {
      const [x, y] = d3.pointer(event, svgRef.current);
      tooltip
        .style('left', `${x + 10}px`)
        .style('top', `${y - 10}px`);
    };

    const hideTooltip = () => {
      tooltip.transition()
        .duration(500)
        .style('opacity', 0);
    };

    // Parse displayValue string to get targeted and achieved values
    const parseDisplayValue = (displayValue: string) => {
      const achieved = parseFloat(displayValue.match(/Achieved: ([\d.]+)%/)?.[1] || '0');
      const targeted = parseFloat(displayValue.match(/Targeted: ([\d.]+)%/)?.[1] || '0');
      return [
        { name: 'targeted', value: targeted },
        { name: 'achieved', value: achieved }
      ];
    };

    const data = parseDisplayValue(cardData.displayValue);
    setParsedData(data);

    // Ensure both 'targeted' and 'achieved' are in the data
    const ensuredData = ['targeted', 'achieved'].map(name => {
      const existing = data.find(d => d.name === name);
      return existing || { name, value: 0 };
    });

    const x = d3
      .scaleBand()
      .range([0, width])
      .domain(['targeted', 'achieved']) // Explicitly set domain order
      .padding(0.3);

    // Update y scale to handle zero values properly
    const y = d3.scaleLinear()
      .range([height - margin.bottom, margin.top])
      .domain([0, d3.max(ensuredData, d => d.value) || 1]);

    // Add axes
    svg.append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x).tickFormat(d => {
        const translated = t(d);
        return translated.charAt(0).toUpperCase() + translated.slice(1);
      }))
      .call(g => g.select(".domain").remove()) // Remove the axis line
      .selectAll("text")
      .style("fill", "white");

    // Update y-axis creation with better tick formatting
    svg.append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y)
        .tickSize(0)
        .ticks(5)  // Reduce number of ticks to 5
        .tickFormat(d => {
          // @ts-ignore 
          if (d >= 1000) {
            // @ts-ignore
            return (d/1000) + 'k';  // Convert to k format for thousands
          }
          return d.toString();
        })
      )
      .call(g => g.select(".domain").remove())
      .selectAll("text")
      .style("fill", "white")
      .attr("dx", "-0.5em");

    // Create color scale with conditional logic
    const getBarColor = (d: SubData) => {
      const targetValue = data.find(item => item.name === "targeted")?.value || 0;
      const achievedValue = data.find(item => item.name === "achieved")?.value || 0;
      
      if (d.name === "targeted") {
        return "#2196F3"; // Blue for target
      } else {
        // For achieved bar
        return achievedValue >= targetValue ? "#4CAF50" : "#FF5252"; // Green if achieved >= target, Red if less
      }
    };

    // Update colors array for legend
    const chartColors = ensuredData.map(d => getBarColor(d));
    setColors(chartColors);

    // Add bars with tooltips
    svg.selectAll("rect")
      .data(ensuredData)
      .join("rect")
      .attr("x", d => x(d.name)! + (x.bandwidth() - Math.min(x.bandwidth() - 3, 50)) / 2)
      .attr("y", d => y(0))
      .attr("width", Math.min(x.bandwidth() - 3, 50))
      .attr("height", d => {
        const barHeight = height - margin.bottom - y(0);
        return Math.max(barHeight, 2);
      })
      .attr("fill", d => getBarColor(d))
      .on("mouseover", (event: MouseEvent, d: SubData) => showTooltip(event, d))
      .on("mousemove", moveTooltip)
      .on("mouseout", hideTooltip)
      .transition()
      .duration(500)
      .attr("y", d => y(Math.max(d.value, 0)))
      .attr("height", d => {
        const barHeight = height - margin.bottom - y(Math.max(d.value, 0));
        return Math.max(barHeight, 2);
      });

    // Add labels
    svg.selectAll('.label')
      .data(ensuredData)
      .join('text')
      .attr('class', 'label')
      .attr('x', d => x(d.name)! + x.bandwidth() / 2)
      .attr('y', d => y(Math.max(d.value, 0)) - 5)
      .attr('text-anchor', 'middle')
      .attr('fill', '#fff')
      .text(d => formatLabeled(d.value, cardData.unitTypeChart)+'%');

    // Add bottom line
    svg.append("line")
      .attr("x1", margin.left)
      .attr("x2", width - margin.right)
      .attr("y1", height - margin.bottom)
      .attr("y2", height - margin.bottom)
      .style("stroke", "white")
      .style("stroke-width", "1px");


  };

  if (
    !cardData ||
    !cardData.subData ||
    !Array.isArray(cardData.subData) ||
    cardData.subData.length === 0
  ) {
    return <div>No data available for the chart</div>;
  }

  return (
    <div className="relative w-full flex flex-col items-center" ref={containerRef}>
      <div className="relative w-full min-h-[700px] max-w-[700px] aspect-square">
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
      <Accordion type="single" collapsible className="w-full ">
        <AccordionItem value="item-1" className="border-none">
          <AccordionTrigger className="text-lg font-semibold text-gray-800 dark:text-white">
            {t('Chart Legend')}
          </AccordionTrigger>
          <AccordionContent>
            <div className="ml-4 ">
              <Legend 
                data={parsedData}
                colors={colors}
                unitTypeChart={cardData.unitTypeChart}
                formatValue={(value) => `${formatLabeled(value, cardData.unitTypeChart)}%`}
                translate={t}
              />
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
