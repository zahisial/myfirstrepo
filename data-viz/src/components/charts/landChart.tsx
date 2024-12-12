/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { useRef, useEffect, useState, useMemo } from 'react';
import * as d3 from 'd3';
import { SubData } from '../../types/types';
import { TFunction } from 'i18next';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { t } from "i18next";
import { useTranslation } from 'react-i18next';

// New function to get localized label
const getLocalizedLabel = (item: { label_en: string; label_ar: string }, isArabic: boolean) => {
  return isArabic ? item.label_ar : item.label_en;
};

interface LandChartProps {
  cardData: { title: string; value: number; subData: SubData[]; };
  t: TFunction<"translation", undefined>;
  frequency: "yearly" | "monthly";
}

interface LegendData {
  name: string;
  value: number;
  color: string;
  children?: { name: string; value: number }[];
}

const LegendComponent: React.FC<{
  legendData: LegendData[];
  expandedItems: string[];
  setExpandedItems: React.Dispatch<React.SetStateAction<string[]>>;
  formatNumber: (num: number) => string;
  toSentenceCase: (str: string) => string;
  t: TFunction;
}> = ({ legendData, expandedItems, setExpandedItems, formatNumber, toSentenceCase, t }) => {
  const { i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4">
      {legendData.map((item) => (
        <div key={item.name} className="mb-2">
          <div
            className="flex items-center cursor-pointer"
            onClick={() => {
              setExpandedItems(prev =>
                prev.includes(item.name)
                  ? prev.filter(i => i !== item.name)
                  : [...prev, item.name]
              );
            }}
          >
          <span className="me-1">
            {expandedItems.includes(item.name) ? (isArabic ? '◀' : '▼') : (isArabic ? '▶' : '▶')}
          </span>
            <span
              className="inline-block w-3 h-3 me-1"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-sm">
              {t(toSentenceCase(item.name))} ({formatNumber(item.value)})
            </span>
          </div>
          {expandedItems.includes(item.name) && item.children && (
            <div className="mt-1 space-y-1 ms-6">
              {item.children.map((child) => (
                <div key={child.name} className="flex items-center">
                  <span
                    className="inline-block w-2 h-2 me-1"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-xs">
                    {t(toSentenceCase(child.name))} ({formatNumber(child.value)})
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

// At the top of the file, add this utility function
const createColorScale = (data: SubData[], isArabic: boolean) => {
  //@ts-ignore
  const uniqueTypes = data.map(type => getLocalizedLabel(type, isArabic));
  return d3.scaleOrdinal<string>()
    .domain(uniqueTypes)
    .range(d3.schemeCategory10);
};

export default function LandChart({ cardData, t, frequency }: LandChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Add resize effect
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.clientWidth;
        const containerHeight = containerRef.current.clientHeight;
        const aspectRatio = 1; // For a perfect circle
        
        // Calculate the size based on the smaller dimension
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

  const chartRef = useRef<SVGSVGElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  const formatNumber = (num: number) => {
    return num.toLocaleString('en-US', { maximumFractionDigits: 0 });
  };

  const toSentenceCase = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  const { i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';

  // Create a single color scale to be used by both chart and legend
  const colorScale = useMemo(() => 
    createColorScale(cardData?.subData || [], isArabic),
    [cardData, isArabic]
  );

  const legendData = useMemo(() => {
    if (!cardData?.subData?.length) return [];
    
    return cardData.subData.map(type => {
      //@ts-ignore
      const typeName = getLocalizedLabel(type, isArabic);
      return {
        name: typeName,
        //@ts-ignore
        value: type.total_lands_by_subtype.reduce((sum, subtype) => sum + subtype.value, 0),
        color: colorScale(typeName),
        children: type.total_lands_by_subtype
          //@ts-ignore
          .filter(subtype => subtype.value > 0)
          //@ts-ignore
          .map(subtype => ({
            name: getLocalizedLabel(subtype, isArabic),
            value: subtype.value
          }))
      };
    }).filter(item => item.value > 0);
  }, [cardData, isArabic, colorScale]);

  useEffect(() => {
    if (!cardData?.subData?.length || !dimensions.width || !dimensions.height) return;

    const margin = { top: 20, right: 20, bottom: 20, left: 20 };
    const width = dimensions.width - margin.left - margin.right;
    const height = dimensions.height - margin.top - margin.bottom;
    const radius = Math.min(width, height) / 2.5;

    // Clear the existing chart
    d3.select(chartRef.current).selectAll("*").remove();

    const svg = d3.select(chartRef.current)
      .attr('width', dimensions.width)
      .attr('height', dimensions.height)
      .append("g")
      .attr("transform", `translate(${dimensions.width / 2},${dimensions.height / 2})`);

    const processData = (data: SubData[]) => {
      return {
        name: "root",
        children: data.map(type => ({
          //@ts-ignore
          name: getLocalizedLabel(type, isArabic),
          children: type.total_lands_by_subtype
            .filter((subtype: { value: number; }) => subtype.value > 0)
            .map((subtype: { label_en: string; label_ar: string; value: number; }) => ({
              name: getLocalizedLabel(subtype, isArabic),
              value: subtype.value
            }))
        })).filter(type => type.children.length > 0)
      };
    };

    let root = d3.hierarchy(processData(cardData.subData))
      .sum(d => (d as any).value)
      .sort((a, b) => (b.value || 0) - (a.value || 0));

    if (selectedItem) {
      const selectedData = cardData.subData.find(type => 
        //@ts-ignore
        getLocalizedLabel(type, isArabic) === selectedItem
      );
      
      if (selectedData) {
        const drillDownData = {
          name: selectedItem,
          //@ts-ignore
          children: selectedData.total_lands_by_subtype
            .filter((subtype: { value: number }) => subtype.value > 0)
            .map((subtype: { label_en: string; label_ar: string; value: number }) => ({
              name: getLocalizedLabel(subtype, isArabic),
              value: subtype.value
            }))
        };
        
        root = d3.hierarchy(drillDownData)
          .sum(d => (d as any).value)
          .sort((a, b) => (b.value || 0) - (a.value || 0));
      }
    }

    const partition = d3.partition<any>()
      .size([2 * Math.PI, radius]);

    partition(root);

    const arc = d3.arc<d3.HierarchyRectangularNode<any>>()
      .startAngle(d => d.x0)
      .endAngle(d => d.x1)
      .padAngle(d => Math.min((d.x1 - d.x0) / 2, 0.005))
      .padRadius(radius / 2)
      .innerRadius(d => d.y0)
      .outerRadius(d => d.y1 - 1);

    const paths = svg.selectAll("path")
      .data(root.descendants().slice(1))
      .join("path")
      .attr("fill", d => {
        while (d.depth > 1) d = d.parent!;
        return colorScale(d.data.name);
      })
      .attr("fill-opacity", d => 1 - d.depth * 0.1)
      .attr("d", arc as any)
      .style("cursor", "pointer")
      .on("click", (event, d) => {
        if (!selectedItem && d.depth === 1) {
          setSelectedItem(d.data.name);
        }
      });

    svg.append("g")
      .attr("pointer-events", "none")
      .attr("text-anchor", "middle")
      .attr("font-size", 12)
      .attr("fill", "#fff")
      .attr("font-family", "sans-serif")
      .selectAll("text")

      //@ts-ignore
      .data(root.descendants().slice(1).filter(d => d.depth && (d.y0 + d.y1) / 2 * (d.x1 - d.x0) > 10))
      .join("text")
      .attr("transform", function(d) {
        //@ts-ignore
        const x = (d.x0 + d.x1) / 2 * 180 / Math.PI;
        //@ts-ignore
        const y = (d.y0 + d.y1) / 2;
        return `rotate(${x - 90}) translate(${y},0) rotate(${x < 180 ? 0 : 180})`;
      })
      .attr("dy", "0.35em")
      .text(d => t(toSentenceCase(d.data.name), { defaultValue: toSentenceCase(d.data.name) })); // Modified line for chart labels

    // Add the "Back" button in the center of the chart
    if (selectedItem) {
      const backButton = svg.append("g")
        .attr("class", "back-button")
        .style("cursor", "pointer")
        .on("click", () => setSelectedItem(null));

      backButton.append("circle")
        .attr("r", radius * 0.2)
        .attr("fill", "white")
        .attr("stroke", "#333")
        .attr("stroke-width", 2);

      backButton.append("text")
        .attr("text-anchor", "middle")
        .attr("dy", "0.3em")
        .style("font-size", "14px")
        .style("font-weight", "bold")
        .text(t("Back to All"));
    }

    // Add tooltip
    const tooltip = d3.select(tooltipRef.current)
      .style("opacity", 0)
      .style("position", "absolute")
      .style("background-color", "rgba(0, 0, 0, 0.8)")
      .style("color", "white")
      .style("border-radius", "5px")
      .style("padding", "10px")
      .style("font-size", "14px")
      .style("pointer-events", "none");

    paths.on('mouseover', (event, d: any) => {
      d3.select(event.currentTarget)
        .style("cursor", d.depth === 0 ? "pointer" : "default");
        
      const [x, y] = d3.pointer(event, chartRef.current);
      tooltip.transition()
        .duration(200)
        .style('opacity', .9);
      tooltip.html(`
        <strong>${t(toSentenceCase(d.data.name), { defaultValue: toSentenceCase(d.data.name) })}</strong><br/>
        ${t('Value')}: ${formatNumber(d.value)}
        ${d.depth === 0 ? '<br/>' + t('Click to explore') : ''}
      `)
        .style('left', `${x}px`)
        .style('top', `${y}px`);
    })
    .on('mousemove', (event) => {
      const [x, y] = d3.pointer(event, chartRef.current);
      tooltip
        .style('left', `${x}px`)
        .style('top', `${y}px`);
    })
    .on('mouseout', () => {
      tooltip.transition()
        .duration(500)
        .style('opacity', 0);
    });

  }, [cardData, t, frequency, expandedItems, selectedItem, isArabic, dimensions, colorScale]); // Add dimensions to dependency array

  return (
    <div ref={containerRef} className="relative flex flex-col w-full min-h-[600px] items-center justify-center">
      <div className="relative aspect-square w-full max-w-[600px]">
        <svg ref={chartRef} className="w-full h-full" />
        <div ref={tooltipRef} className="absolute p-2 text-white transition-opacity duration-200 bg-black rounded shadow-lg opacity-0 pointer-events-none bg-opacity-80" />
      </div>

      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1" className="border-none">
          <AccordionTrigger className="text-lg font-semibold text-gray-800 dark:text-white">
            {t('Chart Legend')}
          </AccordionTrigger>
          <AccordionContent>
            <LegendComponent
              legendData={legendData}
              expandedItems={expandedItems}
              setExpandedItems={setExpandedItems}
              formatNumber={formatNumber}
              toSentenceCase={toSentenceCase}
              t={t}
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
