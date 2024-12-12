/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { TFunction } from "i18next";
import { SubLevelData } from "../../types/types";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";

interface SubLevelProps {
  cardData: {
    title: string;
    value: number;
    subData: SubLevelData[];
  };
  t: TFunction;
  frequency: "yearly" | "monthly";
}

const SubLevel: React.FC<SubLevelProps> = ({ cardData, t, frequency }) => {
  const { subData } = cardData;
  const svgRef = useRef<SVGSVGElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [chartData, setChartData] = useState<any[]>([]);
  const [colorScale, setColorScale] = useState<d3.ScaleOrdinal<string, string>>();
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "decimal",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(num);
  };

  // Prepare chart data
  useEffect(() => {
    if (subData.length > 0) {
      const scale = d3.scaleOrdinal(d3.schemeCategory10);
      setColorScale(scale);
//@ts-ignore
      const data = subData.map((item, index) => ({
        ...item,
        value: typeof item.value === "number" ? item.value : 0,
        //@ts-ignore
        color: scale(item.name || item.label),
      }));

      setChartData(data);
    }
  }, [subData]);

  // Add resize effect
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.clientWidth;
        const containerHeight = containerRef.current.clientHeight;
        
        // Use aspect ratio to maintain chart proportions
        const size = Math.min(containerWidth, containerHeight);
        
        setDimensions({
          width: size,
          height: size
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Create/update chart
  useEffect(() => {
    if (chartData.length > 0 && svgRef.current && colorScale && dimensions.width && dimensions.height) {
      const width = dimensions.width;
      const height = dimensions.height;
      const radius = Math.min(width, height) / 2.5; // Reduced from /2 to /2.5 to leave more padding
      const donutWidth = radius * 0.4; // Make donut width proportional to radius

      d3.select(svgRef.current).selectAll("*").remove();

      const svg = d3
        .select(svgRef.current)
        .attr("width", "100%")
        .attr("height", "100%")
        .attr("viewBox", `0 0 ${width} ${height}`)
        .attr("preserveAspectRatio", "xMidYMid meet")
        .append("g")
        .attr("transform", `translate(${width / 2}, ${height / 2})`);

      const pie = d3.pie<any>().value((d: any) => d.value);
      const arc = d3
        .arc<any>()
        .innerRadius(radius - donutWidth)
        .outerRadius(radius);

      const tooltip = d3.select(tooltipRef.current)
        .style("opacity", 0)
        .style("position", "absolute")
        .style("background-color", "rgba(0, 0, 0, 0.8)")
        .style("color", "white")
        .style("border-radius", "5px")
        .style("padding", "10px")
        .style("font-size", "14px")
        .style("pointer-events", "none")
        .style("z-index", "1000");

      const showTooltip = (event: MouseEvent, d: any) => {
        const [x, y] = d3.pointer(event, svgRef.current);
        tooltip.transition()
          .duration(200)
          .style('opacity', .9);
        tooltip.html(`
          <div style="font-weight: bold; margin-bottom: 5px; border-bottom: 1px solid white; padding-bottom: 5px;">
            ${t(d.data.name || d.data.label, { defaultValue: d.data.label })}
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span>${t("Value")}:</span>
            <span>${formatNumber(d.data.value)}</span>
          </div>
        `)
          .style('left', `${x}px`)
          .style('top', `${y}px`);
      };

      const moveTooltip = (event: MouseEvent) => {
        const [x, y] = d3.pointer(event, svgRef.current);
        tooltip
          .style('left', `${x}px`)
          .style('top', `${y}px`);
      };

      const hideTooltip = () => {
        tooltip.transition()
          .duration(500)
          .style('opacity', 0);
      };

      const arcs = svg
        .selectAll("arc")
        .data(pie(chartData))
        .enter()
        .append("g")
        .attr("class", "arc");

      arcs
        .append("path")
        .attr("d", arc)
        .attr("fill", (d: any) => d.data.color)
        .on("mouseover", showTooltip)
        .on("mousemove", moveTooltip)
        .on("mouseout", hideTooltip);

      return () => {
        d3.select(svgRef.current).selectAll("*").remove();
      };
    }
  }, [chartData, colorScale, t, dimensions]);

  return (
    <div 
      ref={containerRef} 
      className="relative flex flex-col w-full h-full min-h-[300px]" // Added min-height
    >
      <div className="relative flex-grow">
        <svg 
          ref={svgRef} 
          className="w-full h-full"
          style={{ maxHeight: '70vh' }} // Prevent excessive height
        />
        <div 
          ref={tooltipRef} 
          className="absolute p-2 text-white transition-opacity duration-200 bg-black rounded shadow-lg opacity-0 pointer-events-none bg-opacity-80" 
          style={{ zIndex: 10 }} 
        />
      </div>
      <Accordion type="single" collapsible className="w-full mt-4">
        <AccordionItem value="item-1" className="border-none">
          <AccordionTrigger className="text-lg font-semibold text-gray-800 dark:text-white">
            {t('Chart Legend')}
          </AccordionTrigger>
          <AccordionContent>
            <div id="subLevelLegend" className="grid w-full grid-cols-1 gap-4 mt-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4">
              {chartData.map((item, index) => (
                <div key={index} className="mb-2 subLevel-legend-item">
                  <div className="flex items-center">
                    <span className="inline-block w-3 h-3 subLevel-legend-color me-1" style={{backgroundColor: item.color}} />
                    <span className="text-sm subLevel-legend-label">
                      {t(item.name || item.label, { defaultValue: item.label })} - {formatNumber(item.value)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default SubLevel;
