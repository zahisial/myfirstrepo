/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable no-cond-assign */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import React, { useRef, useEffect, useState } from 'react'
import * as d3 from 'd3'
import { SubData } from '../../types/types'
import { TFunction } from 'i18next'
import Legend from './Legend'
import { HierarchyNode } from 'd3'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";

interface PackedBubbleChartProps {
  cardData: { title: string; value: number; subData: SubData[] }
  t: TFunction<"translation", undefined>
  frequency: "yearly" | "monthly"
}

type HierarchyDatum = {
  [x: string]: boolean
  //@ts-ignore
  name: string;
  //@ts-ignore  
  value?: number;
  //@ts-ignore
  children?: HierarchyDatum[];
}

export default function PackedBubbleChart({ cardData, t, frequency }: PackedBubbleChartProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)
  const [colors, setColors] = useState<string[]>([])
  const [selectedLegendItem, setSelectedLegendItem] = useState<string | null>(null)

  const formatNumber = (num: number, isAverage: boolean) => {
    return new Intl.NumberFormat('en-US', { 
      style: 'decimal', 
      minimumFractionDigits: isAverage ? 2 : 0, 
      maximumFractionDigits: isAverage ? 2 : 0 
    }).format(num)
  }

  // Add this variable at the top of your component, outside any function
  let focus: HierarchyNode<HierarchyDatum> | null = null;

  useEffect(() => {
    if (!cardData || !cardData.subData || !Array.isArray(cardData.subData) || cardData.subData.length === 0) {
      console.log('No valid subData available in PackedBubbleChart')
      return
    }

    // Determine dimensions based on screen size
    const width = Math.min(window.innerWidth - 40, 900);
    const height = Math.min(window.innerHeight - 100, 900);

    d3.select(svgRef.current).selectAll("*").remove()

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', `0 0 ${width} ${height}`)

    const colorScale = d3.scaleOrdinal(d3.schemeCategory10)
    const chartColors = cardData.subData.map((_, i) => colorScale(i.toString()))
    setColors(chartColors)

    const data: HierarchyDatum = {
      name: "root",
      //@ts-ignore
      children: cardData.subData.map((item) => ({
        name: item.name,
        value: item.value
      }))
    }

    const root = d3.hierarchy<HierarchyDatum>(data)
      .sum(d => d.value || 0)
      .sort((a, b) => (b.value || 0) - (a.value || 0))

    const pack = d3.pack<HierarchyDatum>()
      .size([width - 2, height - 2])
      .padding(3)

    const packedData = pack(root)

    const node = svg.selectAll("g")
      .data(packedData.descendants().slice(1))
      .join("g")
        .attr("transform", d => `translate(${d.x + 1},${d.y + 1})`)

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

    const circles = node.append("circle")
      .attr("r", d => d.r)
      .attr("fill", (d, i) => chartColors[i % chartColors.length]) // Use modulo to prevent out-of-bounds
      .attr("opacity", d => selectedLegendItem === null || selectedLegendItem === d.data.name ? 0.7 : 0.1)
      .on('mouseover', (event, d: any) => {
        const [x, y] = d3.pointer(event, svgRef.current);
        tooltip.transition()
          .duration(200)
          .style('opacity', .9);
        tooltip.html(`
          <strong>${t(d.data.name)}</strong><br/>
          ${t('Value')}: ${formatNumber(d.value, d.data.isAverage)}
        `)
          .style('left', `${x}px`)
          .style('top', `${y}px`);
      })
      .on('mousemove', (event) => {
        const [x, y] = d3.pointer(event, svgRef.current);
        tooltip
          .style('left', `${x}px`)
          .style('top', `${y}px`);
      })
      .on('mouseout', () => {
        tooltip.transition()
          .duration(500)
          .style('opacity', 0);
      })
      .on('click', (event, d: HierarchyNode<HierarchyDatum>) => {
        event.stopPropagation();
        zoomToBubble(d);
      });

    function zoomToBubble(d: HierarchyNode<HierarchyDatum>) {
      const view = d3.select(svgRef.current);
      
      if (focus === d) {
        // If clicking the same node, zoom out to root
        d = root as HierarchyNode<HierarchyDatum>;
        focus = null;
      } else {
        focus = d;
      }

      const transition = view.transition()
        .duration(750)
        .tween("zoom", () => {
          const i = d3.interpolateZoom(
            //@ts-ignore
            [focus ? focus.x : 0, focus ? focus.y : 0, focus ? focus.r * 2 : width],
            //@ts-ignore
            [d.x, d.y, d.r * 2]
          );
          return (t: number) => {
            const [x, y, r] = i(t);
            view.attr("viewBox", `${x - r / 2} ${y - r / 2} ${r} ${r}`);
          };
        });

      const isZoomed = d !== root;
      //@ts-ignore
      const scale = d.r * 2 / Math.min(width, height);

      node.selectAll("circle")
        .transition(transition as any)
        //@ts-ignore  
        .attr("r", d => d.r * (isZoomed ? 1 : scale));

      node.selectAll("text")
        .transition(transition as any)
        .attr("opacity", 1)
        //@ts-ignore
        .call(renderText, scale, isZoomed);
    }

    function renderText(selection: d3.Selection<d3.BaseType, any, SVGGElement, unknown>, scale: number = 1, isZoomed: boolean = false) {
      selection.each(function(d: any) {
        const text = d3.select(this);
        const name = t(d.data.name || ''); // Use t function for translation
        const value = formatNumber(d.value, d.data.isAverage);
        
        // Clear existing content
        text.selectAll("*").remove();

        // Calculate the available space
        const availableWidth = d.r * 2 * scale * 0.8;
        const availableHeight = d.r * 2 * scale * 0.8;

        // Set initial font size
        let fontSize = isZoomed 
          ? Math.min(availableHeight / 3, 36) // Larger initial font size for zoomed state
          : Math.min(availableHeight / 4, 16); // Original size for default view

        text.style("font-size", `${fontSize}px`)
          .attr("text-anchor", "middle")
          .style("fill", "white")
          .style("pointer-events", "none");

        // Function to check if text fits
        function textFits(textElement: d3.Selection<d3.BaseType, unknown, null, undefined>) {
          const bbox = (textElement.node() as SVGTextElement).getBBox();
          return bbox.width <= availableWidth && bbox.height <= availableHeight;
        }

        // Add name
        const nameElement = text.append("tspan")
          .attr("x", 0)
          .attr("dy", `-${fontSize / 2}px`)
          .text(name);

        // Add value
        const valueElement = text.append("tspan")
          .attr("x", 0)
          .attr("dy", `${fontSize * 1.2}px`)
          .text(value);

        // Adjust text size and truncate if necessary
        if (isZoomed) {
          // For zoomed state, prioritize larger text and full name
          while (!textFits(text) && fontSize > 16) { // Minimum font size for zoomed state
            fontSize -= 1;
            text.style("font-size", `${fontSize}px`);
            nameElement.attr("dy", `-${fontSize / 2}px`);
            valueElement.attr("dy", `${fontSize * 1.2}px`);
          }
        } else {
          // For default view, use the original logic
          while (!textFits(text) && fontSize > 8) {
            fontSize -= 0.5;
            text.style("font-size", `${fontSize}px`);
            nameElement.attr("dy", `-${fontSize / 2}px`);
            valueElement.attr("dy", `${fontSize * 1.2}px`);
          }

          // If text still doesn't fit, truncate the name
          if (!textFits(text)) {
            let truncatedName = name;
            while (!textFits(text) && truncatedName.length > 3) {
              truncatedName = truncatedName.slice(0, -1);
              nameElement.text(truncatedName + '...');
            }
          }
        }
      });
    }

    // In the initial rendering part (outside of zoomToBubble function)
    node.append("text")
      //@ts-ignore
      .call(renderText, 1);

  }, [cardData, t, selectedLegendItem])

  const handleLegendClick = (name: string | null) => {
    setSelectedLegendItem(name);
  };

  if (!cardData || !cardData.subData || !Array.isArray(cardData.subData) || cardData.subData.length === 0) {
    return <div>No data available for the chart</div>
  }

  return (
    <div className="relative w-full h-[100%] flex flex-col items-center">
      <div className="relative flex-grow">
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
                data={cardData.subData.map(item => ({ ...item, name: t(item.name) }))} 
                colors={colors} 
                translate={t} // Pass the t function here
              />
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
