import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

interface TooltipProps {
  content: string;
  visible: boolean;
  position: { x: number; y: number };
}

const Tooltip: React.FC<TooltipProps> = ({ content, visible, position }) => {
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tooltip = d3.select(tooltipRef.current);
    tooltip
      .style('opacity', visible ? 0.9 : 0)
      .style('left', `${position.x + 10}px`)
      .style('top', `${position.y + 10}px`);
  }, [visible, position]);

  return (
    <div
      ref={tooltipRef}
      style={{
        position: 'absolute',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        color: 'white',
        borderRadius: '5px',
        padding: '10px',
        fontSize: '14px',
        pointerEvents: 'none',
        maxWidth: '200px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        zIndex: 1000,
        opacity: 0,
        transition: 'opacity 0.2s ease-in-out',
      }}
    >
      {content}
    </div>
  );
};

export default Tooltip;
