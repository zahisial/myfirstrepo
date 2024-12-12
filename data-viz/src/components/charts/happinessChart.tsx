/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
"use client"

import React, { useRef, useEffect, useState, useMemo } from 'react'
import * as d3 from 'd3'
import { SubData } from '../../types/types'
import { TFunction } from 'i18next'
import Legend from './Legend'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion'

interface HappinessChartProps {
  cardData: {
    title: string;
    value: number;
    subData: SubData[];
    subDataSeries?: Array<{
      year: string;
      month: string;
      name: string;
      value: number;
    }>;
  };
  t: TFunction;
  frequency: 'yearly' | 'all';
}

const emotionColors = {

  excited: "hsl(142, 76%, 36%)",      // Green (Most Positive)
  happy: "hsl(75, 100%, 45%)",        // Light green-yellow
  neutral: "hsl(32, 100%, 50%)",      // Orange (Neutral)
  sad: "hsl(0, 84%, 60%)",            // Red
  angry: "hsl(0, 84%, 40%)"           // Darker Red (Most Negative)
}

const formatEmotionName = (name: string) => {
  return name.split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

const getEmotionColor = (emotion: string): string => {
  emotion = emotion.toLowerCase();
  if (emotion.includes('excited') || emotion.includes('very_happy')) {
    return emotionColors.excited;
  } else if (emotion.includes('happy')) {
    return emotionColors.happy;
  } else if (emotion.includes('neutral')) {
    return emotionColors.neutral;
  } else if (emotion.includes('sad')) {
    return emotionColors.sad;
  } else if (emotion.includes('angry')) {
    return emotionColors.angry;
  }
  return '#666'; // fallback color
}

export default function HappinessChart({ cardData, t, frequency }: HappinessChartProps) {
  const [chartData, setChartData] = useState<any[]>([])
  const svgRef = useRef<SVGSVGElement>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)
  const [colors, setColors] = useState<string[]>([])
  const containerRef = useRef<HTMLDivElement>(null)

  const processedData = useMemo(() => {
    if (frequency === 'yearly' && cardData.subDataSeries) {
      const yearlyData = cardData.subDataSeries.reduce((acc, item) => {
        if (!acc[item.year]) {
          acc[item.year] = {};
        }
        if (!acc[item.year][item.month]) {
          acc[item.year][item.month] = { Excited: 0, Happy: 0, Neutral: 0, Sad: 0, Angry: 0, Total: 0 };
        }
        const emotionType = item.name.includes('excited') ? 'Excited' :
                           item.name.includes('happy') ? 'Happy' : 
                           item.name.includes('neutral') ? 'Neutral' : 
                           item.name.includes('sad') ? 'Sad' : 'Angry';
        acc[item.year][item.month][emotionType] += item.value;
        acc[item.year][item.month].Total += item.value;
        return acc;
      }, {} as Record<string, Record<string, any>>);

      return Object.entries(yearlyData).flatMap(([year, months]) => 
        Object.entries(months).map(([month, data]) => ({
          year,
          month,
          Excited: (data.Excited / data.Total) * 100,
          Happy: (data.Happy / data.Total) * 100,
          Neutral: (data.Neutral / data.Total) * 100,
          Sad: (data.Sad / data.Total) * 100,
          Angry: (data.Angry / data.Total) * 100
        }))
      );
    } else {
      return cardData.subData.map(item => ({
        name: formatEmotionName(item.name),
        originalName: item.name,
        value: item.value
      }));
    }
  }, [cardData, frequency]);

  useEffect(() => {
    const sortedData = [...processedData].sort((a, b) => {
      const emotionOrder = ['excited', 'happy', 'neutral', 'sad', 'angry'];
      if ('year' in a) return 0;
      
      const aItem = a as { originalName: string; name: string };
      const bItem = b as { originalName: string; name: string };
      
      return emotionOrder.indexOf(aItem.originalName?.toLowerCase() || aItem.name.toLowerCase()) - 
             emotionOrder.indexOf(bItem.originalName?.toLowerCase() || bItem.name.toLowerCase());
    });
    
    setChartData(sortedData);
    
    const chartColors = frequency === 'yearly' 
      ? [emotionColors.excited, emotionColors.happy, emotionColors.neutral, emotionColors.sad, emotionColors.angry]
      : sortedData.map(item => {
          // Add type guard
          if ('year' in item) return emotionColors.excited; // This is yearly data
          
          const emotionName = (item.originalName || item.name).toLowerCase();
          if (emotionName.includes('excited')) return emotionColors.excited;
          if (emotionName.includes('happy')) return emotionColors.happy;
          if (emotionName.includes('neutral')) return emotionColors.neutral;
          if (emotionName.includes('sad')) return emotionColors.sad;
          if (emotionName.includes('angry')) return emotionColors.angry;
          return '#000';
      });
    
    console.log('Setting colors:', chartColors);
    setColors(chartColors);
  }, [cardData, frequency, processedData])

  useEffect(() => {
    if (chartData.length > 0 && svgRef.current) {
      drawChart()
    }
  }, [chartData, frequency])

  // Add resize observer
  useEffect(() => {
    if (!containerRef.current) return

    const resizeObserver = new ResizeObserver(() => {
      drawChart()
    })

    resizeObserver.observe(containerRef.current)
    return () => resizeObserver.disconnect()
  }, [chartData, frequency])

  const drawChart = () => {
    if (!containerRef.current || !svgRef.current) return
    const svg = d3.select(svgRef.current)
    svg.selectAll("*").remove()

    // Update size calculations
    const containerWidth = containerRef.current.clientWidth
    const containerHeight = containerRef.current.clientHeight
    const aspectRatio = 0.75
    const width = containerWidth
    const height = Math.min(containerHeight, containerWidth * aspectRatio)

    const margin = {
      top: Math.max(20, height * 0.05),
      right: Math.max(20, width * 0.05),
      bottom: Math.max(40, height * 0.1),
      left: Math.max(40, width * 0.1)
    }

    svg.attr('width', width)
       .attr('height', height)
       .attr('viewBox', `0 0 ${width} ${height}`)
       .attr('preserveAspectRatio', 'xMidYMid meet')

    // Initialize tooltip
    const tooltip = d3.select(tooltipRef.current)
      .style("opacity", 0)
      .style("position", "absolute")
      .style("background-color", "rgba(0, 0, 0, 0.8)")
      .style("color", "white")
      .style("border-radius", "5px")
      .style("padding", "10px")
      .style("font-size", "14px")
      .style("pointer-events", "none")
      .style("max-width", "200px")
      .style("box-shadow", "0 4px 6px rgba(0, 0, 0, 0.1)")
      .style("z-index", "1000");

    const formatNumber = (num: number) => {
      return new Intl.NumberFormat('en-US', { 
        style: 'decimal', 
        minimumFractionDigits: 1, 
        maximumFractionDigits: 1 
      }).format(num)
    }

    // Updated event handlers
    const handleMouseOver = (event: any, d: any) => {
      const svgElement = svgRef.current;
      if (!svgElement) return;

      const svgRect = svgElement.getBoundingClientRect();
      const left = event.pageX - svgRect.left + 10;
      const top = event.pageY - svgRect.top + 10;

      tooltip.transition()
        .duration(200)
        .style('opacity', 0.9);
      
      const content = frequency === 'yearly' 
        ? `
          <div style="font-weight: bold; margin-bottom: 5px; border-bottom: 1px solid #ddd; padding-bottom: 5px;">
            ${d.year}-${d.month}
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span>${t('Excited')}:</span>
            <span>${formatNumber(d.Excited)}%</span>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span>${t('Happy')}:</span>
            <span>${formatNumber(d.Happy)}%</span>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span>${t('Neutral')}:</span>
            <span>${formatNumber(d.Neutral)}%</span>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span>${t('Sad')}:</span>
            <span>${formatNumber(d.Sad)}%</span>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span>${t('Angry')}:</span>
            <span>${formatNumber(d.Angry)}%</span>
          </div>
        `
        : `
          <div style="font-weight: bold; margin-bottom: 5px; border-bottom: 1px solid #ddd; padding-bottom: 5px;">
            ${t(d.name)}
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span>${t('Value')}:</span>
            <span>${formatNumber(d.value)}%</span>
          </div>
        `;

      tooltip.html(content)
        .style('left', `${left}px`)
        .style('top', `${top}px`);
    };

    const handleMouseMove = (event: any) => {
      const svgElement = svgRef.current;
      if (!svgElement) return;

      const svgRect = svgElement.getBoundingClientRect();
      const left = event.pageX - svgRect.left + 10;
      const top = event.pageY - svgRect.top + 10;

      tooltip
        .style('left', `${left}px`)
        .style('top', `${top}px`);
    };

    const handleMouseOut = () => {
      tooltip.transition()
        .duration(500)
        .style('opacity', 0);
    };

    if (frequency === 'yearly') {
      const years = Array.from(new Set(chartData.map(d => d.year))).sort()
      const months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']

      const x = d3.scaleBand()
        .range([margin.left, width - margin.right])
        .domain(months)
        .padding(0.05)

      const y = d3.scaleBand()
        .range([height - margin.bottom, margin.top])
        .domain(years)
        .padding(0.05)

      const colorScale = d3.scaleSequential(d3.interpolateRdYlGn)
        .domain([0, 100])

      svg.selectAll('rect')
        .data(chartData)
        .enter()
        .append('rect')
        .attr('x', d => x(d.month)!)
        .attr('y', d => y(d.year)!)
        .attr('width', x.bandwidth())
        .attr('height', y.bandwidth())
        .attr('fill', d => colorScale(d.Excited))
        .style('cursor', 'pointer') // Add cursor pointer
        .on('mouseover', handleMouseOver)
        .on('mousemove', handleMouseMove)
        .on('mouseout', handleMouseOut);

      // Add x-axis
      svg.append('g')
        .attr('transform', `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x))
        .selectAll('text')
        .attr('fill', '#fff')
        .attr('transform', 'rotate(-45)')
        .attr('text-anchor', 'end');

      // Add y-axis
      svg.append('g')
        .attr('transform', `translate(${margin.left},0)`)
        .call(d3.axisLeft(y))
        .selectAll('text')
        .attr('fill', '#fff');

      // Add x-axis label
      svg.append('text')
        .attr('x', width / 2)
        .attr('y', height - 10)
        .attr('text-anchor', 'center')
        .attr('fill', '#fff')
        .text(t('Month'));

      // Add y-axis label
      svg.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('x', -height / 2)
        .attr('y', 15)
        .attr('text-anchor', 'middle')
        .attr('fill', '#fff')
        .text(t('Year'));

    } else {
      // Original bar chart for 'All' view
      let x = d3.scaleBand()
        .range([margin.left, width - margin.right])
        .domain(chartData.map(d => d.name))
        .padding(0.7)

      let y = d3.scaleLinear()
        .range([height - margin.bottom, margin.top])
        .domain([0, d3.max(chartData, d => d.value) || 0])

      // Add console.log for debugging bar colors
      chartData.forEach(d => {
        const emotion = d.originalName.toLowerCase();
        console.log('Bar Color Debug:', {
          name: d.name,
          originalName: d.originalName,
          emotionKey: emotion,
          color: getEmotionColor(d.originalName),
          allColors: emotionColors
        });
      });

      svg.selectAll('.bar')
        .data(chartData)
        .enter()
        .append('rect')
        .attr('class', 'bar')
        .attr('x', d => x(d.name)!)
        .attr('y', d => y(d.value)!)
        .attr('width', x.bandwidth())
        .attr('height', d => height - margin.bottom - y(d.value)!)
        .attr('fill', d => getEmotionColor(d.originalName))
        .style('cursor', 'pointer')
        .on('mouseover', handleMouseOver)
        .on('mousemove', handleMouseMove)
        .on('mouseout', handleMouseOut);

      // Center the x-axis labels
      svg.append('g')
        .attr('transform', `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x))
        .selectAll('text')
        .attr('fill', '#fff')
        .attr('text-anchor', 'middle')
        .attr('transform', 'translate(0, 10)');

      // Add labels
      svg.selectAll('.label')
        .data(chartData)
        .enter()
        .append('text')
        .attr('class', 'label')
        .attr('x', d => x(d.name)! + x.bandwidth() / 2)
        .attr('y', d => y(d.value) - 5)
        .attr('text-anchor', 'middle')
        .attr('fill', '#fff')
        .text(d => `${d.value.toFixed(1)}%`)

      // Add y-axis
      svg.append('g')
        .attr('transform', `translate(${margin.left},0)`)
        .call(d3.axisLeft(y))
        .selectAll('text')
        .attr('fill', '#fff')

      // Add x-axis label
      // svg.append('text')
      //   .attr('x', width / 2)
      //   .attr('y', height - 10)
      //   .attr('text-anchor', 'middle')
      //   .attr('fill', '#fff')
      //   .text('Emotion');

      // Add y-axis label
      svg.append('text')
        .attr('transform', 'rotate(0)')
        .attr('x', -height / 2)
        .attr('y', 15)
        .attr('text-anchor', 'middle')
        .attr('fill', '#fff')
        .text('Percentage');
    }
  }

  return (
    <div className="relative flex flex-col items-center w-full" ref={containerRef}>
      <div className="relative w-full min-h-[700px] max-w-[700px] aspect-square">
        <svg ref={svgRef} className="w-full h-full" />
        <div
          ref={tooltipRef}
          className="absolute p-2 text-white transition-opacity duration-200 bg-black rounded shadow-lg opacity-0 pointer-events-none bg-opacity-80"
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            zIndex: 1000,
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
                data={chartData.map(d => {
                  console.log('Legend Item:', {
                    name: d.name,
                    value: d.value,
                    originalName: d.originalName
                  });
                  return { name: t(d.name), value: d.value };
                })} 
                colors={colors.map((color, index) => {
                  console.log('Legend Color:', {
                    index,
                    color
                  });
                  return color;
                })} 
                translate={t} 
              />
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
