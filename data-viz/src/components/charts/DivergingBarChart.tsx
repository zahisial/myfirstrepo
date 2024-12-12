/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";
import Legend from "./Legend";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { useTranslation } from 'react-i18next'; // Import the useTranslation hook

interface DivergingBarChartProps {
  data: { year: string; month: string; name: string; value: number }[];
}

export default function DivergingBarChart({ data }: DivergingBarChartProps) {
  console.log("check data",data);
  const { t } = useTranslation(); // Use the useTranslation hook to get the t function
  const svgRef = useRef<SVGSVGElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // State to store filtered data and colors
  const [filteredData, setFilteredData] = useState<
    { year: string; month: string; name: string; value: number }[]
  >([]);
  const [colors, setColors] = useState<string[]>([]);

  // Add resize observer
  useEffect(() => {
    if (!containerRef.current) return;

    const resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        const { width } = entry.contentRect;
        setDimensions({
          width: width,
          height: Math.ceil((filteredData.length + 0.1) * 35) + 60 // Increase bar height slightly
        });
      }
    });

    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, [filteredData.length]);

  useEffect(() => {
    if (dimensions.width === 0) return; // Don't render until we have dimensions
    
    // Filter out zeros and total entries
    const dataWithoutZeros = data.filter((d) => d.value !== 0 && d.year !== 'total'&& d.year !== 'range');
    
    // Create year-month labels
    const yearMonthData = dataWithoutZeros.map(d => ({
      ...d,
      yearMonth: `${d.year}-${d.month}`
    }));
    
    setFilteredData(yearMonthData);

    const margin = { top: 10, right: 140, bottom: 80, left: 50 };

    const width = dimensions.width;
    const height = dimensions.height;

    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3
      .scaleBand()
      .domain([...new Set(yearMonthData.map(d => d.yearMonth))])
      .rangeRound([margin.left, width - margin.right])
      .padding(0.2);

    const xSubgroup = d3
      .scaleBand()
      .domain(yearMonthData.map(d => d.name))
      .rangeRound([0, x.bandwidth()])
      .padding(0.05);

    const y = d3
      .scaleLinear()
      .domain([
        d3.min(yearMonthData, d => d.value) as number,
        d3.max(yearMonthData, d => d.value) as number
      ])
      .nice()
      .rangeRound([height - margin.bottom, margin.top]);

    // Define a color scale using d3.schemeCategory10
    const colorScale = d3.scaleOrdinal(d3.schemeCategory10);
    const chartColors = yearMonthData.map((_, i) => colorScale(i.toString()));
    setColors(chartColors);

    svg.append("g")
      .selectAll("g")
      .data([...new Set(yearMonthData.map(d => d.yearMonth))])
      .join("g")
      .attr("transform", d => `translate(${x(d)},0)`)
      .selectAll("rect")
      .data(yearMonth => yearMonthData.filter(d => d.yearMonth === yearMonth))
      .join("rect")
      .attr("x", d => xSubgroup(d.name)!)
      .attr("y", d => d.value > 0 ? y(d.value) : y(0))
      .attr("height", d => Math.abs(y(0) - y(d.value)))
      .attr("width", xSubgroup.bandwidth())
      .attr("fill", (_, i) => chartColors[i])
      .on('mouseover', (event, d) => {
        const [mouseX, mouseY] = d3.pointer(event, svgRef.current);
        d3.select(tooltipRef.current)
          .style('opacity', 0.9)
          .html(`
            <strong>${t(d.name, { defaultValue: d.name })}</strong><br/>
            ${t('Year')}: ${d.year}<br/>
            ${t('Value')}: ${d.value.toFixed(2)}
          `)
          .style('left', `${mouseX + 10}px`)
          .style('top', `${mouseY - 10}px`);
      })
      .on('mouseout', () => {
        d3.select(tooltipRef.current)
          .style('opacity', 0);
      });

    // Group data by name to handle duplicates
    const groupedByName = d3.group(yearMonthData, d => d.name);
    const uniqueData = Array.from(groupedByName, ([name, values]) => ({
      name,
      value: values[0].value, // Take the first value for each name
      year: values[0].year
    }));

    // Modified text labels
    // svg
    //   .append("g")
    //   .attr("font-family", "sans-serif")
    //   .attr("font-size", 10)
    //   .selectAll("text")
    //   .data(uniqueData)
    //   .join("text")
    //   .attr("text-anchor", "end")
    //   .attr("x", width - margin.right + 10)  // Position labels on the right side
    //   .attr("y", (d, i) => margin.top + (i * 20))  // Stack labels vertically
    //   .attr("dy", "0.35em")
    //   .attr("fill", "currentColor")
    //   .text((d) => `${t(d.name, { defaultValue: d.name })}: ${d.value.toFixed(2)}`);

    // Add a zero line
    svg.append("line")
      .attr("x1", margin.left)
      .attr("x2", width - margin.right)
      .attr("y1", y(0))
      .attr("y2", y(0))
      .attr("stroke", "gray")
      .attr("stroke-dasharray", "2,2");

    // Modified x-axis
    svg.append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("transform", "rotate(-45)")
      .style("text-anchor", "end");

    // Modified y-axis
    svg.append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y));
  }, [data, t, dimensions]);

  return (
    <div className="relative flex flex-col items-center w-full h-full" ref={containerRef}>
      <div className="relative flex-grow w-full">
        <svg ref={svgRef} width="100%" height="100%" preserveAspectRatio="xMidYMid meet" />
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
            <div className="ml-4">
              {/* Group data by yearMonth */}
              {[...new Set(filteredData.map(d => d.yearMonth))].map(yearMonth => (
                <div key={yearMonth} className="mb-4">
                  <h3 className="font-semibold mb-2">{yearMonth}</h3>
                  <Legend 
                    data={filteredData
                      .filter(item => item.yearMonth === yearMonth)
                      .map(item => ({ 
                        name: item.name,
                        value: item.value,
                        year: item.year
                      }))}
                    colors={colors} 
                    translate={t} 
                  />
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
